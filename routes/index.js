var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var unirest = require('unirest');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/crawl', function(req, res){
    var pageToVisit = req.body.address;
    console.log("Visiting page " + pageToVisit);

    unirest.post("https://textanalysis-text-summarization.p.mashape.com/text-summarizer")
        .header("X-Mashape-Key", "A68IXWfzfymshQzAP0fGcYYHq9Qkp1yo1H9jsn6SuNvs3N9x7e")
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .send({"url":pageToVisit
            ,"text":"","sentnum":8})
        .end(function (result) {
            // result.status 結果
            // result.headers
            // result.bodyが重要
            console.log("summary",result.body);
        });

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