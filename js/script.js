/* Author: Chris Barna <chris@unbrain.net> */

(function () {
  var width = 1000;
  var height = width / 3.5 * 2;

  var body = document.getElementsByTagName("body")[0];
  var canvas = body.appendChild(document.createElement('canvas'));

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var context = canvas.getContext('2d');

  var Mandelbrot = function (width, height, context) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.scale = d3.scale.linear().domain([0, 10, 50, 1000])
      .range(['blue', 'red', 'yellow', 'black']);
  };

  Mandelbrot.prototype.draw = function () {
    var imageData = this.context.getImageData(0, 0, this.width, this.height);
    console.log(imageData.data[2]);
    for (var x = 0; x < this.width; x += 1) {
      for (var y = 0; y < this.height; y += 1) {
        var color = d3.rgb(this.calculateColor(x, y));
        imageData.data[((this.width * y) + x) * 4] = color.r;
        imageData.data[((this.width * y) + x) * 4+1] = color.g;
        imageData.data[((this.width * y) + x) * 4+2] = color.b;
        imageData.data[((this.width * y) + x) * 4+3] = 256;
      }
    }
    this.context.putImageData(imageData, 0, 0);
  };

  Mandelbrot.prototype.calculateColor = function (x, y) {
    // Normalize x and y
    var x0 = ((x / this.width) * 3.5) - 2.5;
    var y0 = ((y / this.height) * 2) - 1;

    var iter_x = 0;
    var iter_y = 0;

    var iter = 0;
    var max_iter = 1000;

    while (iter_x*iter_x + iter_y*iter_y < 2*2 && iter < max_iter) {
      var x_tmp = iter_x*iter_x - iter_y*iter_y + x0;
      iter_y = 2 * iter_x * iter_y + y0;

      iter_x = x_tmp;
      iter += 1;
    }
    //var shade = iter + 1 - Math.log(Math.log(iter_x*iter_x + iter_y*iter_y))/Math.log(2)
    return this.scale(iter);

//    return Math.exp(iter / max_iter) * 256;
  };

  // Create the actual objects.
  var mandel = new Mandelbrot(width, height, context);
  mandel.draw();
})();
