'use strict';

//Possible directions a user can move
//their character. These are mapped
//to integers for fast/small storage
var directions = {
  DOWN: 0,
  LEFT: 1,
  RIGHT: 2,
  UP: 3
};

//size of our character sprites
var spriteSizes = {
  WIDTH: 32,
  HEIGHT: 34
};
//function to lerp (linear interpolation)
//Takes position one, position two and the 
//percentage of the movement between them (0-1)
var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

//redraw with requestAnimationFrame
var redraw = function redraw(time) {
  //update this user's positionsz
  updatePosition();

  ctx.clearRect(0, 0, 937, 661);
  ctx.fillStyle = 'lightsalmon';
  ctx.strokeStyle = 'white';
  ctx.drawImage(mapImage, 0, 0, 937, 661);

  //each user id
  var keys = Object.keys(players);
  //for each user
  for (var _i = 0; _i < keys.length; _i++) {
    var player = players[keys[_i]];

    //if alpha less than 1, increase it by 0.01
    if (player.alpha < 1) player.alpha += 0.05;

    //applying a filter effect to other characters
    //in order to see our character easily
    if (player.hash === hash) {
      ctx.filter = "none";
    } else {
      ctx.filter = "hue-rotate(40deg)";
    }

    //calculate lerp of the x/y from the destinations
    player.x = lerp(player.prevX, player.destX, player.alpha);
    player.y = lerp(player.prevY, player.destY, player.alpha);

    // if we are mid animation or moving in any direction
    if (player.frame > 0 || player.moveUp || player.moveDown || player.moveRight || player.moveLeft) {
      //increase our framecount
      player.frameCount++;

      //every 8 frames increase which sprite image we draw to animate
      //or reset to the beginning of the animation
      if (player.frameCount % 3 === 0) {
        if (player.frame < 2) {
          player.frame++;
        } else {
          player.frame = 0;
        }
      }
    }
    var offsetX = spriteSizes.WIDTH * player.frame;
    var offsetY = spriteSizes.HEIGHT * player.direction;
    //draw our characters
    console.dir(fishImage);
    ctx.drawImage(fishImage, spriteSizes.WIDTH * player.iconX + offsetX, spriteSizes.HEIGHT * player.iconY + offsetY, spriteSizes.WIDTH, spriteSizes.HEIGHT, player.x, player.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);
    ctx.filter = "none";
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(player.name, player.x + 5, player.y, 40);
    ctx.strokeText(player.name, player.x + 5, player.y, 40);
  }
  ctx.save();
  ctx.fillStyle = "black";
  ctx.font = "20pt Arial";
  ctx.textAlign = "center";
  for (var i = 0; i < word.length; i++) {
    ctx.fillText(word[i], wordDraw + 20 * i, canvas.height - 40);
  }
  ctx.beginPath();
  ctx.moveTo(wordDraw + 20 * wordIndex - 10, canvas.height - 40);
  ctx.lineTo(wordDraw + 20 * (wordIndex + 1) - 10, canvas.height - 40);
  ctx.stroke();
  ctx.restore();

  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

//show lobby stuff
var readyUp = function readyUp(data) {
  clearError();
  document.getElementById('roomCode').textContent = data.room;
  roomCode = data.room;
  playernumber = data.length - 1;
  numPlayers = data.length;
  hash = data.player;
  for (var i = 0; i < numPlayers; i++) {
    var temp = i.toString();
    var playerID = 'player' + temp + 'Status';
    var playerName = 'player' + temp + 'Name';
    document.getElementById(playerID).textContent = "In Lobby";
    document.getElementById(playerName).textContent = data.roomnames[i];
  }
  $("#index").hide();
  $("#lobby").show();

  if (numPlayers == 1) {
    //call function to send calls to determine player roles
    socket.emit('setup', { room: roomCode });
  }
};
//update lobby
var playerJoin = function playerJoin(data) {
  var temp = numPlayers.toString();
  var playerID = 'player' + temp + 'Status';
  var playerName = 'player' + temp + 'Name';
  document.getElementById(playerID).textContent = "In Lobby";
  document.getElementById(playerName).textContent = data;
  numPlayers++;
};
//join a lobby
var join = function join() {
  var roomname = document.getElementById('lobbyName').value;
  name = document.getElementById('userName').value;
  if (name.length > 12) {
    var error = 'Please use a shorter name';
    handleError(error);
    return;
  }
  if (roomname === "" || name === "") {
    var error = 'Make sure to enter a Room Code and User Name';
    handleError(error);
    return;
  }
  var data = {
    room: roomname,
    user: name
  };
  socket.emit('join', data);
};
//create a lobby, become host
var create = function create() {
  name = document.getElementById('userName').value;
  if (name === "") {
    var error = 'Please enter a name';
    handleError(error);
    return;
  }
  socket.emit('create', name);
  host = true;
};
//show start button
var showStart = function showStart() {
  $("#startButton").show(500);
  document.getElementById('status').textContent = "Room Full!";
  getWord();
};
//get game started
var gameStart = function gameStart(e) {
  var data = {
    room: roomCode

  };

  socket.emit('gameStart', data);
};
// set spawns and start animating
var getGameReady = function getGameReady(data) {
  var tempP = data;
  num++;
  if (num == 1) {
    tempP.destX = 40;
    tempP.prevX = 40;
    tempP.x = 40;
    tempP.destY = 180 + 80 * (num - 1) + 15;
    tempP.prevY = tempP.destY;
    tempP.y = tempP.destY;
    players[data.hash] = tempP;
    $("#lobby").hide();
    $("#drawer").show();
    ctx.drawImage(mapImage, 0, 0, 937, 661);
    requestAnimationFrame(redraw);
  }
  if (num == 2) {
    tempP.destX = 40;
    tempP.prevX = 40;
    tempP.x = 40;
    tempP.destY = 180 + 80 * (num - 1) + 15;
    tempP.prevY = tempP.destY;
    tempP.y = tempP.destY;
    players[data.hash] = tempP;
    if (numPlayers == num) {
      $("#lobby").hide();
      $("#drawer").show();
      ctx.drawImage(mapImage, 0, 0, 937, 661);
      requestAnimationFrame(redraw);
    }
  }
  if (num == 3) {
    tempP.destX = 40;
    tempP.prevX = 40;
    tempP.x = 40;
    tempP.destY = 180 + 80 * (num - 1) + 15;
    tempP.prevY = tempP.destY;
    tempP.y = tempP.destY;
    players[data.hash] = tempP;
    if (numPlayers == num) {
      $("#lobby").hide();
      $("#drawer").show();
      ctx.drawImage(mapImage, 0, 0, 937, 661);
      requestAnimationFrame(redraw);
    }
  }
  if (num == 4) {
    tempP.destX = 40;
    tempP.prevX = 40;
    tempP.x = 40;
    tempP.destY = 180 + 80 * (num - 1) + 15;
    tempP.prevY = tempP.destY;
    tempP.y = tempP.destY;
    players[data.hash] = tempP;
    if (numPlayers == num) {
      $("#lobby").hide();
      $("#drawer").show();
      ctx.drawImage(mapImage, 0, 0, 937, 661);
      requestAnimationFrame(redraw);
    }
  }
  //set the character by their hash
  //document.getElementById('drawer').style.display = 'block';
  //	document.getElementById('lobby').style.display = 'none';
  //  requestAnimationFrame(redraw);
};
var getPlayer = function getPlayer() {
  var iconX = x; //0,1,2,3
  var iconY = y; //0,1
  var out = {
    room: roomCode,
    hash: hash,
    name: name,
    x: iconX,
    y: iconY
  };

  socket.emit('getPlayer', out);
};
var getWord = function getWord() {
  var wordspot = Math.floor(Math.random() * 588);
  socket.emit('words', wordspot);
};
var showWord = function showWord(data) {
  word = data;
  wordDraw = canvas.width / 2 - word.length * 10;
  //get html element by id set text content = word;
  //or write to canvas on overlay
};
var handleError = function handleError(data) {
  //set text for error msg
  var errormsg = data;
  document.getElementById('errormessage').innerHTML = errormsg;

  //show msg
  document.getElementById('error').style.display = 'block';
  //time out, hide msg
  setTimeout(function () {
    clearError();
  }, 5000); //5secs
};
var clearError = function clearError() {
  document.getElementById('error').style.display = 'none';
};
var choosePlayer = function choosePlayer(name) {
  $("#ad4 img").removeClass("selected");
  var id = "#" + name;
  selected = name;
  $(id).addClass('selected');
  switch (name) {
    case 'blue':
      x = 0;
      y = 0;
      break;
    case 'yellow':
      //document.getElementById(name) add class selected
      x = 1;
      y = 0;
      break;
    case 'green':
      //document.getElementById(name) add class selected
      x = 2;
      y = 0;
      break;
    case 'red':
      //document.getElementById(name) add class selected
      x = 0;
      y = 2;
      break;
    case 'brown':
      //document.getElementById(name) add class selected
      x = 0;
      y = 1;
      break;
    case 'snek':
      //document.getElementById(name) add class selected
      x = 0;
      y = 2;
      break;
    case 'frog':
      //document.getElementById(name) add class selected
      x = 3;
      y = 0;
      break;
    default:
      //document.getElementById(name) add class selected
      x = 0;
      y = 0;
  }
};
"use strict";

var canvas = void 0;
var ctx = void 0;
var walkImage = void 0; //spritesheet for character
var slashImage = void 0; //image for attack
var mapImage = void 0;
var fishImage = void 0;
//our websocket connection 
var socket = void 0;
var hash = void 0; //user's unique character id (from the server)
var animationFrame = void 0; //our next animation frame function
var imgArr = void 0;
var playernumber = void 0;
var host = false;
var selected = 'blue';
var numPlayers = void 0;
var name = void 0;
var chosen = void 0;
var x = 0;
var y = 0;
var wordIndex = 0; //index to follow position in the word
var word = "";
var wordDraw = 0;
var trackMoveIndex = 0;
var trackPoints = [460, 490, 630, 490, 720, 450, 740, 410, 740, 280, 685, 225, 630, 170, 300, 170, 245, 225, 190, 280, 190, 410, 245, 450, 300, 490];
var roomCode;
var players = {}; //character list
var num = 0;
var goingForward = true;
//keycode map from http://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
var keyboardMap = ["", // [0]
"", // [1]
"", // [2]
"CANCEL", // [3]
"", // [4]
"", // [5]
"HELP", // [6]
"", // [7]
"BACK_SPACE", // [8]
"TAB", // [9]
"", // [10]
"", // [11]
"CLEAR", // [12]
"ENTER", // [13]
"ENTER_SPECIAL", // [14]
"", // [15]
"SHIFT", // [16]
"CONTROL", // [17]
"ALT", // [18]
"PAUSE", // [19]
"CAPS_LOCK", // [20]
"KANA", // [21]
"EISU", // [22]
"JUNJA", // [23]
"FINAL", // [24]
"HANJA", // [25]
"", // [26]
"ESCAPE", // [27]
"CONVERT", // [28]
"NONCONVERT", // [29]
"ACCEPT", // [30]
"MODECHANGE", // [31]
" ", // [32]
"PAGE_UP", // [33]
"PAGE_DOWN", // [34]
"END", // [35]
"HOME", // [36]
"LEFT", // [37]
"UP", // [38]
"RIGHT", // [39]
"DOWN", // [40]
"SELECT", // [41]
"PRINT", // [42]
"EXECUTE", // [43]
"PRINTSCREEN", // [44]
"INSERT", // [45]
"DELETE", // [46]
"", // [47]
"0", // [48]
"1", // [49]
"2", // [50]
"3", // [51]
"4", // [52]
"5", // [53]
"6", // [54]
"7", // [55]
"8", // [56]
"9", // [57]
"COLON", // [58]
"SEMICOLON", // [59]
"LESS_THAN", // [60]
"EQUALS", // [61]
"GREATER_THAN", // [62]
"QUESTION_MARK", // [63]
"AT", // [64]
"A", // [65]
"B", // [66]
"C", // [67]
"D", // [68]
"E", // [69]
"F", // [70]
"G", // [71]
"H", // [72]
"I", // [73]
"J", // [74]
"K", // [75]
"L", // [76]
"M", // [77]
"N", // [78]
"O", // [79]
"P", // [80]
"Q", // [81]
"R", // [82]
"S", // [83]
"T", // [84]
"U", // [85]
"V", // [86]
"W", // [87]
"X", // [88]
"Y", // [89]
"Z", // [90]
"OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
"", // [92]
"CONTEXT_MENU", // [93]
"", // [94]
"SLEEP", // [95]
"NUMPAD0", // [96]
"NUMPAD1", // [97]
"NUMPAD2", // [98]
"NUMPAD3", // [99]
"NUMPAD4", // [100]
"NUMPAD5", // [101]
"NUMPAD6", // [102]
"NUMPAD7", // [103]
"NUMPAD8", // [104]
"NUMPAD9", // [105]
"MULTIPLY", // [106]
"ADD", // [107]
"SEPARATOR", // [108]
"SUBTRACT", // [109]
"DECIMAL", // [110]
"DIVIDE", // [111]
"F1", // [112]
"F2", // [113]
"F3", // [114]
"F4", // [115]
"F5", // [116]
"F6", // [117]
"F7", // [118]
"F8", // [119]
"F9", // [120]
"F10", // [121]
"F11", // [122]
"F12", // [123]
"F13", // [124]
"F14", // [125]
"F15", // [126]
"F16", // [127]
"F17", // [128]
"F18", // [129]
"F19", // [130]
"F20", // [131]
"F21", // [132]
"F22", // [133]
"F23", // [134]
"F24", // [135]
"", // [136]
"", // [137]
"", // [138]
"", // [139]
"", // [140]
"", // [141]
"", // [142]
"", // [143]
"NUM_LOCK", // [144]
"SCROLL_LOCK", // [145]
"WIN_OEM_FJ_JISHO", // [146]
"WIN_OEM_FJ_MASSHOU", // [147]
"WIN_OEM_FJ_TOUROKU", // [148]
"WIN_OEM_FJ_LOYA", // [149]
"WIN_OEM_FJ_ROYA", // [150]
"", // [151]
"", // [152]
"", // [153]
"", // [154]
"", // [155]
"", // [156]
"", // [157]
"", // [158]
"", // [159]
"CIRCUMFLEX", // [160]
"EXCLAMATION", // [161]
"DOUBLE_QUOTE", // [162]
"HASH", // [163]
"DOLLAR", // [164]
"PERCENT", // [165]
"AMPERSAND", // [166]
"UNDERSCORE", // [167]
"OPEN_PAREN", // [168]
"CLOSE_PAREN", // [169]
"ASTERISK", // [170]
"PLUS", // [171]
"PIPE", // [172]
"", // [173]
"OPEN_CURLY_BRACKET", // [174]
"CLOSE_CURLY_BRACKET", // [175]
"TILDE", // [176]
"", // [177]
"", // [178]
"", // [179]
"", // [180]
"VOLUME_MUTE", // [181]
"VOLUME_DOWN", // [182]
"VOLUME_UP", // [183]
"", // [184]
"", // [185]
"SEMICOLON", // [186]
"EQUALS", // [187]
"COMMA", // [188]
"-", // [189]
"PERIOD", // [190]
"SLASH", // [191]
"BACK_QUOTE", // [192]
"", // [193]
"", // [194]
"", // [195]
"", // [196]
"", // [197]
"", // [198]
"", // [199]
"", // [200]
"", // [201]
"", // [202]
"", // [203]
"", // [204]
"", // [205]
"", // [206]
"", // [207]
"", // [208]
"", // [209]
"", // [210]
"", // [211]
"", // [212]
"", // [213]
"", // [214]
"", // [215]
"", // [216]
"", // [217]
"", // [218]
"OPEN_BRACKET", // [219]
"BACK_SLASH", // [220]
"CLOSE_BRACKET", // [221]
"QUOTE", // [222]
"", // [223]
"META", // [224]
"ALTGR", // [225]
"", // [226]
"WIN_ICO_HELP", // [227]
"WIN_ICO_00", // [228]
"", // [229]
"WIN_ICO_CLEAR", // [230]
"", // [231]
"", // [232]
"WIN_OEM_RESET", // [233]
"WIN_OEM_JUMP", // [234]
"WIN_OEM_PA1", // [235]
"WIN_OEM_PA2", // [236]
"WIN_OEM_PA3", // [237]
"WIN_OEM_WSCTRL", // [238]
"WIN_OEM_CUSEL", // [239]
"WIN_OEM_ATTN", // [240]
"WIN_OEM_FINISH", // [241]
"WIN_OEM_COPY", // [242]
"WIN_OEM_AUTO", // [243]
"WIN_OEM_ENLW", // [244]
"WIN_OEM_BACKTAB", // [245]
"ATTN", // [246]
"CRSEL", // [247]
"EXSEL", // [248]
"EREOF", // [249]
"PLAY", // [250]
"ZOOM", // [251]
"", // [252]
"PA1", // [253]
"WIN_OEM_CLEAR", // [254]
"" // [255]
];

//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.keyCode;

  //handle checking vs a word
  if (word != "" && keyPressed != 16 && keyboardMap[keyPressed] === word[wordIndex].toUpperCase()) {
    //increase index
    wordIndex++;

    //check if word is finished
    if (wordIndex >= word.length) {
      getWord();
      wordIndex = 0;
      advanceOnTrack();
    }
  }
};

