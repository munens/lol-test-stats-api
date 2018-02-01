import axios from 'axios';

module.exports.getSummonerData = (summonerName, callback) => {
	axios.get(`${LOL_URL}/summoner/v3/summoners/by-name/${summonerName}?api_key=${LOL_API_KEY}`)
		.then(({data}) => { 
			callback(null, data);
		})
		.catch((err) => { 
			callback(err, null);
		});
}