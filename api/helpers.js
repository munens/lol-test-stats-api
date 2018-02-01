const _ = require('lodash');

const getParticipantIndex = (participants, accountId) => {
	return _.findIndex(participants, (participant) => { return participant.player.accountId == accountId; });
};

const getParticipantData = (participants, participantId) => {
	const index =	_.findIndex(participants, (participant) => { return participant.participantId == participantId });
	const participant = participants[index];
	return participant;
};

module.exports.matchParser = (matches, accountId) => {
	return matches.map((match) => {
		const game_length = match.gameDuration;
		const index = getParticipantIndex(match.participantIdentities, accountId);
		const participant = match.participantIdentities[index];
		const participantId = participant.participantId;

		const participantData = getParticipantData(match.participants, participantId);
		
		const championId = participantData.championId;
		
		const stats = participantData.stats;
		const timeline = participantData.timeline;

		const level = stats.champLevel;
		const kills = stats.kills;
		const deaths = stats.deaths;
		const assists = stats.assists;
		const outcome = stats.win;
		let champion = {}

		let items = [];
		for(let i = 0; i < 6; i++){
			items.push(stats[`item${i}`]);
		}

		const creepsPerMinDeltas = timeline.creepsPerMinDeltas;
		const csDiffPerMinDeltas = timeline.csDiffPerMinDeltas;		
		
		return {
			game_length: game_length,
			outcome: outcome,
			kda: { kills: kills, deaths: deaths, assists: assists },
			championId: championId,
			items: items,
			creepsPerMinDeltas: creepsPerMinDeltas,
			csDiffPerMinDeltas: csDiffPerMinDeltas
		};
	});
}