var advanceOnTrack = function advanceOnTrack() {
  var player = players[hash];
  player.prevX = Math.ceil(player.prevX);

  if (player.prevX >= 860) {
    goingForward = false;
  }

  if (!goingForward && player.prevX <= 40) {
    var data = {
      color: selected,
      room: roomCode,
      name: name
    };
    socket.emit('endGame', data);
  }

  if (goingForward) {
    player.destX += 40;
  } else {
    player.destX -= 40;
  }
};

var start = function start(data) {
  var player = players[data];
  player.moveDown = true;
};

var init = function init() {
  walkImage = document.querySelector('#walk');
  fishImage = document.querySelector('#fish');
  mapImage = document.querySelector('#map');

  document.querySelector('#joinLobby').onclick = join;
  document.querySelector('#createLobby').onclick = create;
  document.querySelector('#startButton').onclick = gameStart;
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('gameStart', getPlayer); //when user joins
  socket.on('addPlayer', getGameReady); //when user joins
  socket.on('updatedMovement', update); //when players move
  socket.on('left', gameOver); //when a user leaves
  socket.on('msg', handleError); //when a user leaves
  //socket.on('winner', win);//win msg
  socket.on('end', gameOver); //lose msg
  socket.on('lobby', readyUp); //lobby setup
  socket.on('joined', playerJoin); //join lobby
  socket.on('showword', showWord); //join lobby
  socket.on('showStart', showStart); //show start
  document.body.addEventListener('keydown', keyDownHandler);
};

