const Clarifai = require('clarifai');

const clarifai_app = new Clarifai.App({
 apiKey: '2c8dcc1c39c242d284f70ebbb9584cdb'
});

// const handleApiCall = (url, id, sessionData) => {
// 	console.log('url in handleApiCall', url);
	
// 	clarifai_app.models
// 	.predict(Clarifai.FACE_DETECT_MODEL, url)
// 	.then(data => {
// 		sessionData.status = 'completed';
// 		console.log('session status:', sessionData.status);
// 		console.log('data in handleApiCall:', data);
// 		return data;
// 	}).catch(err => res.status(400).json('Error getting clarifai'));
// }

const changeEntries = (req,res,db) => {
	const { input } = req.body;
	console.log('input in changeEntries', input);
	const sessionData = req.session;

	db('entries').insert({url : input}).returning('id').then(async function(id){
    if(id.length){
    	sessionData.status = 'saved_successfully';
    	console.log('session status:', sessionData.status);
    	let data = await (
    		clarifai_app.models
			.predict(Clarifai.FACE_DETECT_MODEL, url)
			.then(data => {
				sessionData.status = 'completed';
				console.log('session status:', sessionData.status);
				console.log('data in handleApiCall:', data);
				res.json(data);
			}).catch(err => res.status(400).json('Error getting clarifai'));)
    }else{
    	res.status(404).json('user doesnt exist');
    }
  }).catch(err => res.status(400).json(err));
}

module.exports = {
	changeEntries : changeEntries
};