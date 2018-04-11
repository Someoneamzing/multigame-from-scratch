let uuid;
if(typeof this !== 'undefined' && typeof module !== 'undefined' && this.module !== module){
  uuid = require('uuid/v4');
}

let client = class {
  constructor(initPkt){
    this.id = initPkt.id;

    client.list[this.id] = this;

    this.update= this.update.bind(this);
  }

  update(updatePkt){
    ;
    //console.log(updatePkt);
  }

  remove(){
    //server.trackList.remove[server.trackName].push(this.id);
    //if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);
    delete this.constructor.list[this.id];
  }

  get type() {
    let inst = new Array();
    inst.push(client.trackName);
    return inst;
  }

  // static setTrack(connection, regName){
  //   client.trackList = connection;
  //   client.trackList = regName;
  // }


}

client.trackName = '';
client.trackList = {};
client.list = {};

let server = class {
  constructor(params){
    this.id = typeof params.id != "undefined" ? params.id : uuid();
    this.dirty = false;


    server.list[this.id] = this;

    this.markDirty= this.markDirty.bind(this);
    this.remove= this.remove.bind(this);
    this.getUpdatePkt= this.getUpdatePkt.bind(this);
    this.getInitPkt= this.getInitPkt.bind(this);
  }

  markDirty(){
    if (this.dirty) return;
    //console.log(server);
    //server.trackList.dirty[server.trackName].push(this);
    this.dirty = true;
  }

  remove(){
    //server.trackList.remove[server.trackName].push(this.id);
    if (!global.removePack[this.constructor.trackName].includes(this.id)) global.removePack[this.constructor.trackName].push(this.id);
    delete this.constructor.list[this.id];
  }

  getUpdatePkt(){
    return {id: this.id};
  }

  getInitPkt(){
    return {id: this.id};
  }

  get type() {
    let inst = new Array();
    inst.push(server.trackName);
    return inst;
  }

  static update(){
    for (let objId in server.list){
      let obj = server.list[objId];
      obj.update();
    }
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
      if (obj.dirty) pkt[objId] = obj.getInitPkt();
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



  // static setTrack(connection, regName){
  //   server.trackList = connection;
  //   server.trackName = regName;
  // }

}

server.trackName = '';
server.trackList = {};
server.list = {};

//console.log(server.getUpdate());

module.exports = {client, server};
