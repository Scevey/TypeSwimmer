		const readyUp = (data) =>{
			document.getElementById('roomCode').textContent=data.room;
			roomCode = data.room;
			playernumber = data.length-1;
			numPlayers = data.length;
			hash = data.player;
			for(var i = 0; i < numPlayers; i++){
				var temp = i.toString();
				var playerID = 'player'+temp+'Status';
				document.getElementById(playerID).textContent = "In Lobby";
			}
			document.getElementById('lobby').style.display = 'block';
			document.getElementById('index').style.display = 'none';
			if(numPlayers == 2){
				//call function to send calls to determine player roles
				socket.emit('setup',{room: roomCode});
			}
		}
		const playerJoin = (data)=>{
			var temp = (numPlayers).toString();
			var playerID = 'player'+temp+'Status';
			document.getElementById(playerID).textContent = "In Lobby";
			numPlayers++;

		}
		const join = ()=>{
			var roomname = document.getElementById('lobbyName').value;
			if(roomname === ""){
			return;
			}
			var data = {
				room: roomname
			};
			socket.emit('join', data);
		}
		const create = ()=>{
			socket.emit('create');
		}
		const showStart = ()=>{
			document.getElementById('startButton').style.display = 'block';
			document.getElementById('status').textContent = "Room Full!";
		}
		const gameStart = (e)=>{
    var data = {
      room: roomCode,
    };


			socket.emit('gameStart', data);
		}
    const getGameReady = (data)=>{
        players[data.hash] = data;
        num++; 
        console.log(num);
        if(num == 2){
          document.getElementById('drawer').style.display = 'block';
          document.getElementById('lobby').style.display = 'none';
          requestAnimationFrame(redraw);
        }//set the character by their hash
				//document.getElementById('drawer').style.display = 'block';
			//	document.getElementById('lobby').style.display = 'none';
      //  requestAnimationFrame(redraw);
		}
    const getPlayer = ()=>{
        var out = {
          room: roomCode,
          hash: hash
        };
        socket.emit('getPlayer',out)
		}