var deck;	
var river;
var dealer;
var player;
var bUserPredictUserWin;
var userPrediction;

function estimate(){
	// This is the most interesting one. Try to estimate the % of winning
	var per = 0.5;
	// First what does the dealer gets?
	checkScore(dealer);
	var dealerScore = outputDealerScore();
	// 
	var pc = sort(player.cards);
	var numSame = numSameNumber(pc);
	console.log("numSame: " + numSame);
	var perFourKind = proFourKind(pc, dealer.cards, numSame);
	console.log("perFourKind: " + perFourKind);
	document.getElementById("pl4k").innerHTML=perFourKind.toPrecision(5);	
	var perFullhouse = proFullhouse(pc, dealer.cards, numSame);
	document.getElementById("plfullhouse").innerHTML= perFullhouse.toPrecision(5);	
	var perThreeKind = proThreeKind(pc, dealer.cards, numSame);
	document.getElementById("pl3k").innerHTML= perThreeKind.toPrecision(5);	
	var perTwoPair = proTwoPair(pc, dealer.cards, numSame);
	document.getElementById("pl2pair").innerHTML= perTwoPair.toPrecision(5);	
	var perAPair = proAPair(pc, dealer.cards, numSame);
	document.getElementById("plpair").innerHTML= perAPair.toPrecision(5);
	var perFlush = proFlush(pc, dealer.cards, numSame);
	document.getElementById("plflush").innerHTML= perFlush.toPrecision(5);	
	var perStraight = proStraight(pc, dealer.cards, numSame);
	document.getElementById("plstraight").innerHTML= perStraight.toPrecision(5);
	var perStraightFlush = proFlushStraight(pc, dealer.cards, numSame);
	document.getElementById("plstraightf").innerHTML= perStraightFlush.toPrecision(5);
	var perRoyalFlush = proRoyalFlush(pc, dealer.cards, numSame);
	document.getElementById("plroyal").innerHTML= perRoyalFlush.toPrecision(5);
	var perHighCard = (1 - perAPair - perTwoPair - perThreeKind - perStraight - perFlush 
			  - perFullhouse - perFourKind - perStraightFlush - perRoyalFlush);
	if (perHighCard > 1){
		perHighCard = 1;
	} else if (perHighCard < 0) {
		perHighCard = 0;
	}
	document.getElementById("plhigh").innerHTML= perHighCard.toPrecision(5);

	var perPlayerWin = 0;
	if (dealerScore >= 9){
		// Dealer got a royal flush. Forget about it
		perPlayerWin = 0;
	} else if (dealerScore >= 8){
		// User gets a straight flush
		perPlayerWin = perRoyalFlush;
	} else if (dealerScore >= 7){
		// Dealer got a 4 kind. 
		// @TODO we shall compare the 4 kind of the dealer and the player here.
		perPlayerWin = perStraightFlush + perFourKind/2;
	} else if (dealerScore >= 6){
		// Dealer got a full house
		// @TODO we need to compare the 3 kind here
		perPlayerWin = perStraightFlush + perFourKind + perFullhouse/2;
	} else if (dealerScore >= 5){
		// Dealer got a flush
		// @TODO need to compare the flushes
		// Note don't double count the straighflush
		perPlayerWin = perStraightFlush + perFourKind + perFullhouse + (perFlush - perStraightFlush)/2;
	} else if (dealerScore >= 4) {
		// Dealer got a straight
		// @TODO need to compare straight
		perPlayerWin = perFourKind + perFullhouse + perStraightFlush + (perStraight)/2;
	} else if (dealerScore >= 3) {
		// Dealer got a 3 Kind
		// @TODO: need to compare 3 kind
		perPlayerWin = perFourKind + perFullhouse + perStraight + (perThreeKind)/2;
	} else if (dealerScore >= 2) {
		// Dealer got 2 pairs
		//@TODO: need to compare 2 pairs
		// Don't overcount 3 kind
		perPlayerWin = perFourKind + perFullhouse + perStraight + perThreeKind + (perTwoPair - perThreeKind)/2;
	} else if (dealerScore >= 1) {
		// Dealer got 1 pair
		perPlayerWin = perFourKind + perFullhouse + perStraight + perThreeKind + perTwoPair + perAPair/2;
	} else {
		perPlayerWin = perHighCard/2 + perFourKind + perFullhouse + perStraight + perThreeKind + perTwoPair + perAPair;
	}

	if (perPlayerWin >= 1){
		perPlayerWin = 1;
	} else if (perPlayerWin <= 0){
		perPlayerWin = 0;
	} 

	var perDealerWin = 1 - perPlayerWin;

	document.getElementById("plwin").innerHTML = perPlayerWin.toPrecision(5);
	document.getElementById("dlwin").innerHTML = perDealerWin.toPrecision(5);

	// DIY display
	var diyresult = diyfunction(pc, dealer.cards);
        document.getElementById("diytitle").innerHTML = diyresult.displayName;
	document.getElementById("diypl").innerHTML = diyresult.probability.toPrecision(5);

	if (bUserPredictUserWin){
		if (perPlayerWin > 0.5){
			document.getElementById("msg").innerHTML="Both you and the app predict the Player will win.";
		} else {
			document.getElementById("msg").innerHTML="You predict the Player will win, but the app predicts the Dealer will!";
		}
	} else {
		if (perPlayerWin > 0.5){
			document.getElementById("msg").innerHTML="You predict the Dealer will win, but the app predicts the Player will!";
		} else {
			document.getElementById("msg").innerHTML="Both you and the app predict the Dealer will win.";
		}
	}

	return per;
}
function lastCard(){
	addOneCard();
	checkScore(player);
	var bPlayerWin = doesPlayerWin(player, dealer);
	//document.getElementById("msg").innerHTML="Final Result";
	if (bPlayerWin){
		if (bUserPredictUserWin){
			document.getElementById("msg").innerHTML="Player Wins. You are right.";
		} else {
			document.getElementById("msg").innerHTML="Player Wins. You are wrong.";
		}
	} else {
		if (bUserPredictUserWin){
			document.getElementById("msg").innerHTML="Dealer Wins. You are wrong.";
		} else {
			document.getElementById("msg").innerHTML="Dealer Wins. You are right.";
		}
	}
}
function predictPlayerWin(res){
	bUserPredictUserWin = res;
	var per = estimate();
		
}
function doesPlayerWin(p, d){
	var ps = p.score;
	var ds = d.score;

	if (ds.royalFlush == true){
		document.getElementById("dlresult").innerHTML="Dealer has a royal flush.";
		return false;
	}else if (ps.royalFlush){
		document.getElementById("dlresult").innerHTML="Player has a royal flush.";
		return true;
	}

	if (ds.straightFlush.hit && !ps.straighFlush.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a straight flush.";
		return false;
	} else if (ps.straightFlush.hit && !ds.straightFlush.hit){
		document.getElementById("dlresult").innerHTML="Player has a straight flush.";
		return true;
	} else if (ps.straightFlush.hit && ds.straightFlush.hit){
		// Both get straight flush. compare high card
		document.getElementById("dlresult").innerHTML="Dealer has a straight flush.";
		return (ps.straightFlush.highCard > ds.straightFlush.highCard);
	}

	// Four kind
	if (ds.fourKind.hit &&!ps.fourKind.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a four kind.";
		return false;
	} else if (ps.fourKind.hit &&!ds.fourKind.hit){
		document.getElementById("dlresult").innerHTML="Player has a four kind.";
		return true;
	} else if (ps.fourKind.hit && ds.fourKind.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a four kind.";
		return (ps.fourKind.value > ds.fourKind.value);
	}
	
	// Full house
	if (ds.fullhouse.hit && !ps.fullhouse.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a full house.";
		return false;
	} else if (ps.fullhouse.hit && !ds.fullhouse.hit){
		document.getElementById("dlresult").innerHTML="Player has a full house.";
		return true;
	} else if (ps.fullhouse.hit && ds.fullhouse.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a full house.";
		return (ps.fullhouse.value > ds.fullhouse.value);
	}
	
	// flush
	if (ds.flush.hit && !ps.flush.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a straight.";
		return false;
	} else if (ps.flush.hit && !ds.flush.hit){
		document.getElementById("dlresult").innerHTML="Player has a straight.";
		return true;
	} else if (ps.flush.hit && ds.flush.hit){
		if (ds.flush.value == 1){
			document.getElementById("dlresult").innerHTML="Dealer has a straight.";
			return false; // dealer gets 1.
		} else if (ps.flush.value == 1){
			document.getElementById("dlresult").innerHTML="Player has a straight.";
			return true;
		} else {
			document.getElementById("dlresult").innerHTML="Dealer has a straight.";
			return (ps.flush.value > ds.flush.value);
		}
	}

	// straight
	if (ds.straight.hit && !ps.straight.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a stright.";
		return false;
	} else if (ps.straight.hit && !ds.straight.hit){
		document.getElementById("dlresult").innerHTML="Player has a stright.";
		return true;
	} else if (ps.straight.hit && ds.straight.hit){
		if (ds.flush.value == 1){
			document.getElementById("dlresult").innerHTML="Dealer has a stright with an Ace.";
			return false; // dealer gets 1.
		} else if (ps.flush.value == 1){
			document.getElementById("dlresult").innerHTML="Player has a stright with an Ace.";
			return true;
		} else {
			document.getElementById("dlresult").innerHTML="Dealer has a stright.";
			return (ps.flush.value > ds.flush.value);
		}
	}

	// threekind
	if (ds.threeKind.hit && !ps.threeKind.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a 3 kind.";
		return false;
	} else if (ps.threeKind.hit && !ds.threeKind.hit){
		document.getElementById("dlresult").innerHTML="Player has a 3 kind.";
		return true;
	} else if (ps.threeKind.hit && ds.threeKind.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a 3 kind.";
		return (ps.threeKind.highCard > ds.threeKind.highCard);
	}
	
	// twoPair
	if (ds.twoPair.hit && !ps.twoPair.hit){
		document.getElementById("dlresult").innerHTML="Dealer has 2 pairs.";
		return false;
	} else if (ps.twoPair.hit && ! ds.twoPair.hit){
		document.getElementById("dlresult").innerHTML="Player has 2 pairs.";
		return true;
	} else if (ps.twoPair.hit && ds.twoPair.hit){
		document.getElementById("dlresult").innerHTML="Dealer has 2 pairs.";
		if (ps.twoPair.value1 != ds.twoPair.value1){
			return (ps.twoPair.value1 > ds.twoPair.value1);
		} else if (ps.twoPair.value2 != ds.twoPair.value2){
			return (ps.twoPair.value2 > ds.twoPair.value2);
		} else if (ps.twoPair.value3 != ds.twoPair.value3){
			return (ps.twoPair.value3 > ds.twoPair.value3);
		} else {
			return false;// dealer advantage when they are all the same
		}
	}
	// Pair
	if (ds.pair.hit && !ps.pair.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a pair.";
		return false;
	} else if (ps.pair.hit && ! ds.pair.hit){
		document.getElementById("dlresult").innerHTML="Player has a pair.";
		return true;
	} else if (ps.pair.hit && ds.pair.hit){
		document.getElementById("dlresult").innerHTML="Dealer has a pair.";
		if (ps.pair.value1 != ds.pair.value1){
			return (ps.pair.value1 > ds.pair.value1);
		} else if (ps.pair.value2 != ds.pair.value2){
			return (ps.pair.value2 > ds.pair.value2);
		} else if (ps.pair.value3 != ds.pair.value3){
			return (ps.pair.value3 > ds.pair.value3);
		} else if (ps.pair.value4 != ds.pair.value4){
			return (ps.pair.value4 > ds.pair.value4);
		} else {
			return false;// dealer advantage when they are all the same
		}
	}
	// high card
	var dc = dealer.cards;
	var pc = player.cards;

	if (dc[0].value == 1 && pc[0].value != 1){
		document.getElementById("dlresult").innerHTML="Dealer has an Ace.";
		return false;
	} else if (pc[0].value == 1 && dc[0].value != 1) {
		document.getElementById("dlresult").innerHTML="Player has an Ace.";
		return true;
	} else{
		if (pc[4].value != dc[4].value){
			return (pc[4].value > dc[4].value);
		} else if (pc[3].value != dc[3].value){
			return (pc[3].value > dc[3].value);
		} else if (pc[2].value != dc[2].value){
			return (pc[2].value > dc[2].value);
		} else if (pc[1].value != dc[1].value){
			return (pc[1].value > dc[1].value);
		} else {
			return checkAceAndCompare(pc[0].value , dc[0].value);
		}
	}
}
function outputDealerScore(){
	var ret = 0;
	var score = dealer.score;
	if (score.royalFlush){
		ret = 9;
		document.getElementById("dlroyal").innerHTML= "1.0000";
	} else if (score.straightFlush.hit){
		ret = 8;
		document.getElementById("dlstraightf").innerHTML= "1.0000";
	} else if (score.fourKind.hit){
		ret = 7;
		document.getElementById("dl4k").innerHTML= "1.0000";
	} else if (score.fullhouse.hit){
		ret = 6;
		document.getElementById("dlfullhouse").innerHTML= "1.0000";
	} else if (score.flush.hit){
		ret = 5
		document.getElementById("dlflush").innerHTML= "1.0000";
	} else if (score.straight.hit){
		ret = 4;
		document.getElementById("dlstraight").innerHTML= "1.0000";
	} else if (score.threeKind.hit){
		ret = 3;
		document.getElementById("dl3k").innerHTML= "1.0000";
	} else if (score.twoPair.hit){
		ret = 2;
		document.getElementById("dl2pair").innerHTML= "1.0000";
	} else if (score.pair.hit){
		ret = 1;
		document.getElementById("dlpair").innerHTML= "1.0000";
	} else {
		ret = 0;
		document.getElementById("dlhigh").innerHTML= "1.0000";
	}
	return ret;
}
function checkAceAndCompare(v1, v2){
	if (v1 == 1 && v2 != 1) {
		return true;
	} else if (v1 != 1 && v2 == 1){
		return false;
	} else {
		return v1 > v2;
	}
}

