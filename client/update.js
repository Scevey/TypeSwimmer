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
const receiveAttack = (data) => {
  attacks.push(data);
};

//send attack 
const sendAttack = () => {
  if(bomb == true){
  const attacker = players[hash];

  const attack = {
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
  bomb = false;
  }
};

//when a character is killed
const playerDeath = (data) => {
  //remove the character
  delete players[data];
  num --;
  
  //if the character killed is our character
  //then disconnect and draw a game over screen
  if(data === hash) {
    cancelAnimationFrame(animationFrame);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 250, 300);
  }
  if( num == 1){
    const winner = Object.keys(players);
   const outdata = {
        room: roomCode,
        player: winner[0]
      };
    socket.emit('playerWin', outdata);
  }
};
//handle hit by attack
const playerHit = (data) => {
  //remove the character
    players[data].hp --;
    if(players[data].hp == 0){
      playerDeath(data);
    }
  
};
const win = () => {
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
const lose = () => {
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
const updatePosition = () => {
  const player = players[hash];
  //move the last x/y to our previous x/y variables
  player.prevX = player.x;
  player.prevY = player.y;
  //if(player.destY <= 480){
  //   player.moveDown = true;
    // player.moveUp = false;
 // }
  if(player.jump) {
       player.destY -= 40;
       player.fall = true;
    }
  
  if(player.moveUp && player.destY > 39) {
    player.destY -= 2;
    player.left= true;
  }
  //if user is moving down, increase y
  if(player.moveDown && player.destY < 470) {
    player.destY += 2;
    player.down = true;
  }
  //if user is moving left, decrease x
  if(player.moveLeft && player.destX > 35) {
    player.destX -= 2;
    player.left = true;
  }
  //if user is moving right, increase x
  if(player.moveRight && player.destX < 530 ) {
    player.destX += 2;
    player.right = true;
  }

  //determine direction based on the inputs of direction keys 
  if(player.moveUp && player.moveLeft) player.direction = directions.UPLEFT;
  if(player.moveUp && player.moveRight) player.direction = directions.UPRIGHT;
  if(player.moveDown && player.moveLeft) player.direction = directions.DOWNLEFT;
  if(player.moveDown && player.moveRight) player.direction = directions.DOWNRIGHT;

  if(player.moveDown && !(player.moveRight || player.moveLeft)) player.direction = directions.DOWN;
  if(player.moveUp && !(player.moveRight || player.moveLeft)) player.direction = directions.UP;
  if(player.moveLeft && !(player.moveUp || player.moveDown)) player.direction = directions.LEFT;
  if(player.moveRight && !(player.moveUp || player.moveDown)) player.direction = directions.RIGHT;

  //reset this character's alpha so they are always smoothly animating
  player.alpha = 0.05;
  var data = {
    playerData: player,
    hash: hash,
    room: roomCode
  }
  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', data);
};