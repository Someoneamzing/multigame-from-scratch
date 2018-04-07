let uuid;
if(typeof module !== 'undefined' && this.module !== module){
  uuid = require('uuid/v4');
}

let client = class {
  constructor(initPkt){
    this.id = initPkt.id;

    client.list[this.id] = this;

    this.update= this.update.bind(this);
  }

  update(updatePkt){
    for (let key of Object.keys(updatePkt)){
      if (key = 'id') continue;
      this[key] = updatePkt[key];
    }
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
    this.id = this.id = typeof params.id != "undefined" ? params.id : uuid();
    this.dirty = false;


    server.list[this.id] = this;

    this.markDirty= this.markDirty.bind(this);
    this.remove= this.remove.bind(this);
    this.getUpdatePkt= this.getUpdatePkt.bind(this);
    this.getInitPkt= this.getInitPkt.bind(this);
  }

  markDirty(){
    if (this.dirty) return;
    console.log(server);
    server.trackList.dirty[server.trackName].push(this);
    this.dirty = true;
  }

  remove(){
    server.trackList.remove[server.trackName].push(this.id);
    delete server.list[this.id];
  }

  getUpdatePkt(){
    return {id: this.id};
  }

  getInitPkt(){
    return {id: this.id};
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
  }

  // static setTrack(connection, regName){
  //   server.trackList = connection;
  //   server.trackName = regName;
  // }

}

server.trackName = '';
server.trackList = {};
server.list = {};


module.exports = {client, server};
