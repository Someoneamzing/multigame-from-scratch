const TrackableProxy = require('./Trackable.js');

let client = class extends TrackableProxy.client {
  constructor(params) {
    super(params);
    const {x = 0, y = 0, world = 0, w = 32, h = 32} = params;
    this.x = x;
    this.y = y;
    this.world = world;
    this.w = w;
    this.h = h;

    client.list[this.id] = this;
  }

  render(canvas){
    canvas.colour('purple');
    canvas.rect(this);
  }
}

let server = class extends TrackableProxy.server {
  constructor(params){
    super(params);
    const {x = 0, y = 0, world = 0, w = 32, h = 32, solid = false} = params;
    this.x = x;
    this.y = y;
    this.world = world;
    this.w = w;
    this.h = h;
    this.hsp = 0;
    this.vsp = 0;
    this.solid = solid;

    server.list[this.id] = this;
  }

  dist(obj,x = this.x,y = this.y){
    return (obj.x-x)**2 + (obj.y-y)**2;
  }

  collision(x,y,onlySolid){
    for (let objName in server.list){
      let obj = server.list[objName];
      if (onlySolid!=obj.solid) continue;
      if (this.dist(obj,x,y)>((this.w/2)**2+(this.h/2)**2)) continue;
      if (x - this.w/2 > obj.x + obj.w/2 || x + this.w/2 < obj.x - obj.w/2) continue;
      if (y - this.h/2 > obj.y + obj.h/2 || y + this.h/2 < obj.y - obj.h/2) continue;
      return obj;
    }
    return false;
  }

  update(){
    if(this.collision(this.x + this.hsp, this.y, true)){
      while (!this.collision(this.x + Math.sign(this.hsp), this.y, true)){
        this.x += Math.sign(this.hsp);
      }
      this.hsp = 0;
    }

    this.x += this.hsp;

    if(this.collision(this.x, this.y + this.vsp, true)){
      while (!this.collision(this.x, this.y + Math.sign(this.vsp), true)){
        this.y += Math.sign(this.vsp);
      }
      this.vsp = 0;
    }

    this.y += this.vsp;

    this.markDirty();
  }

  remove(){
    super.remove();
    delete server.list[this.id];
  }
}
module.exports = {client, server};
