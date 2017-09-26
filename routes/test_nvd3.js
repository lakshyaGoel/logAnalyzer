var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
    // TODO: make json from test data and send it.
    /**
     * 1. read file(~2h)
     * 2. regex file(~3h)
     * 3. jsonify data(~1h)
     * 4. chart it in embed script tags first to test.
     *      - bar chart
     *      - pie chart
     *      - line graph
     */

    var functions = require("../functions");

    functions.parseServerLog(function(a){
        console.log("inside functions.parseServerLog", a);
    });

  res.render('test_nvd3', { title: 'NVD3 test' });
});

module.exports = router;