'use strict'

var SQUARE_SIZE = 3;
var renderMode = '';
var canvas = '';
var ctx;
var width;
var height;

window.onload = function() {
  var renderButton = document.getElementById("renderButton");
  renderButton.onclick = render;
  render();
}

function render() {
  renderMode = (function () {
    var radios = document.getElementsByName('renderLayers');
    for (var i=0; i<radios.length; i++)
      if (radios[i].checked) return radios[i].value
  })();

  var imageType = (function () {
    var radios = document.getElementsByName('imageType');
    for (var i = 0; i < radios.length; i++)
      if (radios[i].checked) return radios[i].value
  })();

  canvas = document.getElementById('Canvas');

  ctx = canvas.getContext('2d');
  ctx.canvas.width = Math.floor(window.innerWidth * 0.8)- 30;
  ctx.canvas.height = window.innerHeight - 30;

  width = Math.floor(ctx.canvas.width / SQUARE_SIZE) - 1;
  height = Math.floor(ctx.canvas.height / SQUARE_SIZE) - 1;

  if (canvas.getContext) {
    switch (imageType) {
      case 'spiral': spiral(); break;
      case 'triangle': triangle(); break;
      case 'rectangle': rectangle(); break;
      default: break;
    }
  } else {
    alert("Canvas is not supported in your browser.");
  }
}

function spiral() {
  var Direction = {
    RIGHT: 0,
    UP: 1,
    LEFT: 2,
    DOWN: 3
  }

  function turnLeft (direction) {
    switch (direction) {
      case Direction.RIGHT: return Direction.UP;
      case Direction.UP:    return Direction.LEFT;
      case Direction.LEFT:  return Direction.DOWN;
      case Direction.DOWN:  return Direction.RIGHT;
    }
  }

  var direction = Direction.RIGHT;
  var maxSideLength = 0;
  var sideLength = 0;
  var sideCount = 0;
  var pixelCount = 0;
  var x, y;
  var length = Math.min(width, height);
  var maxCount = length * length;

  x = y = Math.floor(length / 2);


  while (++pixelCount <= maxCount) {
    renderPixel(pixelCount, x, y);

    switch (direction) {
      case Direction.RIGHT: x ++; break;
      case Direction.UP:    y --; break;
      case Direction.LEFT:  x --; break;
      case Direction.DOWN:  y ++; break;
    }

    if (sideLength < maxSideLength) {
      sideLength++;
    } else {
      sideLength = 0;
      sideCount++;
      direction = turnLeft(direction);

      if (sideCount === 2) {
        sideCount = 0;
        maxSideLength++;
      }
    }
  }
}

function triangle() {
  var x = Math.floor(width/2);
  var y = 1;
  var pixelCount = 0;
  var maxCount = (2 * height > width) ? width / 2 : height;

  maxCount *= maxCount;

  while (++pixelCount <= maxCount) {
    renderPixel(pixelCount, x, y);

    if(pixelCount <= y*y - 1) {
      x++;
    } else {
      x -= (2*y) - 1;
      y++;
    }
  }
}

function rectangle() {
  var x = 1;
  var y = 1;
  var pixelCount = 0;

  while (++pixelCount <= width * height) {

    renderPixel(pixelCount, x, y);

    if(pixelCount < y*width) {
      x++;
    } else {
      x -= (width - 1);
      y++;
    }
  }
}

function renderPixel(pixelCount, x, y) {
  var divCount = divisorCount(pixelCount);

  if (divCount == 0) {  // primes
    if (renderMode !== 'composites') {
      ctx.fillStyle="#005e61";
      ctx.fillRect(x*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
  } else {
    if (renderMode !== 'primes') {
      ctx.fillStyle = "#00F";
      ctx.beginPath();
      ctx.arc(x*SQUARE_SIZE, y*SQUARE_SIZE, 0.1*divCount, 0, Math.PI*2);
      ctx.fill();
    }
  }
}

function divisorCount (num) {

  if(num == 1) return 1;

  var count = 0;
  var middle = Math.sqrt(num);

  for (var i = 2; i <= middle; i++) {
    if (num % i == 0) {
      count++;
    }
  }

  return count;
}
