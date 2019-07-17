"use strict";

document.onkeydown = function () {
  var e = window.event || arguments[0];

  if (e.keyCode == 123) {
    alert('请尊重劳动成果！www.jsdaima.com');
    return false;
  } else if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
    alert('请尊重劳动成果！www.jsdaima.com');
    return false;
  } else if (e.ctrlKey && e.keyCode == 85) {
    alert('请尊重劳动成果！www.jsdaima.com');
    return false;
  } else if (e.ctrlKey && e.keyCode == 83) {
    alert('请尊重劳动成果！www.jsdaima.com');
    return false;
  }
};

document.oncontextmenu = function () {
  alert('请尊重劳动成果！www.jsdaima.com');
  return false;
};

var getDesktopList = function getDesktopList(url, callback) {
  console.log("TCL: getDesktopList -> getDesktopList");
  $.ajax({
    type: "get",
    url: "http://47.240.13.42:88/index.php?r=xearth/desktop-drill/" + url,
    success: function success(response) {
      var data = response.data.record;
      callback(data);
    }
  });
};