const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function (req, res, next) {
  //get token from header
  const token = req.header('x-auth-token');
  //check if token exists
  if (!token) return res.status(401).send('Access denied. No token provided.');
  //verify token
  try {
    // console.log('JWT Secret:', config.get('jwtsecret'));
    const decoded = jwt.verify(token, config.get('jwtsecret'))
    req.user = decoded.user;
    next();
  } catch (ex) {
    res.status(400).json({ msg: 'Invalid token' });
  }
};
