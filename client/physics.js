// box collision check between two rectangles
// of a set width/height
let direction = '';
const checkCollisions = (rect1, rect2, width1, height1, width2, height2) => {
  if (rect1.x < rect2.x + width2 &&
     rect1.x + width1 > rect2.x &&
     rect1.y < rect2.y + height2 &&
     height1 + rect1.y > rect2.y) {
    return true; // is colliding
  }
  return false; // is not colliding
};

// check attack collisions to see if colliding with the
// user themselves and return false so users cannot damage
// themselves
const checkAttackCollision = (character, attackObj) => {
  const attack = attackObj;
  let attackX = attack.x;
  let attackY = attack.y;
  
  // if attacking themselves, we won't check collision
  if (character.hash === attack.hash) {
    //players[character.hash].bomb = true;
    return false;
  }
  if(attack.up == true){

     //   attack.x = attack.x + 4;
    //    attack.y = attack.y - 44;
        let up = checkCollisions(character, attack, spriteSizes.WIDTH, spriteSizes.HEIGHT, attack.explosion1W, attack.explosion1Y);
        if(up == true){
          return true;
        }
  }
  if(attack.right == true){

        attack.x = attackX;
        attack.y = attackY;
        attack.x = attack.x + 59;
        let right = checkCollisions(character, attack, spriteSizes.WIDTH, spriteSizes.HEIGHT, attack.explosion2W, attack.height);
        if(right == true){
          return true;
        }
  }
  if(attack.down == true){
    attack.x = attackX;
    attack.y = attackY;
    attack.x = attack.x + 4;
    attack.y = attack.y + 44;
    let down = checkCollisions(character, attack,  spriteSizes.WIDTH, spriteSizes.HEIGHT,attack.explosion1W, attack.explosion1Y);
    if(down == true){
      return true;
    }
  }
  if(attack.left == true){
        attack.x = attackX;
        attack.y = attackY;
        attack.x = attack.x - 59;
        let left = checkCollisions(character, attack, spriteSizes.WIDTH, spriteSizes.HEIGHT, attack.explosion2W, attack.height);
        if(left == true){
          return true;
        }
  }
  else{
    return false;
  }
};

// handle each attack and calculate collisions
const checkAttacks = () => {
  // if we have attack
  if (liveAttacks.length > 0) {
    // get all characters
    const keys = Object.keys(players);
    const characters = players;

    // for each attack
    for (let i = 0; i < liveAttacks.length; i++) {
      // for each character
      for (let k = 0; k < keys.length; k++) {
        const char1 = characters[keys[k]];

        // call to see if the attack and character hit
        const hit = checkAttackCollision(char1, liveAttacks[i]);

        if (hit) { // if a hit
          // ask sockets to notify users which character was hit
          var data = {
            hash: char1.hash,
            room: roomCode
          }
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
const addAttack = (data) => {
    liveAttacks.push(data);
};

setInterval(() => {
  if(host == true){
      checkAttacks(); 
  }

}, 20);
