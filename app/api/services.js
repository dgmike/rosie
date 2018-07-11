const express = require('express');
const { url, queryLimits } = require('../heplers');
const { Op } = require('sequelize');

const router = express.Router();

exports.router = router;

router.get('/services', (req, res) => {
  const { Service, ServiceType } = req.app.locals.models;

  const { limit, offset } = queryLimits(req);
  const { name, type } = req.query;

  const where = {};

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`
    };
  }

  if (type) {
    where.ServiceTypeId = {
      [Op.eq]: type,
    }
  }

  Service
    .findAndCount({
      include: [ServiceType],
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
      let selfUrl = url(req, `/services?limit=${limit}&offset=${offset}`);
      if (name) {
        selfUrl += `&name=${encodeURIComponent(name)}`;
      }
      if (type) {
        selfUrl += `&type=${encodeURIComponent(type)}`;
      }

      res.json({
        _links: {
          self: selfUrl,
          info: url(req, '/services/info'),
        },
        offset,
        limit,
        resourceType: 'ResourceList',
        total: results.count,
        results: results.results,
      });
    });
});

router.get('/services/info', async (req, res) => {
  const { Service } = req.app.locals.models;
  return res.json(Service.info());
});

router.post('/services', async (req, res) => {
  const { Service } = req.app.locals.models;
  const { body } = req;

  const service = new Service();

  Object.keys(Service.attributes)
    .filter(attr => attr !== 'id')
    .filter(attr => attr in (body || {}))
    .forEach((attr) => {
      console.log(`${attr} = ${body[attr]}`)
      result[attr] = body[attr];
    });

  try {
    const result = await service.save();
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

router.get('/services/:id', async (req, res, next) => {
  if (req.params.id === 'info') {
    return next();
  }

  const { Service, ServiceType, Tag } = req.app.locals.models;

  const result = await Service.findById(
    req.params.id,
    { include: [ServiceType, Tag] }
  );

  if (!result) {
    res.status(404).json({ status: 404 });
    return false;
  }

  res.json(result.representation(req));
});

router.put('/services/:id', async (req, res) => {
  const { Service, ServiceType } = req.app.locals.models;
  const { body } = req;
  const result = await Service.findById(req.params.id);

  if (!result) {
    res.status(404).json({ status: 404 });
    return false;
  }

  Object.keys(Service.attributes)
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

router.delete('/services/:id', async (req, res) => {
  const { Service, ServiceType } = req.app.locals.models;
  const { body } = req;
  const result = await Service.findById(req.params.id);

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
