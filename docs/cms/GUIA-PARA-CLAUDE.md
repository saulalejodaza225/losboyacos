# Guía para Claude: instalar y verificar un CMS (Decap) en una web estática

> **Cómo usar este documento.** Entrégaselo a Claude junto con el proyecto y una frase como: *"Instala el CMS siguiendo `docs/cms/GUIA-PARA-CLAUDE.md`"*. Claude ejecuta los pasos, corre las verificaciones y deja listo lo que depende del cliente (ver `GUIA-PARA-CLIENTE.md`).
> Probado en Los Boyacos (HTML estático + Vercel + GitHub). Marcadores `{{ASÍ}}` = se reemplazan por los datos del proyecto.

## 0. Qué se obtiene
Un panel en `/admin` (Decap CMS) donde el cliente edita archivos JSON/Markdown del repositorio sin tocar código. Cada "Guardar" hace un commit en GitHub y el hosting publica solo. El acceso usa GitHub OAuth mediante dos funciones serverless (`api/auth.js`, `api/callback.js`) que viven en el mismo sitio. No necesita base de datos ni servicios de pago.

**Cuándo NO usar esto:** si el sitio está en Netlify (usar `git-gateway` + Netlify Identity, sin funciones propias), si el cliente no usará GitHub (usar otro backend) o si el contenido cambia varias veces al día (usar una base de datos o un CMS alojado).

## 1. Datos de entrada (pídelos o dedúcelos del repositorio)
| Dato | Marcador | Ejemplo | Cómo obtenerlo |
|---|---|---|---|
| Repositorio `dueño/nombre` | `{{REPO}}` | `saulalejodaza225/losboyacos` | `git remote -v` |
| Rama de publicación | `{{RAMA}}` | `main` | `git branch --show-current` / ajustes del hosting |
| URL pública del sitio | `{{URL_SITIO}}` | `https://losboyacos.vercel.app` | Pedirla; sin barra final |
| Hosting | — | Vercel | Si no es Vercel, ver §9 |
| Archivos de contenido a editar | — | `contenido/*.json` | Revisar cómo los lee la página (campos reales) |
| Carpeta de imágenes | `{{CARPETA_IMG}}` | `assets/img` | Donde ya viven las imágenes del sitio |

**Regla:** los campos del panel deben coincidir **exactamente** con las claves que la página ya lee. No cambies el formato de los datos para acomodar el CMS.

## 2. Archivos a crear
### 2.1 `admin/index.html`
Antes de escribirlo, resuelve la versión vigente y fíjala (nunca `latest`): `npm view decap-cms version` y elige una estable con más de 2 semanas.
````html
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Administrar contenido · {{NOMBRE_NEGOCIO}}</title>
</head>
<body>
<script src="https://unpkg.com/decap-cms@{{VERSION}}/dist/decap-cms.js"></script>
</body>
</html>
````

### 2.2 `admin/config.yml`
````yaml
backend:
  name: github
  repo: {{REPO}}
  branch: {{RAMA}}
  base_url: {{URL_SITIO}}        # sitio que aloja api/auth y api/callback
  auth_endpoint: api/auth
publish_mode: simple
site_url: {{URL_SITIO}}
locale: es
media_folder: {{CARPETA_IMG}}
public_folder: {{CARPETA_IMG}}   # igual que media_folder si el sitio usa rutas relativas (sin "/" inicial)

collections:
  - name: contenido
    label: Contenido del sitio
    files:
      - name: {{ID_ARCHIVO}}
        label: {{TÍTULO_PARA_EL_CLIENTE}}
        file: {{RUTA/ARCHIVO.json}}
        fields:
          - label: {{LISTA}}
            name: {{clave_lista}}
            widget: list
            summary: "{{fields.campo1}} · {{fields.campo2}}"
            fields:
              - { label: Texto, name: texto, widget: string, hint: "Ayuda en lenguaje simple" }
              - { label: Foto, name: src, widget: image }
              - { label: Categoría, name: cat, widget: select, options: [a, b], default: a }
              - { label: Fecha, name: fecha, widget: datetime, date_format: "YYYY-MM-DD", time_format: false, format: "YYYY-MM-DD" }
              - { label: Opcional, name: etiqueta, widget: string, required: false }
