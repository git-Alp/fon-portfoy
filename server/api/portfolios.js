const express = require('express');
const fs = require('fs');
const router = express.Router();
const usersPath = './data/users';
const helpers = require('../helpers');

// USER PORTFOLIOS (bu kısım daha sonra login sayfasından sonra cookie veya storage a kaydedilerek çekilebilir ekstra istek atmaya gerek yok)
router.get('/portfolio-list/:userID', async (req, res) => {
	const { userID } = req.params;
  const userFile = helpers.findUserFile(userID)

  if (!userFile) return res.status(422).json('Something got wrong!');

  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)
  return res.status(200).json(userData);
});

// ADD PORTFOLIO
router.post('/add-portfolio', async (req, res) => {
  const {userID, newPortfolio} = req.body;

  const userFile = helpers.findUserFile(userID)
  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)

  userData.portfolios.push(newPortfolio)
  const json = JSON.stringify(userData, null, 2);
  fs.writeFileSync(`${usersPath}/${userFile}`, json)

  return res.status(200).json(userData);
});

module.exports = router;