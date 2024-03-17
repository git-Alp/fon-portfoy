const express = require('express');
const fs = require('fs');
const router = express.Router();
const usersPath = './data/users';

router.post('/', async (req, res) => {
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

module.exports = router;
