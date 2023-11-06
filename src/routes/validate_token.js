const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['access-token'] || ''; // Get the token from header if present or return an empty string

  if (!token)
    return res
      .status(401)
      .json({ error: '!Lo sentimos!, no puedes acceder a esta ruta' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userData = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'El token no es valido' });
  }
};
module.exports = verifyToken;
