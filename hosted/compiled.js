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
//size of bomb sprites
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

    var mod1 = void 0;
    if (player.hp == 4) {
      mod1 = 1;
    }
    if (player.hp == 3) {
      mod1 = .75;
    }
    if (player.hp == 2) {
      mod1 = .5;
    }
    if (player.hp == 1) {
      mod1 = .25;
    }
    ctx.filter = "none";
    //highlight collision box for each character
    // ctx.strokeRect(player.x, player.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);

    ctx.strokeRect(player.x + 5, player.y + 5, spriteSizes.WIDTH - 5, 10);
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(player.x + 5, player.y + 6, 41, 8);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x + 5, player.y + 6, mod1 * 41, 8);
  }
  for (var _i = 0; _i < attacks.length; _i++) {
    var attack = attacks[_i];
    //every 16 frames increase which sprite image we draw to animate
    //or reset to the beginning of the animation
    if (attack.frames % 16 === 0) {
      if (attack.frame <= 6) {
        attack.frame++;
      } else {
        attack.frame = 1;
      }
    }
    attack.frames++;
    if (attack.frame == 7) {
      if (host == true && attack.frames == 110) {
        addAttack(attack);
      }
      ctx.drawImage(bombImage, 452, 5, 19, 88, attack.x + 4, attack.y - 30, 19, 88);
      ctx.drawImage(bombImage, 5, 162, 119, bombSizes.HEIGHT, attack.x + bombSizes.OFF - 75, attack.y, 119, attack.height);
    } else {

      ctx.drawImage(bombImage, bombSizes.WIDTH * attack.frame + 94, 162, bombSizes.WIDTH, bombSizes.HEIGHT, attack.x, attack.y, attack.width, attack.height);
    }

    if (attack.frames == 110) {
      attacks.splice(_i);
      _i--;
    }
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
var host = false;
var numPlayers = void 0;
var chosen = void 0;
var roomCode = void 0;
var attacks = [];
var liveAttacks = [];
var players = {}; //character list
var num = 0;
var bomb = true;
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
  socket.on('left', lose); //when a user leaves
  socket.on('winner', win); //win msg
  socket.on('loser', lose); //lose msg
  socket.on('lobby', readyUp); //lobby setup
  socket.on('joined', playerJoin); //join lobby
  socket.on('attackHit', playerHit); //when a player dies
  socket.on('attackUpdate', receiveAttack); //when an attack is sent
  socket.on('showStart', showStart); //show start
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;
'use strict';

// box collision check between two rectangles
// of a set width/height
var direction = '';
var checkCollisions = function checkCollisions(rect1, rect2, width1, height1, width2, height2) {
  if (rect1.x < rect2.x + width2 && rect1.x + width1 > rect2.x && rect1.y < rect2.y + height2 && height1 + rect1.y > rect2.y) {
    return true; // is colliding
  }
  return false; // is not colliding
};

// check attack collisions to see if colliding with the
// user themselves and return false so users cannot damage
// themselves
var checkAttackCollision = function checkAttackCollision(character, attackObj) {
  var attack = attackObj;
  var attackX = attack.x;
  var attackY = attack.y;

  // if attacking themselves, we won't check collision
  if (character.hash === attack.hash) {
    //players[character.hash].bomb = true;
    return false;
  }
  if (attack.up == true) {

    //   attack.x = attack.x + 4;
    //    attack.y = attack.y - 44;
    var up = checkCollisions(character, attack, spriteSizes.WIDTH, spriteSizes.HEIGHT, attack.explosion1W, attack.explosion1Y);
    if (up == true) {
      return true;
    }
  }
  if (attack.right == true) {

    attack.x = attackX;
    attack.y = attackY;
    attack.x = attack.x + 59;
    var right = checkCollisions(character, attack, spriteSizes.WIDTH, spriteSizes.HEIGHT, attack.explosion2W, attack.height);
    if (right == true) {
      return true;
    }
  }
  if (attack.down == true) {
    attack.x = attackX;
    attack.y = attackY;
    attack.x = attack.x + 4;
    attack.y = attack.y + 44;
    var down = checkCollisions(character, attack, spriteSizes.WIDTH, spriteSizes.HEIGHT, attack.explosion1W, attack.explosion1Y);
    if (down == true) {
      return true;
    }
  }
  if (attack.left == true) {
    attack.x = attackX;
    attack.y = attackY;
    attack.x = attack.x - 59;
    var left = checkCollisions(character, attack, spriteSizes.WIDTH, spriteSizes.HEIGHT, attack.explosion2W, attack.height);
    if (left == true) {
      return true;
    }
  } else {
    return false;
  }
};

// handle each attack and calculate collisions
var checkAttacks = function checkAttacks() {
  // if we have attack
  if (liveAttacks.length > 0) {
    // get all characters
    var keys = Object.keys(players);
    var characters = players;

    // for each attack
    for (var i = 0; i < liveAttacks.length; i++) {
      // for each character
      for (var k = 0; k < keys.length; k++) {
        var char1 = characters[keys[k]];

        // call to see if the attack and character hit
        var hit = checkAttackCollision(char1, liveAttacks[i]);

        if (hit) {
          // if a hit
          // ask sockets to notify users which character was hit
          var data = {
            hash: char1.hash,
            room: roomCode
          };
          socket.emit('handleAttack', data);
          // kill that character and remove from our user list
          //delete charList[char1.hash];
        }
      }

      // once the attack has been calculated again all users
      // remove this attack and move onto the next one
      liveAttacks.splice(i);
      // decrease i since our splice changes the array length
      i--;
    }
  }
};

// add a new attack to calculate physics on
var addAttack = function addAttack(data) {
  liveAttacks.push(data);
};

setInterval(function () {
  if (host == true) {
    checkAttacks();
  }
}, 20);
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

//add attack
var receiveAttack = function receiveAttack(data) {
  attacks.push(data);
};

//send attack 
var sendAttack = function sendAttack() {

  var attacker = players[hash];
  //if(attacker.bomb == true){
  var attack = {
    hash: hash,
    room: roomCode,
    x: attacker.x,
    y: attacker.y,
    explosion1W: 19,
    explosion1Y: 44,
    explosion2W: 59,
    explosion2Y: 32,
    direction: attacker.direction,
    up: true,
    down: true,
    left: true,
    right: true,
    frames: 0,
    frame: 0
  };
  var data = {
    attack: attack,
    room: roomCode
  };
  socket.emit('attack', data);
  //players[hash].bomb = false;
  // }
};

//when a character is killed
var playerDeath = function playerDeath(data) {
  //remove the character
  delete players[data];
  num--;

  //if the character killed is our character
  //then disconnect and draw a game over screen
  if (data === hash) {
    cancelAnimationFrame(animationFrame);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 250, 300);
  }
  if (num == 1) {
    var winner = Object.keys(players);
    var outdata = {
      room: roomCode,
      player: winner[0]
    };
    socket.emit('playerWin', outdata);
  }
};
//handle hit by attack
var playerHit = function playerHit(data) {
  //remove the character
  players[data].hp--;
  if (players[data].hp == 0) {
    playerDeath(data);
  }
};
var win = function win() {
  //winner    
  socket.emit('disconnect');
  socket.disconnect();
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
  socket.disconnect();
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, 600, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = 'white';
  ctx.font = '48px serif';
  ctx.fillText('You Won!', 250, 300);
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
  if (player.jump) {
    player.destY -= 40;
    player.fall = true;
  }

  if (player.moveUp && player.destY > 39) {
    player.destY -= 2;
    player.left = true;
  }
  //if user is moving down, increase y
  if (player.moveDown && player.destY < 470) {
    player.destY += 2;
    player.down = true;
  }
  //if user is moving left, decrease x
  if (player.moveLeft && player.destX > 35) {
    player.destX -= 2;
    player.left = true;
  }
  //if user is moving right, increase x
  if (player.moveRight && player.destX < 530) {
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
