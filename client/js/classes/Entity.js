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
    canvas.centerRect(this);
  }

  update(pkt){
    this.x = pkt.x;
    this.y = pkt.y;
    this.world = pkt.world;
    super.update(pkt);
  }

  remove(){
    //server.trackList.remove[server.trackName].push(this.id);
    // if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);
    delete this.constructor.list[this.id];
    super.remove();
  }

  get type(){
    let inst = super.type;
    inst.push(client.trackName);
    return inst;
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
    console.log(super.type);
  }

  dist(obj,x = this.x,y = this.y){
    return Math.pow(obj.x-x,2) + Math.pow(obj.y-y,2);
  }

  collision(x,y,onlySolid,type){

    for (let objName in CollisionTree.retrieve(this)){
      let obj = server.list[objName];
      if (!obj) continue;
      if (obj.id == this.id) continue;
      if (typeof type != 'undefined' && !obj.type.includes(type)) continue;
      if (onlySolid&&!obj.solid) continue;
      //if (this.dist(obj,x,y)>(Math.pow(this.w/2,2)+Math.pow(this.h/2,2))) continue;
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

  getInitPkt(){
    let pkt = super.getInitPkt();
    pkt.x = this.x;
    pkt.y = this.y;
    pkt.w = this.w;
    pkt.h = this.h;
    pkt.world = this.world;
    return pkt;
  }

  getUpdatePkt(){
    let pkt = super.getUpdatePkt();
    pkt.x = this.x;
    pkt.y = this.y;
    pkt.world = this.world;
    return pkt;
  }

  get type(){
    let inst = super.type;
    inst.push(server.trackName);
    return inst;
  }

  static registerCollidables(){
    CollisionTree.clear();
    for (let i in server.list){
      CollisionTree.insert(server.list[i]);
    }
  }
}

//console.log(server.getUpdate());
module.exports = {client, server};
