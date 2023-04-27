const express = require("express");
const firebaseAdmin = require("firebase-admin");
const gametagStore = require("./Gamertags.json");
const gamertagsArr = gametagStore.Gamertags;
const serviceAccount = require("./ServiceAccountKey.json");
const functions = require("firebase-functions");
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
});
var queue = [];
var matches = [];
var tempMatches = [];
const database = firebaseAdmin.firestore();
const app = express();
app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
function generatePlayers(nPlayers) {
	baseElo = 1000;
	arr = [];
	for (i = 0; i < nPlayers; i++) {
		arr.push({
			ActualSkillElo: baseElo * (randn_bm() / 0.5),
			SkillElo: baseElo,
			ActualToxicityElo: baseElo * (randn_bm() / 0.5),
			ToxicityElo: baseElo,
			UserName: gamertagsArr[Math.floor(Math.random() * gamertagsArr.length)],
		});
	}
	return arr;
}
//Matchmaking service functions

//makes matches from a queue
function MatchMake() {
	queue.forEach((player) => {
		if (tempMatches.length == 0) {
			tempMatches.push([[player], []]);
		} else {
			var added = false;
			tempMatches.forEach((match) => {
				if (
					!added &&
					(match[0].length < 5 || match[1].length < 5) &&
					Math.abs(player.data.SkillElo - match[0].hasMax("SkillElo")) < 200 &&
					Math.abs(match[0].hasMin("SkillElo") - player.data.SkillElo) < 200 &&
					Math.abs(player.data.ToxicityElo - match[0].hasMax("ToxicityElo")) <
						200 &&
					Math.abs(match[0].hasMin("ToxicityElo") - player.data.ToxicityElo) <
						200
				) {
					if (match[0].length < 5) match[0].push(player);
					else match[1].push(player);
					added = true;
				}
			});
			if (!added) {
				tempMatches.push([[player], []]);
			}
		}
	});
	queue = [];
	for (let i = 0; i < tempMatches.length; i++) {
		if (tempMatches[i][0].length == 5 && tempMatches[i][1].length == 5) {
			matches.push(tempMatches.splice(i, 1));
			i--;
		}
	}
}

//function to simulate all matches currently active
async function simulateMatches() {
	for (const match of matches) {
		console.log(match[0]);
		const teamOnePerfElo = match[0][0].sumAttrib("ActualSkillElo");
		const teamTwoPerfElo = match[0][1].sumAttrib("ActualSkillElo");
		const teamOneElo = match[0][0].sumAttrib("SkillElo");
		const teamTwoElo = match[0][1].sumAttrib("SkillElo");
		if (Math.random() < teamOnePerfElo / (teamOneElo + teamTwoPerfElo)) {
			for (const player of match[0][0]) {
				await updatePlayer(
					player,
					(teamTwoElo / teamOneElo) * 20,
					-0.5 +
						Math.random() *
							0.2 *
							(player.data.ToxicityElo - player.data.ActualToxicityElo)
				);
			}
			for (const player of match[0][1]) {
				await updatePlayer(
					player,
					(-teamTwoElo / teamOneElo) * 20,
					-0.5 +
						Math.random() *
							0.2 *
							(player.data.ToxicityElo - player.data.ActualToxicityElo)
				);
			}
		} else {
			for (const player of match[0][0]) {
				await updatePlayer(
					player,
					-(teamOneElo / teamTwoElo) * 20,
					-0.5 +
						Math.random() *
							0.2 *
							(player.data.ToxicityElo - player.data.ActualToxicityElo)
				);
			}
			for (player of match[0][1]) {
				await updatePlayer(
					player,
					(teamOneElo / teamTwoElo) * 20,
					-0.5 +
						Math.random() *
							0.2 *
							(player.data.ToxicityElo - player.data.ActualToxicityElo)
				);
			}
		}
	}
	return "done";
}
//DB functions

