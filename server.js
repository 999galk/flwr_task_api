const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'postgres',
//     password : '1234',
//     database : 'smartbrain'
//   }
// });
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl : true,
  }
});

const store = new KnexSessionStore({
    knex: db,
    tablename: 'sessions' // optional. Defaults to 'sessions'
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.set({'Access-Control-Allow-Origin' :'*', 'Access-Control-Allow-Headers':'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,mode'});
//   next();
// });
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
//app.post('/imageUrl', image.handleApiCall())

// app.listen(3001 , () =>{
// 	console.log('app is running on port ${process.env.PORT}');
// })

app.listen(process.env.PORT || 3001 , () =>{
	console.log(`app is running on port ${process.env.PORT}`);
})