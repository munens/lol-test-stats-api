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

const getChampions = (championIds) => {
	let requests = []
	for(let i = 0; i < championIds.length; i++){
		const championId = championIds[i];
		requests.push(axios.get(`${LOL_URL}/static-data/v3/champions/${championId}?locale=en_US&tags=image&api_key=${LOL_API_KEY}`));
	}
	return axios.all(requests);
}

const getItemData = (itemIds) => {
	console.log('in getItemData')
	const all_requests = [];
	for(let i = 0; i < itemIds.length; i++){
		const requests = []
		console.log('itemId array: ', itemIds[i])
		for(let j = 0; j < itemIds[i].length; j++){
			//https://na1.api.riotgames.com/lol/static-data/v3/items/3073?locale=en_US&tags=image&api_key=RGAPI-30565e17-5e97-408a-9e2f-f411f7028e1c
			const itemId = itemIds[i][j];
			console.log('itemId', itemId)
			//itemIds[i][j] = axios.get(`${LOL_URL}/static-data/v3/items/${itemId}?locale=en_US&tags=image&api_key=${LOL_API_KEY}`)
			requests.push(axios.get(`${LOL_URL}/static-data/v3/items/${itemId}?locale=en_US&tags=image&api_key=${LOL_API_KEY}`))
		}
		all_requests.push(requests);
		console.log('all_requests', all_requests)
	}
	return all_requests;
}

const getSpellsData = () => {
	return axios.get(`http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json`);
}

const getRunesData = () => {
	// https://na1.api.riotgames.com/lol/static-data/v3/runes?locale=en_US&tags=image&api_key=RGAPI-30565e17-5e97-408a-9e2f-f411f7028e1c
	return axios.get(`${LOL_URL}/static-data/v3/runes?locale=en_US&tags=image&api_key=${LOL_API_KEY}`)
}

async function getAllMatchData(accountId, startIndex, endIndex, callback){
	try {
		const matchHistory = await getMatchHistoryData(accountId);
		const matches = matchHistory.data.matches.slice(startIndex, endIndex);
		const matchesData = await getAllMatchHistoryData(matches);
		
		const matchData = matchesData.map((match) => { return match.data });
		const parsedMatchData = helpers.matchParser(matchData, accountId);
		/*
		let championIds = parsedMatchData.map((match) => { return match.championId; });
		const champions = await getChampions(championIds);
		champions.map((champion, index) => {
			parsedMatchData[index].champion = champion.data
		});*/
		/*
		let itemIds = parsedMatchData.map((match) => { return match.items });
		const itemIdsData = getItemData(itemIds);
		*/
		
		const runes = await getRunesData();
		const runesData = runes.data.data;

		const spells = await getSpellsData();
		console.log(spells);

		callback(null, parsedMatchData);

	} catch(err) {
		console.log('getAllMatchData', err);
		callback(err, null)
	}
}


module.exports.getMatchHistoryData = getMatchHistoryData;
module.exports.getAllMatchData = getAllMatchData;