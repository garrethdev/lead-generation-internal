const express = require('express');
const mailchimpCtrl = require('./mailchimp.controller');

const router = express.Router();

router.all('/*', mailchimpCtrl.mailchimpRequest);

module.exports = router;
