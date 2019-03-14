require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./components/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));

app.use('/api', routes);
app.get('/health-check', (req, res) => res.send('OK'));

app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname, '..', '..', 'dist', 'index.html')));

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
}

module.exports = app;
