const EntityProxy = require('./Entity.js');

let client = class extends EntityProxy.client {
  constructor(params){
    super(params);
    const {name} = params;
    this.name = name;
    client.list[this.id] = this;
  }

  render(canvas){
    super.render(canvas);
    canvas.text(this.name,this.x+this.w/2,this.y-this.h/2)
  }

  update(pkt){
    super.update(pkt);
  }

  remove(){
    //server.trackList.remove[server.trackName].push(this.id);
    // if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);
    delete this.constructor.list[this.id];
    super.remove();
  }
}

let server = class extends EntityProxy.server {
  constructor(params){
    super(params);
    const {name = 'player',socket,moveSpeed = 5,maxHealth = 20,health = maxHealth} = params;
    this.name = name;
    this.socket = socket;
    this.moveSpeed = moveSpeed;
    this.keys = {};
    this.maxHealth = maxHealth;
    this.health = health;

    server.list[this.id] = this;
    initPack[server.trackName][this.id] = this.getInitPkt();
    //console.log(initPack[server.trackName][this.id]);
  }

  getInitPkt(){
    let pkt = super.getInitPkt();
    pkt.name = this.name;
    return pkt;
  }

  update(){
    //console.log(this.keys);
    this.hsp = (Number(Boolean(this.keys["D"])||Boolean(this.keys["ARROWRIGHT"]))-Number(Boolean(this.keys["A"])||Boolean(this.keys["ARROWLEFT"])))*this.moveSpeed;
    this.vsp = (Number(Boolean(this.keys["S"])||Boolean(this.keys["ARROWDOWN"]))-Number(Boolean(this.keys["W"])||Boolean(this.keys["ARROWUP"])))*this.moveSpeed;
    //console.log("(" + this.hsp + "," + this.vsp + ")");
    super.update();
  }

  getUpdatePkt(){
    let pkt = super.getUpdatePkt();
    pkt.name = this.name;
    return pkt;
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

  static getRemove(){
    let pkt = {};
    for (let objId in server.list){
      let obj = server.list[objId];
      if (obj.dirty) pkt[objId] = obj.getRemovePkt();
    }
    return pkt;
  }
}

server.list = {};
client.list = {};

//console.log(EntityProxy.server.getUpdate());

module.exports = {client, server};
