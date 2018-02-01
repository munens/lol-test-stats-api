const axios = require('axios');

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

async function getAllMatchData(accountId, startIndex, endIndex){
	try {
		const matchHistory = await getMatchHistoryData(accountId);
		const matchHistoryData = matchHistory.data.slice(startIndex, endIndex);

	} catch(err) {
		console.log(error);
	}
}


module.exports.getMatchHistoryData = getMatchHistoryData;
module.exports.getAllMatchData = getAllMatchData;