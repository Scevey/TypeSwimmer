// fast hashing library
const xxh = require('xxhashjs');
// Character custom class
const Character = require('./classes/Character.js');

const rooms = [];
// object of user characters
const characters = {};

// our socketio instance
let io;

const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7,
};

const handleAttack = (data) => {
  io.sockets.in(data.room).emit('attackHit', data.hash);
};

// function to setup our socket server
const setupSockets = (ioServer) => {
  // set our io server instance
  io = ioServer;

  // on socket connections
  io.on('connection', (sock) => {
    const socket = sock;

    socket.on('join', (data) => {
      const room = data.room;

      if (!rooms[room]) {
      //  socket.emit('error', 'Sorry that room doesnt exist');
        return;
      }
      const length = io.sockets.adapter.rooms[room];
      if (length.length >= 4) {
       // socket.emit('error', 'Sorry room is full');
        return;
      }
      const player = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
      io.sockets.in(room).emit('joined');
      rooms[room][length.length] = player;
      socket.join(room);
      const playernum = length.length;
      const outdata = {
        room,
        length: length.length,
        player,
        num: playernum,
      };
      socket.emit('lobby', outdata);
    });
    socket.on('playerWin', () => {
      socket.emit('winner');
      socket.broadcast.emit('loser');
    });
    socket.on('create', () => {
      const room = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
      const player = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
      socket.join(room);
      rooms[room] = [];
      rooms[room][0] = player;
      const length = io.sockets.adapter.rooms[room];
      const outdata = {
        room,
        player,
        length: length.length,
      };
      socket.emit('lobby', outdata);
    });
    socket.on('gameStart', (data) => {
      io.sockets.in(data.room).emit('gameStart');
    });
    socket.on('getPlayer', (data) => {
      characters[data.hash] = new Character(data);
      io.sockets.in(data.room).emit('addPlayer', characters[data.hash]);
    });
    socket.on('setup', (data) => {
      io.sockets.in(data.room).emit('showStart');
    });
    socket.on('handleAttack', (data) => {
      handleAttack(data);
    });
    // when this user sends the server a movement update
    socket.on('movementUpdate', (data) => {
      // update the user's info
      // NOTICE: THIS IS NOT VALIDED AND IS UNSAFE
      characters[data.hash] = data.playerData;
      // update the timestamp of the last change for this character
      characters[data.hash].lastUpdate = new Date().getTime();
      // update our physics simulation with the character's updates

      // notify everyone of the user's updated movement
      io.sockets.in(data.room).emit('updatedMovement', characters[data.hash]);
    });
    // when this user sends an attack request

    // when the user disconnects
    socket.on('disconnect', (data) => {
      // let everyone know this user left
      io.sockets.in(data.room).emit('left', data.hash);
      // remove this user from our object
      if (characters[data.hash]) {
        delete characters[data.hash];
      }

      // update the character list in our physics calculations

      // remove this user from the socket room
      socket.leave(data.room);
    });

    // when this user sends an attack request
    socket.on('attack', (data) => {
      const attack = data.attack;

      // should we handle the attack
      // I only did this because I did not code
      // for all player directions.
      let handleAttackEvent = true;

      // which direction is the user attacking in
      // will be an integer from our directions structure
      switch (attack.direction) {
        // if down, set the height/width of attack to face down
        // and offset attack downward from user
        case directions.DOWN: {
          attack.width = 34;
          attack.height = 32;
          attack.y += 91;
          attack.x += 5;
          if (attack.y >= 470) {
            handleAttackEvent = false;
          }
          break;
        }
        // if left, set the height/width of attack to face left
        // and offset attack left from user
        case directions.LEFT: {
          attack.width = 34;
          attack.height = 32;
          attack.y += 55;
          attack.x -= 36;
          if (attack.x <= 39) {
            handleAttackEvent = false;
          }
          break;
        }
        // if right, set the height/width of attack to face right
        // and offset attack right from user
        case directions.RIGHT: {
          attack.width = 34;
          attack.height = 32;
          attack.x += 46;
          attack.y += 55;
          if (attack.x >= 530) {
            handleAttackEvent = false;
          }
          break;
        }
        // if up, set the height/width of attack to face up
        // and offset attack upward from user
        case directions.UP: {
          attack.width = 34;
          attack.height = 32;
          attack.y -= 36;
          attack.x += 5;
          if (attack.y <= 35) {
            handleAttackEvent = false;
          }
          break;
        }
        // any other direction we will not handle
        default: {
          handleAttackEvent = false;
        }
      }

      // if handling the attack
      if (handleAttackEvent) {
        // send the graphical update to everyone
        // This will NOT perform the collision or character death
        // This just updates graphics so people see the attack
        io.sockets.in(data.room).emit('attackUpdate', attack);
        // add the attack to our physics calculations
      }
    });
  });
};

module.exports.setupSockets = setupSockets;
