'use strict'

var SQUARE_SIZE = 3;
var DIMENSION = 1;
var renderMode = '';
var canvas = '';
var ctx;
var width;
var height;
var numSquares;

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
  width = ctx.canvas.width = window.innerWidth * DIMENSION - 30;
  height = ctx.canvas.height = window.innerHeight * DIMENSION - 30;
  numSquares = width/SQUARE_SIZE;

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
  var w, h;
  w = h = Math.min(window.innerWidth, window.innerHeight);

  var numSquares = w/SQUARE_SIZE;

  ctx.canvas.width = w;
  ctx.canvas.height = h;

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

  var x, y;
  x = y =  Math.floor(numSquares/2);

  var direction = Direction.RIGHT;
  var maxSideLength = 0;
  var sideLength = 0;
  var sideCount = 0;
  var pixelCount = 0;

  while (++pixelCount <= numSquares*numSquares) {

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
      } else {
      }
    }
  }

}

function triangle() {
  var x = Math.floor(width/SQUARE_SIZE/2);
  var y = 1;
  var pixelCount = 0;

  while (++pixelCount <= height * height) {

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
  ctx.fillStyle="#eeeeee";
  ctx.fillRect(x*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

  if (divCount == 0) {
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
  var count = 0;

  if(num == 1) return 1;

  var middle = Math.sqrt(num);
  for (var i = 2; i <= middle; i++) {
    if (num % i == 0) {
      count++;
    }
  }

  return count;
}
