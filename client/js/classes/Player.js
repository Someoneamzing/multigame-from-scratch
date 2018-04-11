const EntityProxy = require('./Entity.js');
const InventoryProxy = require('./Inventory.js');

let client = class extends EntityProxy.client {
  constructor(params){
    super(params);
    const {name, inventory, maxMana, mana, maxHealth, health} = params;
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = health;
    this.maxMana = maxMana;
    this.mana = mana;
    this.inventory = new InventoryProxy.client(inventory);

    client.list[this.id] = this;
  }

  render(canvas){
    super.render(canvas);
    canvas.text(this.name,this.x,this.y-this.h/1.5)
  }

  update(pkt){
    this.inventory.update(pkt.inventory.hotbar,pkt.inventory.list);
    delete pkt.inventory;
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

let server = class extends EntityProxy.server {
  constructor(params){
    super(params);
    const {name = 'player',socket,moveSpeed = 5,maxHealth = 20,health = maxHealth, maxMana = 100, mana = maxMana} = params;
    this.name = name;
    this.socket = socket;
    this.moveSpeed = moveSpeed;
    this.keys = {};
    this.maxHealth = maxHealth;
    this.health = health;
    this.maxMana = maxMana;
    this.mana = mana;
    this.inventory = new InventoryProxy.server({size: 36,hotbarSize: 9});

    server.list[this.id] = this;
    initPack[server.trackName][this.id] = this.getInitPkt();
    //console.log(initPack[server.trackName][this.id]);
  }

  getInitPkt(){
    let pkt = super.getInitPkt();
    pkt.name = this.name;
    pkt.maxHealth = this.maxHealth;
    pkt.health = this.health;
    pkt.maxMana = this.maxMana;
    pkt.mana = this.mana;
    pkt.inventory = {size: this.inventory.totalSize, hotbarSize: this.inventory.hotbarSize};
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
    pkt.maxHealth = this.maxHealth;
    pkt.health = this.health;
    pkt.maxMana = this.maxMana;
    pkt.mana = this.mana;
    pkt.inventory = {list: this.inventory.list, hotbar: this.inventory.hotbar};
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

  // static getRemove(){
  //   let pkt = {};
  //   for (let objId in server.list){
  //     let obj = server.list[objId];
  //     if (obj.dirty) pkt[objId] = obj.getRemovePkt();
  //   }
  //   return pkt;
  // }
}

server.list = {};
client.list = {};

//console.log(EntityProxy.server.getUpdate());

module.exports = {client, server};
