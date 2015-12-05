//  diy.js
//
//  author: Yongjian Feng
//
//  This file is developed for students of BU METCS546 to get hand-on 
//  experience on Statistics in computer programming. 
//
//  The following function called diyfunction can be modified to compute
//  probability of one possible score for the player. And the result will 
//  be shown in the last role of the Table of Probabilities
//
//  For example, you can try to compute the probability for the player to 
//  get a full house. 
//  
//  There are some utility functions that you might find useful at the end
//
//  Look for DIY Start and start coding!!!!
//

function diyfunction(playerCards, dealerCards){
	
	//  Results of this function;
	//  Your task: Set the following two variables that this function will return
	var scoreName = 'DIY Score'; // Change this to what you want to compute, i.e.  'Full house'
	var scoreProbability = 0.0;  // Compute the probability! 

	// Input information
	// You need to use this information to compute the probability
	// playerCards is an array of 4 cards, and dealerCards is an array of 5 cards shown on the
	// table.
	
	// For example, playerCards[0].value gives the value of the first card for the player
	// and playCards[0].suit gives the suit of the first card for the player. 
	// playCards[0].suit can be 'h', 's', 'd', or 'c'.
//------ DIY Start: modify code below to compute probability -------

//------ DIY End: you don't need to worry about the return code below----
	return obj = {displayName: scoreName, probability: scoreProbability};
}



//
//==================================================
// Some utility functions that you might find useful
//==================================================
//
// containNumOfValue (cards, value)
// Check how many values c contains.
// Input: 
//     	cards: 	array of cards
// 	value:	the value you want to check. range: 1-13
//------------------------------------------------------
function containNumOfValue(cards, value){
	var num = 0;
	for (var i = 0; i < cards.length; ++i){
		if (cards[i].value == value){
			num ++;
		}	
	}
	return num;
}
//
// containCardOfValueAndSuit(cards, value, suit)
// Check if cards contains a card of value and suit
//------------------------------------------------------
function containCardOfValueAndSuit(cards, value, suit){
	for (var i = 0; i < cards.length; ++i){
		if (cards[i].value == value && cards[i].suit == suit){
			return true;
		}
	}	
	return false;
}

//
// getNumSameValue(pc)
// Check how many cards in the pc array carry the same value
//
// This is a useful utility function when checking
// scores like full house, 4 kind, 3 kind 2 pairs...
//----------------------------------------------------------
function getNumSameValue(pc){
	// Assume only 4 cards in pc. 
	if (checkTwoPair(pc)){
		return obj = {value: 0, num: 0, rem1:0, rem2:0, rem3:0, twoPair: true};
	} else if (pc[0].value == pc[1].value &&
	    pc[0].value == pc[2].value &&
	    pc[0].value == pc[3].vale){
		return obj = {value: pc[0].value, num: 4, rem1:0, rem2:0, rem3:0, twoPair: false};
	} else if (pc[0].value == pc[1].value && pc[0].value == pc[2].value) {
		return obj = {value: pc[0].value, num: 3, rem1:pc[3].value, rem2:0, rem3:0, twoPair: false};
	} else if (pc[1].value == pc[2].value && pc[1].value == pc[3].value){
		return obj = {value: pc[1].value, num: 3, rem1:pc[0].value, rem2:0, rem3:0, twoPair: false};
	} else if (pc[0].value == pc[1].value){
		return obj = {value: pc[0].value, num:2, rem1:pc[2].value, rem2:pc[3].value, rem3:0, twoPair: false};
	} else if (pc[1].value == pc[2].value){
		return obj = {value: pc[1].value, num:2, rem1:pc[0].value, rem2:pc[3].value, rem3:0, twoPair: false};
	} else if (pc[2].value == pc[3].value){
		return obj = {value: pc[2].value, num:2, rem1:pc[0].value, rem2:pc[1].value, rem3:0, twoPair: false};
	} else {
		// Not pair
		return obj = {value: 0, num:0, rem1:pc[0].value, rem2:pc[1].value, rem3:0};
	}
}