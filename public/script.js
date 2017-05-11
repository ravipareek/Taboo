 // Initialize Firebase
 var config = {
 	apiKey: "AIzaSyCNKmzmijAQF6Vj_bFQQpHJHwmh9g4qr6E",
 	authDomain: "taboo-a33c0.firebaseapp.com",
 	databaseURL: "https://taboo-a33c0.firebaseio.com",
 	storageBucket: "taboo-a33c0.appspot.com",
 	messagingSenderId: "372261741358"
 };
 firebase.initializeApp(config);
 var database = firebase.database();
 var gameid;
 var name;
 var host = false;
 var gameStart = false;
 var myTeam;

 var allCards = [];

var score = [0,0];

//false is Team A
//true is Team B
 var turn = false;

 function getCards(){
 	var ref = database.ref('words');
 	ref.once('value').then(function(snapshot){
 		snapshot.forEach(function(childSnapshot){
 			allCards.push(childSnapshot.val())
 		});
 	});
 }

 function fillCard(){
	var cardNum = 1;
	database.ref('games/'+gameid).once('value').then(function(snapshot){
		cardNum = snapshot.val().card;
		var card = allCards[cardNum];
	 	document.getElementById('wordText').innerText = card.word;
	 	document.getElementById('noSay1Text').innerText = card.noSay1;
	 	document.getElementById('noSay2Text').innerText = card.noSay2;
	 	document.getElementById('noSay3Text').innerText = card.noSay3;
	 	document.getElementById('noSay4Text').innerText = card.noSay4;
	 	document.getElementById('noSay5Text').innerText = card.noSay5;

	 	allCards.splice(cardNum,1);
	 	
	 	if (allCards.length==1){
	 		getCards();
	 		console.log('getting new cards');
	 	}
	});	
 }

function getNewCard(){
	var cardNum = Math.floor(Math.random() * allCards.length);
	var ref = database.ref('games/' + gameid);
	ref.update({
		card: cardNum
	});
}

 function correct(){
 	if (turn == false)
 		score[0]++;
 	else
 		score[1]++;
 	getNewCard();
 }

 function wrong(){
 	getNewCard();
 }

 function startRound(){
	if (myTeam != turn){
		console.log('Not my turn');
		document.getElementById('correct').style.display = 'none';
		document.getElementById('wrong').style.display = 'none';
	}
	else{
		console.log('My turn');
		document.getElementById('correct').style.display = 'inline-block';
		document.getElementById('wrong').style.display = 'inline-block';
	}
 	console.log("Starting new round");
 	var countDownDate = new Date().getTime() + 61000;
 	getNewCard();
 	var x = setInterval(function(){
		// Get todays date and time
		var now = new Date().getTime();	
		// Find the distance between now an the count down date
		var distance = countDownDate - now;
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		document.getElementById("timer").innerHTML = seconds + "s ";

		if (seconds <= 0){
			clearInterval(x);
		}
	},1000);

	var y = setTimeout(function(){
		nextRound();
 		clearTimeout(y);
 	},60000);
 }

