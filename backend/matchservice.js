const express = require("express");
const firebaseAdmin = require("firebase-admin");
const gametagStore = require("../GamerTags.json");
const gamertagsArr = gametagStore.Gamertags;
const serviceAccount = require("../ServiceAccountKey.json");
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
});
var queue = [];
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
//DB functions

//gets all players in database
async function getPlayers() {
	const playersRef = await database.collection("players").get();
	return playersRef.docs.map((doc) => {
		return { id: doc.id, data: doc.data() };
	});
}
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
function addPlayerWithId(id, player) {
	database.collection("players").doc(id).set({
		UserName: player.UserName,
		SkillElo: player.SkillElo,
		ActualSkillElo: player.ActualSkillElo,
		ToxicityElo: player.ToxicityElo,
		ActualToxicityElo: player.ActualToxicityElo,
	});
}
//Endpoints

//generates 20 players and adds them to the players collection in firebase
app.get("/generatePlayers", (req, res) => {
	const playerData = generatePlayers(20);
	console.log(playerData[1]);
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
});
app.get("/getPlayer", (req, res) => {
	console.log(req.query.id);
	player = getPlayer(req.query.id).then((player) => {
		console.log(player);
		res.send(player);
	});
});
//gets a random player from players collection in firebase and adds them to queue
app.get("/addPlayertoQueue", (req, res) => {});
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

app.listen(4000, () => console.log("listening on 4000"));
