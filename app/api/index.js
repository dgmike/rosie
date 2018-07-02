const express = require('express');
const { url, queryLimits } = require('../heplers');
const servicesRouter = require('./services');
const serviceTypesRouter = require('./service_types');

const router = express.Router();

exports.router = router;

router.use('/', servicesRouter.router);
router.use('/', serviceTypesRouter.router);

router.get('/', (req, res) => {
  res.json({
    '_links': {
      entrypoint: {
        href: url(req, req.path)
      },
      services: {
        href: url(req, '/services{?name,type,limit,offset}'),
        templated: true
      }
    }
  });
});