function checkScore(p){

	p.cards = sort(p.cards);
	p.score.flush = checkForFlush(p.cards);
	p.score.straight = checkForStraight(p.cards);
	if (p.score.flush.hit && p.score.straight){
		p.score.straightflush ={hit:true, suit:p.score.flush.suit, highCard:p.score.flush.highCard};
		if (p.cards[0] == 1 && p.cards[4]==13){
			p.score.royalFlush == true;
		}
	}

	p.score.fourKind = checkForAKind(p.cards,4);
	p.score.threeKind = checkForAKind(p.cards,3);

	if (p.score.threeKind.hit == true){
		p.score.fullhouse = checkForFullHouse(p.cards, p.score.threeKind.value);
	}
	p.score.pair = checkForAKind(p.cards,2);
	p.score.twoPair = checkForTwoPair(p.cards);
	p.score.highCard = findHighCard(p.cards);
	
	console.log(p.score);
	console.log('High Card: ' + p.score.highCard.value + p.score.highCard.suit);
	console.log('Pair: ' + p.score.pair.hit);
	console.log('Three of a Kind: ' + p.score.threeKind.hit);
	console.log('Four of a Kind: ' + p.score.fourKind.hit);
	console.log('Two pairs: ' + p.score.twoPair.hit);
	console.log('Straight: ' + p.score.straight.hit);
	console.log('Flush: ' + p.score.flush.hit);
}

