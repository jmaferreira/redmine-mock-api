var express = require('express');
var axios = require('axios');
var router = express.Router();

var users = require('../data/users.json').users;

router.get('/', async function (req, res, next) {
  let { forceMail } = req.query;

  if (forceMail) {
    let users2 = users.map(e => {
      if (e.id > 10) e.mail = forceMail
      return e;
    });
  }
  res.jsonp(users2);
});


router.get('/:id', async function (req, res, next) {
  let { forceMail } = req.query;
  let { id } = req.params;

  let filteredUser = users.filter(e => {
    if (e.id == id) return e;
  });


  if (filteredUser && filteredUser.length == 1) {
    let user = filteredUser[0];
    if (forceMail && user.id > 10) user.mail = forceMail;
    res.jsonp(user);
  } else {
    res.status(404).jsonp({ errorMessage: `User not found` })
  }
});


// Help functions. 

async function generateFakeUsers(maxUsers) {
  let users = []
  for (let i = 0; i < maxUsers; i++) {
    let user = await generateNewFakeUser(i + 1);
    users.push(user);
  }
  return users;
}

async function generateNewFakeUser(id) {
  const userMock = {
    "id": 1,
    "login": "aalem",
    "firstname": "Anabela",
    "lastname": "Além",
    "mail": "aalem@gmail.com",
    "created_on": "2018-10-16T16:30:37Z",
    "last_login_on": "2019-01-28T15:02:06Z"
  }

  let fakeName = await axios.get('https://uinames.com/api/?region=portugal');
  let { name, surname } = fakeName.data;

  //let newUser = JSON.parse(JSON.stringify(userMock));
  let newUser = userMock;

  newUser.id = id;
  newUser.login = `${name.charAt(0)}${surname}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  newUser.firstname = `${name}${surname}`.toLowerCase();
  newUser.firstname = name;
  newUser.lastname = surname;
  newUser.mail = RECIPIENT_EMAIL || `${newUser.login}@mail.pt`;
  return newUser;
}

module.exports = router;
