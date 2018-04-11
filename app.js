const $ = require('jquery');
const uuid = require('uuid/v4');
const loki = require('lokijs');
const CONFIG = require('./config.js');
const express = require('express');
const Socket = require('socket.io');
const httpModule = require('http');

// const ConnectionProxy = require('./client/js/classes/Connection.js');
// const {server: Connection} = ConnectionProxy;
const EntityProxy = require('./client/js/classes/Entity.js');
const {server: Entity} = EntityProxy;
//Entity.trackName = 'Entity';
const PlayerProxy = require('./client/js/classes/Player.js');
const {server: Player} = PlayerProxy;
Player.trackName = "Player";
const ItemProxy = require('./client/js/classes/Item.js');
const {server: Item} = ItemProxy;
const WallProxy = require('./client/js/classes/Wall.js');
const {server: Wall} = WallProxy;

function copyDefaultPkt(){
  return JSON.parse(JSON.stringify(defaultPack));
}

//Fix node imports with the --experimental-modules flag.

const app = express();
const http = httpModule.Server(app);
const io = Socket(http);

//---Handle Requests------------------------------------------------------------
app.get('/', (req, res)=>{
  res.sendFile(__dirname + "/client/index.html")
})

app.get('/jquery', (req,res)=>{
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js')
})

app.get('/bootstrapjs', (req,res)=>{
  res.sendFile(__dirname + "/node_modules/bootstrap/dist/js/bootstrap.min.js")
})

app.get('/bootstrapcss', (req,res)=>{
  res.sendFile(__dirname + "/node_modules/bootstrap/dist/css/bootstrap.min.css")
})


app.use(express.static('client'));

//______________________________________________________________________________

//---Init Database--------------------------------------------------------------
let accounts;

function initData(){
  accounts = db.getCollection('accounts');
  if(accounts === null) {
    accounts = db.addCollection('accounts');
  }
}

const db = new loki('data.db',{autosave: true, autoload: true, autoloadCallback: initData});
//______________________________________________________________________________

//---Register Connection Tracking-----------------------------------------------
const defaultPack = {Player: {}, Item: {}, Wall: {}};
global.updatePack = copyDefaultPkt();
global.initPack = copyDefaultPkt();
global.removePack = copyDefaultPkt();
for (let cName of Object.keys(defaultPack)){
  removePack[cName] = [];
}
//______________________________________________________________________________

//---Handle Connections---------------------------------------------------------

io.on('connection',(socket)=>{
  console.log('Socket Connection: ' + socket);
  //console.log(io.sockets.connected);
  socket.on('sign-in',(creds)=>{
    const res = accounts.count(creds);
    if (res == 1) {
      socket.emit('sign-in-res', {success: true});
    } else if (res > 1) {
      socket.emit('sign-in-res', {success: false, err: 'dupe-acc'});
    } else {
      socket.emit('sign-in-res', {success: false, err: 'incorrect'});
    }
  })

  socket.on('sign-up',(creds)=>{
    const res = accounts.count({user: creds.user});
    if (res == 0) {
      accounts.insert(creds);
      socket.emit('sign-up-res', {success: true});
    } else {
      socket.emit('sign-up-res', {success: false, err: 'dupe-acc'});
    }
  });

  socket.on('loaded',(name)=>{
    let connPlayer = new Player({name,id:socket.id,socket});

    let init = copyDefaultPkt();
    init.Player = Player.getInit();
    init.Item = Item.getInit();
    init.Wall = Wall.getInit();
    console.log("Hello", init);
    socket.emit('init',{initPkt: init,playerId: socket.id});
    socket.on('disconnect',()=>{
      console.log(socket.id, Player.list[socket.id].name);
      Player.list[socket.id].remove();
    })

    socket.on('click', (e)=>{
      console.log("Click at (" + e.x + "," + e.y + ") on the " + ["Left","Middle","Right"][e.button] + " button.");
    })

    socket.on('key', (keys)=>{
      Player.list[socket.id].keys = keys;
    })

    let store = {};

    socket.on('eval', (str)=>{
      try {
        socket.emit('eval-res',eval(str));
      } catch(err) {
        socket.emit('eval-res',err.message,err);
      }
    })

    socket.on('chat', (str)=>{
      console.log("CHAT:  <" + Player.list[socket.id].name + "> " + str);
      for(let id in Player.list){
        Player.list[id].socket.emit('chat',"&lt;" + Player.list[socket.id].name + "&gt; " + str);
      }
    })
  })
})


//______________________________________________________________________________

//---Begin Listening------------------------------------------------------------
http.listen(CONFIG.port, ()=>{
  console.log('Server Started on port ' + CONFIG.port + '.');
})
//______________________________________________________________________________

//---Start Main Loop------------------------------------------------------------
//let checker = new Entity({});

let MAIN_LOOP = setInterval(()=>{
  updatePack = copyDefaultPkt();
  Player.update();

  Item.update();

  updatePack.Player = Player.getUpdate();

  updatePack.Item = Item.getUpdate();

  updatePack.Wall = Wall.getUpdate();
  // console.log(initPack);
  for(let id in Player.list){
    Player.list[id].socket.emit('init-pkt',initPack);
    Player.list[id].socket.emit('update',updatePack);
    Player.list[id].socket.emit('remove', removePack)
  }
  initPack = copyDefaultPkt();
  for (let cName of Object.keys(defaultPack)){
    removePack[cName] = [];
  }
},1000/30)

//______________________________________________________________________________
