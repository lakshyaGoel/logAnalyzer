var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/crawl', function(req, res){
    var pageToVisit = req.body.address;
    console.log("Visiting page " + pageToVisit);

    request(pageToVisit, function(error, response, body) {
       if(error) {
         console.log("Error: " + error);
       }
       console.log("Status code: " + response.statusCode);
       if(response.statusCode === 200) {
         var $ = cheerio.load(body);
           var list = [];
           $("a").each(function(){
              list.push($(this).attr("href"));
           });

         res.render('web_data', { title: list });
       }
    });
});
module.exports = router;