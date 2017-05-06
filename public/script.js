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

 var allCards = [];

 function getCards(){
 	var ref = database.ref('words');
 	ref.once('value').then(function(snapshot){
 		snapshot.forEach(function(childSnapshot){
 			allCards.push(childSnapshot.val())
 		});
 	});
 }

 function fillCard(){
  	 	var cardNum = Math.floor(Math.random() * allCards.length);
 	 	// console.log(cardNum);
 	 	var card = allCards[cardNum];
 	 	document.getElementById('wordText').innerText = card.word;
 	 	document.getElementById('noSay1Text').innerText = card.noSay1;
 	 	document.getElementById('noSay2Text').innerText = card.noSay2;
 	 	document.getElementById('noSay3Text').innerText = card.noSay3;
 	 	document.getElementById('noSay4Text').innerText = card.noSay4;
 	 	document.getElementById('noSay5Text').innerText = card.noSay5;

 	 	allCards.splice(cardNum,1);
 	 	
 	 	if (allCards.length==0){
 	 		getCards();
 	 		console.log('getting new cards');
 			// console.log(allCards);
 		}
 }

 function startRound(){
 	var countDownDate = new Date().getTime() + 61000;
 	fillCard()
 	var x = setInterval(function(){
		// Get todays date and time
		var now = new Date().getTime();	
		// Find the distance between now an the count down date
		var distance = countDownDate - now;
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		document.getElementById("timer").innerHTML = 	 seconds + "s ";

		if (seconds <= 0){
			clearInterval(x);
		}
	},1000);
 }

 function openNav() {
 	document.getElementById("myNav").style.height = "100%";
 	initApp();
 	getCards();
 }

 function closeNav() {
 	startRound();
 	document.getElementById("myNav").style.height = "0%";
 }

 function GameStartCountdown(){
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
 		console.log("Clear Interval")
 		clearInterval(x);
 		closeNav(x,y);
 	},3000);
 }

function toggleSignIn() {
	document.getElementById('signin').style.display = "none";
	document.getElementById('countdown').style.display = 'block';
	user = firebase.auth().currentUser;
    if (user) {
    	var name = document.getElementById("name").value;
        user.updateProfile({
        	displayName: name
        }).then(function() {
        	//success
        }, function(error){
        	//fail
        	console.log(error);
        });
    } else {
        firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/operation-not-allowed') {
            alert('You must enable Anonymous auth in the Firebase Console.');
          } else {
            console.log(user.displayName);
          }
        });
        console.log("Signed In");
        toggleSignIn();
    }
    GameStartCountdown();
}
function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user);
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          console.log("Signed In - Init");
        } else {
          // User is signed out.
          console.log("Signed Out - Init");
        }
    });
}