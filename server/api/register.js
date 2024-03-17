const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const usersPath = './data/users';

router.post('/', async (req, res) => {
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

module.exports = router;
