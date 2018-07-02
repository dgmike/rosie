const express = require('express');
const { url, queryLimits } = require('../heplers');
const { Op } = require('sequelize');

const router = express.Router();

exports.router = router;

router.get('/service-types', (req, res) => {
  const { ServiceType } = req.app.locals.models;

  const { limit, offset } = queryLimits(req);
  const { name } = req.query;

  const where = {};

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`
    };
  }

  ServiceType
    .findAndCount({
      limit,
      offset,
      where,
    })
    .then((results) => {
      return {
        count: results.count,
        results: results.rows.map(item => item.representation(req))
      };
    })
    .then((results) => {
      let selfUrl = url(req, `/service-types?limit=${limit}&offset=${offset}`);
      if (name) {
        selfUrl += `&name=${encodeURIComponent(name)}`;
      }

      res.json({
        _links: {
          self: selfUrl,
          info: url(req, '/service-types/info'),
        },
        offset,
        limit,
        resourceType: 'ResourceList',
        total: results.count,
        results: results.results,
      });
    });
});

router.get('/service-types/info', async (req, res) => {
  const { ServiceType } = req.app.locals.models;
  return res.json(ServiceType.info());
});

router.post('/service-types', async (req, res) => {
  const { ServiceType } = req.app.locals.models;
  const { body } = req;

  const serviceType = new ServiceType();

  Object.keys(ServiceType.attributes)
    .filter(attr => attr !== 'id')
    .filter(attr => attr in (body || {}))
    .forEach((attr) => {
      console.log(`${attr} = ${body[attr]}`)
      result[attr] = body[attr];
    });

  try {
    const result = await serviceType.save();
    res.status(201).json(result.representation(req));
  } catch (err) {
    if (typeof err == 'SequelizeValidationError') {
      return res.status(422).json(err);
    } else {
      const message = err.message;
      return res.status(500).json({ message, err });
    }
  }
});

router.get('/service-types/:id', async (req, res, next) => {
  if (req.params.id === 'info') {
    return next();
  }

  const { ServiceType } = req.app.locals.models;

  const result = await ServiceType.findById(
    req.params.id,
  );

  if (!result) {
    res.status(404).json({ status: 404 });
    return false;
  }

  res.json(result.representation(req));
});

router.put('/service-types/:id', async (req, res, next) => {
  const { ServiceType } = req.app.locals.models;
  const { body } = req;
  const result = await ServiceType.findById(req.params.id);

  if (!result) {
    res.status(404).json({ status: 404 });
    return false;
  }

  Object.keys(ServiceType.attributes)
    .filter(attr => attr !== 'id')
    .filter(attr => attr in (body || {}))
    .forEach((attr) => {
      console.log(`${attr} = ${body[attr]}`)
      result[attr] = body[attr];
    });

  try {
    result.save();
    res.json(result.representation(req));
  } catch (err) {
    if (typeof err == 'SequelizeValidationError') {
      return res.status(422).json(err);
    } else {
      const message = err.message;
      return res.status(500).json({ message, err });
    }
  }
});

router.delete('/service-types/:id', async (req, res, next) => {
  const { ServiceType } = req.app.locals.models;
  const { body } = req;
  const result = await ServiceType.findById(req.params.id);

  if (!result) {
    res.status(404).json({ status: 404 });
    return false;
  }

 try {
   result.destroy();
   res.status(204).end();
 } catch (err) {
   const message = err.message;
   return res.status(500).json({ message, err });
 }
});
