(function ($) {
    function toggleAlert(toggle) {
        /**
         * toggleAlert(toggle)
         * if toggle is true, then show alert with animation,
         * else toggle is false, then hide alert
         * default, toggle = false;
         *
         * @param: bool toggle
         */
        if (toggle !== true && toggle !== false) {
            toggle = false;
        }
        var $alert = $(".notification");
        var key = "is-hidden";
        if (toggle) { // toggle = true(show)
            if ($alert.hasClass(key)) {
                $alert.removeClass(key).addClass("fade-in");
            }
        }
        else { // toggle = false(hide)
            if (!$alert.hasClass(key)) {
                $alert.removeClass("fade-in").addClass(key);
            }
        }
    }

    // tab switch operation
    $(function(){
        $("#card").flip({
            trigger: 'manual',
            front: ".graph",
            back: ".table"
        });
        // $(".table").css({"display": "none"});

        $(".switch-table").on("click", function(){
            // $(".graph").css({"display": "none"});
            // $(".table").css({"display": "block"}).fadeIn(200);
            $("#card").flip(true);
            $(this).parent().addClass("is-active");
            $(".switch-graph").parent().removeClass("is-active");
        });
        $(".switch-graph").on("click", function(){
            // $(".table").css({"display": "none"});
            // $(".graph").css({"display": "block"}).fadeIn(200);
            $("#card").flip(false);
            $(this).parent().addClass("is-active");
            $(".switch-table").parent().removeClass("is-active");
        });
    });
    /**
    * Source for the D3 Code
    * http://bl.ocks.org/nautat/4085017
    **/
    window.recurse = function(sel) {
      sel.each(function(d) {
        var colnames,
            tds,
            table = d3.select(this);
        colnames = d
            .reduce(function(p,c) { return p.concat(d3.keys(c)); }, [])
            .reduce(function(p,c) { return (p.set(c,0), p); }, d3.map())
            .keys();
        table.append("thead").append("tr").selectAll("th")
            .data(colnames)
          .enter().append("th")
            .text(function(d) { return d; });
        tds = table.append("tbody").selectAll("tr")
            .data(d)
          .enter().append("tr").selectAll("td")
            .data(function(d) {
              return colnames.map(function(k) {
                return d[k] || "";
              });
            })
          .enter().append("td");
        tds.filter(function(d) { return !(d instanceof Array); })
            .text(function(d) { return d; });
        tds.filter(function(d) { return (d instanceof Array); })
            .append("table")
            .call(recurse);
      });
    }
    window.fileTypeDataFunc = function (fileTypeDataUnMapped) {
        var GETCount = [];
        var POSTCount = [];
        fileTypeDataUnMapped.forEach(function (x) {
            if (x.requestType == "GET ") {
                var tmp = GETCount.findIndex(f => f.label == x.file);
                if (tmp !== -1) {
                    GETCount[tmp].value += 1;
                }
                else {
                    GETCount.push({
                        label: x.file
                        , value: 1
                    })
                }
            }
            else {
                var tmp = POSTCount.findIndex(f => f.label == x.file);
                if (tmp !== -1) {
                    POSTCount[tmp].value += 1;
                }
                else {
                    POSTCount.push({
                        label: x.file
                        , value: 1
                    })
                }
            }
        });
        var doubleBarObj = [];
        var fileDataTypes = [];
        doubleBarObj = {
            key: "POST"
            , values: POSTCount
        };
        fileDataTypes.push(doubleBarObj);
        doubleBarObj = {
            key: "GET"
            , values: GETCount
        };
        fileDataTypes.push(doubleBarObj);

        var toDelete = new Set([""]);
        fileDataTypes.forEach(function(x){
            var temp = x.values;
            newArray = [];
            newArray = temp.filter(obj => !toDelete.has(obj.label));
            x.values = newArray;
        });

        return fileDataTypes;
    }
})(jQuery);
