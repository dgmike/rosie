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
        },
        offset,
        limit,
        resourceType: 'ResourceList',
        total: results.count,
        results: results.results,
      });
    });
});

router.get('/services/:id', (req, res) => {
  const { Service, ServiceType } = req.app.locals.models;

  Service
    .findById(req.params.id, {
      include: [ServiceType],
    })
    .then(result => res.json(result.representation(req)))
});