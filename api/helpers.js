const _ = require('lodash');

const getParticipantIndex = (participants, accountId) => {
	return _.findIndex(participants, (participant) => { return participant.player.accountId == accountId; });
};

const getParticipantData = (participants, participantId) => {
	const index =	_.findIndex(participants, (participant) => { return participant.participantId == participantId });
	const participant = participants[index];
	return participant;
};

module.exports.retrieveSpellsData = (spellIds, spellData) => {
	for(let i = 0; i < spellIds.length; i++){
		for(let j = 0; j < spellIds[i].length; j++){
			for (let key of Object.keys(spellData)) {
				if(spellData[key].key == spellIds[i][j]){
					spellIds[i][j] = spellData[key];
				}
			}
		}	
	}
	return spellIds;
}

module.exports.retrieveChampionData = (championIds, championData) => {
	for(let i = 0; i < championIds.length; i++){	
		for (let key of Object.keys(championData)) {
			if(championData[key].key == championIds[i]){
				championIds[i] = championData[key];
			}
		}	
	}
	return championIds;
}

module.exports.retrieveItemData = (itemIds, itemData) => {
	for(let i = 0; i < itemIds.length; i++){
		for(let j = 0; j < itemIds[i].length; j++){	
			Object.keys(itemData).forEach((key, index) => {
				if(key == itemIds[i][j]){
					itemIds[i][j] = itemData[key];
				}
			});	
		}	
	}
	return itemIds;
}

module.exports.matchParser = (matches, accountId) => {
	return matches.map((match) => {
		const game_length = match.gameDuration;
		const index = getParticipantIndex(match.participantIdentities, accountId);
		const participant = match.participantIdentities[index];
		const participantId = participant.participantId;

		const participantData = getParticipantData(match.participants, participantId);
		const spell1Id = participantData.spell1Id;
		const spell2Id = participantData.spell2Id;

		const championId = participantData.championId;
		
		const stats = participantData.stats;
		const timeline = participantData.timeline;
		
		const level = stats.champLevel;
		const kills = stats.kills;
		const deaths = stats.deaths;
		const assists = stats.assists;
		const outcome = stats.win;
		const totalCreepScore = stats.totalMinionsKilled;
		const averageCreepScore = totalCreepScore / game_length;

		let items = [];
		for(let i = 0; i < 6; i++){
			items.push(stats[`item${i}`]);
		}
		
		return {
			game_length: game_length,
			level: level,
			outcome: outcome,
			kda: { kills: kills, deaths: deaths, assists: assists },
			championId: championId,
			items: items,
			spells: [ spell1Id, spell2Id], 
			totalCreepScore: totalCreepScore,
			averageCreepScore: averageCreepScore
		};
	});
}