function addOneCard()
{
	// One more card for the player
	if(player.cards.length < 5){
		player.cards.push(deck.pop());
		addCardToStage(player.cards[player.cards.length-1], 'player-cards');
	}
}

function initCardGame()
{
	deck = newDeck();	
	//river = new Array();
	dealer = newPlayer("Dealer");
	player = newPlayer("Kevin");
	
	for(var i = 0; i < 4; i++){		
		player.cards[i] = deck.pop();
		addCardToStage(player.cards[i], 'player-cards');
	};
	
	for(var i = 0; i < 5; i++)
	{
		//river.push(deck.pop());		
		dealer.cards[i] = deck.pop();
		addCardToStage(dealer.cards[i], 'river');
	}	
}


function newPlayer(name)
{
	var p = {
		name: name,
		cards: new Array(),
		score: scoreHolder()
	}
	
	return p;
}

function scoreHolder()
{
	var score = {		
		royalFlush: false,
		straightFlush: {hit: false, suit: 'd', 	highCard:0},
		fourKind: {hit:false, value:0},
		fullhouse: {hit:false, value:0},
		flush: {hit:false, suit: 'd', highCard:0},
		straight: {hit:false, highCard:0},
		threeKind: {hit:false, highCard:0},
		twoPair: {hit:false, value1:0, value2:0, value3:0},
		pair: {hit:false, value1:0, value2:0, value3:0, value4:0},
		highCard: false
	}
	
	return score;
}

