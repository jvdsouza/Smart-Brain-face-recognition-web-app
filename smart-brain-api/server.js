const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
const port = 3000;
//mock database to test routes with POST, PUT, and DELETE methods before
//implementing a database
const database = {
  users: [
    {
      id: 123,
      name: 'John',
      password: 'cookies',
      email: "john@gmail.com",
      entries: 0,
      joined: new Date()
    },
    {
      id: 124,
      name: 'Sally',
      password: 'bananas',
      email: "sally@gmail.com",
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

//import apps to express
app.use(bodyParser.json());
app.use(cors());

//testing the root directory to check if everything is working
app.get('/', (req, resp) => {
  resp.send(database.users);
})

//signin route
app.post('/signin', (req, resp) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
    resp.json(database.users[0]);
  } else {
    resp.status(400).json('error logging in');
  }
})

//register route
app.post('/register', (req, resp) => {
  const {email, name, password} = req.body;
  // bcrypt.hash(password, null, null, function(err, hash) {
  //     console.log(hash);
  // });
  database.users.push({
    id: 125,
    name,
    email,
    entries: 0,
    joined: new Date()
  })
    resp.json(database.users[database.users.length-1]);
})

//profile route
app.get('/profile/:id', (req, resp) => {
  const { id } = req.params;
  const idVal = Number(id);
  let found = false;

  database.users.forEach(user => {
    if (user.id == idVal) {
      found = true;
      return resp.json(user);
    }
  })
  if (!found) {
    resp.status(400).json('user not found')
  }
})

//update entries page through image submission
app.put('/image', (req, resp) => {
  const { id } = req.body;
  const idVal = Number(id);
  let found = false;

  database.users.forEach(user => {
    if (user.id == idVal) {
      found = true;
      user.entries++
      return resp.json(user.entries);
    }
  })
  if (!found) {
    resp.status(400).json('user not found')
  }
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });
//
// Load hash from your password DB.


//display port in console
app.listen(port, () => {
  console.log(`200 app is running on port ${port}`)
});
