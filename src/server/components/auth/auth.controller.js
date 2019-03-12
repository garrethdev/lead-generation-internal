const httpStatus = require('http-status');
const APIError = require('../../helpers/APIErrors');

function login(req, res, next) {
  if (req.body.email === 'admin@gmail.com' && req.body.password === 'admin') {
    return res.json({
      user: req.body,
    });
  }
  return next(new APIError('Invalid credentials', httpStatus.NOT_FOUND));
}

module.exports = { login };
