const express = require('express');
const { url, queryLimits } = require('../heplers');

const router = express.Router();

exports.router = router;

router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

router.get('/servicos', (req, res) => {
  res.render('servicos.html');
});

router.get('/dashboard', (req, res) => {
  res.redirect('/servicos');
});

router.get('/dashboard/services/:id', (req, res) => {
  res.render('servico.html');
});
