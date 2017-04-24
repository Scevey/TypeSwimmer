'use strict';

//Possible directions a user can move
//their character. These are mapped
//to integers for fast/small storage
var directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7
};

//size of our character sprites
var spriteSizes = {
  WIDTH: 46,
  HEIGHT: 91
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

  ctx.clearRect(0, 0, 800, 800);
  ctx.fillStyle = 'lightsalmon';
  ctx.strokeStyle = 'white';
  ctx.drawImage(mapImage, 0, 0, 800, 800);
  // ctx.ellipse(400, 400, 245, 180, 0, 0, Math.PI*2);  
  // ctx.ellipse(400, 400, 295, 220, 0, 0, Math.PI*2); 
  // ctx.ellipse(400, 400, 335, 260, 0, 0, Math.PI*2);
  // ctx.ellipse(400, 400, 375, 300, 0, 0, Math.PI*2);
  // ctx.lineWidth = 5;

  //ctx.stroke();
  //ctx.fill();


  //each user id
  var keys = Object.keys(players);
  //for each user
  for (var i = 0; i < keys.length; i++) {
    var player = players[keys[i]];

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
      if (player.frameCount % 8 === 0) {
        if (player.frame < 7) {
          player.frame++;
        } else {
          player.frame = 0;
        }
      }
    }

    //draw our characters
    ctx.drawImage(walkImage, spriteSizes.WIDTH * player.frame, spriteSizes.HEIGHT * player.direction, spriteSizes.WIDTH, spriteSizes.HEIGHT, player.x, player.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);
    ctx.filter = "none";
  }
  
  ctx.save();
  ctx.fillStyle = "black";
  ctx.font = "40pt Arial";
  ctx.textAlign = "center";
  ctx.fillText(word, canvas.width / 2, canvas.height / 2, 500);
  ctx.restore();
  
  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

