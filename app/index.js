const express = require('express');
const api = require('./api');

const app = express();

const port = process.env.PORT || '3000';
app.locals.port = port;

app.use('/api', api.router);

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
