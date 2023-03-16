const express = require("express");
const firebaseAdmin = require("firebase-admin");
const gametagStore = require("../GamerTags.json");
const gamertagsArr = gametagStore.Gamertags;
const serviceAccount = require("../ServiceAccountKey.json");
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount),
});
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
let playerData;
// /getPlayer().then(res =>{
// 	console.log(result.body);
// 	const player = JSON.parse(result.body);
// 	playerData = {
// 		Username: player.UserName,
// 		ToxicityElo: player.ToxicityElo,
// 		SkillElo: player.ToxicityElo,
// 	};

// })
//database.collection("players").add({});
getPlayers().then((res) => {
	console.log(res);
});
async function getPlayers() {
	const playersRef = await database.collection("players").get();
	return playersRef.docs.map((doc) => {
		return { id: doc.id, data: doc.data() };
	});
}
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
app.get("/", (req, res) => {
	res.send(generatePlayers(2000));
});
console.log(generatePlayers(400), "lmao");
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
