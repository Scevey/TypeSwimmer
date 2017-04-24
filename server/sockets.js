// fast hashing library
const xxh = require('xxhashjs');
// Character custom class
const Character = require('./classes/Character.js');

const rooms = [];
// object of user characters
const characters = {};
const words = ['A rolling pin', 'A hammock', 'An anchor', 'A skunk', 'A desk chair', 'Van Goghs ear', 'A sandwich', 'A string quartet', 'An ottoman', 'A bottle opener', 'A fire escape', 'Luminescent plankton', 'A cabin', 'Mushrooms', 'Shrubbery', 'Bob Marley', 'A full house', 'Bubbles', 'Fangs', 'A pickle', 'An ironing board', 'A dolphin', 'A paper clip', 'A trumpet', 'A burrito', 'Tube socks', 'A crayon', 'A robot', 'A roller coaster', 'A mosquito', 'Fruit cocktail', 'A peg leg', 'A spigot', 'A balloon', 'Head in the clouds', 'The Milky Way', 'A knot', 'An old key', 'A submarine', 'A tulip', 'A gold medal', 'Synchronized swimmers', 'Pom-poms', 'A juice box', 'A jar full of pennies', 'A bag of hammers', 'Jelly beans', 'A sundial', 'A crystal ball', 'A synthesizer', 'A paper airplane', 'A water tower', 'A surfboard', 'New Jersey', 'Fiji', 'A layer cake', 'A panda', 'A mime', 'Charlie Chaplin', 'A penguin', 'A seagull', 'David Bowie', 'A sensitive cowboy', 'A leopard', 'An anatomy chart', 'A tree limb', 'A ship in a bottle', 'A mouth', 'Brass knuckles', 'An ear of corn', 'Costume jewelry', 'A mirage', 'Smoke', 'Mold', 'A rainbow', 'A dollar bill', 'A bone', 'A glass of milk', 'A teapot', 'Weeds', 'Dance steps', 'A turkey leg', 'A pencil', 'A picket fence', 'A Tiffany lamp', 'The Empire State Building', 'A stalagmite', 'A stalactite', 'A kiss', 'A ladybug', 'A helmet', 'A paw print', 'A Martian', 'A T-shirt', 'A cinder block', 'Swim fins', 'A ripe banana', 'A barbell', 'A tennis racket', 'Japan', 'A spiral staircase', 'A ponytail', 'A campfire', 'A squirrel', 'A thumb', 'A book', 'Girlish laughter', 'Tangled ribbons', 'Noodles', 'Best friends', 'Worst enemies', 'A lock', 'An accordion', 'A log', 'A melting candle', 'A phone booth', 'A geode', 'Dice', 'Ointment', 'A bucket', 'A digital watch', 'A bicycle', 'A cassette tape', 'A library card', 'A corn dog with mustard', 'Mittens', 'A pocket', 'A bunch of grapes', 'A vending machine', 'A typewriter', 'A flamingo', 'A kebab', 'Shelves', 'A necklace', 'A dirty rag', 'A scallion pancake', 'A time machine', 'A Tyrannosaurus Rex', 'A music box', 'A candelabra', 'A quarter', 'A bulldog', 'A fairy', 'A ball of yarn', 'A haircut', 'An electric guitar', 'Confetti', 'A pair of scissors', 'A bandage', 'A watermelon', 'Bacon', 'A newsboy cap', 'A seed pod', 'A board game', 'Daffodils', 'An onion', 'A slinky', 'A keychain', 'A sand castle', 'Leftovers', 'A ghost', 'A vampire', 'A football', 'A lightbulb', 'A horseshoe', 'A pug', 'The Sunday paper', 'A helicopter', 'A warthog', 'A basket', 'A skateboard', 'Sea spray', 'Seaweed', 'Hills and valleys', 'An umbrella', 'A Christmas tree', 'A hamburger', 'Sunglasses', 'A seal', 'Twenty thousand leagues under the sea', 'A shooting star', 'Handprints', 'A rotary phone', 'A top hat', 'A turtle', 'A baseball', 'Flags', 'An airplane', 'A microphone', 'A county fair', 'A saxophone', 'An ice cream cone', 'A marble', 'A weathervane', 'A lunchbox', 'A pound', 'A trolley car', 'Cat whiskers', 'A cleaver', 'Electricity', 'A Quonset hut', 'A treasure chest', 'Binoculars', 'A pumpkin', 'A chalkboard', 'Stiletto heels', 'A crowd', 'A pile of tires', 'A zombie', 'French fries', 'A butterfly', 'A watering can', 'A cactus', 'Coral', 'Playing cars', 'A celebration', 'A constellation', 'The northern lights', 'Bonbons', 'A wink', 'An inchworm', 'A knife', 'A kite', 'The Olympics', 'A box of tissues', 'A balloon animal', 'A spiral-bound notebook', 'A salt shaker', 'A bearded lady', 'A wrinkle', 'A box of kittens', 'A slug', 'A shadow', 'A winter hat', 'A puzzle', 'A diving board', 'A spoon', 'A cuttlefish', 'Rain', 'Eyelashes', 'A unicorn', 'A diaper', 'A bottle cap', 'Queen Victoria', 'A bottle cap', 'A bird feeder', 'A baguette', 'A ladder', 'A parade', 'Running shoes', 'Bowling shoes', 'An apple tree', 'A storm', 'A fan', 'A princess crown', 'Broccoli', 'A sarcophagus', 'A stick of butter', 'A sled', 'A flattop', 'A tattoo', 'A bonnet', 'A baseball glove', 'Elvis', 'A rubber duck', 'A milk carton', 'A diamond ring', 'Feelings', 'Mom', 'Dad', 'A drunken sailor', 'A police officer', 'Snowshoes', 'A necktie', 'A bowler hat', 'A unicycle', 'A frog', 'A paper coffee cup', 'A circuit board', 'A waterslide', 'Spilled milk', 'Molten lava', 'A spaceship', 'A sound wave', 'Clogs', 'An open/closed sign', 'A view from an airplane window', 'Knitting needles', 'The Little Prince', 'A box of cereal', 'Toes', 'Chips and dip', 'A newt', 'A moustache', 'Cheese', 'A face full of character', 'An ugly duckling', 'A laser', 'The Leaning Tower of Pisa', 'Scrambled eggs', 'A caribou', 'An eyeball', 'A chimney', 'A drum kit', 'A battleship', 'Whirling dervishes', 'Building blocks', 'A fashion model', 'Fancy pants', 'Hot springs', 'Steak and potatoes', 'A spool of thread', 'The wild blue yonder', 'A rabbit', 'A boom box', 'A birds nest', 'A power tool', 'A butterfly', 'Toast', 'A computer', 'An eye patch', 'A crab apple', 'A golf ball', 'Cutlery', 'A Q-tip', 'Chocolate truffles', 'An office park', 'A sock monkey', 'A clock tower', 'A snorkel', 'A scorpion', 'A sardine tin', 'A secret door', 'A compound fracture', 'A bookstore', 'Dumplings', 'A prom dress', 'A bowl of pudding', 'A directors chair', 'A beetle', 'A water jug', 'Your least favorite food', 'A turntable', 'A wheel of fortune', 'A fainting goat', 'A dumpster', 'A parasite', 'Lipstick', 'An oasis', 'A frying pan', 'Potato salad', 'Buttons', 'A lumberjack', 'An artichoke', 'A flower', 'A teacup', 'A map', 'A moose', 'A palm tree', 'A bear family', 'The Black forest', 'The periodic table', 'A keyboard', 'An anteater', 'A comet', 'A globe', 'Noahs ark', 'Popcorn', 'Mac and cheese', 'The moon', 'An apron', 'An antelope', 'Petroleum jelly', 'An uneventful street', 'Bricks', 'A wormhole', 'A black hole', 'Perfume', 'A giraffe', 'A chainsaw', 'Cotton candy', 'A sidewalk', 'A sailboat', 'A fjord', 'A brain', 'Saturn', 'A ticket', 'A barrel of monkeys', 'A real estate agent', 'Tears', 'First love', 'Middle school', 'A lock', 'A tongue', 'Puget Sound', 'Peanut butter', 'A cranky old man', 'Roller skates', 'A pillow', 'A gnome', 'A bully', 'A puppet', 'An opera singer', 'Alphabet soup', 'A lollipop', 'Contrails', 'A hanger', 'A motel', 'A string of DNA', 'A squid', 'A stick of gum', 'A ballpoint pen', 'A cornucopia', 'A gravestone', 'Teeth', 'Icicles', 'A snout', 'A cabbage patch', 'An inner tube', 'An elephant', 'An Egyptian pyramid', 'A narwhal', 'A swimming pool', 'Fresh air', 'An iceberg', 'A cello', 'A stoplight', 'Mistakes', 'A dream', 'A nightmare', 'A fire truck', 'A tea bag', 'Tiny ballerinas', 'An electrical outlet', 'A game-show host', 'A technological diagram', 'Footprints', 'A stain', 'Unmentionables', 'A porcupine', 'Alfred Hitchcock', 'Bugs', 'A thumbtack', 'A cupcake', 'A steak', 'A pirate flag', 'A bowling pin', 'A loading crane', 'A reflection', 'A jungle', 'A tube of toothpaste', 'A turnip', 'A trailer', 'An orb', 'A long-playing record', 'A centaur', 'Mount Rushmore', 'A labyrinth', 'Your pinky finger', 'A wooly mammoth', 'A boss', 'An ashtray', 'A walnut', 'A burlap sack', 'Mismatched earrings', 'Freckles', 'A swimsuit', 'A chessboard', 'A tetherball', 'Root beer', 'Dimples', 'A poodle', 'A box car', 'Donuts', 'A church', 'An architect', 'Nails', 'A cowbell', 'A bus stop', 'Leisure Wear', 'A huge gold frame', 'A whisper', 'A scream', 'A jellyfish', 'A skeleton', 'A toaster', 'A hummingbird', 'A condiment', 'A safety pin', 'A garden', 'Lucky charms', 'A partner in crime', 'The man in the moon', 'Platform shoes', 'A quilt', 'A doily', 'Vitamins', 'A belt buckle', 'A container ship', 'A scoundrel', 'Crutches', 'A dandy', 'A waterfall', 'A circus', 'A troll', 'A deserted island', 'An owl', 'A beaker', 'A jumper', 'A pearl', 'A broken toy', 'A seashell', 'A feathered hat', 'An amoeba', 'Tie-Dye', 'A bobsledder', 'A houseboat', 'A gourd', 'A saint', 'A playsuit', 'An orphan', 'A bow and arrow', 'A pinecone', 'Curtains', 'A chorus line', 'A wallet', 'A messenger bag', 'Shrimp cocktail', 'An eggbeater', 'A sheep', 'A blackberry bush', 'Spats', 'Dignity', 'A carrot top', 'A freezer', 'A Scottie dog', 'A pineapple upside-down cake', 'A telescope', 'A mystery box', 'A bird in the hand', 'A horse and carriage', 'Skee ball', 'A razor blade', 'A goldfish', 'A recycling bin', 'A palm reading', 'A road', 'Windows', 'An egg', 'A birdhouse', 'A sweatband', 'A strawberry', 'Sushi', 'A hippo', 'A prism', 'A sense of humor', 'Pie a la mode', 'A dragonfly', 'A tractor', 'A propaganda poster', 'Behind the scenes', '2 x 4s', 'A lava lamp', 'A harmonica', 'A ruler', 'Virginia Woolf', 'A windmill', 'Plateaus', 'A crash-test dummy', 'A starfish', 'Rain boots', 'A shoulder shrug', 'A pomegranate', 'A certificate', 'A Beatles song', 'A hobo', 'A portal', 'A wheelbarrow', 'A three-toed sloth', 'A box of fried chicken', 'Wise babies', 'The Abominable Snow Man', 'Cookies', 'Prescription medication', 'Capes', 'A tarantula', 'A can of beans', 'A sand dollar', 'A bee', 'A parasol', 'An ink pot', 'A sippy cup', 'Maple syrup', 'A video game', 'Tectonic plates', 'A beach', 'A wedding dress', 'A spelunker', 'A calculator', ' A baby monster', 'A transportation system', 'A swamp', 'An invitation', 'An oven', 'A train', 'The Bermuda Triangle', 'A heart', 'A movie star', 'A spiderweb', 'An igloo', 'Presidential pets', 'Paisley', 'A grandma', 'Lightning', 'Wind', 'Run-D.M.C.', 'A tuxedo', 'A mayonnaise jar', 'A lemon meringue pie', 'A sea urchin', 'A canyon', 'A cave', 'A concert', 'A viper', 'A phonograph', 'A bow', 'A convertible', 'Ski slopes', 'A mummy', 'Broken glass', 'A bed', 'A bar of music', 'Polka dots', 'Woodgrain', 'Plaid', 'Zigzag', 'A tacky rug', 'A plastic bag', 'A muffin tin', 'A sweater', 'A tuba'];

// our socketio instance
let io;

/* const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7,
};*/

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
    socket.on('words', (data) => {
      const word = words[data];
      socket.emit('showword', word);
    });
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
  });
};

module.exports.setupSockets = setupSockets;
