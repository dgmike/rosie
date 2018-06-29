const express = require('express');

const router = express.Router();

exports.router = router;

const url = (req, path) => {
  const port = (req.app.locals.port == '80') ? '' : `:${req.app.locals.port}`;
  return `${req.protocol}://${req.hostname}${port}${req.baseUrl}${path}`
};

router.get('/', (req, res) => {
  res.json({
    '_links': {
      entrypoint: {
        href: url(req, req.path)
      },
      services: {
        href: url(req, '/services{?name,type}'),
        templated: true
      }
    }
  });
});

router.get('/services', (req, res) => {
  res.status(501).end('501 Not Implemented');
});
