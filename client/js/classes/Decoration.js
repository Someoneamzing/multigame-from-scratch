const EntityProxy = require('./Entity.js');
class client extends EntityProxy.client {
  constructor(params){
    super(params)
    const {category, variant, health, healthMax} = params;
    this.category = category;
    this.variant = variant;
    console.log(category, variant);
    this.health = health;
    this.healthMax = healthMax;
    this.sprite = Sprites.get('decoration_' + this.category + "_" + this.variant);

    client.list[this.id] = this;
  }

  render(canvas){
    this.sprite.drawCenter(canvas, this);
  }

  remove(){
    delete this.constructor.list[this.id];
    super.remove();
  }

  update(pkt){
    this.category = pkt.category;
    this.variant = pkt.variant;
    super.update(pkt);
    if (this.x > canvas.camera.x-canvas.width/2 && this.x < canvas.camera.x+canvas.width/2 && this.y > canvas.camera.y-canvas.height/2 && this.y < canvas.camera.y+canvas.height/2) client.visible.push(this);
  }

  get type(){
    let inst = super.type;
    inst.push(client.trackName);
    return inst;
  }
}

class server extends EntityProxy.server {
  constructor(params){
    super(params);
    const {category, variant, health, healthMax} = params;
    this.category = category;
    this.variant = variant;
    this.health = health;
    this.healthMax = healthMax;

    server.list[this.id] = this;
    initPack[server.trackName][this.id] = this.getInitPkt();
  }

  getInitPkt(){
    let pkt = super.getInitPkt();
    pkt.category = this.category;
    pkt.variant = this.variant;
    return pkt;
  }

  getUpdatePkt(){
    let pkt = super.getInitPkt();
    pkt.category = this.category;
    pkt.variant = this.variant;
    return pkt;
  }

  update(){

    super.update();
  }

  damage(amount, p){
    this.health = Math.max(this.health-amount, 0);
    if (this.health <= 0) this.kill(p);
  }

  kill(p){
    p.exp += Math.floor(Math.random() * 3);
    this.remove();
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

client.trackName = server.trackName = "Decoration";
server.list = {};
client.list = {};
client.visible = [];
module.exports = {client,server};
