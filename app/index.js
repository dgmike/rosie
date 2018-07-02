const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const fs = require('fs');
const util = require('util');
const api = require('./api');
const frontend = require('./frontend');
const models = require('./models');

const app = express();

const port = process.env.PORT || '3000';
app.locals.port = port;
app.locals.models = models;

// middlewares
app.use(bodyParser.json());
app.use(serveStatic('public'))

app.engine('html', (path, options, callback) => {
	console.log(path)
  util
    .promisify(fs.readFile)
    .call(null, path)
    .then(buffer => buffer.toString())
    .then(str => callback(false, str));
});

app.use('/api', api.router);
app.use('/', frontend.router);

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
