const EntityProxy = require('./Entity.js');

let client = class extends EntityProxy.client {
  constructor(params) {
    super(params);
    const {variant, rot} = params;
    this.variant = variant;
    this.rot = rot;

    client.list[this.id] = this;
    console.log('New Projectile', client.list);
  }

  render(canvas){
    Sprites.get('proj_' + this.variant).drawCenter(canvas, this)
  }

  update(pkt){
    this.rot = pkt.rot;
    super.update(pkt);
  }

  remove(){
    delete client.list[this.id];
    super.remove();
  }

  get type(){
    let inst = super.type;
    inst.push(client.trackName);
    return inst;
  }
}

let server = class extends EntityProxy.server {
  constructor(params) {
    super(params);
    const {variant, damage, pId, hsp, vsp} = params;
    this.variant = variant;
    this.damage = damage;
    this.pId = pId;
    this.age = 0;
    this.hsp = hsp;
    this.vsp = vsp;

    server.list[this.id] = this;
    initPack[server.trackName][this.id] = this.getInitPkt();
  }

  get rot(){
    return Math.atan2(this.vsp, this.hsp);
  }

  getInitPkt(){
    let pkt = super.getInitPkt();
    pkt.variant = this.variant;
    pkt.rot = this.rot;
    return pkt;
  }

  getUpdatePkt(){
    let pkt = super.getUpdatePkt();
    pkt.rot = this.rot;
    return pkt;
  }

  remove(){
    delete server.list[this.id];
    super.remove();
  }

  update(){
    super.update();
    let p = this.collision(this.x,this.y,false,'Player');

    if(p){
      this.onHit(p);
    }

    this.age ++;
    if (this.age >= 1000) {this.remove();}
  }

  onHit(p){
    if (p.id != this.pId) {
      p.damage(this.damage, p.constructor.list[this.pId]);
      this.remove();
    }

  }

  get type(){
    let inst = super.type;
    inst.push(server.trackName);
    return inst;
  }

  static getUpdate(){
    let pkt = {};
    for (let objId in server.list){
      let obj = server.list[objId];
      if (obj.dirty) pkt[objId] = obj.getUpdatePkt();
    }
    return pkt;
  }

  static getInit(){
    let pkt = {};
    for (let objId in server.list){
      let obj = server.list[objId];
      pkt[objId] = obj.getInitPkt();
    }
    return pkt;
  }

  static update(){
    for (let objId in server.list){
      let obj = server.list[objId];
      obj.update();
    }
  }
}

client.list = {};
server.list = {};

client.trackName = server.trackName = "Projectile";

module.exports = {client, server};
