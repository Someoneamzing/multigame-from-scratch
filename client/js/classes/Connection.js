let client = class {
  constructor(socket){
    this.socket = socket;
    this.track = {};
    this.playerID = '';
    this.socket.on('connection-update', this.update);
    this.socket.on('connection-new', this.createNew);
    this.socket.on('connection-remove', this.remove);
    this.socket.on('connection-init', this.init);

    this.init = this.init.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.update = this.update.bind(this);
    this.createNew = this.createNew.bind(this);
    this.remove = this.remove.bind(this);
    this.begin = this.begin.bind(this);
    this.end = this.end.bind(this);

  }

  init(initInfo){
    PlayerID = this.playerID = initInfo.playerId;
    this.createNew(initInfo.initPkt);
  }

  // addTrack(className, classID){
  //   // this.track[className] = classID;
  //   // classID.trackList = this;
  //   // classID.trackName = className;
  //   // TODO: Handle class tracking on connection
  // }

  update(updatePkt){
    for(let list in updatePkt){
      for(let obj of updatePkt[list]){
        this.track[list][obj.id].update(obj);
      }
    }
  }

  createNew(newPkt){
    for(let list in newPkt){
      for(let obj of newPkt[list]){
        new this.track[list](obj);
      }
    }
  }

  remove(removePkt){
    for(let listName in newPkt){
      for(let id of newPkt[list]){
        delete client.track[listName][id];
      }
    }
  }

  begin(){
    this.socket.emit('connection-begin');
  }

  end(){
    this.socket.emit('connection-end');
  }
}

let server = class {
  constructor(io){
    this.io = io;
    this.track = {};
    this.initPkt = {};
    this.newPkt = {};
    this.remove = {};
    this.updates = {};
    this.room = 'connection' + Math.floor(Math.random() * 1000)/1000;
    this.dirty = {};
    this.add = {};
    this.io.on('connection',(socket)=>{
      socket.on('connection-begin',()=>{
        socket.join(this.room);

      })

      socket.on('connection-end',()=>{
        socket.leave(this.room);
      })

      // socket.on('disconnect',(reason)=>{
      //   delete this.sockets[socket.id];
      // })
      //socket.emit('connection-track-res', Object.keys(this.track)
    })

    this.initSocket = this.initSocket.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
    this.sendInit = this.sendInit.bind(this);
    this.sendRemove = this.sendRemove.bind(this);
    this.sendAll = this.sendAll.bind(this);
  }

  initSocket(socket, id){
    for(let ClassID of this.track){
      let list = this.initPkt[ClassID.trackName];
      list.length = 0;
      for (let objName in ClassID.list){
        let obj = ClassID.list[objName];
        list.push(obj.getInitPkt());
      }
    }
    socket.emit('connection-init', {playerId: id, initPkt: this.initPkt});
  }

  addTrack(className, classID){
    this.track[className] = classID.class;
    classID.class.trackList = this;
    classID.class.trackName = className;
  }

  sendUpdate(){
    for (let listName in this.updates) {
      let list = this.updates[listName];
      list.length = 0;
      for (let obj of this.track[listName]){
        if (obj.dirty) list.push(obj.getUpdatePkt());
      }
      //this.dirty[listName].length = 0;
    }
    this.io.to(this.room).emit('connection-update', this.updates);
  }

  sendInit(){
    for (let listName in this.newPkt){
      let list = this.newPkt[listName];
      list.length = 0;
      for (let obj of this.add[listName]){
        list.push(obj.getInitPack());
      }
      this.add[listName].length = 0;
    }
    this.io.to(this.room).emit('connection-new', this.newPkt);
  }

  sendRemove(){
    this.io.to(this.room).emit('connection-remove', this.remove);
    for (let listName in this.remove){
      let list = this.remove[listName];
      list.length = 0;
    }
  }

  sendAll(){
    this.sendInit();
    this.sendUpdate();
    this.sendRemove();
  }


}

module.exports = {client, server};
