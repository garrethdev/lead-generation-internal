const express = require('express');
const validate = require('express-validation');
const Joi = require('joi');
const authCtrl = require('./auth.controller');

const router = express.Router();
const paramValidation = {
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
};

router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

module.exports = router;