function nextRound(){
	if (turn == false){
		turn = true;
		var ref = database.ref('games/' + gameid);
		ref.update({
		Team_A_Score: score[0],
		turn: turn
		});
	}
	else if (turn == true){
		turn = false;
		var ref = database.ref('games/' + gameid);
		ref.update({
		Team_B_Score: score[1],
		turn: turn
		});
	}
	openNav();
}

 function openNav() {
 	document.getElementById("myNav").style.height = "100%";
 	if(!gameStart){
 	 	document.getElementById('Team_Setup').style.display = "none";
 	 	initApp();
 	 	getCards();
 	}
 	else{
 		//show team scores
 		GameStartCountdown();
 	}
 }

 function closeNav() {
 	document.getElementById("myNav").style.height = "0%";
 	startRound();
 }

 function GameStartCountdown(){
 	if (host){
 		document.getElementById('startButton').style.display = 'none';
 		document.getElementById('gameID').style.display = 'none';
 	}
 	var countDownDate = new Date().getTime() + 3510;

 	var x = setInterval(function(){
		// Get todays date and time
		var now = new Date().getTime();	
		// Find the distance between now an the count down date
		var distance = countDownDate - now;
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		// Output the result in an element with id="demo"
		document.getElementById("startCountdown").innerHTML = seconds + "s ";
	},100);

 	var y = setTimeout(function(){
 		clearInterval(x);
 		clearTimeout(y);
 		closeNav();
 	},3000);
 }

 function signin() {
 	user = firebase.auth().currentUser;
 	name = document.getElementById("name").value;
 	var team = document.forms['signinData'].elements['Team'];
 	if (team[0].checked)
 		team = 0;
 	else if (team[1].checked)
 		team = 1;

 	user.updateProfile({
 		displayName: name
 	}).then(function() {
        	//success
        	console.log(user.displayName + " is signed in");
        }, function(error){
        	//fail
        	console.log("Update Name error: " + error);
        });

 	if (team == 0){
 		database.ref('games/' + gameid+'/Team_A_Members').child(name).set(user.uid);
 	}
 	else if (team == 1){
 		database.ref('games/' + gameid+'/Team_B_Members').child(name).set(user.uid);
 	}
 	myTeam = team;
 	document.getElementById('signin').style.display = "none";
 	Setup_Teams();
 }
 function Setup_Teams(){
 	document.getElementById('Team_Setup').style.display = "inline-block";
 	var refA = database.ref('games/'+gameid+'/Team_A_Members');
 	var refB = database.ref('games/'+gameid+'/Team_B_Members');
 	var table = document.getElementById("teamTable");
 	var rows = table.rows;
 	refA.on("child_added", function(data, prevChildKey){
 		var Acount = 0;
 		var Bcount = 0;
 		for(var i=1;i<rows.length;i++){
 			if (rows[i].cells[0].innerHTML!=""){
 				Acount++;
 			}
 			if (rows[i].cells[1].innerHTML!=""){
 				Bcount++;
 			}
 		}
 		//less members in Team A
 		//dont add new row
 		//find first blank space and write user name and break the loop
 		if (Acount < Bcount){
 			for(var i = 0; i<rows.length;i++){
 				if (rows[i].cells[0].innerHTML == ""){
 					rows[i].cells[0].innerHTML = data.key;
 					break;
 				}
 			}
 		}
 		//same or more members in A
 		//add new row
 		else{
 			row = table.insertRow(Acount+1);
 			row.insertCell(0).innerHTML = data.key;
 			row.insertCell(1).innerHTML = "";
 		}
 	});
 	refB.on("child_added", function(data, prevChildKey){
 		var Acount = 0;
 		var Bcount = 0;
 		for(var i=1;i<rows.length;i++){
 			if (rows[i].cells[0].innerHTML!=""){
 				Acount++;
 			}
 			if (rows[i].cells[1].innerHTML!=""){
 				Bcount++;
 			}
 		}
 		//less members in Team B
 		//dont add new row
 		//find first blank space and write user name and break the loop
 		if (Bcount < Acount){
 			for(var i = 0; i<rows.length;i++){
 				if (rows[i].cells[1].innerHTML == ""){
 					rows[i].cells[1].innerHTML = data.key;
 					break;
 				}
 			}
 		}
 		//same or more members in B
 		//add new row
 		else{
 			row = table.insertRow(Bcount+1);
 			row.insertCell(0).innerHTML = "";
 			row.insertCell(1).innerHTML = data.key;
 		}
 	});
 	if (host){
 		var startButton = document.createElement('button');
 		startButton.innerHTML = "Start Game";
 		startButton.id = 'startButton';
 		startButton.onclick = function(){
 			database.ref('games/'+gameid).update({
 				ready: true
 			});
 		};
 		document.getElementsByClassName('overlay-content')[0].appendChild(startButton);
 	}
 	database.ref('games/').on('child_changed',function(data){
 		if (data.val().ready == true && !gameStart && data.key == gameid){
 			document.getElementById('Team_Setup').style.display = "none";
 			document.getElementById('countdown').style.display = 'block';
 			GameStartCountdown();
 			gameStart = true;
 		}
 	});

 	database.ref('games/'+gameid).on('child_changed',function(data){
		if(data.key == 'card')
			fillCard();
 	});
 }
 function initApp() {
	// Listening for auth state changes.
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.log("Signed In - Init");
	} else {
		firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/operation-not-allowed') {
        	alert('You must enable Anonymous auth in the Firebase Console.');
        } else {
			console.log("New Sign in Error: "+errorCode);
		}
		});
	}
    });
}
function joinGame(){
  	var game = prompt("Enter the game id:", "");
  	database.ref('games/'+game).once("value").then(function(snapshot){
  		if(snapshot.exists()){
  			gameid = game;
  			document.getElementById("Join-Create").style.display = 'none';
  			document.getElementById("signin").style.display = 'block';
  		}
  		else{
  			window.alert("The game id you entered does not exist")
  		}
  	});

  }
  function createGame(){
  	gameid = Math.random().toString(36).substring(3,8);
  	host = true;
  	database.ref('games').update({
  		[gameid]:{
  			Team_A_Members: {},
  			Team_B_Members: {},
  			ready: false,
  			turn: false
  		}
  	});
  	document.getElementById("Join-Create").style.display = 'none';
  	document.getElementById("signin").style.display = 'block';

  	var showGameID = document.createElement("textarea");
  	showGameID.style.textAlign = 'center';
  	showGameID.style.paddingTop = '10px';
  	showGameID.innerText = "Game ID: " + gameid;
  	showGameID.style.color = 'white';
  	showGameID.id = "gameID";
  	showGameID.style.background = 'none';
  	showGameID.style.border = 'none';
  	showGameID.style.resize = 'none';
  	showGameID.readOnly = true;

  	document.getElementsByClassName('overlay-content')[0].appendChild(showGameID);
  }
  function toTitleCase(str)
  {
  	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  function validSignin(){
  	var x = document.forms['signinData']['Name'].value;
  	var y = document.forms['signinData']['Team'].value
  	if (x == "" || y == ""){
  		window.alert("Please enter your name and select a team");
  	}
  	else{
  		signin();
  	}
  	return false;
  }