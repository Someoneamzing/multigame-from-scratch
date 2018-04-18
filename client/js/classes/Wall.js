const EntityProxy = require('./Entity.js');

let client = class extends EntityProxy.client {
  constructor(params) {
    super(params);

    client.list[this.id] = this;
  }

  remove(){
    delete this.constructor.list[this.id];
    super.remove();
  }

  render(canvas){
    canvas.colour('grey');
    canvas.centerRect(this);
    canvas.colour('black');
    canvas.lineWidth(2);
    canvas.centerRect(this,true);
    canvas.minimap.colour('grey');
    canvas.minimap.centerRect(this);
  }

  get type() {
    let inst = super.type;
    inst.push(client.trackName);
    return inst;
  }
}

let server = class extends EntityProxy.server {
  constructor(params) {
    params.solid = true;
    super(params);

    server.list[this.id] = this;
    initPack[server.trackName][this.id] = this.getInitPkt();
  }

  getInitPkt(){
    return super.getInitPkt();
  }

  getUpdatePkt(){
    let pkt = super.getUpdatePkt();
    pkt.w = this.w;
    pkt.h = this.h;
    return pkt;
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
}

client.trackName = server.trackName = 'Wall';

server.list = {};
client.list = {};

module.exports = {client, server};
