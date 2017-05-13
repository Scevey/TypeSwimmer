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

//when a character is killed
const playerDeath = (data) => {
  //remove the character
  delete players[data];
  num --;
  
  //if the character killed is our character
  //then disconnect and draw a game over screen
  if(data === hash) {
     socket.disconnect();
    cancelAnimationFrame(animationFrame);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 937, 661);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.fillText('You died', 250, 300);
  }
};

const gameOver = (data) => {
  //winner    
    socket.emit('disconnect');
    var flakes = '',
        randomColor,
        icon,
        playerColor;
        
        icon = data.color+'1';
      switch(data.color) {
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
    for(var i = 0, len = 400; i < len; i++) {
        if(i % 2 == 0){
            randomColor = playerColor;
        }
        else{
            randomColor = Math.floor(Math.random()*16777215).toString(16);
        }

        flakes += '<div class="ball" style="background: #'+randomColor;
        flakes += '; animation-duration: '+(Math.random() * 9 + 2)+'s; animation-delay: ';
        flakes += (Math.random() * 2 + 0)+'s;"></div>';
    }
    $('#winmessage').css('color', '#'+playerColor);
    $('#'+icon).css('display', 'inline');
    document.getElementById("winmessage").innerHTML = data.name +' Won!';
    
    document.getElementById('confetti').innerHTML = flakes;
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, 937, 661);
    $('#win').show();
    $('#drawer').hide();
  
};

//update this user's positions based on keyboard input
const updatePosition = () => {
  const player = players[hash];
  //move the last x/y to our previous x/y variables
  player.prevX = player.x;
  player.prevY = player.y;
  
  if ((player.destX < lastCheckpoint + 40 - .1 && goingForward) || (player.destX > lastCheckpoint - 40 && !goingForward) && (lastCheckpoint + 40 != 900 || lastCheckpoint - 40 != 0)) {
    if (goingForward) {
      player.destX += .1;
    } else {
      player.destX -= .1;
    }
  }

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