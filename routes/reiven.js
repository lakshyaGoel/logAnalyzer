var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
// parse User Agent
var uaParser = require('ua-parser-js');
// add multer lib to support file uploads
var multer  = require('multer');
var upload = multer({ storage: multer.memoryStorage() });
var moment = require('moment');
var regression = require('regression');

router.get('/', function (req, res, next) {
    res.render('indexReiven', {
        title: 'Reiven Test'
    });
});


router.post('/show-graph', upload.single("thefile") ,function(req, res, next){
    var functions = require("../functions");

    if (!req.file) {
        res.status(500).send('error: no file');
    }

    functions.parseServerLog(req.file.buffer.toString('UTF-8') ,function(data){
        // console.log("This is callback(~= inside) functions.parseServerLog", data);
        var UA = {};
        var piChartData = [];
        var piTableTemp = {};
        var itemcount = 0;
        var piTableData = [];
        var fileTypeData = [];
        var barChartData1 = [];
        var barChartData2 = [];
        var aMap = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var aCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        var i;
        var type;

        for(i = 0; i < data.length; i++){
            //console.log(data[i]);

            // BEGIN: data parsing for piChart and piTable(Aki)
            var uaData = uaParser(data[i]["UA"]);
            var os = uaData["os"]["name"];
            var appendData = uaData["browser"]["name"] + " on ";
            var appendTableData = "";
            if(os == "Windows"){
                appendData += os+ uaData["os"]["version"];
                appendTableData += os + uaData["os"]["version"];
            }
            else if(os == "Mac OS" || os == "Android" || os == "iOS" || os == "Linux"){
                appendData += os;
                appendTableData += os;
            }else{
                appendData += "Other";
                appendTableData += os;
            }
            appendTableData += "/" +  uaData["browser"]["name"];
            if(piTableTemp[appendTableData] == undefined){
                piTableTemp[appendTableData] = 0;
            }
            itemcount += 1;
            piTableTemp[appendTableData] += 1;
            if(Object.keys(UA).indexOf(appendData) >= 0){
                UA[appendData] += 1;
            }else{
                UA[appendData] = 1;
            }
            // END: data parsing for piChart and piTable(Aki)



            // BEGIN: data for parsing the file types for chart(Lakshya)
            var http = data[i]["HTTP"];
            http = http.split('/');
            var ftype = ((http[http.length - 2]).split(" "))[0];
            ftype = ftype.split(".");
            ftype = ftype[ftype.length - 1];
            ftype = ftype.split("?");
            fileTypeData.push({
                "file": ftype[0],
                "requestType": http[0],
                "status": data[i]["Status"]
            });
            // END: data for parsing the file types for chart(Lakshya)



            // BEGIN: data parsing for barChart(Nishka)
            var hr =data[i]["Time"].format("H");
            var sz =data[i]["Size"];
            if(isNaN(sz))
              sz=0;
            aMap[hr]= aMap[hr]+sz;
            aCount[hr]=aCount[hr]+1;
            // END: data parsing for barChart(Nishka)
        }// end for(i = 0; i < data.length; i++)



        // BEGIN: data parsing for piChart and piTable part 2(Aki)
        for(i = 0; i < Object.keys(UA).length; i++){
            piChartData.push({
                "key": Object.keys(UA)[i], "value": UA[Object.keys(UA)[i]]
            });
        }
        // piChart data parsing
        for(i = 0; i < Object.keys(piTableTemp).length; i++){
            var key = Object.keys(piTableTemp)[i].split("/");
            var appendData = {
                "OS": key[0],
                "browser": key[1],
                "amount":piTableTemp[Object.keys(piTableTemp)[i]],
                "rate": Math.round(piTableTemp[Object.keys(piTableTemp)[i]] / itemcount * 100, 1) + " %"
            };
            piTableData.push(appendData);
        }
        piTableData = piTableData.sort(function(a, b){
            var aOS = a.OS.toUpperCase();
            var bOS = b.OS.toUpperCase();
            var comparison = 0;
            if(aOS > bOS){
                comparison = -1;
            }else if(aOS < bOS){
                comparison = 1;
            }
            return comparison;
        });
        // END: data parsing for piChart and piTable part 2(Aki)



        // BEGIN: barchart data parting(Nishka)
        for(i = 0; i <12; i++){
          if(aCount[i]==0){
            barChartData1.push({
                  "key": i, "value": aMap[i]
              });
          }else{
            var tempVar = (aMap[i]/aCount[i]);
            barChartData1.push({
                  "key": i, "value": tempVar
              });
          }

        }
        for(i = 12; i <=23; i++){
          if(aCount[i]==0){
            barChartData2.push({
                  "key": i-12, "value": aMap[i]
              });
            }else{
              var tempVar = (aMap[i]/aCount[i]);
              barChartData2.push({
                    "key": i-12, "value": tempVar
                });
            }
        }
        // END: barchart data parting(Nishka)?

        // BEGIN: barchart data parting(Vaybhav)?
        var map={};
        for(i = 0; i < data.length; i++){

            // data parsing for piChart
            var t=data[i]["Time"].format("k");
            if(!(t in map))
                map[t]=1;
            else{
                var ctime=map[t];
                map[t]=ctime+1;
            }

        }
        var keys = Object.keys(map);
        var i = 0;
        var barchartdata=[];
        var barcharttup={};
        var lineChartData = [];
        var regdata=[];
        for(i = 0; i < keys.length; i++){
            var appendData = {};
            var appendreg=[];
            appendData["label"] = keys[i];
            appendData["value"] = map[keys[i]];
            appendreg[0] = parseInt(keys[i]);
            appendreg[1] = map[keys[i]];
            lineChartData.push(appendData);
            regdata.push(appendreg);
        }
        barcharttup["key"]="Cumulative Return";
        barcharttup["values"]=lineChartData;
        barchartdata.push(barcharttup);

        // END: barchart data parting(Vaybhav)?

        // BEGIN: Computing regression
        var result = regression.polynomial(regdata,{order:3});
        console.log(result);
        console.log(result.equation);


        // send data to /view/test_nvd3.hbs
        res.render('test_nvd3',
            {
                title: 'NVD3 test',
                piChartData: piChartData,
                piTableData: piTableData,
                fileTypeData: fileTypeData,
                barChartData1:barChartData1,
                barChartData2:barChartData2,
                bardata:lineChartData,
                result:result.equation
            }
         );// end res.render
    });// end functions.parseServerLog;
});

module.exports = router;