function newDeck()
{
    var values = 14;
    var suits = ["s", "h", "c", "d"];
    
    var deck = new Array();
    var shuffledDeck = new Array();
	
    //MAKE DECK
    for(var s = 0; s < suits.length; s++)
    {    	
        for(var v = 1; v < values; v++)
        {
            deck.push({value: v, suit: suits[s]});
        }
    }
    
    //SHUFFLE DECK
    for(var i = 0; deck != i;)
    {
    	var random = Math.floor(Math.random()*(deck.length));
		var card = deck[random];
		deck.splice(random,1);
		
		shuffledDeck.push(card);
    }

    return shuffledDeck;
}

function addCardToStage(card, position)
{
	var img = document.createElement('img');	

	img.setAttribute('src',"images/" + card.value + card.suit + ".gif");
	img.setAttribute('width','71');
	img.setAttribute('height','96');
	
	document.getElementById(position).appendChild(img);
}

function findHighCard(cards)
{
	if (cards.length == 0){
		return 0;
	}
	
	var highCard = cards[0];
	
	for(var i = 1; i < cards.length; ++i){
		if (cards[i].value == 1){
			highCard = cards[i];
		}
		else if (highCard.value != 1 && cards[i].value > highCard.value){
			highCard = cards[i];
		}
	}
	
	cards[0].value == 1 ? highCard = cards[0] : highCard = cards[cards.length-1];
	
	return highCard;
}

