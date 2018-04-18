const EntityProxy = require('./Entity.js')

let client = class extends EntityProxy.client {
  constructor(params) {
    super(params);
    const {item, count} = params;
    this.item = item;
    this.count = count;

    client.list[this.id] = this;
  }

  render(canvas){
    Sprites.get('item_' + this.item).drawCenter(canvas, this)
    //super.render(canvas);

  }

  remove(){
    delete this.constructor.list[this.id];
    super.remove();
  }

  update(pkt){
    this.item = pkt.item;
    this.count = pkt.count;
    super.update(pkt);
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
    const {item, count, delay} = params;
    this.item = item;
    this.count = count;
    this.delay = delay;

    server.list[this.id] = this;
    initPack[server.trackName][this.id] = this.getInitPkt();
  }

  getInitPkt(){
    let pkt = super.getInitPkt();
    pkt.item = this.item;
    pkt.count = this.count;
    return pkt;
  }

  getUpdatePkt(){
    let pkt = super.getUpdatePkt();
    pkt.item = this.item;
    pkt.count = this.count;
    return pkt;
  }

  update(){
    let p = this.collision(this.x,this.y,false,'Player');
    if (this.delay <= 0 && p && !p.dead){
      let added = p.inventory.add(this.item, this.count, 'any');
      this.count -= added;
      console.log(added, this.count);
      if (this.count <= 0) this.remove();
    }
    this.delay = Math.max(this.delay - 1, 0);
    super.update();
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
client.trackName = server.trackName = "Item";
server.list = {};
client.list = {};
module.exports = {client,server};
