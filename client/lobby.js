	//show lobby stuff
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
			if(numPlayers == 4){
				//call function to send calls to determine player roles
				socket.emit('setup',{room: roomCode});
			}
		}
    //update lobby
		const playerJoin = (data)=>{
			var temp = (numPlayers).toString();
			var playerID = 'player'+temp+'Status';
			document.getElementById(playerID).textContent = "In Lobby";
			numPlayers++;

		}
    //join a lobby
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
    //create a lobby, become host
		const create = ()=>{
			socket.emit('create');
      host = true;
		}
    //show start button
		const showStart = ()=>{
			document.getElementById('startButton').style.display = 'block';
			document.getElementById('status').textContent = "Room Full!";
		}
    //get game started
		const gameStart = (e)=>{
    var data = {
      room: roomCode,
    };


			socket.emit('gameStart', data);
		}
    // set spawns and start animating
    const getGameReady = (data)=>{
        let tempP = data;
        num++;        
        if(num == 1){
        tempP.destX = 47;
        tempP.prevX = 47;
        tempP.x = 47;
        tempP.destY = 52;
        tempP.prevY = 52;
        tempP.y = 52;
        players[data.hash] = tempP;
        }
        if(num == 2){
          tempP.x = 522;
          tempP.prevX = 522;
          tempP.destX = 522;
          tempP.prevY = 52;
          tempP.destY = 52;
          tempP.y = 52;
          players[data.hash] = tempP;
          if(numPlayers == num){
          document.getElementById('drawer').style.display = 'block';
          document.getElementById('lobby').style.display = 'none';
          requestAnimationFrame(redraw);
          }

        }
        if(num == 3){
        tempP.destX = 47;
        tempP.prevX = 47;
        tempP.x = 47;
        tempP.destY = 469;
        tempP.prevY = 469;
        tempP.y = 469;
        players[data.hash] = tempP;
          if(numPlayers == num){
          document.getElementById('drawer').style.display = 'block';
          document.getElementById('lobby').style.display = 'none';
          requestAnimationFrame(redraw);
          }
        }
         if(num == 4){
        tempP.x = 522;
        tempP.prevX = 522;
        tempP.destX = 522;
        tempP.destY = 469;
        tempP.prevY = 469;
        tempP.y = 469;
        players[data.hash] = tempP;
          if(numPlayers == num){
          document.getElementById('drawer').style.display = 'block';
          document.getElementById('lobby').style.display = 'none';
          ctx.fillStyle = 'lightsalmon'; 
          ctx.strokeStyle = 'white';
          ctx.drawImage(mapImage,0,0,800,800);
       ctx.ellipse(400, 400, 245, 180, 0, 0, Math.PI*2);  
       ctx.ellipse(400, 400, 295, 220, 0, 0, Math.PI*2); 
       ctx.ellipse(400, 400, 335, 260, 0, 0, Math.PI*2);
       ctx.ellipse(400, 400, 375, 300, 0, 0, Math.PI*2);
       ctx.lineWidth = 5;

        ctx.stroke();
        //ctx.fill();
          requestAnimationFrame(redraw);
          }
        }
        //set the character by their hash
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