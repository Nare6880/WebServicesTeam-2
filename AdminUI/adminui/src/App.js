import "./App.css";
import React, { useState } from "react";
import Collapsible from "react-collapsible";
import axios from "axios";
function App() {
	const [queue, setQueue] = useState([]);
	const [matches, setMatches] = useState([]);
	const [numPlayers, setnumPlayers] = useState(0);

	return (
		<div className="App">
			<div className="grid">
				<div>
					<div className="">
						<div className="headerButton">Control Panel</div>
						<div className="FormGroup">
							<h3>Add Players to Queue</h3>
							<form>
								<label>Players to Add:</label>
								<br></br>
								<input
									type="number"
									value={numPlayers}
									min="0"
									placeholder="0"
									onChange={(e) => setnumPlayers(e.target.value)}
								></input>
								<br />
								<button type="button" onClick={addPlayerstoQueue}>
									Add Players To Queue
								</button>
							</form>
							<button type="button" onClick={matchmake}>
								Generate Matches
							</button>
						</div>
						<div className="FormGroup">
							<h3>simulate Matches repeatedly</h3>
							<form>
								<label>Players to Add:</label>
								<br></br>
								<input type="number" min="0" placeholder="0"></input>
								<br />
								<label>Matches to simulate: </label>
								<br></br>
								<input type="number" min="0" placeholder="0"></input>
								<br />
								<button>simulate Matches</button>
							</form>
						</div>
						<div className="FormGroup">
							<h3>Current Rating Quality: </h3>
							<button>Get Rating Quality</button>
						</div>
					</div>
				</div>
				<div>
					<button type="button" className="headerButton" onClick={getQueue}>
						Get Queue
					</button>
					<div className="FormGroup">
						<ul>
							{queue.length > 0 ? (
								queue.map((player) => {
									return (
										<li>
											<Collapsible trigger={player.data.UserName}>
												<div className="col2">
													<div>
														<h4>SkillElo:</h4>
														<h5>{player.data.SkillElo}</h5>
													</div>
													<div>
														<div>
															<h4>ToxicityElo:</h4>
															<h5>{player.data.ToxicityElo}</h5>
														</div>
													</div>
												</div>
											</Collapsible>
										</li>
									);
								})
							) : (
								<li>No players in Queue</li>
							)}
						</ul>
					</div>
				</div>
				<div>
					<button className="headerButton" onClick={getMatches}>
						Get Matches
					</button>
					<div className="FormGroup">
						<ul>
							{matches.length > 0 ? (
								matches.map((match, index) => {
									return (
										<li>
											<Collapsible trigger={`Match ${index}`}>
												<div className="col2">
													<div>
														<h3>Team 1</h3>
														<ul>
															{console.log(match[0][0][0])}
															{match[0][0].map((player) => {
																return (
																	<li>
																		<Collapsible trigger={player.data.UserName}>
																			<div className="col2">
																				<div>
																					<h4>SkillElo:</h4>
																					<h5>{player.data.SkillElo}</h5>
																				</div>
																				<div>
																					<div>
																						<h4>ToxicityElo:</h4>
																						<h5>{player.data.ToxicityElo}</h5>
																					</div>
																				</div>
																			</div>
																		</Collapsible>
																	</li>
																);
															})}
														</ul>
													</div>
													<div>
														<h3>Team 2</h3>
														<ul>
															{match[0][1].map((player) => {
																return (
																	<li>
																		<Collapsible trigger={player.data.UserName}>
																			<div className="col2">
																				<div>
																					<h4>SkillElo:</h4>
																					<h5>{player.data.SkillElo}</h5>
																				</div>
																				<div>
																					<div>
																						<h4>SkillElo:</h4>
																						<h5>{player.data.ToxicityElo}</h5>
																					</div>
																				</div>
																			</div>
																		</Collapsible>
																	</li>
																);
															})}
														</ul>
													</div>
												</div>
											</Collapsible>
										</li>
									);
								})
							) : (
								<li>No Matches Currently</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
	async function matchmake() {
		try {
			await axios.get("http://localhost:3500/Matchmake").then((matches) => {
				setMatches(matches.data);
				getQueue();
			});
		} catch (e) {
			console.log(e);
		}
	}
	async function getQueue() {
		console.log("yeet");
		try {
			await axios.get("http://localhost:3500/Queue").then((response) => {
				setnumPlayers(0);
				setQueue(response.data);
			});
		} catch (e) {
			console.log(e);
		}
	}
	async function addPlayerstoQueue() {
		try {
			await axios
				.get(`http://localhost:3500/addPlayerstoQueue?numPlayers=${numPlayers}`)
				.then((response) => {
					setQueue(response.data);
				});
		} catch (e) {}
	}
	async function getMatches() {
		try {
			await axios.get("http://localhost:3500/matches").then((response) => {
				setMatches(response.data);
			});
		} catch (e) {
			console.log(e);
		}
	}
}

export default App;
