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
var showWord = function showWord(data) {
  word = data;
  //get html element by id set text content = word;
  //or write to canvas on overlay
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
var word = void 0;
var roomCode = void 0;
var players = {}; //character list
var num = 0;
//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var player = players[hash];
  // W OR UP
  if (keyPressed === 87 || keyPressed === 38) {
    player.moveUp = true;
  }
  // A OR LEFT
  else if (keyPressed === 65 || keyPressed === 37) {
      player.moveLeft = true;
    }
    //S or DOWN
    else if (keyPressed === 83 || keyPressed === 40) {
        player.moveDown = true;
      }
      // D OR RIGHT
      else if (keyPressed === 68 || keyPressed === 39) {
          player.moveRight = true;
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
  socket.on('showword', showword); //join lobby
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
