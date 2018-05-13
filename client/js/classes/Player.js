const EntityProxy = require('./Entity.js');
const InventoryProxy = require('./Inventory.js');

let client = class extends EntityProxy.client {
  constructor(params){
    super(params);
    const {name, inventory, maxMana, mana, maxHealth, health, selectedSlot, exp, toNextL, level} = params;
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = health;
    this.maxMana = maxMana;
    this.mana = mana;
    this.exp = exp;
    this.toNextL = toNextL;
    this.level = level;
    this.inventory = new InventoryProxy.client(inventory);

    client.list[this.id] = this;
  }

  render(canvas){
    super.render(canvas);
    canvas.minimap.colour('lime');
    canvas.minimap.centerRect(this);
    canvas.font('10px Arial');
    canvas.colour('black');
    canvas.text(this.name,this.x,this.y-this.h/0.8);
    canvas.text("Level: " + this.level, this.x, this.y-this.h/0.6);
    canvas.colour('red');
    canvas.rect({x: this.x - this.w/2, y: this.y - this.w, w: 32, h: 5});
    canvas.colour('green');
    canvas.rect({x: this.x - this.w/2, y: this.y - this.w, w: 32 * (this.health/this.maxHealth), h: 5});
  }

  update(pkt){
    this.inventory.update(pkt.inventory.hotbar,pkt.inventory.list, pkt.inventory.selectedSlot);
    this.health = pkt.health;
    this.maxHealth = pkt.maxHealth;
    this.mana = pkt.mana;
    this.maxMana = pkt.maxMana;
    this.exp = pkt.exp;
    this.toNextL = pkt.toNextL;
    this.level = pkt.level;
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
    this.dead = false;
    this.deathTime = 0;
    this.mouse = {button: 0, x: this.x, y: this.y};
    this.mouseThisTick = 0;
    this.maxHealth = maxHealth;
    this.health = health;
    this.maxMana = maxMana;
    this.mana = mana;
    this.exp = 0;
    this.toNextL = 100;
    this.level = 0;
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
    pkt.exp = this.exp;
    pkt.toNextL = this.toNextL;
    pkt.level = this.level;
    pkt.inventory = {size: this.inventory.totalSize, hotbarSize: this.inventory.hotbarSize};
    return pkt;
  }

  update(){
    if (!this.dead){
      if (this.toNextL <= this.exp){
        this.level ++;
        this.exp -= this.toNextL;
        this.toNextL += this.level * 10;
      }
      this.hsp = (Number(Boolean(this.keys["D"])||Boolean(this.keys["ARROWRIGHT"]))-Number(Boolean(this.keys["A"])||Boolean(this.keys["ARROWLEFT"])))*this.moveSpeed;
      this.vsp = (Number(Boolean(this.keys["S"])||Boolean(this.keys["ARROWDOWN"]))-Number(Boolean(this.keys["W"])||Boolean(this.keys["ARROWUP"])))*this.moveSpeed;

      let item = this.collision(this.x,this.y,false,"Item");
      if(item != false && item.delay <= 0){
        let picked = this.inventory.add(item.item, item.count);
        item.count = Math.max(item.count - picked, 0);
        if (item.count <= 0){
          item.remove();
        }
        item = null;
      }

      if(this.mouseThisTick == 1){
        let tool = global.Tool.get(this.inventory.selected.item);
        if (tool) {
          tool.use(this);
        } else {
          let deco = this.collision(this.x, this.y, false, 'Tree') || this.collision(this.x, this.y, false, 'Rock');
          if (deco){
            deco.damage(1, this);
          }
        }
      }

      if(this.mouseThisTick == 3){
        let cons = global.Consumable.get(this.inventory.selected.item);
        if (cons) cons.use(this, this.inventory.selectedSlot);
      }

      if(this.keys[1]||this.keys[2]||this.keys[3]||this.keys[4]||this.keys[5]||this.keys[6]||this.keys[7]||this.keys[8]||this.keys[9]){
        let test = [];
        for (let i = 1; i < 10; i ++){
          if (this.keys[i]) test.push(i);
        }
        this.inventory.selectedSlot = test[0]?test[0]-1:this.inventory.selectedSlot;
      }

      this.mouseThisTick = 0;
      super.update();
    } else {
      this.deathTime --;
      if (this.deathTime <= 0) this.respawn();
    }
  }

  respawn(){
    this.x = 0;
    this.y = 0;
    this.dead = false;
    this.deathTime = 0;
    this.exp = 0;
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    this.socket.emit('respawn');
  }

  damage(damage, p){
    if(this.dead) return;
    this.health = Math.max(this.health - damage, 0);
    if (this.health <= 0){
      this.kill(p);
    } else {
      this.socket.emit('damage', damage);
    }
  }

  heal(amount){
    if(this.dead) return;
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  kill(p){
    this.dead = true;
    this.deathTime = 300;
    this.hsp = this.vsp = 0;
    for (let key in this.keys) this.keys[key] = false;
    for (let i =0; i < this.inventory.hotbarSize; i++){
      this.inventory.drop('hotbar', i, Infinity, this.x, this.y);
    }
    for (let i = 0; i < this.inventory.size; i ++){
      this.inventory.drop('list', i, Infinity, this.x, this.y);
    }
    p.exp += Math.floor(Math.random() * 10);
    this.socket.emit('kill', p.name);
  }

  getUpdatePkt(){
    let pkt = super.getUpdatePkt();
    pkt.name = this.name;
    pkt.maxHealth = this.maxHealth;
    pkt.health = this.health;
    pkt.maxMana = this.maxMana;
    pkt.mana = this.mana;
    pkt.exp = this.exp;
    pkt.toNextL = this.toNextL;
    pkt.level = this.level;
    pkt.inventory = {list: this.inventory.list, hotbar: this.inventory.hotbar, selectedSlot: this.inventory.selectedSlot};
    return pkt;
  }

  get type(){
    let inst = super.type;
    inst.push(server.trackName);
    return inst;
  }

  render(ctx){
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
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

  static broadcast(e, m){
    for (let id in server.list){
      server.list[id].socket.emit(e,m);
    }
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
