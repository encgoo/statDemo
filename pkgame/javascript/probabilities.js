
// This one compute the probability for the player to
// get a 4Kind.
function proFourKind(pc, dc, numSame){
	if (numSame.twoPair){
		return 0.0;
	}
	else if (numSame.num == 4){
		return 1.0;
	} else if (numSame.num == 3){
		var outAlready = 3 + contain(dc, numSame.value);
		return (4.0 -outAlready)/(52.0 - 9.0);
	} else {
		return 0.0;
	}
}
// get a full house
function proFullhouse(pc, dc, numSame){
	if (numSame.num == 3){
		var outAlready = 1 + contain(dc, numSame.rem1);
		return (4.0 - outAlready)/43.0;
	}
	else if (numSame.twoPair) {
		var out1Already = 2 + contain(dc, pc[0].value);
		var out2Already = 2 + contain(dc, pc[2].value);
		return (4.0+4.0-out1Already-out2Already)/43.0;		
	} else {
		return 0.0;
	}
}
// get a 3 kind
function proThreeKind(pc, dc, numSame){
	if (numSame.num == 3){
		return 1.0;
	}else if (numSame.twoPair) {
		var out1Already = 2 + contain(dc, pc[0].value);
		var out2Already = 2 + contain(dc, pc[2].value);
		return (4.0+4.0-out1Already-out2Already)/43.0;		
	} else if (numSame.num == 2){
		var outAlready = 2 + contain(dc, numSame.value);
		return (4.0 - outAlready)/43.0;
	} else {
		return 0.0;
	}
}
// get a two pair
function proTwoPair(pc, dc, numSame){
	if (numSame.twoPair){
		return 1.0;
	} else if (numSame.num == 2) {
		var out1Already = 1 + contain(dc, numSame.rem1);
		var out2Already = 1 + contain(dc, numSame.rem2);
		return (8.0 - out1Already - out2Already)/43.0;
	} else {
		return 0.0;
	}
}
// get a pair
function proAPair(pc, dc, numSame){
	if (numSame.twoPair){
		return 1.0;
	} else if (numSame.num >= 2){
		return 1.0;
	} else {
		var out1 = 1 + contain(dc, pc[0].value);
		var out2 = 1 + contain(dc, pc[1].value);
		var out3 = 1 + contain(dc, pc[2].value);
		var out4 = 1 + contain(dc, pc[3].value);
		return (16 - out1 - out2 - out3)/43.0;
	}
}

