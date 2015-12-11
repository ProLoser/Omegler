$(document).ready(function () {
 
    var paused = false;
    var pause = $("<button>Pause Omegler</button>").bind('click', function(){
        paused = !paused;
        $(this).text(paused && 'Unpause Omegler' || 'Pause Omegler');
    });
    var greeting = $("<button>Change Greeting</button>").bind('click', function(){
		chrome.storage.sync.get({text:'Hello there!', delay: 0 }, function (val) {
            var newGreeting = prompt('Please enter a new greeting:', val.text||'');
            if (newGreeting !== null) {
                var delay = prompt('Please enter an optional delay before sending in milliseconds', val.delay||500);
                chrome.storage.sync.set({"text": newGreeting});
                chrome.storage.sync.set({"delay": delay});
            }
        });
    });
    $("#tagline").html('').prepend(pause).append(greeting);

    $("#textbtn").click(function start(){
        console.log("[debug] start");
		chrome.storage.sync.get({text:'Hello there!', delay: 0 }, function (val) {
			write(val.text, val.delay);
		});
    });

    function write(msg, delay) {
        console.log("[debug] write called delay=" + delay + "// msg=" + msg);
        $(".chatmsg", document).html(msg);
        if ($(".sendbtn", document).is(":disabled")) {
            return setTimeout(function () {
                write(msg, delay);
            }, 200);
        }
        stopper = 0;
        
     	chrome.storage.sync.get("delay", function (val) {
        	setTimeout(function(){
				console.log("[debug] .sendbtn setTimeout called delay=" + val["delay"]);
				$(".sendbtn", document).click();
			}, val.delay || 0);
        });
    }

    function reconnect(double){
        console.log("[debug] reconnect");
        if (msgCount < 10){
            stopper = 1;
            msgCount = 0;
            clearInterval(timeout);
            $(".disconnectbtn", document).click();
            if (double) {
                $(".disconnectbtn", document).click();
                $(".disconnectbtn", document).click();
            }
            chrome.storage.sync.get({text:'Hello there!', delay: 0 }, function (val) {
                write(val.text, val.delay);
            });
        }
        else{
            $(".chatmsg", document).html('Save chat log if desired and then Reload page to continue.');
        }
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
