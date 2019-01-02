$window = $(window);
$('[data-type="background"]').each(function(){
    $(this).css('background-attachment', 'fixed');
    var $bgobj = $(this);
    var speedDividend = $bgobj.data('speed');
    $bgobj.css('background-repeat', 'no-repeat');

    $(window).on('scroll resize load', function() {
        var parallaxDistance = ($bgobj.height() + $window.height()) / speedDividend;

        if($bgobj.data('bg-attach') === 'bottom') {
            var zeroPointPercent = $bgobj.height() / ($window.height() + $bgobj.height());
            var startPoint = -(parallaxDistance * zeroPointPercent);
            var endPoint = startPoint + parallaxDistance;
        } else {
            var zeroPointPercent = $window.height() / ($window.height() + $bgobj.height());
            var startPoint = parallaxDistance * zeroPointPercent;
            var endPoint = startPoint - parallaxDistance;
        }

        var offset = $bgobj.offset().top;
        var progress = ($bgobj.height() + $bgobj.offset().top - $window.scrollTop()) / ($window.height() + $bgobj.height());

        if($bgobj.data('bg-attach') === 'bottom') {
            var yPos = Math.floor((parallaxDistance * (1 - progress)) + startPoint);

            $bgobj.css('background-position', 'center bottom ' + yPos + 'px');
        } else {
            var yPos = Math.floor((parallaxDistance * progress) + endPoint);
            $bgobj.css('background-position', 'center '+ yPos + 'px');
        }
    });
});


window.onload = function() {
    function handler1() {
        $('.menu-btn ul').animate({"right": '250px'});
        $('body').animate({"right": '250px'});
        $('.navbar').animate({"right": '250px'});
        $(this).one("click", handler2);
    }

    function handler2() {
        $('.menu-btn ul').animate({"right": '0px'});
        $('body').animate({"right": '0px'});
        $('.navbar').animate({"right": '0px'});
        $(this).one("click", handler1);
    }

    $("#nav-icon3").one("click", handler1);
}

$(document).ready(function(){
    $('#nav-icon3').click(function(){
        $(this).toggleClass('open');
    });
});

function enforceHttps() {
    if(window.location.host.indexOf('localhost') !== -1) {
        return; //ignore for local environment.
    }

    if(window.location.protocol !== 'https:') {
        window.location = window.location.href.replace(/^http:/, "https:");
    }
}

enforceHttps();