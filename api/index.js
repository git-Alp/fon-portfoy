const express = require('express');
const cors = require('cors');
const axios = require("axios");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const usersPath = './data/users';
const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

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
    fs.promises.appendFile(`${usersPath}/${fileName}`, json);
  } else {
    const newID = uuidv4();
    fileName = `${newID}.json`;
    fs.promises.appendFile(`${usersPath}/${fileName}`, json);
  }

});

app.post('/sign-in', (req, res) => {
  const {mail, password} = req.body;
  
  res.json({mail, password});
});


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