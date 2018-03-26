console.log('Connected to server at ' + location.hostname + ' on port ' + location.port + '.');

import * as ConnectionProxy from './classes/Connection.js';
const {client: Connection} = ConnectionProxy;
import * as SpriteProxy from './classes/Sprite.js';
const {client: Sprite} = SpriteProxy;
import * as SpriteListProxy from './classes/SpriteList.js';
const {client: SpriteList} = SpriteListProxy;
import * as LoaderListProxy from './classes/LoaderList.js';
const {client: LoaderList} = LoaderListProxy;
import * as CanvasProxy from './classes/Canvas.js';
const {client: Canvas} = CanvasProxy;

$(()=>{
  const loginTab = $('#page-nav-assist a[href="#login-page"]');
  const loadTab = $('#page-nav-assist a[href="#load-page"]');
  const gameTab = $('#page-nav-assist a[href="#game-page"]');
  const ctx = document.getElementById('gc').getContext('2d');
  const canvas = new Canvas(ctx);
  canvas.resize({w: window.innerWidth, h: window.innerHeight});

  $(window).resize((e)=>{
    canvas.resize({w: window.innerWidth, h: window.innerHeight});
  })


//---Asset Definition-----------------------------------------------------------

  const Sprites = new SpriteList();
  Sprites.add(new Sprite({ctx, src: '/img/test.png'}));//, name: 'test-sprite'
  Sprites.add(new Sprite({ctx, src: '/img/test2.png'}));

  const Loader = new LoaderList([Sprites]);
//______________________________________________________________________________


//---Authentication Listeners---------------------------------------------------
  socket.on('sign-in-res',(res)=>{
    $("#user").get(0).setCustomValidity('');
    $("#pass").get(0).setCustomValidity('');
    $('#user-feedback').text('');
    if (res.success){
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
      socket.emit('loaded');
      gameTab.tab('show');
    });
  }
//______________________________________________________________________________
})
