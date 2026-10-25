// Paso 2 del acceso con GitHub para el CMS (/admin): canjea el código por un token
// y se lo entrega a la ventana del panel (protocolo de Decap CMS).
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
    // solo se responde a una ventana que venga de este mismo sitio
    if (e.origin.replace(/^https?:\\/\\//,'') !== host) return;
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
  if (!code || !state || state !== cookie(req, 'oauth_state')) {
    return send(400, page('error', { message: 'Estado o código inválido' }, host));
  }
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
    });
    const j = await r.json();
    if (!j.access_token) return send(401, page('error', { message: j.error_description || 'GitHub no entregó el token' }, host));
    return send(200, page('success', { token: j.access_token, provider: 'github' }, host));
  } catch (e) {
    return send(502, page('error', { message: 'Error al hablar con GitHub' }, host));
  }
};
