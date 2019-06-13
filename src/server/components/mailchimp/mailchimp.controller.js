const request = require('request-promise');

function actualMailchimpRequest(req) {
  const countryCode = process.env.MAILCHIMP_PASS.split('-')[1];
  const mailchimpConfig = {
    baseUrl: `https://${countryCode}.api.mailchimp.com/3.0`,
    username: 'any',
    password: process.env.MAILCHIMP_PASS,
  };

  const defaultHeaders = {
    // eslint-disable-next-line
    'content-type': 'application/json',
    Authorization: `Basic ${Buffer(`${mailchimpConfig.username}:${mailchimpConfig.password}`).toString('base64')}`,
  };
  const path = req.path.replace(/\/api\/mailchimp/g, '');
  const options = {
    url: `${mailchimpConfig.baseUrl}${path}`,
    method: req.method,
    headers: defaultHeaders,
    json: true,
  };
  if (req.params) {
    options.qs = req.query;
  }

  if (req.body) {
    options.body = req.body;
  }
  return request(options);
}

/**
 *  Forwards the mailchimp request to mailchimp server and returns the response.
 * @property {Request} req - The type of request to be forwarded.
 * @returns {Response}
 */
function mailchimpRequest(req, res) {
  actualMailchimpRequest(req)
    .then(response => res.send(response))
    .catch((err) => {
      const status = err.statusCode || 500;
      return res.status(status).send(err);
    });
}

module.exports = { mailchimpRequest };
