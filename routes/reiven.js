var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
// parse User Agent
var uaParser = require('ua-parser-js');
// add multer lib to support file uploads
var multer  = require('multer')
var upload = multer({ storage: multer.memoryStorage() });


router.get('/', function (req, res, next) {
    res.render('indexReiven', {
        title: 'Reiven Test'
    });
});


router.post('/show-graph', upload.single("thefile") ,function(req, res, next){
    // TODO: make json from test data and send it.
    /**
     * 4. chart it in embed script tags first to test.
     *      - bar chart
     *      - line graph
     */

    var functions = require("../functions");

    if (!req.file) {
        res.status(500).send('error: no file');
    }

    // console.log(req.file.buffer.toString('UTF-8'));

    functions.parseServerLog(req.file.buffer.toString('UTF-8') ,function(data){
        // console.log("This is callback(~= inside) functions.parseServerLog", data);
        var UA = {};
        var piChartData = [];
        var i;

        for(i = 0; i < data.length; i++){
            // console.log(data[i]["UA"]);

            // data parsing for piChart
            var uaData = uaParser(data[i]["UA"]);
            var os = uaData["os"]["name"];
            var appendData = uaData["browser"]["name"] + " on ";
            if(os == "Windows" ||os == "Mac OS" || os == "Android" || os == "iOS" || os == "Linux"){
                appendData += os;
            }else{
                appendData += "Other";
            }

            if(uaData["browser"]["name"] == undefined){
                console.log("browser",typeof(uaData["browser"]["name"]));
                appendData = uaData["browser"]["name"];
            }

            if(Object.keys(UA).indexOf(appendData) >= 0){
                UA[appendData] += 1;
            }else{
                UA[appendData] = 1;
            }


            // data parsing for lineChart

            // data parsing for barChart
        }
        // console.log(UA);
        for(i = 0; i < Object.keys(UA).length; i++){
            piChartData.push({
                "key": Object.keys(UA)[i], "value": UA[Object.keys(UA)[i]]
            });
        }
        res.render('test_nvd3', {title: 'NVD3 test', piChartData: piChartData});
    });// end functions.parseServerLog;
});

module.exports = router;