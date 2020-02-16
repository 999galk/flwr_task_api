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
    tablename: 'sessions' // optional. Defaults to 'sessions'
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

app.use(function(req, res, next) {
    var session_id = (req.body && req.body.sid) || req.query && req.query.sid;
    console.log('session id in middleware:', session_id);
    req.store && req.store.get(session_id, function(err, session) {
    	console.log('inside get from store');
        if (session) {
        	console.log('found session to reasign');
            // createSession() re-assigns req.session
            req.store.createSession(req, session)
        }
        return next()
    })
})


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
const handleUnclosedCalls = () => {
	console.log('got to handleUnclosedCalls');

	db.select('sess').from('sessions').then(data => {
    	data.forEach(se => {
    		console.log('inside for each');
    		if(se.sess.status){
    			if(se.sess.status === 'saved_successfully'){
    				console.log('found incomplete call:', se.sess.status);
    				if(se.sess.urlId){
    					console.log('found urlID:', se.sess.urlId[0]);
    					db.select('url').from('entries').where('id', '=', se.sess.urlId[0]).then(data => {
    						console.log('url of the session:', data);
    						request.post('/image', {
		                      json: {
		                        "input" : data[0].url;
		                      }
		                    }, (error, res, body) => {
		                      if (error) {
		                        console.error(error);
		                        return
		                      }
		                      console.log('body back in callback:',body);
		                    })
    					});
    					
    				}
    			}
    		}
    	})
    // 	// console.log('all data:', data);
    // 	// const firstRow=data[0];
    // 	// console.log('first:',firstRow);
    // 	// const status=data[0].sess.status;
    // 	// console.log('firstRowCookie:',firstRowCo);
    });
}

app.listen(process.env.PORT || 3001 , () =>{
	console.log(`app is running on port ${process.env.PORT}`);
	handleUnclosedCalls();
})