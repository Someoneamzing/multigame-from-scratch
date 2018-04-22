
let client = class extends Image {
  constructor({src, name = src.match(/([\w-]+)(?=\.(?:png|jpg|jpeg|mpeg|gif))/)[0], w = 32, h = 32, frames = 1, speed = 0}){
    super();
    //this.ctx = ctx;
    this.name = name;
    this.w = w;
    this.h = h;
    this.frames = frames;
    this.index = 0;
    this.speed = speed;
    this.path = src;
    this.loaded = false;
    this.offScreenC = document.createElement('canvas');
    this.offScreenC.width = this.w;
    this.offScreenC.height = this.h;
    this.offScreen = this.offScreenC.getContext('2d');
  }

  load(to, indicator){
    return new Promise(resolve=>{
      this.onload = ()=>{
        to.list.push(this);
        to.test(indicator);
        this.loaded = true;
        resolve();
      };
      this.onerror = ()=>{
        reject();
      }
      this.src = this.path;
    })
    // this.onload = ()=>{
    //   to.test(indicator);
    //   to.list.push(this);
    //   this.loaded = true;
    // }
    //this.src = this.path;
  }

  update(){
    this.index ++;
    this.index = this.index>=this.frames?0:this.index;
    this.offScreen.drawImage(this, this.index * this.width, 0, this.w, this.h, 0, 0, w, h);
  }

  get image(){
    return this.offScreen.toDataURL();
  }

  draw(canvas, {x,y,w,h,rot}){
    canvas.ctx.save();
    canvas.ctx.translate(x,y);
    canvas.ctx.rotate(rot);
    canvas.ctx.drawImage(this, this.index * this.width, 0, this.w, this.h, 0, 0, w, h);
    canvas.ctx.restore();
  }

  drawCenter(canvas, {x,y,w,h,rot}){
    canvas.ctx.save();
    canvas.ctx.translate(x,y);
    canvas.ctx.rotate(rot);
    canvas.ctx.drawImage(this, this.index * this.width, 0, this.w, this.h,-w/2,-h/2, w, h);
    canvas.ctx.restore();
  }

}

module.exports = {client};
