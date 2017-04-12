const sockets = require('./sockets.js');

let roomList = [];
let charList = {}; // list of characters
let attacks = []; // array of attack to handle
// box collision check between two rectangles
// of a set width/height
const checkCollisions = (rect1, rect2, width, height) => {
  if (rect1.x < rect2.x + width &&
     rect1.x + width > rect2.x &&
     rect1.y < rect2.y + height &&
     height + rect1.y > rect2.y) {
    return true; // is colliding
  }
  return false; // is not colliding
};

// check attack collisions to see if colliding with the
// user themselves and return false so users cannot damage
// themselves
const checkAttackCollision = (character, attackObj) => {
  const attack = attackObj;

  // if attacking themselves, we won't check collision
  if (character.hash === attack.hash) {
    return false;
  }

  // otherwise check collision of user rect and attack rect
  return checkCollisions(character, attack, attack.width, attack.height);
};

// handle each attack and calculate collisions
const checkAttacks = (room) => {
  // if we have attack
  if (attacks.length > 0) {
    // get all characters
    const keys = Object.keys(charList);
    const characters = charList;

    // for each attack
    for (let i = 0; i < attacks.length; i++) {
      // for each character
      for (let k = 0; k < keys.length; k++) {
        const char1 = characters[keys[k]];

        // call to see if the attack and character hit
        const hit = checkAttackCollision(char1, attacks[i]);

        if (hit) { // if a hit
          // ask sockets to notify users which character was hit
          var data = {
            hash: char1.hash,
            room: room
          }
          sockets.handleAttack(data);
          console.log('hit');
          // kill that character and remove from our user list
          //delete charList[char1.hash];
        } else {
          // if not a hit
          console.log('miss');
        }
      }

      // once the attack has been calculated again all users
      // remove this attack and move onto the next one
      attacks.splice(i);
      // decrease i since our splice changes the array length
      i--;
    }
  }
};

// update our entire character list
const setCharacterList = (hash, room) => {
  delete charList[room][hash];
  if(charList[room].length == 0){
    delete charList[room];
  }
};

// update an individual character
const setCharacter = (character, room) => {
  
  // if(!charList[room]) {
  //      charList[room] = {};
  //      attacks[room] = [];
 // }
  charList[character.hash] = character;
  roomList.push(room);
};

// add a new attack to calculate physics on
const addAttack = (data) => {
    attacks.push(data);
};


setInterval(() => {
  if(attacks.length > 0){
     const keys = Object.keys(attacks);
     for (let i = 0; i < keys.length; i++) {
        const room = keys[i];
      checkAttacks(room);
    }
  }
  
}, 20);

module.exports.setCharacterList = setCharacterList;
module.exports.setCharacter = setCharacter;
module.exports.addAttack = addAttack;