//show lobby stuff
var readyUp = function readyUp(data) {
  document.getElementById('roomCode').textContent = data.room;
  roomCode = data.room;
  playernumber = data.length - 1;
  numPlayers = data.length;
  hash = data.player;
  for (var i = 0; i < numPlayers; i++) {
    var temp = i.toString();
    var playerID = 'player' + temp + 'Status';
    document.getElementById(playerID).textContent = "In Lobby";
  }
  document.getElementById('lobby').style.display = 'block';
  document.getElementById('index').style.display = 'none';
  if (numPlayers == 4) {
    //call function to send calls to determine player roles
    socket.emit('setup', { room: roomCode });
  }
};
//update lobby
var playerJoin = function playerJoin(data) {
  var temp = numPlayers.toString();
  var playerID = 'player' + temp + 'Status';
  document.getElementById(playerID).textContent = "In Lobby";
  numPlayers++;
};
//join a lobby
var join = function join() {
  var roomname = document.getElementById('lobbyName').value;
  if (roomname === "") {
    return;
  }
  var data = {
    room: roomname
  };
  socket.emit('join', data);
};
//create a lobby, become host
var create = function create() {
  socket.emit('create');
  host = true;
};
//show start button
var showStart = function showStart() {
  document.getElementById('startButton').style.display = 'block';
  document.getElementById('status').textContent = "Room Full!";
  var wordspot = Math.floor(Math.random() * 588);
  socket.emit('words', wordspot);
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
    tempP.destX = 47;
    tempP.prevX = 47;
    tempP.x = 47;
    tempP.destY = 52;
    tempP.prevY = 52;
    tempP.y = 52;
    players[data.hash] = tempP;
  }
  if (num == 2) {
    tempP.x = 522;
    tempP.prevX = 522;
    tempP.destX = 522;
    tempP.prevY = 52;
    tempP.destY = 52;
    tempP.y = 52;
    players[data.hash] = tempP;
    if (numPlayers == num) {
      document.getElementById('drawer').style.display = 'block';
      document.getElementById('lobby').style.display = 'none';
      requestAnimationFrame(redraw);
    }
  }
  if (num == 3) {
    tempP.destX = 47;
    tempP.prevX = 47;
    tempP.x = 47;
    tempP.destY = 469;
    tempP.prevY = 469;
    tempP.y = 469;
    players[data.hash] = tempP;
    if (numPlayers == num) {
      document.getElementById('drawer').style.display = 'block';
      document.getElementById('lobby').style.display = 'none';
      requestAnimationFrame(redraw);
    }
  }
  if (num == 4) {
    tempP.x = 522;
    tempP.prevX = 522;
    tempP.destX = 522;
    tempP.destY = 469;
    tempP.prevY = 469;
    tempP.y = 469;
    players[data.hash] = tempP;
    if (numPlayers == num) {
      document.getElementById('drawer').style.display = 'block';
      document.getElementById('lobby').style.display = 'none';
      ctx.fillStyle = 'lightsalmon';
      ctx.strokeStyle = 'white';
      ctx.drawImage(mapImage, 0, 0, 800, 800);
      ctx.ellipse(400, 400, 245, 180, 0, 0, Math.PI * 2);
      ctx.ellipse(400, 400, 295, 220, 0, 0, Math.PI * 2);
      ctx.ellipse(400, 400, 335, 260, 0, 0, Math.PI * 2);
      ctx.ellipse(400, 400, 375, 300, 0, 0, Math.PI * 2);
      ctx.lineWidth = 5;

      ctx.stroke();
      //ctx.fill();
      requestAnimationFrame(redraw);
    }
  }
  //set the character by their hash
  //document.getElementById('drawer').style.display = 'block';
  //	document.getElementById('lobby').style.display = 'none';
  //  requestAnimationFrame(redraw);
};
var getPlayer = function getPlayer() {
  var out = {
    room: roomCode,
    hash: hash
  };

  socket.emit('getPlayer', out);
};
var getWord = ()=>{
    var wordspot = Math.floor(Math.random() * 588);
    socket.emit('words', wordspot);
};
var showWord = function showWord(data) {
  word = data;
  //get html element by id set text content = word;
  //or write to canvas on overlay
  console.log(word);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var walkImage = void 0; //spritesheet for character
var slashImage = void 0; //image for attack
var mapImage = void 0;
//our websocket connection 
var socket = void 0;
var hash = void 0; //user's unique character id (from the server)
var animationFrame = void 0; //our next animation frame function
var imgArr = void 0;
var playernumber = void 0;
var host = false;
var numPlayers = void 0;
var chosen = void 0;
var word = "";
var wordIndex = 0;
var roomCode = void 0;
var players = {}; //character list
var num = 0;
//keycode map from http://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
var keyboardMap = [
  "", // [0]
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
  "HYPHEN_MINUS", // [173]
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
  "MINUS", // [189]
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
  var player = players[hash];
  
  //handle checking vs a word
  if (word != "" && keyPressed != 16 && keyboardMap[keyPressed] === word[wordIndex].toUpperCase()) {
    //increase index
    wordIndex++;
    
    //check if word is finished
    if (wordIndex >= word.length) {
      getWord();
      wordIndex = 0;
      player.destX += 5;
    }
  }
};
var start = function start(data) {
  var player = players[data];
  player.moveDown = true;
};
//handler for key up events
var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;
  var player = players[hash];

  // Space
  //W or UP
  if (keyPressed === 87 || keyPressed === 38) {
    player.moveUp = false;
  }
  // A OR LEFT
  else if (keyPressed === 65 || keyPressed === 37) {
      player.moveLeft = false;
    }
    // S OR DOWN
    else if (keyPressed === 83 || keyPressed === 40) {
        player.moveDown = false;
      }
      // D OR RIGHT
      else if (keyPressed === 68 || keyPressed === 39) {
          player.moveRight = false;
        }
};

var init = function init() {
  walkImage = document.querySelector('#walk');
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
  socket.on('left', lose); //when a user leaves
  socket.on('winner', win); //win msg
  socket.on('loser', lose); //lose msg
  socket.on('lobby', readyUp); //lobby setup
  socket.on('joined', playerJoin); //join lobby
  socket.on('showword', showWord); //join lobby
  socket.on('showStart', showStart); //show start
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
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
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 250, 300);
  }
};

var win = function win() {
  //winner    
  socket.emit('disconnect');

  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, 600, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = 'white';
  ctx.font = '48px serif';
  ctx.fillText('You Won!', 250, 300);
};
var lose = function lose() {
  //loser    
  socket.emit('disconnect');
  delete players[hash];
  socket.disconnect();
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, 600, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = 'white';
  ctx.font = '48px serif';
  ctx.fillText('You Lost!', 250, 300);
};
//update this user's positions based on keyboard input
var updatePosition = function updatePosition() {
  var player = players[hash];
  //move the last x/y to our previous x/y variables
  player.prevX = player.x;
  player.prevY = player.y;

  if (player.moveUp && player.destY > 39) {
    player.destY -= 2;
    player.left = true;
  }
  //if user is moving down, increase y
  if (player.moveDown && player.destY < 670) {
    player.destY += 2;
    player.down = true;
  }
  //if user is moving left, decrease x
  if (player.moveLeft && player.destX > 35) {
    player.destX -= 2;
    player.left = true;
  }
  //if user is moving right, increase x
  if (player.moveRight && player.destX < 730) {
    player.destX += 2;
    player.right = true;
  }

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
