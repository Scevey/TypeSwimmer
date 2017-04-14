let canvas;
let ctx;
let walkImage; //spritesheet for character
let slashImage; //image for attack
let mapImage;
let bombImage;
//our websocket connection 
let socket; 
let hash; //user's unique character id (from the server)
let animationFrame; //our next animation frame function
let imgArr;
let playernumber;
let host = false;
let numPlayers;
let chosen;
let roomCode;
let attacks = []; 
let liveAttacks = []; 
let players = {}; //character list
let num = 0;
let bomb = true;
//handle for key down events
const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const player = players[hash];
    // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    player.moveUp = true;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    player.moveLeft = true;
  }
  //S or DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    player.moveDown = true;
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

  // Space
  if(keyPressed === 32) {
    //player.jump = true;
    sendAttack();
  }
  //W or UP
  if(keyPressed === 87 || keyPressed === 38) {
    player.moveUp = false;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    player.moveLeft = false;
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    player.moveDown = false;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    player.moveRight = false;
  }
};

const init = () => {
  walkImage = document.querySelector('#walk');
  bombImage = document.querySelector('#bomb');
  mapImage = document.querySelector('#map');
  slashImage = document.querySelector('#slash');
  document.querySelector('#joinLobby').onclick = join;
	document.querySelector('#createLobby').onclick = create;
	document.querySelector('#startButton').onclick = gameStart; 
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('gameStart', getPlayer); //when user joins
  socket.on('addPlayer', getGameReady); //when user joins
  socket.on('updatedMovement', update); //when players move
  socket.on('left', lose); //when a user leaves
  socket.on('winner', win);//win msg
  socket.on('loser', lose);//lose msg
	socket.on('lobby', readyUp);//lobby setup
	socket.on('joined', playerJoin);//join lobby
  socket.on('attackHit', playerHit); //when a player dies
  socket.on('attackUpdate', receiveAttack); //when an attack is sent
	socket.on('showStart',showStart); //show start
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
  

};

window.onload = init;