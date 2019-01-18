const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const port = 3000;
//mock database to test routes with POST, PUT, and DELETE methods before
//implementing a database

//import apps to express
app.use(bodyParser.json());
app.use(cors());

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

//testing the root directory to check if everything is working
app.get('/', (req, resp) => {
  resp.send(database.users);
})

//signin route
app.post('/signin', (req, resp) => {signin.handleSignin(req, resp, db, bcrypt)});

//register route
app.post('/register', (req, resp) => {register.handleRegister(req, resp, db, bcrypt)});

//profile route
app.get('/profile/:id', (req, resp) => {profile.handleProfile(req, resp, db)})

//update entries page through image submission
app.put('/image', (req, resp) => {image.handleImage(req, resp, db)})

//For handling the clarifai api
app.post('/imageurl', (req, resp) => {image.handleApiCall(req, resp)})


//display port in console
app.listen(port, () => {
  console.log(`200 app is running on port ${port}`)
});
