const express = require("express");
const firebaseAdmin = require("firebase-admin");
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

app.listen(4000, () => console.log("listening on 4000"));
