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
    { include: [ServiceType, Tag, 'Dependencies'] }
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

router.get('/services/:id/tree', async (req, res) => {
  const { Service, ServiceType, ServiceDependency } = req.app.locals.models;
  const service = await Service.findById(req.params.id, { attributes: ['id', 'name'], include: [ServiceType] });

  if (!service) {
    res.status(404).json({ status: 404 });
    return false;
  }

  let dependencies = await service.getDependencies({
    attributes: ['id', 'name'],
    include: [
      ServiceType,
      {
        model: Service,
        as: 'Dependencies',
        include: [ServiceType],
      },
    ]
  });

  const result = {
    id: service.id,
    name: service.name,
    type: service.ServiceType.name,
    children: dependencies.map(dep => ({
      id: `${service.id}/${dep.id}`,
      name: dep.name,
      type: dep.ServiceType.name,
      children: (dep.Dependencies || []).map((dep2) => ({
        id: `${service.id}/${dep.id}/${dep2.id}`,
        name: dep2.name,
        type: dep2.ServiceType.name,
        children: [],
      })),
    })),
  };

  return res.json(result);
});

router.get('/services/:id/files', async (req, res) => {
  const { Service } = req.app.locals.models;
  const result = await Service.findById(req.params.id);

  if (!result) {
    res.status(404).json({ status: 404 });
    return false;
  }

  let files;

  try {
    files = await result.getFiles();
    res.json(
      {
        resourceType: 'ServiceFiles',
        total: files.length,
        _links: {
          self: { href: url(req, `/services/${req.params.id}/files`) },
          service: { href: url(req, `/services/${req.params.id}`) },
          services: { href: url(req, '/services') },
        },
        _embedded: {
          files: files.map(file => ({
            url: file.toJSON().req.url,
            file: file.toJSON().req.url.replace(/.*\/(.*)$/, '$1'),
            text: file.text
          })),
        }
      }
    );
  } catch (err) {
    res.json(err);
  }
});

router.delete('/services/:id', async (req, res) => {
  const { Service, ServiceType } = req.app.locals.models;
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
