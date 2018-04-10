const CameraProxy = require('./Camera.js');

let client = class {
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

  text(str,x,y){
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(str,x,y);
  }

  clear(){
    this.ctx.clearRect(0,0,this.canvas.width(),this.canvas.height());
  }

  update(){
    this.ctx.save();
    //console.log(this.camera.x,this.camera.y);
    this.ctx.translate(-(this.camera.x - this.width/2),-(this.camera.y - this.height/2));
  }

  reset(){
    this.ctx.restore();
  }
}

module.exports = {client};