````
Widgets útiles: `string`, `text` (párrafos), `image`, `select`, `datetime`, `boolean`, `number`, `list`, `object`, `markdown`. Para páginas/artículos en Markdown con una carpeta por colección usa `folder:` en vez de `files:`. Pon `hint` en cada campo; el cliente lo lee.

### 2.3 `api/auth.js`
````js
// Paso 1 del acceso con GitHub para el CMS: redirige a GitHub.
// Variables de entorno: GITHUB_CLIENT_ID y GITHUB_CLIENT_SECRET.
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Falta la variable GITHUB_CLIENT_ID en el hosting.');
  }
  const state = crypto.randomBytes(16).toString('hex');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirect = `${proto}://${req.headers.host}/api/callback`;
  const url = 'https://github.com/login/oauth/authorize?' + new URLSearchParams({
    client_id: clientId, redirect_uri: redirect, scope: 'repo', state,
  });
  res.statusCode = 302;
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  res.setHeader('Location', url);
  res.end();
};
````

### 2.4 `api/callback.js`
````js
// Paso 2: canjea el código por un token y se lo entrega a la ventana del panel (protocolo de Decap).
const page = (status, body, targetHost) => `<!doctype html><meta charset="utf-8"><title>Acceso al CMS</title>
<p>${status === 'success' ? 'Acceso concedido. Puedes cerrar esta ventana.' : 'No se pudo iniciar sesión. Cierra esta ventana e inténtalo de nuevo.'}</p>
<script>
(function(){
  var provider='github', status=${JSON.stringify(status)}, payload=${JSON.stringify(body)}, host=${JSON.stringify(targetHost)};
  function send(origin){
    window.opener.postMessage('authorization:'+provider+':'+status+':'+JSON.stringify(payload), origin);
    window.removeEventListener('message', onMsg); window.close();
  }
  function onMsg(e){
    if (e.origin.replace(/^https?:\\/\\//,'') !== host) return;   // solo ventanas del mismo sitio
    send(e.origin);
  }
  if (!window.opener) return;
  window.addEventListener('message', onMsg, false);
  window.opener.postMessage('authorizing:'+provider, '*');
})();
</script>`;

function cookie(req, name) {
  const m = (req.headers.cookie || '').split(';').map((s) => s.trim()).find((s) => s.startsWith(name + '='));
  return m ? m.slice(name.length + 1) : '';
}

module.exports = async (req, res) => {
  const host = req.headers.host;
  const send = (code, html) => { res.statusCode = code; res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.setHeader('Set-Cookie', 'oauth_state=; Max-Age=0; Path=/api'); res.end(html); };
  const url = new URL(req.url, 'https://' + host);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state || state !== cookie(req, 'oauth_state')) return send(400, page('error', { message: 'Estado o código inválido' }, host));
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
    });
    const j = await r.json();
    if (!j.access_token) return send(401, page('error', { message: j.error_description || 'GitHub no entregó el token' }, host));
    return send(200, page('success', { token: j.access_token, provider: 'github' }, host));
  } catch (e) { return send(502, page('error', { message: 'Error al hablar con GitHub' }, host)); }
};
````

### 2.5 Ajustes colaterales
- `robots.txt`: `Disallow: /admin/` y `Disallow: /api/`. No pongas `/admin` en el `sitemap.xml`.
- Si el proyecto usa `vercel.json`, no reescribas `/api/*` ni `/admin/*`.
- No metas secretos en el repositorio. `GITHUB_CLIENT_SECRET` solo vive en el hosting.
- Documenta los valores propios del proyecto en `README-CMS.md` (URL del panel, variables, quién puede editar).

## 3. Verificaciones que Claude debe ejecutar (crear `tests/cms.mjs`)
Sin red ni claves reales (mockea `fetch`). Todas deben pasar antes de dar el trabajo por hecho.
1. `admin/index.html` carga Decap con versión exacta y tiene `noindex`.
2. `config.yml`: backend `github`, `repo`, `branch`, `auth_endpoint: api/auth`, `media_folder` y `public_folder`.
3. Cada archivo de contenido listado existe, es JSON válido y **cada clave del primer elemento está declarada como `name:` en el config** (paridad panel↔página).
4. `auth`: sin `GITHUB_CLIENT_ID` → 500 con mensaje claro; con él → 302 a `github.com`, con `client_id`, `scope=repo`, `redirect_uri=…/api/callback` y un `state` igual al de la cookie (`HttpOnly; Secure`).
5. `callback`: `state` distinto → 400 sin token; sin código → 400; con `state` válido y `fetch` simulado → 200 con `authorization:github:success` y el token; GitHub rechaza → 401 sin token; comprueba que limpia la cookie y filtra por origen.
6. La guía del cliente existe y el README del proyecto lista las variables.

