const express = require('express');
const { url, queryLimits } = require('../heplers');

const router = express.Router();

exports.router = router;

router.get('/', (req, res) => {
  res.render('index');
});