//Updates given player's skill and toxicity
async function updatePlayer(player, skillStep, toxicityStep) {
	await database
		.collection("players")
		.doc(player.id)
		.update({
			SkillElo: player.data.SkillElo + skillStep,
			ToxicityElo: player.data.ToxicityElo + toxicityStep,
		});
	// .update({
	// 	SkillElo: skillStep,
	// 	ToxicityElo: toxicityStep,
	// });
}
//gets all players in database
async function getPlayers() {
	const playersRef = await database.collection("players").get();
	return playersRef.docs.map((doc) => {
		return { id: doc.id, data: doc.data() };
	});
}
//gets given number of random of players from table
function getRandPlayers(numPlayers) {
	let playersArr = [];
	return getPlayers().then((players) => {
		if (numPlayers >= players.length) {
			return players;
		} else {
			for (let i = 0; i < numPlayers; i++) {
				playersArr.push(
					players.splice(Math.floor(Math.random() * players.length), 1)[0]
				);
			}
			return playersArr;
		}
	});
}
//gets given player with Uid
async function getPlayer(uid) {
	const doc = await database.collection("players").doc(uid).get();
	console.log(doc.id);
	return { id: doc.id, data: doc.data() };
}
//adds an individual player to database
function addPlayer(player) {
	console.log("adding ", player);
	database.collection("players").add({
		UserName: player.UserName,
		SkillElo: player.SkillElo,
		ActualSkillElo: player.ActualSkillElo,
		ToxicityElo: player.ToxicityElo,
		ActualToxicityElo: player.ActualToxicityElo,
	});
}
async function getRatingQualities() {
	var EloDiffAccum = 0;
	let EloAccum = 0;
	let ToxicityDiffAccum = 0;
	let ToxicityAccum = 0;
	return getPlayers().then((players) => {
		players.forEach((player) => {
			EloDiffAccum += Math.abs(
				player.data.SkillElo - player.data.ActualSkillElo
			);
			EloAccum += player.data.SkillElo;
			ToxicityDiffAccum += Math.abs(
				player.data.ToxicityElo - player.data.ActualToxicityElo
			);
			ToxicityAccum += player.data.ToxicityElo;
			console.log(ToxicityAccum);
		});
		return {
			EloQuality: EloDiffAccum / EloAccum,
			ToxicityQuality: ToxicityDiffAccum / ToxicityAccum,
		};
	});
	console.log(EloDiffAccum, EloAccum, ToxicityAccum, ToxicityAccum);
}
//creates player in database with given UID
function addPlayerWithId(id, player) {
	database.collection("players").doc(id).set({
		UserName: player.UserName,
		SkillElo: player.SkillElo,
		ActualSkillElo: player.ActualSkillElo,
		ToxicityElo: player.ToxicityElo,
		ActualToxicityElo: player.ActualToxicityElo,
	});
}
//sets all players back to default 1000 elo (must change update player for this to work from a step to a )
async function fixElos() {
	getPlayers().then(async (players) => {
		for (player of players) {
			await updatePlayer(player, 1000, 1000);
			console.log("ok");
		}
	});
}
getPlayers().then((players) => {
	console.log(players.sumAttrib("SkillElo"));
	console.log(players.sumAttrib("ToxicityElo"));
});
//fixElos();
// getPlayers().then((playersarr) => {
// 	//console.log(playersarr.length);
// 	playersarr.forEach((player) => {
// 		queue.push(player);
// 	});
// 	console.log(queue.length);
// 	MatchMake();
// 	console.log(matches);
// });
// getRandPlayers(3).then((players) => {
// 	console.log(players);
// });
//Endpoints

//generates 20 players and adds them to the players collection in firebase
app.get("/generatePlayers", (req, res) => {
	console.log("hit");
	let playerData = generatePlayers(req.query.numPlayers);
	res.send(playerData);
	playerData.forEach((player) => addPlayer(player));
});
app.get("/addPlayer", (req, res) => {
	addPlayerWithId(req.query.id, {
		UserName: req.query.UserName,
		SkillElo: 1000,
		ActualSkillElo: 1000 * (randn_bm() / 0.5),
		ToxicityElo: 1000,
		ActualToxicityElo: 1000 * (randn_bm() / 0.5),
	});
	res.send("Good");
});
app.get("/getPlayer", (req, res) => {
	console.log(req.query.id);
	player = getPlayer(req.query.id).then((player) => {
		console.log(player);
		res.send(player);
	});
});
//gets a player with a given ID from players collection in firebase and adds them to queue
app.get("/addPlayertoQueue", (req, res) => {
	player = getPlayer(req.query.id).then((player) => {
		queue.push(player);
		MatchMake();
		let MatchFound = false;
		matches.forEach((match) => {
			if (match.find((element) => element.id === player.id)) {
				res.send(match);
				matchFound = true;
			}
		});
		if (!matchFound) {
			res.send("MatchNotFound");
		}
	});
});
//addsPlayers given number of random players to queue
app.get("/addPlayerstoQueue", (req, res) => {
	getRandPlayers(req.query.numPlayers).then((players) => {
		players.forEach((player) => {
			queue.push(player);
		});
		res.send(queue);
	});
});
// getRatingQualities().then((res) => {
// 	console.log(res);
// });
app.get("/matches", (req, res) => {
	res.send(matches);
});
//makes matches with current player queue
app.get("/Matchmake", (req, res) => {
	MatchMake();
	res.send(matches);
});
//simulates current matches
app.get("/SimCurrent", (req, res) => {
	simulateMatches().then(() => {
		getRatingQualities().then((result) => {
			res.send(result);
		});
	});
});
app.get("/Queue", (req, res) => {
	res.send(queue);
});
//simulates a number of players entering the queue finding a match simulating that match and repeating X number of times and returns quality of skill ratings
app.get("/SimXiterations", async (req, res) => {
	for (let i = 0; i < res.iterations; i++) {
		getRandPlayers(req.query.numPlayers).then(async (players) => {
			players.forEach((player) => {
				queue.push(player);
			});
			MatchMake();
			await simulateMatches();
			console.log("ok");
		});
	}
});
//HelperFunctions
//generate random values on a bellcurve taken from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
	return num;
}
//Adds functionality to array to find minimum/max value of an attribute in an array of objects taken from https://stackoverflow.com/questions/8864430/compare-javascript-array-of-objects-to-get-min-max
Array.prototype.hasMin = function (attrib) {
	return ((this.length &&
		this.reduce(function (prev, curr) {
			return prev["data"][attrib] < curr["data"][attrib] ? prev : curr;
		})) ||
		null)["data"][attrib];
};
Array.prototype.hasMax = function (attrib) {
	return ((this.length &&
		this.reduce(function (prev, curr) {
			return prev["data"][attrib] > curr["data"][attrib] ? prev : curr;
		})) ||
		null)["data"][attrib];
};
//Adds function to sum an attribute from a list of objects to list Prototype
Array.prototype.sumAttrib = function (attrib) {
	let Accum = 0;
	this.forEach((element) => {
		Accum += element.data[attrib];
	});
	return Accum;
};
app.listen(3500, () => console.log("listening on 4000"));
exports.api = functions.https.onRequest(app);
