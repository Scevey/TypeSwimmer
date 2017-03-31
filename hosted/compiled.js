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
  WIDTH: 61,
  HEIGHT: 121
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

  ctx.clearRect(0, 0, 500, 500);

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
  }

  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var walkImage = void 0; //spritesheet for character
var slashImage = void 0; //image for attack
//our websocket connection 
var socket = void 0;
var hash = void 0; //user's unique character id (from the server)
var animationFrame = void 0; //our next animation frame function

var players = {}; //character list


//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var player = players[hash];
  // W OR UP
  if (keyPressed === 32) {
    player.moveUp = true;
  }
  // A OR LEFT
  else if (keyPressed === 65 || keyPressed === 37) {
      player.moveLeft = true;
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

  // W OR UP
  if (keyPressed === 32) {
    player.moveUp = false;
  }
  // A OR LEFT
  else if (keyPressed === 65 || keyPressed === 37) {
      player.moveLeft = false;
    }

    // D OR RIGHT
    else if (keyPressed === 68 || keyPressed === 39) {
        player.moveRight = false;
      }
};

var init = function init() {
  walkImage = document.querySelector('#walk');
  slashImage = document.querySelector('#slash');

  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('joined', setUser); //when user joins
  socket.on('updatedMovement', update); //when players move
  socket.on('left', removeUser); //when a user leaves

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
  console.log(player);
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

//function to set this user's character
var setUser = function setUser(data) {
  hash = data.hash; //set this user's hash to the unique one they received
  players[hash] = data; //set the character by their hash
  requestAnimationFrame(redraw); //start animating
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
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 50, 100);
  }
};

//update this user's positions based on keyboard input
var updatePosition = function updatePosition() {
  var player = players[hash];
  console.log(player);
  //move the last x/y to our previous x/y variables
  player.prevX = player.x;
  player.prevY = player.y;
  if (player.destY < 390) {
    player.moveDown = true;
  } else {
    player.moveDown = null;
  }
  //if user is jumping up, decrease y
  if (player.moveUp) {
    if (player.destY > 370) {
      player.destY = 350;
    }
  }
  //if user is moving down, increase y
  if (player.moveDown && player.destY < 390) {
    player.destY += 2;
  }
  //if user is moving left, decrease x
  if (player.moveLeft && player.destX > 0) {
    player.destX -= 2;
  }
  //if user is moving right, increase x
  if (player.moveRight && player.destX < 440) {
    player.destX += 2;
  }

  //determine direction based on the inputs of direction keys 
  if (player.moveDown) player.direction = directions.DOWN;

  if (player.moveDown && player.moveLeft) player.direction = directions.DOWNLEFT;

  if (player.moveDown && player.moveRight) player.direction = directions.DOWNRIGHT;

  if (player.moveLeft && !(player.moveUp || player.moveDown)) player.direction = directions.LEFT;

  if (player.moveRight && !(player.moveUp || player.moveDown)) player.direction = directions.RIGHT;

  //reset this character's alpha so they are always smoothly animating
  player.alpha = 0.05;

  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', player);
};