function checkForFullHouse(cards, value){
	var pairValue = 0;
	for(var i = 0; i < cards.length; ++i){
		if (cards[i].value != value){
			if (pairValue == 0){
				pairValue = cards[i].value;
			}
			else if(cards[i].value == pairValue){
				console.log('FullHouse!');
				return obj = { hit:true, value: pairValue };
			}
		}
	}
	return false;
}

function checkForAKind(cards,num)
{	
	// Assume that we check first and always call 4, 3, then 2, and 1. 	
	var obj = Object;
	var value = 0;
	var count = 0;
	var remaining = new Array();

	for(var i = 0; i < cards.length - (num-1); i++)
	{	
		for (var j = i+1; j <= i+(num-1); j++)
		{
			if(cards[i].value == cards[j].value)
			{
				count++;
				value = cards[i].value;
				
				console.log(count);
				
				if(count == num - 1) 
				{
					console.log('eh!');
					if (num == 2){
						for (var k = 0; k < cards.length; ++k){
							if (cards[k].value != value){
								remaining.push(cards[k].value);
							}
						}
						return obj = {hit:true, value1: value, value2: remaining[2], 
									value3: remaining[1], value4: remaining[0]};
					}
					else {
						return obj = { hit:true, value: value };
					}
				} 
			}
		}	
		// Need to reset count to 0
		count = 0;
	}
	
	return false;
}

