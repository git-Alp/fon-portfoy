const express = require('express');
const cors = require('cors');
const axios = require("axios");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const usersPath = './data/users';
const fundsPath = './data/funds';
const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

const findUserFile = (userID) => {
  const fileNames = fs.readdirSync(usersPath, 'utf-8');

  const userFile = fileNames.find(file => {
    const userJason = fs.readFileSync(`${usersPath}/${file}`, 'utf-8');
    const userData = JSON.parse(userJason)
    return userData.id == userID;
  })

  if (!userFile) return "";
  return userFile;
}

// REGISTER
app.post('/register', async (req, res) => {
  const userID = uuidv4();

  const user = {
    id: userID,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.mail,
    password: req.body.password,
    createDate: new Date().getTime(),
    updateDate: new Date().getTime(),
    status: true,
    portfolios: []
  }

  const json = JSON.stringify(user, null, 2);
  let fileName = `${userID}.json`;
  const status = fs.existsSync(fileName);

  if (!status) {
    await fs.promises.appendFile(`${usersPath}/${fileName}`, json);
  } else {
    const newID = uuidv4();
    fileName = `${newID}.json`;
    await fs.promises.appendFile(`${usersPath}/${fileName}`, json);
  }

  return res.status(200).json('Registration Successful!');
});

// LOGIN
app.post('/sign-in', async (req, res) => {
  const {mail, password} = req.body;

  const fileNames = fs.readdirSync(usersPath, 'utf-8');

  const findUser = fileNames.find(file => {
    const userJason = fs.readFileSync(`${usersPath}/${file}`, 'utf-8');
    const userData = JSON.parse(userJason)
    return userData.email == mail;
  })

  if (!findUser) return res.status(422).json('User information is incorrect');

  const userJason = fs.readFileSync(`${usersPath}/${findUser}`, 'utf-8');
  const userData = JSON.parse(userJason)

  if (userData.password == password) {
    return res.status(200).json('Password Correct');
  } else {
    return res.status(422).json('Password Wrong');
  }
});

// USER PORTFOLIOS (bu kısım daha sonra login sayfasından sonra cookie veya storage a kaydedilerek çekilebilir ekstra istek atmaya gerek yok)
app.get('/portfolio-list/:userID', async(req, res) => {
	const { userID } = req.params;
  const userFile = findUserFile(userID)

  if (!userFile) return res.status(422).json('Something got wrong!');

  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)
  return res.status(200).json(userData);
})

// ADD PORTFOLIO
app.post("/add-portfolio", async (req, res) => {
  const {userID, newPortfolio} = req.body;

  const userFile = findUserFile(userID)
  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)

  userData.portfolios.push(newPortfolio)
  const json = JSON.stringify(userData, null, 2);
  fs.writeFileSync(`${usersPath}/${userFile}`, json)

  return res.status(200).json(userData);
})

// PORTFOLIO FUNDS
app.get('/fund-list/:userID/:portfolioID', async(req, res) => {
	const { userID, portfolioID } = req.params;
  const userFile = findUserFile(userID)

  if (!userFile) return res.status(422).json('Something got wrong!');

  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)
  const userPortfolio = userData.portfolios.find(portfolio => portfolio?.id == portfolioID)

  return res.status(200).json(userPortfolio);
})

// UPDATE PORTFOLIO
app.post("/add-fund", async (req, res) => {
  const {userID, portfolioID, newFund} = req.body;
  const userFile = findUserFile(userID)
  
  if (!userFile) return res.status(422).json('Something got wrong!');

  const userJason = fs.readFileSync(`${usersPath}/${userFile}`, 'utf-8');
  const userData = JSON.parse(userJason)

  const portfolioIndex = userData.portfolios.findIndex(portfolio => portfolio.id == portfolioID);
  const userPortfolio = userData.portfolios[portfolioIndex]
  
  userPortfolio.funds.push(newFund)
  
  const json = JSON.stringify(userData, null, 2);
  fs.writeFileSync(`${usersPath}/${userFile}`, json)

  return res.status(200).json(userPortfolio);
})

// FUND LIST
app.get('/all-funds', async(req, res) => {
  const fundsJson = fs.readFileSync(`${fundsPath}/funds.json`, 'utf-8');
  const fundsData = JSON.parse(fundsJson)
  return res.status(200).json(fundsData);
})

// TEFAS API
app.post("/tefas/:kod", async (req, res) => {
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
})

app.listen(4000, () => console.log('🎈 http://localhost:4000 🎈'));