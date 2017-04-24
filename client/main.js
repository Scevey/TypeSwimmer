let canvas;
let ctx;
let walkImage; //spritesheet for character
let slashImage; //image for attack
let mapImage;
//our websocket connection 
let socket; 
let hash; //user's unique character id (from the server)
let animationFrame; //our next animation frame function
let imgArr;
let playernumber;
let host = false;
let numPlayers;
let chosen;
let wordIndex = 0; //index to follow position in the word
let word;
let roomCode;
let players = {}; //character list
let num = 0;

//handle for key down events
const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const player = players[hash];
  
  //handle checking vs a word
  if (keyPressed == word.charCodeAt(wordIndex)) {
    //increase index
    wordIndex++;
    
    //check if word is finished
    if (wordIndex == word.length) {
      getWord();
    }
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
  mapImage = document.querySelector('#map');

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
	socket.on('showword', showWord);//join lobby
	socket.on('showStart',showStart); //show start
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
  

};

window.onload = init;