const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/global');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Acceso denegado');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send('Token no válido');
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;