const fs = require('fs');
const usersPath = './data/users';

exports.findUserFile = (userID) => {
  const fileNames = fs.readdirSync(usersPath, 'utf-8');

  const userFile = fileNames.find(file => {
    const userJason = fs.readFileSync(`${usersPath}/${file}`, 'utf-8');
    const userData = JSON.parse(userJason)
    return userData.id == userID;
  })

  if (!userFile) return "";
  return userFile;
};