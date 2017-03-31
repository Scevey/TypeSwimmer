//when we receive a character update
const update = (data) => {
  //if we do not have that character (based on their id)
  //then add them
  if(!players[data.hash]) {
    players[data.hash] = data;
    return;
  }

  //if the update is for our own character (we dont need it)
  //Although, it could be used for player validation
  if(data.hash === hash) {
    return;
  }

  //if we received an old message, just drop it
  if(players[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  //grab the character based on the character id we received
  const player = players[data.hash];
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
const removeUser = (data) => {
  //if we have that character, remove them
  if(players[data.hash]) {
    delete players[data.hash];
  }
};

//function to set this user's character
const setUser = (data) => {
  hash = data.hash; //set this user's hash to the unique one they received
  players[hash] = data; //set the character by their hash
  requestAnimationFrame(redraw); //start animating
};


//when a character is killed
const playerDeath = (data) => {
  //remove the character
  delete players[data];
  
  //if the character killed is our character
  //then disconnect and draw a game over screen
  if(data === hash) {
    socket.disconnect();
    cancelAnimationFrame(animationFrame);
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 50, 100);
  }
};

//update this user's positions based on keyboard input
const updatePosition = () => {
  const player = players[hash];
  console.log(player);
  //move the last x/y to our previous x/y variables
  player.prevX = player.x;
  player.prevY = player.y;
  if(player.destY < 390){
     player.moveDown = true;
  }
  else{
    player.moveDown = null;
  }
  //if user is jumping up, decrease y
  if(player.moveUp) {
    if (player.destY > 370){
       player.destY = 350;
    }
  }
  //if user is moving down, increase y
  if(player.moveDown && player.destY < 390) {
    player.destY += 2;
  }
  //if user is moving left, decrease x
  if(player.moveLeft && player.destX > 0) {
    player.destX -= 2;
  }
  //if user is moving right, increase x
  if(player.moveRight && player.destX < 440 ) {
    player.destX += 2;
  }

  //determine direction based on the inputs of direction keys 
  if(player.moveDown) player.direction = directions.DOWN;

  if(player.moveDown && player.moveLeft) player.direction = directions.DOWNLEFT;

  if(player.moveDown && player.moveRight) player.direction = directions.DOWNRIGHT;



  if(player.moveLeft && !(player.moveUp || player.moveDown)) player.direction = directions.LEFT;

  if(player.moveRight && !(player.moveUp || player.moveDown)) player.direction = directions.RIGHT;

  //reset this character's alpha so they are always smoothly animating
  player.alpha = 0.05;

  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', player);
};