function checkForTwoPair(cards)
{
	//Assuming that the cards are already sorted
	var checkForThree = checkForAKind(cards, 3);
	if (checkForThree.hit == true){
		return obj = {hit:false, value: 0};
	}
	// When compare, first compare value1, then value2, then value3
	if (cards[0].value == cards[1].value){
		if(cards[2].value == cards[3].value){
			// 0 = 1; 2=3;
			return obj = {hit:true, value1:cards[3].value, value2:cards[0].value, value3: cards[4].value};
		} else if (cards[3].value == cards[4].value){
			// 0 = 1; 3=4;
			return obj = {hit:true, value1:cards[3].value, value2:cards[0].value, value3: cards[2].value};
		}
	}
	else if (cards[1].value == cards[2].value && cards[3].value == cards[4].value &&
		cards[2].value != cards[3].value){
		// 1=2; 3=4;
		return obj = {hit:true, value1:cards[3].value, value2:cards[1].value, value3:cards[0].value};
	}
	
	return obj = {hit:false, value1: 0, value2: 0, value3:0};
}

function checkForFlush(cards)
{	
	var h = 0;
	var s = 0;
	var d = 0;
	var c = 0;
		
	for(var i = 0; i < cards.length; i++)
	{
		if(cards[i].suit == 'h') h++;
		if(cards[i].suit == 's') s++;
		if(cards[i].suit == 'd') d++;
		if(cards[i].suit == 'c') c++;
	}
	
	var obj = Object;
	var hc = cards[cards.length-1].value;
	if (cards[0].value == 1){
		// There is an Ace!
		hc = 1;
	}	

	if(h >= 5) {
		return obj = { hit: true, suit: 'h' , highCard:hc};
	} else if(s >= 5) {
		return obj = { hit: true, suit: 's' , highCard:hc};
	} else if(d >= 5) {
		return obj = { hit: true, suit: 'd' , highCard:hc};
	} else if(c >= 5) {
		return obj = { hit: true, suit: 'c' , highCard:hc};
	} else {
		return false;
	}
}

function checkForStraight(cards)
{	
	var highCard = 0; 
    var count = 0;
    
    for(var i = 0; i < cards.length - 1; i++)
    {
        if(cards[i].value == cards[i+1].value - 1)
        {
        	count++;
        	highCard = cards[i+1].value;
        } 
        else if(cards[i+1].value - 1 > cards[i].value && count < 4)
        {
        	count = 0;
        }
        
        if(cards[0].value == 1 && cards[cards.length-1].value == 13 && count >= 3)
        {
        	count++;
        	highCard = cards[0].value;
        }
    }
    
    var obj = Object;
    
    if(count >= 4) return obj = { hit: true, value: highCard };
    else return false;
}

function sort(cards){

    var c = cards;

    //SORT NUMERICALLY
    for(var i = 1; i < c.length; i++)
    {
        var a = i;
        while(a != 0)
        {
            if(c[a].value < c[a-1].value)
            {
                temp = c[a];
                c[a] = c[a-1];
                c[a-1] = temp;
            }
            a--;
        }
    }
    return c;
}


$(document).ready(function()
{
	initCardGame();
});
