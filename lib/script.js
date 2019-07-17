"use strict";

var MAX_BAR_HEIGHT = 18;
addBarSpans();
setInterval(function () {
  setRandomBars();
}, 200); // Main programm (repeats)

function setRandomBars(maxBarHeight) {
  var bars = document.getElementsByClassName('equalizer-bar');

  for (var i = 0; i < bars.length; i++) {
    var spans = bars[i].getElementsByTagName('span');
    var activeSpanCount = getActiveSpans(spans);
    var newHeight = getRandomHeight(MAX_BAR_HEIGHT);

    for (var j = 0; j < spans.length; j++) {
      if (newHeight > activeSpanCount) {
        spans[j].style.opacity = '1';
      } else if (j > newHeight) {
        spans[j].style.opacity = '0';
      } // set little opacity


      var upperSpan = MAX_BAR_HEIGHT - j;

      if (newHeight > MAX_BAR_HEIGHT - 5 && upperSpan < 5) {
        spans[j].style.opacity = '0.' + upperSpan;
      }
    }
  }
} // Returns the number of active spans


function getActiveSpans(spans) {
  var counter = 0;

  for (var i = 0; i < spans.length; i++) {
    if (spans[i].style.opacity > 0) counter++;
  }

  return counter;
} // Returns a random number between 1 and 20


function getRandomHeight(maxBarHeight) {
  return Math.round(Math.random() * (maxBarHeight - 1)) + 1;
} // Add the default spans


function addBarSpans() {
  var bars = document.getElementsByClassName('equalizer-bar');
  var html = '';

  for (var j = 0; j < MAX_BAR_HEIGHT; j++) {
    html += '<span></span>';
  }

  for (var i = 0; i < bars.length; i++) {
    bars[i].innerHTML = html;
  }
}