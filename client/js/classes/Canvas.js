const CameraProxy = require('./Camera.js');

class client {
  constructor(ctx, camera = new CameraProxy.client(ctx, {x: 0, y: 0, zoom: 1})){
    this.ctx = ctx;
    this.canvas = $(this.ctx.canvas);
    this.camera = camera;
  }

  get width() {
    return this.canvas.width();
  }

  get height(){
    return this.canvas.height();
  }

  resize({w, h}){
    this.ctx.canvas.width = w;
    this.ctx.canvas.height = h;
    this.colour('red');
    this.rect({x: 0, y: 0, w: this.width, h: this.height},true);
  }

  rect({x, y, w, h}, outline){
    if(outline){
      this.ctx.strokeRect(x,y,w,h);
    } else {
      this.ctx.fillRect(x,y,w,h);
    }
  }

  colour(colour){
    this.ctx.fillStyle = colour;
    this.ctx.strokeStyle = colour;
  }
}

module.exports = {client};
