let canvas;
let ctx;
let walkImage; //spritesheet for character
let slashImage; //image for attack
//our websocket connection 
let socket; 
let hash; //user's unique character id (from the server)
let animationFrame; //our next animation frame function

let players = {}; //character list


//handle for key down events
const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const player = players[hash];
  // W OR UP
  if(keyPressed === 32) { 
    player.moveUp = true;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    player.moveLeft = true;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    player.moveRight = true;
  }
};
const start = (data) => {
  const player = players[data];
  player.moveDown = true;
}
//handler for key up events
const keyUpHandler = (e) => {
  var keyPressed = e.which;
  const player = players[hash];

  // W OR UP
  if(keyPressed === 32) {
    player.moveUp = false;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    player.moveLeft = false;
  }

  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    player.moveRight = false;
  }
};

const init = () => {
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