let uuid;
if(typeof module !== 'undefined' && this.module !== module){
  uuid = require('uuid/v4');
}

export class client {
  constructor(initPkt){
    this.id = initPkt.id;

    client.list[this.id] = this;
  }

  update(updatePkt){
    for (let key of Object.keys(updatePkt)){
      if (key = 'id') continue;
      this[key] = updatePkt[key];
    }
  }

  static trackName = '';
  static list = {};
}

export class server {
  constructor(params){
    this.id = this.id = typeof params.id != "undefined" ? params.id : uuid();
    this.dirty = false;


    server.list[this.id] = this;
  }

  markDirty(){
    if (this.dirty) return;
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

  static trackName = '';
  static list = {};

  static update(){
    for (let obj of server.list){
      obj.update();
    }
  }

}
