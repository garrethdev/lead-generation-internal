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
app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname, '..', '..', 'dist', 'index.html')));

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
