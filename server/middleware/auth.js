const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'rlbsa_secure_token_secret_key_99';

function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Access denied. Token missing or invalid." });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Access token is expired or invalid." });
  }
}

module.exports = verifyAdminToken;
