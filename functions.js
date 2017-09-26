/**
 * Created by reiven on 2017/09/25.
 */
function readTestText(callback){
    /**
     * readTextText();
     *
     * return test log data from ./test_data/log.txt
     *
     * @type {string}
     * @return string
     */
    var fs = require('fs');
    fs.readFile("./test_data/log.txt", 'utf-8', function(err, text){
        var result = "";
        if(!err){
            result = text;
        }
        callback(result);
    });
}


function parseLog(callback){
    readTestText(function(text){
        var serverLogRawText = text;
        var result = [];
        var i;
        var serverLogList = serverLogRawText.split("\n");
        var length = serverLogList.length;
        var regex = /([0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3})\s-\s-\s\[(.*)\]\s\"(.*)\"\s([0-9]{1,3})\s([0-9]+)\s\"(.+)\"\s\"(.+)\"\s\"(.+)\"/;

        for(i = 0; i < length; i++){
            var lineItem = serverLogList[i].match(regex);
            if(lineItem){
                var appendObject = {
                    "IP": lineItem[1],// TODO: if IP is not given like "" or "-", then data never match now...
                    "Time": lineItem[2],//TODO: need to wrap datetime?
                    "HTTP": lineItem[3],
                    "Status": lineItem[4],
                    "Size": parseInt(lineItem[5]),
                    "Referer": lineItem[6],
                    "UA": lineItem[7]
                };
                // console.log("obj", appendObject);
                result.push(appendObject);
            }
        }
        callback(result);
    });
}


exports.readTestText = readTestText;
exports.parseServerLog = parseLog;