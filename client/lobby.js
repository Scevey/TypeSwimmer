	//show lobby stuff
	const readyUp = (data) =>{
      clearError();
			document.getElementById('roomCode').textContent=data.room;
			roomCode = data.room;
			playernumber = data.length-1;
			numPlayers = data.length;
			hash = data.player;
			for(var i = 0; i < numPlayers; i++){
				var temp = i.toString();
			var playerID = 'player'+temp+'Status';
			var playerName = 'player'+temp+'Name';
			document.getElementById(playerID).textContent = "In Lobby";
			document.getElementById(playerName).textContent = data.roomnames[i];
			}
      $("#index").hide();
      $("#lobby").show();

			if(numPlayers == 1){
				//call function to send calls to determine player roles
				socket.emit('setup',{room: roomCode});
			}
		}
    //update lobby
		const playerJoin = (data)=>{
			var temp = (numPlayers).toString();
			var playerID = 'player'+temp+'Status';
			var playerName = 'player'+temp+'Name';
			document.getElementById(playerID).textContent = "In Lobby";
			document.getElementById(playerName).textContent = data;
			numPlayers++;

		}
    //join a lobby
		const join = ()=>{
			var roomname = document.getElementById('lobbyName').value;
			name = document.getElementById('userName').value;
      if (name.length > 12){
        var error = 'Please use a shorter name';        
        handleError(error);
        return;
      }
			if(roomname === "" || name === ""){
      var error = 'Make sure to enter a Room Code and User Name';        
			handleError(error);
      return;
			}
			var data = {
				room: roomname,
        user: name
			};
			socket.emit('join', data);
		}
    //create a lobby, become host
		const create = ()=>{ 
    name = document.getElementById('userName').value;
      if(name === ""){
        var error = 'Please enter a name';
        handleError(error);
        return;
      }
			socket.emit('create', name);
      host = true;
		}
    //show start button
		const showStart = ()=>{
      $("#startButton").show(500);
			document.getElementById('status').textContent = "Room Full!";
      getWord();
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
        tempP.destX = 460;
        tempP.prevX = 460;
        tempP.x = 460;
        tempP.destY = 490;
        tempP.prevY = 490;
        tempP.y = 490;
        players[data.hash] = tempP;
          $("#lobby").hide();
          $("#drawer").show();
          ctx.drawImage(mapImage,0,0,937,661);
          requestAnimationFrame(redraw);
        }
        if(num == 2){
          tempP.destX = 460;
        tempP.prevX = 460;
        tempP.x = 460;
        tempP.destY = 490;
        tempP.prevY = 490;
        tempP.y = 490;
          players[data.hash] = tempP;
          if(numPlayers == num){
          $("#lobby").hide();
          $("#drawer").show();
          ctx.drawImage(mapImage,0,0,937,661);
          requestAnimationFrame(redraw);
          }

        }
        if(num == 3){
        tempP.destX = 460;
        tempP.prevX = 460;
        tempP.x = 460;
        tempP.destY = 490;
        tempP.prevY = 490;
        tempP.y = 490;
        players[data.hash] = tempP;
          if(numPlayers == num){
          $("#lobby").hide();
          $("#drawer").show();
          ctx.drawImage(mapImage,0,0,937,661);
          requestAnimationFrame(redraw); 
          }
        }
         if(num == 4){
        tempP.destX = 460;
        tempP.prevX = 460;
        tempP.x = 460;
        tempP.destY = 490;
        tempP.prevY = 490;
        tempP.y = 490;
        players[data.hash] = tempP;
          if(numPlayers == num){
          $("#lobby").hide();
          $("#drawer").show();
          ctx.drawImage(mapImage,0,0,937,661);
          requestAnimationFrame(redraw);
          }
        }
        //set the character by their hash
				//document.getElementById('drawer').style.display = 'block';
			//	document.getElementById('lobby').style.display = 'none';
      //  requestAnimationFrame(redraw);
		}          
    const getPlayer = ()=>{
        var iconX = x; //0,1,2,3
        var iconY = y; //0,1
        var out = {
          room: roomCode,
          hash: hash,
          name: name,
          x: iconX,
          y: iconY
        };
        
        socket.emit('getPlayer',out)
		}
    const getWord = ()=>{
      var wordspot = Math.floor(Math.random() * 588);
      socket.emit('words', wordspot);
    }
    const showWord = (data)=>{
			word = data;
      wordDraw = (canvas.width / 2) - (word.length * 10);
      //get html element by id set text content = word;
      //or write to canvas on overlay
		}
    const handleError = (data)=>{
      //set text for error msg
      var errormsg = data;
      document.getElementById('errormessage').innerHTML = errormsg;

      //show msg
       document.getElementById('error').style.display = 'block';
      //time out, hide msg
      setTimeout(function(){
          clearError();
        }, 5000);  //5secs
      
    }
    const clearError = () =>{
     document.getElementById('error').style.display = 'none';
    }
    const choosePlayer = (name) =>{
      $("#ad4 img").removeClass("selected");
      let id = "#"+name;
      selected = name;
      $(id).addClass('selected');    
      switch(name) {
    case 'blue':
        x = 0; 
        y = 0;
        break;
    case 'yellow':
        //document.getElementById(name) add class selected
        x = 1; 
        y = 0;
        break;
    case 'green':
        //document.getElementById(name) add class selected
        x = 2; 
        y = 0;
        break;
    case 'red':
        //document.getElementById(name) add class selected
        x = 0; 
        y = 2;
        break;
    case 'brown':
        //document.getElementById(name) add class selected
        x = 0; 
        y = 1;
        break;
     case 'snek':
        //document.getElementById(name) add class selected
        x = 0; 
        y = 2;
        break;
    case 'frog':
        //document.getElementById(name) add class selected
        x = 3; 
        y = 0;
        break;
    default:
        //document.getElementById(name) add class selected
        x = 0; 
        y = 0;
}
    }