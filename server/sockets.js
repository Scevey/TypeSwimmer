// fast hashing library
const xxh = require('xxhashjs');
// Character custom class
const Character = require('./classes/Character.js');
// our physics calculation file
const physics = require('./physics.js');

const rooms = [];
// object of user characters
const characters = {};

// our socketio instance
let io;

// function to setup our socket server
const setupSockets = (ioServer) => {
  // set our io server instance
  io = ioServer;

  // on socket connections
  io.on('connection', (sock) => {
    const socket = sock;

  /*  socket.on('', (data) => {

    // create a new character and store it by its unique id
    characters[hash] = new Character(hash);

    // add the id to the user's socket object for quick reference
    socket.hash = hash;

    // emit a joined event to the user and send them their character
    socket.emit('joined', characters[hash]);
  }*/
    socket.on('join', (data) => {
      const room = data.room;

      if (!rooms[room]) {
        socket.emit('error', 'Sorry that room doesnt exist');
        return;
      }
      const length = io.sockets.adapter.rooms[room];
      if (length.length >= 4) {
        socket.emit('error', 'Sorry room is full');
        return;
      }
      const player = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
      io.sockets.in(room).emit('joined');
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
    socket.on('create', () => {
      const room = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
      const player = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
      socket.join(room);
      rooms[room] = {};
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
      characters[data.hash] = new Character(data.hash);
      io.sockets.in(data.room).emit('addPlayer', characters[data.hash]);
    });
    socket.on('setup', (data) => {
      io.sockets.in(data.room).emit('showStart');
    });
    // when this user sends the server a movement update
    socket.on('movementUpdate', (data) => {
      // update the user's info
      // NOTICE: THIS IS NOT VALIDED AND IS UNSAFE
      characters[data.hash] = data.playerData;
      // update the timestamp of the last change for this character
      characters[data.hash].lastUpdate = new Date().getTime();
      // update our physics simulation with the character's updates
      physics.setCharacter(characters[data.hash]);

      // notify everyone of the user's updated movement
      io.sockets.in(data.room).emit('updatedMovement', characters[data.hash]);
    });
    // when this user sends an attack request

    // when the user disconnects
    socket.on('disconnect', (data) => {
      // let everyone know this user left
      io.sockets.in(data.room).emit('left', characters[data.hash]);
      // remove this user from our object
      delete characters[data.hash];
      // update the character list in our physics calculations
      physics.setCharacterList(characters);

      // remove this user from the socket room
      socket.leave(data.room);
    });
  });
};

module.exports.setupSockets = setupSockets;
