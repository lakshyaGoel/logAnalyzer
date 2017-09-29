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


    $('#theLogField').change(function () {
        console.log('picked file', $('#theLogField')[0].files[0]);
    });


    $('#theAjaxButton').click(function (e) {
        // how to select the file itself
        var f = $('#theLogField')[0].files[0];
        if (!f) {
            alert('pick a file');
            return;
        }
        // create the
        var fd = new FormData();
        fd.append('ajaxfile', f);
        $.ajax({
            url: '/upload-file-ajax'
            , data: fd
            , processData: false
            , contentType: false
            , type: 'POST'
            , success: function (data) {
                console.log('data', data);
                $('#lg').html(JSON.stringify(data.fileContent));
            }
        });
    });

    // tab switch operation
    $(function(){
        $(".table").css({"display": "none"});

        $(".switch-table").on("click", function(){
            $(".graph").css({"display": "none"});
            $(".table").css({"display": "block"}).fadeIn(200);
            $(this).parent().addClass("is-active");
            $(".switch-graph").parent().removeClass("is-active");
        });
        $(".switch-graph").on("click", function(){
            $(".table").css({"display": "none"});
            $(".graph").css({"display": "block"}).fadeIn(200);
            $(this).parent().addClass("is-active");
            $(".switch-table").parent().removeClass("is-active");
        });
    });

})(jQuery);