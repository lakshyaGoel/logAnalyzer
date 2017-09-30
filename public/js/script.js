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

})(jQuery);