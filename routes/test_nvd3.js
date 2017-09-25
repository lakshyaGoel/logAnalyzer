var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
    // TODO: make json from test data and send it.
  res.render('test_nvd3', { title: 'NVD3 test' });
});

module.exports = router;