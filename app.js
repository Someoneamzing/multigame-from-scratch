const $ = require('jquery');
const uuid = require('uuid/v4');
const loki = require('lokijs');
const CONFIG = require('./config.js');
const express = require('express');
const Socket = require('socket.io');
const httpModule = require('http');

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

//---Handle Connections---------------------------------------------------------

io.on('connection',(socket)=>{
  console.log('Socket Connection: ' + socket);
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
  })
})

//______________________________________________________________________________

//---Begin Listening------------------------------------------------------------
http.listen(CONFIG.port, ()=>{
  console.log('Server Started on port ' + CONFIG.port + '.');
})
//______________________________________________________________________________
