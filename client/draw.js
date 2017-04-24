//Possible directions a user can move
//their character. These are mapped
//to integers for fast/small storage
const directions = {
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
const spriteSizes = {
  WIDTH: 46,
  HEIGHT: 91
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

  ctx.clearRect(0, 0, 800, 800);  
  ctx.fillStyle = 'lightsalmon'; 
  ctx.strokeStyle = 'white';
  ctx.drawImage(mapImage,0,0,800,800);
 // ctx.ellipse(400, 400, 245, 180, 0, 0, Math.PI*2);  
 // ctx.ellipse(400, 400, 295, 220, 0, 0, Math.PI*2); 
 // ctx.ellipse(400, 400, 335, 260, 0, 0, Math.PI*2);
 // ctx.ellipse(400, 400, 375, 300, 0, 0, Math.PI*2);
 // ctx.lineWidth = 5;

  //ctx.stroke();
  //ctx.fill();


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
      if(player.frameCount % 8 === 0) {
        if(player.frame < 7) {
          player.frame++;
        } else {
          player.frame = 0;
        }
      }
    }

    //draw our characters
    ctx.drawImage(
      walkImage, 
      spriteSizes.WIDTH * player.frame,
      spriteSizes.HEIGHT * player.direction,
      spriteSizes.WIDTH, 
      spriteSizes.HEIGHT,
      player.x, 
      player.y, 
      spriteSizes.WIDTH, 
      spriteSizes.HEIGHT
    );
    ctx.filter = "none";
  }
  
  ctx.fillText(word, canvas.width / 2, canvas.height / 2, 500);
  
  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};