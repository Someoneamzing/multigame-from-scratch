console.log('Connected to server at ' + location.hostname + ' on port ' + location.port + '.');

// const ConnectionProxy = require('./classes/Connection.js');
// const {client: Connection} = ConnectionProxy;
// import React from 'react';
// import ReactDOM from 'react-dom';

const SpriteProxy = require('./classes/Sprite.js');
const {client: Sprite} = SpriteProxy;
const SpriteListProxy = require('./classes/SpriteList.js');
const {client: SpriteList} = SpriteListProxy;
const LoaderListProxy = require('./classes/LoaderList.js');
const {client: LoaderList} = LoaderListProxy;
const CanvasProxy = require('./classes/Canvas.js');
const {client: Canvas} = CanvasProxy;
const EntityProxy = require('./classes/Entity.js');
const {client: Entity} = EntityProxy;
Entity.trackName = "Entity";
const PlayerProxy = require('./classes/Player.js');
const {client: Player} = PlayerProxy;
Player.trackName = "Player";
const ItemProxy = require('./classes/Item.js');
const {client: Item} = ItemProxy;
const WallProxy = require('./classes/Wall.js');
const {client: Wall} = WallProxy;
const ProjectileProxy = require('./classes/Projectile.js');
const {client: Projectile} = ProjectileProxy;

//const KeyMap = require('./classes/KeyMap.js');
window.KEYS = {};
const GAME = {screen: 'login'};

window.getClassLists = ()=>{
  return {
    Player: Player.list,
    Item: Item.list,
    Wall: Wall.list,
    Projectile: Projectile.list
  }
}

