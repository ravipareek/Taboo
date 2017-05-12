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
 //get all cards from the database
 function getCards(){
 	var ref = database.ref('words');
 	ref.once('value').then(function(snapshot){
 		snapshot.forEach(function(childSnapshot){
 			allCards.push(childSnapshot.val())
 		});
 	});
 	// console.log(allCards)
 }
 //display the card
 function fillCard(){
	var cardNum = 1;
	//when the card attribute changes for this game
	database.ref('games/'+gameid+'/card').on('value',function(snapshot){
		//get the card number
		cardNum = snapshot.val();
		//get the card information from the words table
		database.ref('words/word' + cardNum).once("value").then(function(snap){
			var card = snap.val();
			// fill the display with the information
		 	document.getElementById('wordText').innerText = toTitleCase(card.word);
		 	document.getElementById('noSay1Text').innerText = toTitleCase(card.noSay1);
		 	document.getElementById('noSay2Text').innerText = toTitleCase(card.noSay2);
		 	document.getElementById('noSay3Text').innerText = toTitleCase(card.noSay3);
		 	document.getElementById('noSay4Text').innerText = toTitleCase(card.noSay4);
		 	document.getElementById('noSay5Text').innerText = toTitleCase(card.noSay5);
		});
	});	
 }
//get a new card
function getNewCard(){
	//generate a random number between 0 and the number of words in the database
	var cardNum = Math.floor(Math.random() * allCards.length) + 1;
	//remove that element from the list
	allCards.splice(cardNum,1);
	//update this in the database for this game
	var ref = database.ref('games/' + gameid);
	ref.update({
		card: cardNum
	});
}
 // players guessed the word
 function correct(){
 	// increment the score for the appropriate team
 	if (turn == false)
 		score[0]++;
 	else
 		score[1]++;
 	// get a new word
 	getNewCard();
 }
 //players did not guess the word
 //skip word
 function wrong(){
 	// get a new word
 	getNewCard();
 }

 //begin the round for a team
 function startRound(){
 	console.log("Starting new round");
 	//hide the buttons if it is not your turn, show them else 
	if (myTeam != turn){
		// console.log('Not my turn');
		document.getElementById('correct').style.display = 'none';
		document.getElementById('wrong').style.display = 'none';
	}
	else{
		// console.log('My turn');
		document.getElementById('correct').style.display = 'inline-block';
		document.getElementById('wrong').style.display = 'inline-block';
	}
	//set a timer for 1 minute per round
 	//change to 61000
 	var countDownDate = new Date().getTime() + 21000;
 	// this will run every second updating the timer displayed
 	var x = setInterval(function(){
		// Get todays date and time
		var now = new Date().getTime();	
		// Find the distance between now an the count down date
		var distance = countDownDate - now;
		//calculate that in seconds
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		//display the time remaining for the user
		document.getElementById("timer").innerHTML = seconds + "s ";
		//if the end is reached, stop the repatition of the function
		if (seconds <= 0){
			clearInterval(x);
		}
	},1000);
 	//this will run after 1 minute has passed
	var y = setTimeout(function(){
		//start the next round (switch turns)
		nextRound();
		//stop the interval and timeout
		clearInterval(x);
 		clearTimeout(y);
 	//change to 60000
 	},20000);
 }

