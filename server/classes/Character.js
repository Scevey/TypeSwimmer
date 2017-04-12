// Character class
class Character {
  constructor(data) {
    this.hash = data.hash; // character's unique id
    this.room = data.room;
    // last time this character was updated
    this.lastUpdate = new Date().getTime();
    const Xpos = Math.floor(Math.random() * 400);
    const Ypos = Math.floor(Math.random() * 40);
    this.x = Xpos; // x location of character on screen
    this.y = Ypos; // y location of character on screen
    this.prevX = Xpos; // last known x location of character
    this.prevY = Ypos; // last known y location of character
    this.destX = Xpos; // destination x location of character
    this.destY = Ypos; // destination y location of character
    this.height = 100; // height of character
    this.width = 100; // width of character
    this.alpha = 0; // lerp amount (from prev to dest, 0 to 1)
    this.direction = 0; // direction character is facing
    this.frame = 0; // frame in animation character is on
    this.frameCount = 0; // how many frames since last draw
    this.moveLeft = false; // if character is moving left
    this.moveRight = false; // if character is moving right
    this.moveDown = false; // if character is moving down
    this.moveUp = false; // if character is moving up
    this.jump = false;
  }
}

module.exports = Character;
