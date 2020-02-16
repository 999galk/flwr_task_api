const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const image = require('./controllers/image');
const startupFuncs = require('./controllers/startupFuncs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const request = require('request');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl : true,
  }
});

const store = new KnexSessionStore({
    knex: db,
    tablename: 'sessions'
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  store: store,
  secret: (process.env.FOO_COOKIE_SECRET || 'sdftyhjik') ,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.get('/', (req, res) => {
	console.log('session :', req.session);
	res.json('Hey you!');
})

app.post('/image', (req,res) => {
	image.changeEntries(req,res,db);
});

app.listen(process.env.PORT || 3001 , () =>{
	console.log(`app is running on port ${process.env.PORT}`);
	startupFuncs.handleUnclosedCalls(db,store);
})