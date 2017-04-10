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
 	var ref = database.ref();
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