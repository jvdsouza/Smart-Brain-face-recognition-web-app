const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port: "5434",
    user : 'postgres',
    password : 'jet153',
    database : 'smart-brain'
  }
});



const app = express();
const port = 3000;
//mock database to test routes with POST, PUT, and DELETE methods before
//implementing a database

//import apps to express
app.use(bodyParser.json());
app.use(cors());

//testing the root directory to check if everything is working
app.get('/', (req, resp) => {
  resp.send(database.users);
})

//signin route
app.post('/signin', (req, resp) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            resp.json(user[0]);
          })
          .catch (err => resp.status(400).json('unable to get user'))
      } else{
          resp.status(400).json('wrong credentials');
      }
    })
    .catch(err => resp.status(400).json('wrong credentials'))
})

//register route
app.post('/register', (req, resp) => {
  const {email, name, password} = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          resp.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })

      .catch(err => resp.status(400).json("unable to register"))
})

//profile route
app.get('/profile/:id', (req, resp) => {
  const { id } = req.params;
  let found = false;

  db.select('*').from('users').where({id}).then(user => {
    if (user.length) {
      resp.json(user[0]);
    } else {
      resp.status(400).json('not found')
    }
  }).catch(err =>resp.status(400).json('not found'));
})

//update entries page through image submission
app.put('/image', (req, resp) => {
  const { id } = req.body;

  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    resp.json(entries[0]);
  })
  .catch(err => res.status(400).json("unable to get entries"));
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
