const express = require('express');

const router = express.Router();
const authRoutes = require('./auth/auth.routes');
const mailchimpRoutes = require('./mailchimp/mailchimp.routes');

router.use('/auth', authRoutes);
router.use('/mailchimp', mailchimpRoutes);

module.exports = router;
