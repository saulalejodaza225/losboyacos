// Paso 1 del acceso con GitHub para el CMS (/admin): redirige a GitHub.
// Variables de entorno en Vercel: GITHUB_CLIENT_ID y GITHUB_CLIENT_SECRET (ver README-CMS.md).
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Falta la variable GITHUB_CLIENT_ID en Vercel (ver README-CMS.md).');
  }
  const state = crypto.randomBytes(16).toString('hex');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirect = `${proto}://${req.headers.host}/api/callback`;
  const url = 'https://github.com/login/oauth/authorize?' + new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirect,
    scope: 'repo',
    state,
  });
  res.statusCode = 302;
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  res.setHeader('Location', url);
  res.end();
};
