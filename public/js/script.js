(function($){

    function toggleAlert(toggle){
        /**
         * toggleAlert(toggle)
         * if toggle is true, then show alert with animation,
         * else toggle is false, then hide alert
         * default, toggle = false;
         *
         * @param: bool toggle
         */
        if(toggle !== true && toggle !== false){
            toggle = false;
        }

        var $alert = $(".notification");
        var key = "is-hidden";
        if(toggle){// toggle = true(show)
            if($alert.hasClass(key)){
                $alert.removeClass(key).addClass("fade-in");
            }
        }else{// toggle = false(hide)
            if(!$alert.hasClass(key)){
                $alert.removeClass("fade-in").addClass(key);
            }
        }
    }



    function is_valid_url(url) {
        /**
         * is_valid_url(url)
         * Check url as a valid url or not.
         *
         * @url: https://stackoverflow.com/questions/24908208/url-validation-jquery-using-regex
         * @param: string url
         * @return: bool
         */
        return /^http(s)?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url);
    }

    $("#form").submit(function(){
        if(is_valid_url($('[name="address"]').val())){

        }else{
            toggleAlert(true);
            return false;
        }
    });

    // $(document).on("click", ".delete", function(){
    //     toggleAlert(false);
    // });


})(jQuery);