window.onload = init;
'use strict';

//when we receive a character update
var update = function update(data) {
  //if we do not have that character (based on their id)
  //then add them
  if (!players[data.hash]) {
    players[data.hash] = data;
    return;
  }

  //if the update is for our own character (we dont need it)
  //Although, it could be used for player validation
  if (data.hash === hash) {
    return;
  }

  //if we received an old message, just drop it
  if (players[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  //grab the character based on the character id we received
  var player = players[data.hash];
  //update their direction and movement information
  //but NOT their x/y since we are animating those
  player.prevX = data.prevX;
  player.prevY = data.prevY;
  player.destX = data.destX;
  player.destY = data.destY;
  player.direction = data.direction;
  player.moveLeft = data.moveLeft;
  player.moveRight = data.moveRight;
  player.moveDown = data.moveDown;
  player.moveUp = data.moveUp;
  player.alpha = 0.05;
};

//when a character is killed
var playerDeath = function playerDeath(data) {
  //remove the character
  delete players[data];
  num--;

  //if the character killed is our character
  //then disconnect and draw a game over screen
  if (data === hash) {
    socket.disconnect();
    cancelAnimationFrame(animationFrame);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 937, 661);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 250, 300);
  }
};

var gameOver = function gameOver(data) {
  //winner    
  socket.emit('disconnect');
  var flakes = '',
      randomColor,
      icon,
      playerColor;

  icon = data.color + '1';
  switch (data.color) {
    case 'blue':
      playerColor = '000080';
      break;
    case 'yellow':
      playerColor = 'FFFF00';
      break;
    case 'green':
      playerColor = '00DD00';
      break;
    case 'red':
      playerColor = 'FF0000';
      break;
    case 'brown':
      playerColor = '800000';
      break;
    case 'snek':
      playerColor = '00FF00';
      break;
    case 'frog':
      playerColor = '008000';
      break;
    default:
      playerColor = '000080';
  }
  for (var i = 0, len = 400; i < len; i++) {
    if (i % 2 == 0) {
      randomColor = playerColor;
    } else {
      randomColor = Math.floor(Math.random() * 16777215).toString(16);
    }

    flakes += '<div class="ball" style="background: #' + randomColor;
    flakes += '; animation-duration: ' + (Math.random() * 9 + 2) + 's; animation-delay: ';
    flakes += Math.random() * 2 + 0 + 's;"></div>';
  }
  $('#winmessage').css('color', '#' + playerColor);
  $('#' + icon).css('display', 'inline');
  document.getElementById("winmessage").innerHTML = data.name + ' Won!';

  document.getElementById('confetti').innerHTML = flakes;
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, 937, 661);
  $('#win').show();
  $('#drawer').hide();
};

//update this user's positions based on keyboard input
var updatePosition = function updatePosition() {
  var player = players[hash];
  //move the last x/y to our previous x/y variables
  player.prevX = player.x;
  player.prevY = player.y;

  //determine direction based on the inputs of direction keys 
  if (player.moveUp && player.moveLeft) player.direction = directions.UPLEFT;
  if (player.moveUp && player.moveRight) player.direction = directions.UPRIGHT;
  if (player.moveDown && player.moveLeft) player.direction = directions.DOWNLEFT;
  if (player.moveDown && player.moveRight) player.direction = directions.DOWNRIGHT;

  if (player.moveDown && !(player.moveRight || player.moveLeft)) player.direction = directions.DOWN;
  if (player.moveUp && !(player.moveRight || player.moveLeft)) player.direction = directions.UP;
  if (player.moveLeft && !(player.moveUp || player.moveDown)) player.direction = directions.LEFT;
  if (player.moveRight && !(player.moveUp || player.moveDown)) player.direction = directions.RIGHT;

  //reset this character's alpha so they are always smoothly animating
  player.alpha = 0.05;
  var data = {
    playerData: player,
    hash: hash,
    room: roomCode
  };
  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', data);
};
