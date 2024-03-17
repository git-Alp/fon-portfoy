const express = require('express');
const fs = require('fs');
const axios = require("axios");
const router = express.Router();
const fundsPath = './data/funds';
const usersPath = './data/users';
const helpers = require('../helpers');

// ALL FUNDS LIST
router.get('/all-funds', async(req, res) => {
  const fundsJson = fs.readFileSync(`${fundsPath}/funds.json`, 'utf-8');
  const fundsData = JSON.parse(fundsJson)
  return res.status(200).json(fundsData);
});

// PORTFOLIO FUNDS
router.get('/fund-list/:userID/:portfolioID', async(req, res) => {
	const { userID, portfolioID } = req.params;
  const userFile = helpers.findUserFile(userID)

  if (!userFile) return res.status(422).json('Something got wrong!');

  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)
  const userPortfolio = userData.portfolios.find(portfolio => portfolio?.id == portfolioID)

  return res.status(200).json(userPortfolio);
});

// ADD NEW FUND
router.post('/add-fund', async(req, res) => {
  const {userID, portfolioID, newFund} = req.body;
  const userFile = helpers.findUserFile(userID)
  
  if (!userFile) return res.status(422).json('Something got wrong!');

  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)

  const portfolioIndex = userData.portfolios.findIndex(portfolio => portfolio.id == portfolioID);
  const userPortfolio = userData.portfolios[portfolioIndex]
  
  userPortfolio.funds.push(newFund)
  
  const json = JSON.stringify(userData, null, 2);
  fs.writeFileSync(`${usersPath}/${userFile}`, json)

  return res.status(200).json(userPortfolio);
});

// TEFAS API
router.post("/tefas/:kod", async (req, res) => {
	const { kod } = req.params;
  
  const result = await axios({
    method: 'post',
    url: 'https://www.tefas.gov.tr/api/DB/GetAllFundAnalyzeData',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    }, 
    data: {
      'dil': 'TR',
      'fonkod': kod
    }
  })
  .then(response => response.data)
  .catch(error => error);

  return res.json(result);
});

module.exports = router;