// get a flush
function proFlush(pc, dc, numSame){
	if (numSame.num >= 2){
		return 0;
	} else if (! (pc[0].suit == pc[1].suit && pc[0].suit == pc[2].suit && pc[0].suit == pc[3].suit)){
		return 0;
	} else {
		var count = 4;
		for (var i = 0; i < dc.length; ++i){
			if (dc[i].suit == pc[0].suit){
				++count;
			}
		}
		return (13.0 - count)/43.0;
	}
}
// get a straight
function proStraight(pc, dc, numSame){
	if (numSame.num >= 2){
		return 0;
	} else if ((pc[3].value - pc[0].value <= 4) && pc[0].value != 1){
		var vs = findMissingInStraight(pc);
		var ret = 0;
		if (vs.v1 != 0){
			ret += (4 - contain(dc, vs.v1))/43.0;
		}
		
		if (vs.v2 != 0){
			ret += (4 - contain(dc, vs.v2))/43.0;
		}
		return ret;

	} else if (pc[0].value == 1 && pc[0] == 11){
		var out = contain(dc, 10);
		return (4 - out)/43.0;
	} else if (pc[0].value == 1 && pc[0] == 10){
		var o11 = contain(pc, 11);
		var o12 = contain(pc, 12);
		var o13 = contain(pc, 13);

		var out = 0;
		if (o11 == 0){
			out = contain(dc, 11);
		} else if (o12 == 0){
			out = contain(dc, 12);
		} else if (o13 == 0){
			out = contain(dc, 13);
		}
		return (4.0 - out)/43.0;
	} else if (pc[0].value == 1 && pc[3].value == 5){
		var missing = 4;
		if(pc[1].value == 3){
			missing = 2;
		} else if (pc[2] == 4){
			missing = 3;
		}

		var out = contain(dc, missing);
		return (4.0 - out)/43.0;
	} else if (pc[0].value == 1 && pc[3].value == 4){
		var out = contain(pc, 5);
		return (4-out)/43.0;
	}
	return 0;
}
// get a flush straight
function proFlushStraight(pc, dc, numSame){
	if (numSame.num >= 2 || numSame.twoPair){
		return 0;
	} else if (! (pc[0].suit == pc[1].suit && pc[0].suit == pc[2].suit && pc[0].suit == pc[3].suit)){
		return 0;
	} else if ((pc[3].value - pc[0].value <= 3) && pc[0].value != 1){
		var vs = findMissingInStraight(pc);
		var ret = 0;
		if (vs.v1 != 0){
			if (containSuit(dc, vs.v1, pc[0].suit)){
				ret += 0;
			} else {
				ret += 1.0/43.0;
			}
		}
		
		if (vs.v2 != 0){
			if (containSuit(dc, vs.v2, pc[0].suit)){
				ret += 0;
			} else {
				ret += 1.0/43.0;
			}
		}
		return ret;

	} else if (pc[0].value == 1 && pc[0] == 11){
		if ( containSuit(dc, 10, pc[0].suit)){
				return 0;
			} else {
				return 1.0/43.0;
			}
	} else if (pc[0].value == 1 && pc[0] == 10){
		var o11 = contain(pc, 11);
		var o12 = contain(pc, 12);
		var o13 = contain(pc, 13);

		var out = 0;
		if (o11 == 0 && !containSuit(dc, 11, pc[0].suit)){
			out = 1;
		} else if (o12 == 0 &&!containSuit(dc, 12, pc[0].suit)){
			out = 1;
		} else if (o13 == 0 && !containSuit(dc, 13, pc[0].suit)){
			out = 1;
		}
		return out/43.0;
	} else if (pc[0].value == 1 && pc[4].value == 5){
		var missing = 4;
		if(pc[1].value == 3){
			missing = 2;
		} else if (pc[2] == 4){
			missing = 3;
		}

		if (containSuit(dc, missing, pc[0].suit)){
			return 0;
		} else {
			return 1/43.0;
		}

	} else if (pc[0].value == 1 && pc[4].value == 4){
		if (containSuit(dc, 5, pc[0].suit)){
			return 0;
		} else {
			return 1/43.0;
		}
	}
	return 0;
}

function proRoyalFlush(pc, dc, numSame){
	if (pc[0].value == 1 && pc[0] == 11){
		if ( containSuit(dc, 10, pc[0].suit)){
				return 0;
			} else {
				return 1.0/43.0;
			}
	} else if (pc[0].value == 1 && pc[0] == 10){
		var o11 = contain(pc, 11);
		var o12 = contain(pc, 12);
		var o13 = contain(pc, 13);

		var out = 0;
		if (o11 == 0 && !containSuit(dc, 11, pc[0].suit)){
			out = 1;
		} else if (o12 == 0 &&!containSuit(dc, 12, pc[0].suit)){
			out = 1;
		} else if (o13 == 0 && !containSuit(dc, 13, pc[0].suit)){
			out = 1;
		}
		return out/43.0;
	}
	return 0;
}

function findMissingInStraight(pc){
	if (pc[3].value - pc[0].value == 4){
		// Can be either end, if pc[0].value is 1, then return 0.
		return obj = {v1: pc[3].value + 1, v2:pc[0].value - 1}	
	} else if (pc[3].value - pc[0].value == 5){
		if (pc[1].value - pc[0].value == 2){
			return obj = {v1: pc[0].value + 1, v2:0};
		} else if (pc[2].value - pc[1].value == 2){
			return obj = {v1: pc[1].value + 1, v2:0};
		} else {
			return obj = {v1: pc[2].value + 1, v2:0};
		}
	}
}
function contain(c, value){
	var num = 0;
	for (var i = 0; i < c.length; ++i){
		if (c[i].value == value){
			num ++;
		}	
	}
	return num;
}
function containSuit(c, value, suit){
	for (var i = 0; i < c.length; ++i){
		if (c[i].value == value && c[i].suit == suit){
			return true;
		}
	}	
	return false;
}
function checkTwoPair(pc){
	// This is special
	return (pc[0].value == pc[1].value && pc[2].value == pc[3].value);
}

function numSameNumber(pc){
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