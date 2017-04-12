"use strict";

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
var bombSizes = {
  WIDTH: 32,
  HEIGHT: 32,
  OFF: 16
};
//function to lerp (linear interpolation)
//Takes position one, position two and the 
//percentage of the movement between them (0-1)
var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

//redraw with requestAnimationFrame
var redraw = function redraw(time) {
  //update this user's positions
  updatePosition();

  ctx.clearRect(0, 0, 600, 600);
  ctx.drawImage(mapImage, 0, 0, 600, 600);
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

    //highlight collision box for each character
    ctx.strokeRect(player.x, player.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);
    ctx.filter = "none";
  }
  for (var _i = 0; _i < attacks.length; _i++) {
    var attack = attacks[_i];
    //increase our framecount

    //every 8 frames increase which sprite image we draw to animate
    //or reset to the beginning of the animation
    if (attack.frames % 16 === 0) {
      if (attack.frame <= 7) {
        attack.frame++;
      } else {
        attack.frame = 1;
      }
    }
    attack.frames++;
    if (attack.frame == 7) {
      ctx.drawImage(bombImage, 444, 159, bombSizes.WIDTH, bombSizes.HEIGHT, attack.x, attack.y, attack.width, attack.height);
    } else if (attack.frame == 8) {
      ctx.drawImage(bombImage, 452, 5, 19, 88, attack.x + 4, attack.y - 30, 19, 88);
      ctx.drawImage(bombImage, 5, 159, 119, bombSizes.HEIGHT, attack.x + bombSizes.OFF - 75, attack.y, 119, attack.height);
    } else {

      ctx.drawImage(bombImage, bombSizes.WIDTH * attack.frame + 94, 159, bombSizes.WIDTH, bombSizes.HEIGHT, attack.x, attack.y, attack.width, attack.height);
    }

    if (attack.frames > 127) {
      attacks.splice(_i);
      _i--;
    }
  }
  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

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
	if (numPlayers == 2) {
		//call function to send calls to determine player roles
		socket.emit('setup', { room: roomCode });
	}
};
var playerJoin = function playerJoin(data) {
	var temp = numPlayers.toString();
	var playerID = 'player' + temp + 'Status';
	document.getElementById(playerID).textContent = "In Lobby";
	numPlayers++;
};
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
var create = function create() {
	socket.emit('create');
};
var showStart = function showStart() {
	document.getElementById('startButton').style.display = 'block';
	document.getElementById('status').textContent = "Room Full!";
};
var gameStart = function gameStart(e) {
	var data = {
		room: roomCode
	};

	socket.emit('gameStart', data);
};
var getGameReady = function getGameReady(data) {
	players[data.hash] = data;
	num++;
	console.log(num);
	if (num == 2) {
		document.getElementById('drawer').style.display = 'block';
		document.getElementById('lobby').style.display = 'none';
		requestAnimationFrame(redraw);
	} //set the character by their hash
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
'use strict';

var canvas = void 0;
var ctx = void 0;
var walkImage = void 0; //spritesheet for character
var slashImage = void 0; //image for attack
var mapImage = void 0;
var bombImage = void 0;
//our websocket connection 
var socket = void 0;
var hash = void 0; //user's unique character id (from the server)
var animationFrame = void 0; //our next animation frame function
var imgArr = void 0;
var playernumber = void 0;
var numPlayers = void 0;
var chosen = void 0;
var roomCode = void 0;
var attacks = [];
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
  if (keyPressed === 32) {
    //player.jump = true;
    sendAttack();
  }
  //W or UP
  else if (keyPressed === 87 || keyPressed === 38) {
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
  bombImage = document.querySelector('#bomb');
  mapImage = document.querySelector('#map');
  slashImage = document.querySelector('#slash');
  document.querySelector('#joinLobby').onclick = join;
  document.querySelector('#createLobby').onclick = create;
  document.querySelector('#startButton').onclick = gameStart;
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('gameStart', getPlayer); //when user joins
  socket.on('addPlayer', getGameReady); //when user joins
  socket.on('updatedMovement', update); //when players move
  socket.on('left', removeUser); //when a user leaves
  //socket.on('getRole', getRole);
  //socket.on('role', getGameReady);
  //socket.on('showwords', showWords);
  //socket.on('word', countDown);
  socket.on('lobby', readyUp);
  socket.on('joined', playerJoin);
  //socket.on('gameStart', gameStart);
  //socket.on('drawend', snapshot);
  socket.on('attackHit', playerDeath); //when a player dies
  socket.on('attackUpdate', receiveAttack); //when an attack is sent
  socket.on('showStart', showStart);
  //socket.on('movementUpdate', movementUpdate);
  //chooser responses
  //socket.on('addChoice',addChoice);
  //socket.on('reset',doReset);
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

//function to remove a character from our character list
var removeUser = function removeUser(data) {
  //if we have that character, remove them
  if (players[data.hash]) {
    delete players[data.hash];
  }
};
var receiveAttack = function receiveAttack(data) {
  attacks.push(data);
};

var sendAttack = function sendAttack() {
  var attacker = players[hash];

  var attack = {
    hash: hash,
    room: roomCode,
    x: attacker.x,
    y: attacker.y,
    direction: attacker.direction,
    frames: 0,
    frame: 0
  };
  var data = {
    attack: attack,
    room: roomCode
  };
  socket.emit('attack', data);
};

//when a character is killed
var playerDeath = function playerDeath(data) {
  //remove the character
  delete players[data];

  //if the character killed is our character
  //then disconnect and draw a game over screen
  if (data === hash) {
    socket.disconnect();
    cancelAnimationFrame(animationFrame);
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 50, 100);
  }
};

//update this user's positions based on keyboard input
var updatePosition = function updatePosition() {
  var player = players[hash];
  //move the last x/y to our previous x/y variables
  player.prevX = player.x;
  player.prevY = player.y;
  //if(player.destY <= 480){
  //   player.moveDown = true;
  // player.moveUp = false;
  // }
  //else{
  //  player.moveDown = null;
  //}
  //if user is jumping up, decrease y
  if (player.jump) {
    player.destY -= 40;
    player.fall = true;
  }

  if (player.moveUp && player.destY > 0) {
    player.destY -= 2;
  }
  //if user is moving down, increase y
  if (player.moveDown && player.destY < 480) {
    player.destY += 2;
  }
  //if user is moving left, decrease x
  if (player.moveLeft && player.destX > 0) {
    player.destX -= 2;
  }
  //if user is moving right, increase x
  if (player.moveRight && player.destX < 540) {
    player.destX += 2;
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
