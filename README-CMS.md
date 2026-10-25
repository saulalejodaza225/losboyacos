# Cómo editar el contenido de Los Boyacos (CMS)

> Guías **reutilizables** para otros proyectos: [`docs/cms/GUIA-PARA-CLAUDE.md`](docs/cms/GUIA-PARA-CLAUDE.md) (para dárselas a Claude y que instale y verifique el CMS) y [`docs/cms/GUIA-PARA-CLIENTE.md`](docs/cms/GUIA-PARA-CLIENTE.md) (para enviar al cliente con los pasos exactos). Este archivo contiene los valores de Los Boyacos.

El panel está en **`https://losboyacos.vercel.app/admin`** (cuando el dominio sea losboyacos.com, será `/admin` de ese dominio).
Desde ahí el cliente cambia **banners de oferta**, **galería de fotos** y **blog** sin tocar código. Cada "Guardar" crea un cambio en GitHub y Vercel publica la página sola en 1 o 2 minutos.

## Qué se puede editar
| Sección del panel | Archivo que modifica | Dónde se ve |
|---|---|---|
| Banners de oferta | `contenido/banners.json` | Inicio del catálogo (botón "Más") |
| Galería de fotos | `contenido/galeria.json` | Galería (hasta 20 fotos) |
| Blog | `contenido/blog.json` | Lista de artículos y su detalle |

Las fotos que se suben quedan en `assets/img/`.

## Puesta en marcha (una sola vez) — la hace quien administra el proyecto
El panel entra con la cuenta de GitHub de la persona que edita. Para eso hay que crear una "app de acceso" y guardar dos claves en Vercel.

1. **Crear la OAuth App en GitHub** (con la cuenta dueña del repositorio): GitHub > Settings > Developer settings > OAuth Apps > New OAuth App.
   - Application name: `Los Boyacos CMS`
   - Homepage URL: `https://losboyacos.vercel.app`
   - Authorization callback URL: `https://losboyacos.vercel.app/api/callback`
   - Pulsa **Register application**, luego **Generate a new client secret** y copia el *Client ID* y el *Client secret*.
2. **Guardar las claves en Vercel**: proyecto > Settings > Environment Variables, para Production:
   - `GITHUB_CLIENT_ID` = el Client ID
   - `GITHUB_CLIENT_SECRET` = el Client secret
3. **Volver a desplegar** (Deployments > Redeploy) para que las funciones lean las claves.
4. **Dar permiso de escritura** a cada persona que editará: en GitHub, repositorio `losboyacos` > Settings > Collaborators > Add people. Sin ese permiso el panel abre pero no deja guardar.
5. Abre `/admin`, pulsa **Login with GitHub** y autoriza. Prueba cambiando un banner.

> Cuando se cambie al dominio definitivo (losboyacos.com): edita la URL de callback en la OAuth App, `base_url` y `site_url` en `admin/config.yml`, y vuelve a desplegar.

## Uso diario
1. Entra a `/admin` e inicia sesión con GitHub.
2. Elige la sección (Banners, Galería o Blog), cambia lo que necesites y pulsa **Guardar** > **Publicar** (o "Publish now").
3. Espera 1 o 2 minutos y recarga la página para ver el cambio.

Consejos:
- **Banners:** texto corto y con precio; la etiqueta es opcional (Oferta, 20% off, Gratis).
- **Fotos:** JPG o WebP, idealmente de menos de 400 KB. Escribe una descripción de lo que se ve: ayuda a personas ciegas y a Google.
- **Blog:** separa los párrafos con una línea en blanco.

## Si algo falla
- *"Falta la variable GITHUB_CLIENT_ID"*: faltan las claves del paso 2 o no se volvió a desplegar.
- *Inicia sesión pero no deja guardar*: esa cuenta no es colaboradora del repositorio (paso 4).
- *El login se abre y se cierra sin entrar*: revisa que la URL de callback de la OAuth App coincida exactamente con el sitio.
- Alternativa sin panel: editar directamente los archivos de `contenido/` en GitHub (el formato está en cada archivo).

## Para quien desarrolla
- Decap CMS `3.16.3` cargado desde unpkg en `admin/index.html`; configuración en `admin/config.yml`.
- Acceso: `api/auth.js` (redirige a GitHub, con `state` en cookie) y `api/callback.js` (canjea el código y entrega el token solo a una ventana del mismo sitio).
- El campo `_nota` de los JSON es solo informativo y el panel lo descarta al guardar; la página no lo usa.
