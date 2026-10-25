# Cómo dejar listo el panel para editar tu página web

> **Para quien envía esta guía:** reemplaza los marcadores antes de mandarla: `{{NOMBRE_NEGOCIO}}`, `{{URL_SITIO}}` (sin barra final), `{{CORREO_SOPORTE}}`, `{{QUIEN_ADMINISTRA}}` (nombre de quien da soporte) y `{{REPO}}` (solo si el cliente es dueño del repositorio). Borra la sección **B** o la **C** según corresponda (ver "¿Cuál sección me toca?").

Hola. Con este panel podrás cambiar por tu cuenta las ofertas, las fotos y los artículos de la página de **{{NOMBRE_NEGOCIO}}**, sin saber de programación. Cada cambio que guardes se publica solo en uno o dos minutos.

Para dejarlo funcionando necesitamos que hagas unos pasos una sola vez. Tardas unos 15 minutos. Si te trabas en cualquier paso, escríbenos a **{{CORREO_SOPORTE}}** con una captura de pantalla.

## ¿Cuál sección me toca?
- **Sección A (para todos):** crear tu cuenta y entrar al panel.
- **Sección B:** solo si **nosotros** administramos tu página (lo más común). Tú solo haces la sección A.
- **Sección C:** solo si **tú eres el dueño** de la cuenta de GitHub y de Vercel donde está la página. Aquí configuras el acceso.

---

## Sección A · Tu cuenta y tu primer ingreso

**Paso 1. Crea tu cuenta de GitHub (gratis).**
1. Entra a **github.com** y pulsa **Sign up** (Registrarse).
2. Usa el correo que revisas a diario, elige una contraseña segura y un nombre de usuario (por ejemplo `losboyacos-taller`).
3. Confirma tu correo con el código que te llega.
4. Activa la **verificación en dos pasos** (Settings > Password and authentication). Es lo que protege tu página.

**Paso 2. Envíanos tu nombre de usuario de GitHub.**
Escríbenos a **{{CORREO_SOPORTE}}** con el asunto "Usuario de GitHub" y dinos solo el nombre de usuario (**nunca nos mandes tu contraseña**).

**Paso 3. Acepta la invitación.**
GitHub te enviará un correo con el asunto *"invited you to collaborate"*. Ábrelo y pulsa **Accept invitation**. Sin este paso el panel te dejará entrar pero **no te dejará guardar**.

**Paso 4. Entra al panel.**
1. Abre **{{URL_SITIO}}/admin** (guárdalo en favoritos).
2. Pulsa **Login with GitHub** y luego **Authorize**.
3. Verás las secciones: *Banners de oferta*, *Galería de fotos* y *Blog*.

**Paso 5. Haz una prueba.**
1. Entra a *Banners de oferta* y cambia una palabra de algún banner.
2. Pulsa **Guardar** y luego **Publicar**.
3. Espera 2 minutos, abre tu página, toca el botón **Más** y comprueba que el cambio aparece. Después devuelve el texto como estaba.

Si el paso 5 funciona, **ya está todo listo**.

---

## Sección B · Si nosotros administramos tu página
No tienes nada más que hacer. Nosotros nos encargamos de la configuración técnica (la "llave" de acceso del panel) y te avisamos cuando esté lista para que hagas el paso 4. Mientras tanto haz los pasos 1 al 3.

---

## Sección C · Si tú eres el dueño de GitHub y de Vercel
Hazla **después** de la Sección A y con la misma cuenta que es dueña del repositorio `{{REPO}}`.

**C1. Crea la "llave" de acceso (OAuth App) en GitHub.**
1. En GitHub pulsa tu foto (arriba a la derecha) > **Settings**.
2. En el menú de la izquierda baja hasta **Developer settings** > **OAuth Apps** > **New OAuth App**.
3. Llena así (copia y pega):
   - **Application name:** `{{NOMBRE_NEGOCIO}} panel`
   - **Homepage URL:** `{{URL_SITIO}}`
   - **Authorization callback URL:** `{{URL_SITIO}}/api/callback`
4. Pulsa **Register application**.
5. En la pantalla siguiente copia el **Client ID**. Luego pulsa **Generate a new client secret** y copia el **Client secret** (solo se muestra una vez; si lo pierdes, genera otro).

**C2. Guarda las dos claves en Vercel.**
1. Entra a **vercel.com**, abre el proyecto de tu página y ve a **Settings** > **Environment Variables**.
2. Agrega dos variables, marcando **Production**:
   - Nombre `GITHUB_CLIENT_ID` → valor: el Client ID.
   - Nombre `GITHUB_CLIENT_SECRET` → valor: el Client secret.
3. Ve a **Deployments**, abre el último despliegue, pulsa los tres puntos **⋯** > **Redeploy**.

> **Importante:** el Client secret es como una contraseña. No lo envíes por WhatsApp ni por correo. Si necesitas que lo cargue otra persona, compártelo por un gestor de contraseñas o créalo juntos en una videollamada.

**C3. Invita a quienes van a editar.**
En GitHub: repositorio `{{REPO}}` > **Settings** > **Collaborators** > **Add people**. Escribe el usuario de cada persona y elige permiso de escritura. Cada persona debe aceptar la invitación (Paso 3).

**C4. Avísanos.**
Escríbenos a **{{CORREO_SOPORTE}}** cuando termines. Haremos una prueba contigo.

---

## Cómo se usa cada día
1. Entra a **{{URL_SITIO}}/admin** e inicia sesión con GitHub.
2. Elige qué quieres cambiar:
   - **Banners de oferta:** escribe frases cortas con el precio. La etiqueta (Oferta, 20% off, Gratis) es opcional.
   - **Galería de fotos:** sube fotos reales del taller y de los trabajos, en JPG, y escribe una frase que diga qué se ve.
   - **Blog:** título, fecha, un resumen corto y el texto. Deja una línea en blanco entre párrafos.
3. Pulsa **Guardar** y luego **Publicar**.
4. Espera 1 o 2 minutos y recarga tu página.

**Consejos:** usa fotos que pesen menos de 400 KB; escribe la descripción de cada foto; no subas datos personales de clientes.

## Si algo no funciona
| Qué pasa | Qué hacer |
|---|---|
| Entro pero me dice que no puedo guardar | Falta aceptar la invitación del correo de GitHub (Paso 3), o no te hemos invitado aún. |
| La ventana de inicio de sesión se cierra sola | Escríbenos con una captura. Suele ser un dato mal copiado en la configuración. |
| Guardé pero la página no cambió | Espera 2 minutos y recarga con **Ctrl + F5** (en celular, cierra y abre el navegador). |
| Olvidé mi contraseña | En github.com pulsa **Forgot password**. Nosotros no la conocemos ni podemos recuperarla. |
| Se fue una persona del equipo | Avísanos para quitarle el acceso el mismo día. |

## Qué datos nos hacen falta de ti (resumen)
- Tu **usuario de GitHub** (Paso 2).
- Si eres dueño: confirmar que terminaste las secciones C1 a C3.
- Las **fotos, ofertas y artículos reales** para reemplazar los de ejemplo.

Gracias. Cuando termines el paso 5, escríbenos un "listo" y damos el trabajo por entregado.

*{{QUIEN_ADMINISTRA}}*
