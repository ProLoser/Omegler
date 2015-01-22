$(document).ready(function () {
 
    var paused = false;
    var pause = $("<button>Pause Omegler</button>").bind('click', function(){
        paused = !paused;
        $(this).text(paused && 'Unpause Omegler' || 'Pause Omegler');
    });
    var greeting = $("<button>Change Greeting</button>").bind('click', function(){
        chrome.storage.sync.get("text", function (val) {
            var newGreeting = prompt('Please enter a new greeting:', val["text"]||'');
            if (newGreeting !== null)
                chrome.storage.sync.set({"text": newGreeting});
        });
    });
    $("#tagline").html('').prepend(pause).append(greeting);

    $("#textbtn").click(function start(){
        console.log("[debug] start");
        chrome.storage.sync.get("text", function (val) {
            write(val["text"],true);
        });
    });

    function write(msg) {
        $(".chatmsg", document).html(msg);
        if ($(".sendbtn", document).is(":disabled")) {
            return setTimeout(function () {
                write(msg);
            }, 200);
        }
        stopper = 0;
        $(".sendbtn", document).click();
    }

    function reconnect(double){
        stopper = 1;
        msgCount = 0;
        clearInterval(timeout);
        $(".disconnectbtn", document).click();
        if(double){
            $(".disconnectbtn", document).click();
            $(".disconnectbtn", document).click();
        }
        chrome.storage.sync.get("text", function (val) {
            write(val["text"]);
        });
    }

    var msgCount = 0;
    var stopper = 0;
    var timeout = 0;

    document.addEventListener("DOMSubtreeModified", function (event) {

        if ($('.strangermsg').length > msgCount) {
            console.log("[debug] countmessage");
            msgCount = $('.strangermsg').length;
        }
        if(stopper == 0 && $(".newchatbtnwrapper").is(":visible")){
            console.log("[debug] reconnect button show up");
            if (!paused)
                reconnect();
        }

    });

});