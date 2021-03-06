const CameraProxy = require('./Camera.js');

let client = class {
  constructor(ctx, hasMini = false, camera = new CameraProxy.client(ctx, {x: 0, y: 0, zoom: 1})){
    this.ctx = ctx;
    this.canvas = $(this.ctx.canvas);
    this.camera = camera;
    this.minimap = hasMini !== false?new client(hasMini, false, new CameraProxy.client(this.hasMini, {x: 0, y: 0, zoom: 0.1})):false;
    console.log(this.minimap);
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

  centerRect({x, y, w, h}, outline){
    if(outline){
      this.ctx.strokeRect(x-w/2,y-h/2,w,h);
    } else {
      this.ctx.fillRect(x-w/2,y-h/2,w,h);
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

  textWO(str,x,y,fill,line){
    let old = this.ctx.fillStyle;
    let lineW = this.ctx.lineWidth;
    this.ctx.fillStyle = fill;
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = line;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(str,x,y);
    this.ctx.strokeText(str,x,y);
    this.colour(old);
    this.lineWidth(lineW);
  }

  lineWidth(w){
    this.ctx.lineWidth = w;
  }

  font(f){
    this.ctx.font = f;
  }

  clear(){
    this.ctx.clearRect(0,0,this.canvas.width(),this.canvas.height());
  }

  update(){
    this.ctx.save();
    if(this.minimap) {
      this.minimap.clear();
      this.minimap.camera.setPos(this.camera.x,this.camera.y);
      this.minimap.update();

    }
    //console.log(this.camera.x,this.camera.y);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-(this.camera.x - this.width/(2*this.camera.zoom)),-(this.camera.y - this.height/(2*this.camera.zoom)));

  }

  reset(){
    this.ctx.restore();
    if (this.minimap){
      this.minimap.reset();
    }
  }

  background(image){
    let {x, y} = this.camera;
    const {w :a, h: b} = image;
    const {width: w, height: h} = this;
    x = x - w;
    y = y - h;
    let C = [{n: (x - (x%a))/a, m: (y - (y%b))/b},{n: ((x+w) - ((x+w)%a))/a + 2, m: (y - (y%b))/b},{n: (x - (x%a))/a, m: ((y+h) - ((y+h)%b))/b + 2}];
    let imax = C[1].n - C[0].n;
    let jmax = C[2].m - C[0].m;
    //console.log(imax, jmax);
    for (let i = 0; i <= imax; i++){
      for (let j = 0; j <= jmax; j++){
        image.drawCenter(this, {x: (C[0].n + i) * a, y: (C[0].m + j) * b, w: a, h: b});
        //image.drawCenter(this.minimap, {x: (C[0].n + i) * a, y: (C[0].m + j) * b, w: a, h: b});
      }
    }
  }
}

module.exports = {client};
