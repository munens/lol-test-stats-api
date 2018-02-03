const axios = require('axios');
const _ = require('lodash');
const helpers = require('./helpers');

const LOL_API_KEY = process.env.LOL_API_KEY;
const LOL_URL = `https://na1.api.riotgames.com/lol`;

module.exports.getSummonerData = (summonerName, callback) => {
	axios.get(`${LOL_URL}/summoner/v3/summoners/by-name/${summonerName}?api_key=${LOL_API_KEY}`)
		.then(({data}) => { 
			callback(null, data);
		})
		.catch((err) => { 
			callback(err, null);
		});
}

getMatchHistoryData = (accountId, callback) => {
	const request = axios.get(`${LOL_URL}/match/v3/matchlists/by-account/${accountId}?api_key=${LOL_API_KEY}`)
	if(!callback){
		return request;
	} else {
		axios.get(`${LOL_URL}/match/v3/matchlists/by-account/${accountId}?api_key=${LOL_API_KEY}`)
		.then(({data}) => { 
			callback(null, data);
		})
		.catch((err) => { 
			callback(err, null);
		});
	}
}

const getAllMatchHistoryData = (matches) => {
	let requests = [];
	for(let i = 0; i < matches.length; i++){
		const gameId = matches[i].gameId;
		requests.push(axios.get(`${LOL_URL}/match/v3/matches/${gameId}?api_key=${LOL_API_KEY}`));
	}
	return axios.all(requests);
};

const getChampions = () => {
	return axios.get(`http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json`);
}

const getItemsData = () => {
	return axios.get(`http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json`);
}

const getSpellsData = () => {
	return axios.get(`http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json`);
}

async function getAllMatchData(accountId, startIndex, endIndex, callback){
	try {
		const matchHistory = await getMatchHistoryData(accountId);
		const matches = matchHistory.data.matches.slice(startIndex, endIndex);
		const matchesData = await getAllMatchHistoryData(matches);
		
		const matchData = matchesData.map((match) => { return match.data });
		const parsedMatchData = helpers.matchParser(matchData, accountId);
		
		let championIds = parsedMatchData.map((match) => { return match.championId; });
		const champions = await getChampions(championIds);
		const championsData = champions.data.data;
		const retrievedChampionItems = helpers.retrieveChampionData(championIds, championsData);
		
		let itemIds = parsedMatchData.map((match) => { return match.items });
		const items = await getItemsData();
		const itemData = items.data.data;
		const retrievedItems = helpers.retrieveItemData(itemIds, itemData);

		let spellIds = parsedMatchData.map((match) => { return match.spells })
		const spells = await getSpellsData();
		const spellsData = spells.data.data;
		const retrievedSpellItems = helpers.retrieveSpellsData(spellIds, spellsData);

		parsedMatchData.map((match, index) => {
			match.champion = retrievedChampionItems[index];
			match.items = retrievedItems[index];
			match.spells = retrievedSpellItems[index];
			return match;
		})

		callback(null, parsedMatchData);

	} catch(err) {
		console.log('getAllMatchData', err);
		callback(err, null)
	}
}


module.exports.getMatchHistoryData = getMatchHistoryData;
module.exports.getAllMatchData = getAllMatchData;