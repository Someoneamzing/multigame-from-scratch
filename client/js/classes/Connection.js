class client {
  constructor(socket){
    this.socket = socket;
    this.track = {};
    this.socket.on('connection-update', this.update);
    this.socket.on('connection-new', this.createNew);
    this.socket.on('connection-remove', this.remove);
  }

  addTrack(className, classID){
    this.track[className] = classID;
    classID.trackList = this;
    classID.trackName = className;
    // TODO: Handle class tracking on connection
  }

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

class server {
  constructor(io){
    this.io = io;
    this.track = {};
    this.initPkt = {};
    this.remove = {};
    this.updates = {};
    this.room = 'connection' + Math.floor(Math.random() * 1000)/1000;
    this.dirty = [];
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
  }

  addTrack(className, classID){
    this.track[className] = classID;
    classID.trackList = this;
    classID.trackName = className;
  }

  sendUpdate(){
    for (let listName in this.updates) {
      let list = this.updates[listName];
      list.length = 0;
      for (let obj of this.dirty[listName]){
        list.push(obj.getUpdatePkt());
      }
      this.dirty[listName].length = 0;
    }
    this.io.to(this.room).emit('connection-update', this.updates);
  }

  sendInit(){
    for(let ClassID of this.track){
      let list = this.initPkt[ClassID.trackName];
      list.length = 0;
      for(let obj of ClassID.list){
        list.push(obj.getInitPkt());
      }
    }
    this.io.to(this.room).emit('connection-init', this.initPkt);
  }

  sendRemove(){
    this.io.to(this.room).emit('connection-remove', this.remove);
    for (let list of this.remove){
      list.length = 0;
    }
  }

  sendAll(){
    this.sendInit();
    this.sendUpdate();
    this.sendRemove();
  }




}