// It is the other team's turn
function nextRound(){
	//if it was just your turn and you are team A
	if (turn == false && myTeam == turn){
		//update your score and let the database know it is the other team's turn
		var ref = database.ref('games/' + gameid);
		// console.log("Team A Score: " + score[0]);
		ref.update({
		Team_A_Score: score[0],
		turn: true
		});
	}
	//if it was just your turn and you are team B
	else if (turn == true && myTeam == turn){
		//update your score and let the database know it is the other team's turn
		var ref = database.ref('games/' + gameid);
		// console.log("Team B Score: " + score[1]);
		ref.update({
		Team_B_Score: score[1],
		turn: false
		});
	}
	//change turns locally
	turn = !turn;
	//show the dropdown to update people the scores
	openNav();
}
 // show the dropdown view
 function openNav() {
 	//show the dropdown
 	document.getElementById("myNav").style.height = "100%";
 	//if it is the start of the game
 	if(!gameStart){
 		//get all the cards
 	 	getCards();
 	 	//hide the team tables
 	 	document.getElementById('Team_Setup').style.display = "none";
 	 	//initialize the user's sign in and authentication
 	 	initApp();
 	}
 	else{
 		//show team scores

 		//show the countdown to the next turn
 		GameStartCountdown();
 	}
 }
 // hide the dropdown
 function closeNav() {
 	//fill the information in the card
 	fillCard();
 	//close the dropdown
 	document.getElementById("myNav").style.height = "0%";
 	//start the round
 	startRound();
 }
 
 //show a countdown of 3 seconds before the round begins
 function GameStartCountdown(){
 	//if the player is the host, hide the start button and the game id
 	if (host){
 		document.getElementById('startButton').style.display = 'none';
 		document.getElementById('gameID').style.display = 'none';
 	}
 	//generate the first card of the round
 	getNewCard();

 	//set a countdown for 3 seconds
 	var countDownDate = new Date().getTime() + 3100;
 	//run this every 100 ms updating the timer
 	var x = setInterval(function(){
		// Get todays date and time
		var now = new Date().getTime();	
		// Find the distance between now an the count down date
		var distance = countDownDate - now;
		//calculate that in seconds
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		// display the time remaining
		document.getElementById("startCountdown").innerHTML = seconds + "s ";
	},100);

 	//run this after 3 seconds have passed
 	var y = setTimeout(function(){
 		// hide the dropdown
 		closeNav();
 		//clear the interval and timeout
 		clearInterval(x);
 		clearTimeout(y);
 	},3000);
 }

 // user signs in
 function signin() {
 	//get the user object from firebase
 	user = firebase.auth().currentUser;
 	//get the text in the textbox
 	name = document.getElementById("name").value;
 	//get the option selected
 	var team = document.forms['signinData'].elements['Team'];
 	//determine the option selected
 	if (team[0].checked)
 		team = 0;
 	else if (team[1].checked)
 		team = 1;
 	//update the firebase profile with the user's name
 	user.updateProfile({
 		displayName: name
 	}).then(function() {
        	//success
        	console.log(user.displayName + " is signed in");
        }, function(error){
        	//fail
        	console.log("Update Name error: " + error);
        });
 	//add them to the game database as a member of a team
 	if (team == 0){
 		database.ref('games/' + gameid+'/Team_A_Members').child(name).set(user.uid);
 	}
 	else if (team == 1){
 		database.ref('games/' + gameid+'/Team_B_Members').child(name).set(user.uid);
 	}
 	//save the user's team locally
 	myTeam = team;
 	//hide the sign in
 	document.getElementById('signin').style.display = "none";
 	//go to next window to show team information
 	Setup_Teams();
 }

 // team information posted before game begins
 function Setup_Teams(){
 	//show the table with team members
 	document.getElementById('Team_Setup').style.display = "inline-block";
 	//reference both teams' members
 	var refA = database.ref('games/'+gameid+'/Team_A_Members');
 	var refB = database.ref('games/'+gameid+'/Team_B_Members');
 	//get the table and the rows
 	var table = document.getElementById("teamTable");
 	var rows = table.rows;
 	//when a child is added
 	refA.on("child_added", function(data, prevChildKey){
 		//number of members listed in the table so far in each team
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
 		//number of members listed in the table so far in each team
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
 	//if player is the host
 	if (host){
 		//create a start button icon
 		var startButton = document.createElement('button');
 		startButton.innerHTML = "Start Game";
 		startButton.id = 'startButton';
 		// when the button is clicked, update that in the database
 		startButton.onclick = function(){
 			database.ref('games/'+gameid).update({
 				ready: true
 			});
 		};
 		//add this button to the dropdown
 		document.getElementsByClassName('overlay-content')[0].appendChild(startButton);
 	}
 	//when the value of ready changes for this game
 	database.ref('games/'+gameid+"/ready").on('value',function(data){
 		// if ready is now true, game has not started yet and the game id matches
 		if (data.val() == true && !gameStart && data.ref.parent.key == gameid){
 			//hide the table and show the countdown timer
 			document.getElementById('Team_Setup').style.display = "none";
 			document.getElementById('countdown').style.display = 'block';
			//game has started
 			gameStart = true;
 			// start the countdown 
			GameStartCountdown();
 		}
 	});
 }

//initialize the user in firebase
 function initApp() {
	// Listening for auth state changes.
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
//join a game that is already been created
function joinGame(){
	// show a prompt for the user to type the game id
  	var game = prompt("Enter the game id:", "");
  	//check if the game id is valid and can be joined
  	database.ref('games/'+game).once("value").then(function(snapshot){
  		if(snapshot.exists()){
  			//if the game has not yet begun
  			if (snapshot.val().ready == false){
  			  	gameid = game;
  				document.getElementById("Join-Create").style.display = 'none';
	  			document.getElementById("signin").style.display = 'block';
  			}
  			//game has already started
  			else{
  				window.alert("This game has already begun");
  			}
  		}
  		else{
  			window.alert("The game id you entered does not exist")
  		}
  	});

  }
 // create a game for users to join
  function createGame(){
  	//generate a random 5 alphanumeric uid
	gameid = Math.random().toString(36).substring(3,8);
  	//user is the host
  	host = true;
  	//update the database with the new game
  	database.ref('games').update({
  		[gameid]:{
  			Team_A_Members: {},
  			Team_B_Members: {},
  			ready: false,
  			turn: false
  		}
  	});
  	//hide the join/create buttons and show the user sign in
  	document.getElementById("Join-Create").style.display = 'none';
  	document.getElementById("signin").style.display = 'block';

  	//create a textarea to show the game id
  	var showGameID = document.createElement("textarea");
  	//set all the display properties
  	showGameID.style.textAlign = 'center';
  	showGameID.style.paddingTop = '10px';
  	showGameID.innerText = "Game ID: " + gameid;
  	showGameID.style.color = 'white';
  	showGameID.id = "gameID";
  	showGameID.style.background = 'none';
  	showGameID.style.border = 'none';
  	showGameID.style.resize = 'none';
  	showGameID.readOnly = true;
  	//add it to the dropdown overlay
  	document.getElementsByClassName('overlay-content')[0].appendChild(showGameID);
  }
  //convert the text to title case
  function toTitleCase(str)
  {
  	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  //validate the sign in
  function validSignin(){
  	//get the name and team selected
  	var x = document.forms['signinData']['Name'].value;
  	var y = document.forms['signinData']['Team'].value
  	//if either are left blank
  	if (x == "" || y == ""){
  		window.alert("Please enter your name and select a team");
  	}
  	//both are filled in
  	else{
  		signin();
  	}
  	return false;
  }