Referencia funcional completa: `tests/cms.mjs` de Los Boyacos (20 comprobaciones).

## 4. Lo que Claude NO puede hacer (dejarlo preparado y avisar)
Claude no crea la OAuth App ni inicia sesión por el cliente. Debe:
1. Entregar `GUIA-PARA-CLIENTE.md` rellenada (reemplaza los marcadores).
2. Decir exactamente qué falta: **Client ID y Client secret** (los crea el dueño del repositorio), **invitar como colaboradores** a quienes editarán, y **redesplegar** tras cargar las variables.
3. Tras la configuración del cliente, **verificar en vivo** (§5).

## 5. Verificación en vivo (cuando el cliente confirme)
1. `curl -I {{URL_SITIO}}/api/auth` → `302` con `Location: https://github.com/login/oauth/authorize?...`. Si da 500 → faltan variables o falta redespliegue.
2. `curl -I {{URL_SITIO}}/admin/` → `200`; `/admin/config.yml` → `200`.
3. Pedir al cliente que abra `/admin`, entre y cambie un dato de prueba; confirmar el commit en GitHub (`git log origin/{{RAMA}} -3`) y que el sitio lo muestra tras el despliegue. Revertir el dato de prueba.
4. Si algo falla, usa la tabla de problemas (§7).

## 6. Seguridad (no omitir)
- `scope=repo` da acceso de escritura a repositorios del usuario: úsalo solo con cuentas de confianza y, si el cliente tiene otros repos privados, sugiere una cuenta de GitHub solo para el sitio.
- El `state` y su cookie evitan CSRF; no los quites.
- El token solo se envía a una ventana del mismo origen.
- Solo los **colaboradores** del repositorio pueden guardar; quitar a alguien = quitarlo de Collaborators.
- Al cambiar de dominio hay que actualizar la URL de callback de la OAuth App, `base_url`, `site_url` y redesplegar.

## 7. Problemas frecuentes
| Síntoma | Causa | Arreglo |
|---|---|---|
| `/api/auth` da 500 "Falta GITHUB_CLIENT_ID" | Variables no cargadas o sin redespliegue | Cargarlas en Production y redesplegar |
| La ventana de login se abre y se cierra sin entrar | URL de callback de la OAuth App no coincide con el sitio | Corregirla exactamente: `{{URL_SITIO}}/api/callback` |
| Entra pero no deja guardar | La cuenta no es colaboradora | Invitarla con permiso de escritura |
| Pantalla en blanco en `/admin` | Error de sintaxis en `config.yml` | Validar el YAML; revisar la consola |
| Guarda pero el sitio no cambia | El despliegue falló o la rama es otra | Ver el estado del despliegue; revisar `branch` |
| La imagen sube pero no se ve | `public_folder` no coincide con cómo el sitio referencia la ruta | Alinear `media_folder`/`public_folder` con la ruta real |
| El campo desaparece al guardar | Clave no declarada en el config | Declarar todas las claves que lee la página (el CMS descarta las no declaradas, p. ej. `_nota`) |

## 8. Entregables al terminar
`admin/` (2 archivos), `api/` (2 archivos), `tests/cms.mjs` pasando, `README-CMS.md` del proyecto, `GUIA-PARA-CLIENTE.md` rellenada y un resumen para el usuario con: qué quedó listo, qué debe hacer el cliente y qué se verificará en vivo.

## 9. Variantes
- **Netlify:** `backend: { name: git-gateway, branch: main }` + activar Identity y Git Gateway; no se necesitan `api/*`.
- **Otro hosting estático sin funciones:** usar un proveedor OAuth externo (p. ej. un servicio de autenticación para Decap) y poner su URL en `base_url`.
- **Varias personas, flujo con revisión:** `publish_mode: editorial_workflow` (los cambios llegan como pull request y se aprueban antes de publicar).
