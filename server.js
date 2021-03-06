require('dotenv').config();
const express = require('express');
const axios = require('axios').default
const cors = require('cors');
const _ = require('lodash');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const app = express();

const routes = require(`./api/routes`);
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(methodOverride())
app.use(cors());

app.get('/api/summoner/:summonerName', (req, res) => {
	const summonerName = req.params.summonerName;
	routes.getSummonerData(summonerName, (err, data) => {
		if(err){
			console.log(err);
			res.status(err.response.status);
		}
		return res.json(data);
	})
});

app.get('/api/account/:accountId/match-history', (req, res) => {
	const accountId = req.params.accountId;
	const startIndex = req.query.startIndex;
	const endIndex = req.query.endIndex;
	routes.getAllMatchData(accountId, startIndex, endIndex, (err, data) => {
		if(err){
			console.log(err);
			res.status(err.response.status);
		}
		return res.json(data);
	});
	
})

app.listen(PORT, () => console.log(`app listening on PORT ${PORT}`))