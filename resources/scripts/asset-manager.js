"use strict";

var LoadText = function(url, callback)
{
  var request = new XMLHttpRequest();
  request.open('GET', url, false);
  request.onload = function()
  {
    callback(null, request.responseText);
  };

  request.send();
};

var LoadImage = function(url, callback, target)
{
  var image = new Image();
  image.onload = function()
  {
    callback(null, image, target);
  };
  image.src = url;
};

var LoadJSON = function(url, callback)
{
  LoadText(url, function(err, res) {
    callback(null, JSON.parse(res));
  });
};