$(()=>{
  const loginTab = $('#page-nav-assist a[href="#login-page"]');
  const loadTab = $('#page-nav-assist a[href="#load-page"]');
  const gameTab = $('#page-nav-assist a[href="#game-page"]');
  const ctx = document.getElementById('gc').getContext('2d');
  const miniCtx = document.getElementById('mc').getContext('2d');
  //let miniMap =  new Canvas(miniCtx);
  const canvas = new Canvas(ctx,miniCtx);


  //let PlayerID;

  canvas.resize({w: window.innerWidth, h: window.innerHeight});

  $(window).resize((e)=>{
    canvas.resize({w: window.innerWidth, h: window.innerHeight});
  })


//---Asset Definition-----------------------------------------------------------

  window.Sprites = new SpriteList();
  Sprites.add(new Sprite({ctx, src: '/img/test.png'}));//, name: 'test-sprite'
  Sprites.add(new Sprite({ctx, src: '/img/test2.png'}));
  Sprites.add(new Sprite({ctx, src: '/img/gold.png', name: 'item_gold', w: 64, h: 64}));
  Sprites.add(new Sprite({ctx, src: '/img/bow.png', name: 'item_bow', w: 64, h: 64}));
  Sprites.add(new Sprite({ctx, src: '/img/arrow.png', name: 'proj_arrow', w: 32, h: 8}));
  Sprites.add(new Sprite({ctx, src: '/img/arrowItem.png', name: 'item_arrow', w: 64, h: 64}));
  Sprites.add(new Sprite({ctx, src: '/img/bandage.png', name: 'item_bandage', w: 64, h: 64}));


  const Loader = new LoaderList([Sprites]);

  // const connection = new Connection(socket);
  // connection.addTrack('Entity', Entity);
//______________________________________________________________________________


//---Authentication Listeners---------------------------------------------------
  socket.on('sign-in-res',(res)=>{
    $("#user").get(0).setCustomValidity('');
    $("#pass").get(0).setCustomValidity('');
    $('#user-feedback').text('');
    if (res.success){
      changeScreen('load');
      loadTab.tab('show');
      loadAssets();
    } else {
      switch (res.err){
        case 'dupe-acc':
          $('#pass-feedback').text('Error: Duplicate accounts found. Plaese contact the mods.');
          break;

        case 'incorrect':
          $('#pass-feedback').text('Incorrect username or password.');
          break;

        default:
          $('#pass-feedback').text('Unknown Error. Please contact the mods.');
      }
      $("#user").get(0).setCustomValidity('Username Error');
      $("#pass").get(0).setCustomValidity('Password Error');
      $("#login-form").addClass('was-validated');
    }
  })

  socket.on('sign-up-res',(res)=>{
    $('#user-feedback').text('');
    $('#pass-feedback').text('');
    if(res.success){
      $("#user").get(0).setCustomValidity('');
      $("#pass").get(0).setCustomValidity('');
      $('#pass-message').text('Sign-up Successful.');
    } else {
      switch (res.err) {
        case 'dupe-acc':
          $('#user-feedback').text('Username taken. Please try another.');
          break;

        default:
          $('#pass-feedback').text('Unknown Error. Please contact the mods.');
      }
      $("#user").get(0).setCustomValidity('Username Taken');
      $("#pass").get(0).setCustomValidity('Password Error');
    }
    $("#login-form").addClass('was-validated');
  })

  $("#login-form").submit((e)=>{
    e.preventDefault();
    $("#user").get(0).setCustomValidity('');
    $("#pass").get(0).setCustomValidity('');
    let user = $("#user").val();
    let pass = $("#pass").val();
    if(user == ''){
      $("#user").get(0).setCustomValidity('No Username');
      $('#user-feedback').text('Please enter a username.');
      $("#login-form").addClass('was-validated');
      e.stopPropagation();
      return false;
    }
    if(pass == ''){
      $("#pass").get(0).setCustomValidity('No Password');
      $('#pass-feedback').text('Please enter a password.');
      $("#login-form").addClass('was-validated');
      e.stopPropagation();
      return false;
    }
    socket.emit('sign-in',{user, pass});
  })

  $("#sign-up").click((e)=>{
    $("#user").get(0).setCustomValidity('');
    $("#pass").get(0).setCustomValidity('');
    e.preventDefault();
    let user = $("#user").val();
    let pass = $("#pass").val();
    if(user == ''){
      $('user-feedback').text('Please enter a username.');
      e.stopPropagation();
      return false;
    }
    if(pass == ''){
      $('pass-feedback').text('Please enter a password.');
      e.stopPropagation();
      return false;
    }
    socket.emit('sign-up',{user, pass});
  })

//______________________________________________________________________________

//---Asset Loading--------------------------------------------------------------
  function loadAssets(){
    Loader.load($('#load-bar'),()=>{
      console.log('Finished loading assets.', Loader.loaders);
      $('#game-page').append($(Loader.loaders[0].list[1]));
      //connection.begin();
      socket.emit('loaded', $("#user").val());
      gameTab.tab('show');
      changeScreen('game');
    });
  }
//______________________________________________________________________________


//---Initialization-------------------------------------------------------------
  socket.on('init',(initInfo)=>{
    window.PlayerId = initInfo.playerId;
    for(let pId in initInfo.initPkt.Player){
      new Player(initInfo.initPkt.Player[pId]);
    }
    for(let iId in initInfo.initPkt.Item){
      new Item(initInfo.initPkt.Item[iId]);
    }
    for(let wId in initInfo.initPkt.Wall){
      new Wall(initInfo.initPkt.Wall[wId]);
    }
    for(let pId in initInfo.initPkt.Projectile){
      new Projectile(initInfo.initPkt.Projectile[pId]);
    }

    socket.on('update',(pkt)=>{
      updatePkt(pkt);
    })

    socket.on('init-pkt', (pkt)=>{
      initPkt(pkt);
    })

    socket.on('remove', (pkt)=>{
      removePkt(pkt);
    })

    socket.on('chat', (msg)=>{
      addToChat(msg);
    })

    socket.on('eval-res', (res)=>{
      addToChat(res);
    })

    socket.on('kill', (name)=>{
      $('#killer').text(name);
      changeScreen('dead');
    })

    socket.on('respawn', ()=>{
      changeScreen('game');
    })

    beginRender();
  })

  function addToChat(msg){
    console.log("CHAT:  " + msg);
    $('#chat-view').append('<div class="chat-msg">' + msg + '</div>')
    let newMsg = $('#chat-hint').append('<div class="chat-msg">' + msg + '</div>').find(':last-child').show().delay(5000).fadeOut(1000,(e)=>{console.log(e);newMsg.remove();});
    $('#chat-view').remove('.chat-msg:nth-last-child(1n+50)');
    $('#chat-hint').remove(':nth-last-child(1n+10)');
    if ($('#chat-view').scrollTop()>= $("#chat-view").get(0).scrollHeight-$("#chat-view").height() - 40){
      console.log('Auto Scrolling', $("#chat-view").get(0).scrollHeight);
      $('#chat-view').scrollTop($("#chat-view").get(0).scrollHeight);
    }
    $('#chat-hint').scrollTop($("#chat-hint").get(0).scrollHeight);
  }
//______________________________________________________________________________


//---Update Handling------------------------------------------------------------
  function updatePkt(pkt) {
    //console.log("Update");

    //Players
    //console.log(pkt.Player);
    for (let id in pkt.Player){
      //console.log(id);
      let player = Player.list[id];
      player.update(pkt.Player[id]);
    }

    for (let id in pkt.Item){
      //console.log(id);
      let item = Item.list[id];
      item.update(pkt.Item[id]);
    }

    for (let id in pkt.Wall){
      //console.log(id);
      let wall = Wall.list[id];
      wall.update(pkt.Wall[id]);
    }

    for (let id in pkt.Projectile){
      let proj = Projectile.list[id];
      proj.update(pkt.Projectile[id]);
    }


  }

  function initPkt(pkt){
    //console.log(pkt);

    //Players
    for (let id in pkt.Player){
      let player = new Player(pkt.Player[id]);
      //console.log("New Player",player);
    }

    for (let id in pkt.Item){
      let item = new Item(pkt.Item[id]);
      //console.log("New Item",item);
    }

    for (let id in pkt.Wall){
      let wall = new Wall(pkt.Wall[id]);
    }

    for (let id in pkt.Projectile){
      let proj = new Projectile(pkt.Projectile[id]);
      console.log('New Projectile');
    }
  }

  function removePkt(pkt){


    //Players
    for (let id of pkt.Player){
      addToChat(Player.list[id].name + " left the game.");
      Player.list[id].remove();
    }

    for (let id of pkt.Item){
      Item.list[id].remove();
    }

    for (let id of pkt.Wall){
      Wall.list[id].remove();
    }

    for (let id of pkt.Projectile){
      Projectile.list[id].remove();
    }
  }
//______________________________________________________________________________

//---Render Loop----------------------------------------------------------------
  let renderLoop = ()=>{


    canvas.clear();
    let player = Player.list[PlayerId];
    canvas.camera.setPos(player.x + player.w/2,player.y + player.h/2);
    canvas.update();
    canvas.colour('black');
    canvas.lineWidth(2);
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(-10,0);
    canvas.ctx.lineTo(10,0);
    canvas.ctx.moveTo(0,-10);
    canvas.ctx.lineTo(0,10);
    canvas.ctx.stroke();

    for (let iId in Item.list){
      Item.list[iId].render(canvas);
    }

    for (let wId in Wall.list){
      Wall.list[wId].render(canvas);
    }

    for (let pId in Projectile.list){
      Projectile.list[pId].render(canvas);
    }

    for (let pId in Player.list){
      Player.list[pId].render(canvas);
    }
    canvas.reset();
    renderUI();
    //console.log(Player.list);

    requestAnimationFrame(renderLoop);
  }

  function beginRender(){
    requestAnimationFrame(renderLoop);
  }

  function renderUI(){
    let player = Player.list[PlayerId];

    canvas.colour('red');
    canvas.rect({x: 20,y: canvas.height - 40, w: 200, h: 20});
    canvas.colour('green');
    canvas.rect({x: 20,y: canvas.height - 40, w: 200 * (player.health/player.maxHealth), h: 20});
    canvas.colour('white');
    canvas.font('15px Arial');
    canvas.text("" + player.health + '/' + player.maxHealth, 120, canvas.height - 30);

    canvas.colour('grey');
    canvas.rect({x: canvas.width - 220,y: canvas.height - 40, w: 200, h: 20});
    canvas.colour('blue');
    canvas.rect({x: canvas.width - 220,y: canvas.height - 40, w: 200 * (player.mana/player.maxMana), h: 20});
    canvas.colour('white');
    canvas.font('15px Arial');
    canvas.text("" + player.mana + '/' + player.maxMana, canvas.width - 120, canvas.height - 30);

    canvas.colour('grey');
    canvas.rect({x:240, y: canvas.height - 40, w: canvas.width - 2 * 240, h: 20});
    canvas.colour('lime');
    canvas.rect({x:240, y: canvas.height - 40, w: player.exp / player.toNextL * (canvas.width - 2 * 240), h: 20});
    //canvas.colour('white');
    canvas.font('30px Consolas');
    canvas.textWO("" + player.level, canvas.width/2, canvas.height - 45, 'white', 'black');


    canvas.colour('#333333');
    canvas.rect({x: canvas.width/2 - 450,y: 20, w: 900, h: 100});
    for (let i in player.inventory.hotbar){
      canvas.colour('grey');
      canvas.lineWidth(1);
      canvas.rect({x: canvas.width/2 - 450 + i * 100,y: 20, w: 100, h: 100}, true);
      if (player.inventory.hotbar[i].item != null) Sprites.get('item_' + player.inventory.hotbar[i].item).drawCenter(canvas, {x: canvas.width/2 - 400 + i *100, y: 70, w: 64, h: 64});
      canvas.colour('white');
      canvas.font('20px Arial');
      if (player.inventory.hotbar[i].item != null && player.inventory.hotbar[i].count > 1) canvas.text(player.inventory.hotbar[i].count, canvas.width/2 - 365 + i *100, 110);
    }
    canvas.colour('#cccccc');
    canvas.lineWidth(3);
    canvas.rect({x: canvas.width/2 - 450 + player.inventory.selectedSlot * 100,y: 20, w: 100, h: 100}, true);
  }

//______________________________________________________________________________


//---Screens--------------------------------------------------------------------
  function changeScreen(newScreen){
    switch(newScreen){
      case "login":
        $('#chat-pane').hide();
        break;

      case 'load':
        $('#chat-pane').hide();
        break;

      case "game":
        $('#chat-pane').hide();
        $('#chat-input').blur();
        $('#chat-input').val("");
        $('#death-screen').hide();
        break;

      case "chat":
        $('#chat-pane').show();
        $('#chat-view .chat-msg').show();
        console.log('Auto Scrolling', $("#chat-view").get(0).scrollHeight);
        $('#chat-view').scrollTop($("#chat-view").get(0).scrollHeight);
        $('#chat-input').focus();
        break;

      case 'dead':
        $('#chat-pane').hide();
        $('#chat-input').blur();
        $('#chat-input').val("");
        $('#death-screen').show();
        break;
    }
    GAME.screen = newScreen;
  }
//______________________________________________________________________________

//---Event Listiners------------------------------------------------------------
  canvas.canvas.mousedown((e)=>{
    e.preventDefault();
    socket.emit('mousedown',{x: e.offsetX + canvas.camera.x - canvas.width/2, y: e.offsetY + canvas.camera.y - canvas.height/2, button: e.button})
  });

  canvas.canvas.mouseup((e)=>{
    e.preventDefault();
    socket.emit('mouseup', {x: e.offsetX + canvas.camera.x - canvas.width/2, y: e.offsetY + canvas.camera.y - canvas.height/2, button: e.button})
  })

  canvas.canvas.bind('contextmenu', (e)=>{
    e.preventDefault();
  })

  $(document).keydown((e)=>{
    KEYS[e.key.toUpperCase()] = true;
    console.log(e.key.toUpperCase());
    if(KEYS[String.fromCharCode(0x5C)]){

      //console.log('opening chat', GAME.screen);
      if(GAME.screen == 'game') {changeScreen('chat');e.preventDefault();} //else if (GAME.screen == 'chat') {changeScreen('game')};
    }

    if(KEYS['ESCAPE']){
      if(GAME.screen != 'game'){
        changeScreen('game');
      }
    }
    //console.log(KEYS);
    socket.emit('key',KEYS);
  })

  $(document).keyup((e)=>{
    KEYS[e.key.toUpperCase()] = false;
    //console.log(KEYS);
    socket.emit('key',KEYS);
  })

  $("#chat-form").submit((e)=>{
    e.preventDefault();
    let val = $('#chat-input').val();
    if(val.charAt(0) == "/"){
      socket.emit('eval',val.slice(1));
    } else {
      socket.emit('chat',val);
    }
    $('#chat-history').append("<option value='" + val.replace(/"/g, "&quot;").replace(/'/g,"&apos;") + "'>");
    changeScreen('game');
  })
//______________________________________________________________________________
})
