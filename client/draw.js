//Possible directions a user can move
//their character. These are mapped
//to integers for fast/small storage
const directions = {
  DOWN: 0,
  LEFT: 1,
  RIGHT: 2, 
  UP: 3
};

//size of our character sprites
const spriteSizes = {
  WIDTH: 32,
  HEIGHT: 32
};
//function to lerp (linear interpolation)
//Takes position one, position two and the 
//percentage of the movement between them (0-1)
const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

//redraw with requestAnimationFrame
const redraw = (time) => {
  //update this user's positionsz
  updatePosition();

  ctx.clearRect(0, 0, 937, 661);  
  ctx.fillStyle = 'lightsalmon'; 
  ctx.strokeStyle = 'white';
  ctx.drawImage(mapImage,0,0,937,661);



  //each user id
  const keys = Object.keys(players);
  //for each user
  for(let i = 0; i < keys.length; i++) {
    const player = players[keys[i]];

    //if alpha less than 1, increase it by 0.01
    if(player.alpha < 1) player.alpha += 0.05;

    //applying a filter effect to other characters
    //in order to see our character easily
    if(player.hash === hash) {
      ctx.filter = "none";
    }
    else {
      ctx.filter = "hue-rotate(40deg)";
    }

    //calculate lerp of the x/y from the destinations
    player.x = lerp(player.prevX, player.destX, player.alpha);
    player.y = lerp(player.prevY, player.destY, player.alpha);

    // if we are mid animation or moving in any direction
    if(player.frame > 0 || (player.moveUp || player.moveDown || player.moveRight || player.moveLeft)) {
      //increase our framecount
      player.frameCount++;

      //every 8 frames increase which sprite image we draw to animate
      //or reset to the beginning of the animation
      if(player.frameCount % 3 === 0) {
        if(player.frame < 2) {
          player.frame++;
        } else {
          player.frame = 0;
        }
      }
    }
      let offsetX = spriteSizes.WIDTH * player.frame;
      let offsetY = spriteSizes.HEIGHT * player.direction;
    //draw our characters
    ctx.drawImage(
      fishImage, 
      spriteSizes.WIDTH * player.iconX + offsetX,
      spriteSizes.HEIGHT * player.iconY + offsetY,
      spriteSizes.WIDTH, 
      spriteSizes.HEIGHT,
      player.x, 
      player.y, 
      spriteSizes.WIDTH, 
      spriteSizes.HEIGHT
    ); 
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
    ctx.fillText(word[i], wordDraw + (20 * i), canvas.height - 40);
  }
  ctx.beginPath();
  ctx.moveTo(wordDraw + (20 * wordIndex) - 10, canvas.height - 40);
  ctx.lineTo(wordDraw + (20 * (wordIndex + 1)) - 10, canvas.height - 40);
  ctx.stroke();
  ctx.restore();
  
  
  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};