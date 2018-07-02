const express = require('express');
const { url, queryLimits } = require('../heplers');

const router = express.Router();

exports.router = router;

router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

router.get('/services', (req, res) => {
  res.redirect('/dashboard');
});

router.get('/dashboard/services/:id', async (req, res) => {
  res.render('service.html');
});
