// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;

	app.onactivated = function (args) {
	    if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
			    // TODO: This application has been newly launched. Initialize your application here.
			    var ApplicationView = Windows.UI.ViewManagement.ApplicationView;
			    var preferredSize = { height: 165, width: 250 };
			    ApplicationView.preferredLaunchViewSize = preferredSize;
			    ApplicationView.preferredLaunchWindowingMode = preferredSize;
			    ApplicationView.getForCurrentView().setPreferredMinSize(preferredSize);
			    ApplicationView.getForCurrentView().tryResizeView(preferredSize);
			} else {
				// TODO: This application was suspended and then terminated.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
			}
			args.setPromise(WinJS.UI.processAll());
		}
		
		function readableTimespan(milliseconds) {
		    var secondSize = 1000;
		    var minuteSize = secondSize * 60;
		    var hourSize = minuteSize * 60;
		    var daySize = hourSize * 24;

		    var msRemaining = milliseconds;
		    var days = Math.floor(msRemaining / daySize);
		    msRemaining -= days * daySize;
		    var hours = Math.floor(msRemaining / hourSize);
		    msRemaining -= hours * hourSize;
		    var minutes = Math.floor(msRemaining / minuteSize);
		    msRemaining -= minutes * minuteSize;
		    var seconds = Math.floor(msRemaining / secondSize);
		    msRemaining -= seconds * secondSize;

		    return {
		        totalMilliseconds: milliseconds,
		        milliseconds: msRemaining,
		        seconds: seconds,
		        minutes: minutes,
		        hours: hours,
		        days: days,
		    };
		}

		function twoDigit(input) {
		    var string = String(input);
		    if (string.length > 2) {
		        string = string.slice(0, 2);
		    } else if (string.length < 2) {
		        string = "0" + string;
		    }
		    return string;
		}

		function play(id) {
		    document.getElementById(id).play();
		}

		function flash(selector) {
		    function fadeOut(then) {
		        $(selector).animate({ opacity: 0 }, "slow", then);
		    }
		    function fadeIn(then) {
		        $(selector).animate({ opacity: 1 }, "fast", then);
		    }
		    fadeOut(fadeIn(fadeOut(fadeIn(fadeOut(fadeIn)))));
		}

		var timer;
		function timerFactory(distance, $element) {
		    var start = new Date();
		    var destination = new Date(start.valueOf() + distance);
		    var halfway = false;
		    var threeQuarters = false;
		    timer = {
		        destination: destination,
		        display: $element.find('.timer-display'),
		        read: function () {
		            var timeRemaining = this.destination - Date.now();
		            return readableTimespan(timeRemaining);
		        },
		        checkPercentComplete: function () {
		            var origTimespan = destination - start;
		            var timeElapsed = Date.now() - start;
		            return timeElapsed / origTimespan;
		        }
		    };
		    timer.interval = setInterval(function () {
		        var displayText = twoDigit(timer.read().minutes) + ":" + twoDigit(timer.read().seconds) + "." + twoDigit(timer.read().milliseconds);
		        timer.display.text(displayText);
		        document.title = displayText.slice(0, -3) + " - Octave Timer";
		        $('#octave-timer progress').attr('value', timer.checkPercentComplete());
		        if (timer.checkPercentComplete() > 0.5 && halfway === false) {
		            halfway = true;
		            play('half-sound');
		        }
		        if (timer.checkPercentComplete() > 0.75 && threeQuarters === false) {
		            threeQuarters = true;
		            play('third-sound');
		        }
		        if (timer.read().totalMilliseconds < 9) {
		            play('scale-sound');
		            timer.stop();
		        }
		    }, 10);
		    timer.stop = function () {
		        clearInterval(timer.interval);
		        $('.btn-primary').toggleClass('hidden');
		        flash('.timer-display');
		        $('.timer-display').text("00:00.00");
		        document.title = "Octave Timer";
		    };
		    return timer;
		}

		$("#octave-timer .start-btn").click(function () {
		    alert("Clicked Start");
		    var minutes = $('#minutes-input').val();
		    var seconds = $('#seconds-input').val();
		    if (minutes === "" && seconds === "") {
		        $('input').css('border', '1px solid red');
		        return false;
		    }
		    $('input').css('border', '1px solid white');
		    var timeToSet = 1000 * 60 * minutes + 1000 * seconds;
		    $('.btn-primary').toggleClass('hidden');
		    timer = timerFactory(timeToSet, $('#octave-timer'));
		    play('octave-sound');
		});

		$('#octave-timer .stop-btn').click(function () {
		    timer.stop();
		});

		$('input').on('input', function () {
		    localStorage.setItem("minutes", $('#minutes-input').val());
		    localStorage.setItem("seconds", $('#seconds-input').val());
		    $('input').css('border', '1px solid white');
		});
		$('#minutes-input').val(localStorage.getItem("minutes"));
		$('#seconds-input').val(localStorage.getItem("seconds"));
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();
})();
