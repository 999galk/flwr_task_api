const Clarifai = require('clarifai');

const clarifai_app = new Clarifai.App({
 apiKey: '2c8dcc1c39c242d284f70ebbb9584cdb'
});

const handleApiCall = (url, id, sessionData) => {
	console.log('url in handleApiCall', url);
	clarifai_app.models
	.predict(Clarifai.FACE_DETECT_MODEL, url)
	.then(data => {
		sessionData.status = 'completed';
		console.log('session status:', sessionData.status);
		console.log('data in handleApiCall:', data);
		return data;
	}).catch(err => res.status(400).json('Error getting clarifai'));
}

const changeEntries = (req,res,db) => {
	const { input } = req.body;
	console.log('input in changeEntries', input);
	const sessionData = req.session;

	db('entries').insert({url : input}).returning('id').then(id => {
    if(id.length){
    	sessionData.status = 'saved_successfully';
    	console.log('session status:', sessionData.status);
    	const getData = new Promise((resolve,reject) => { resolve(handleApiCall(input, id, sessionData)); });
    	getData.then(data => {
    		console.log('data back in changeEntries:', data);
    		res.json(data)
    	});
    }else{
    	res.status(404).json('user doesnt exist');
    }
  }).catch(err => res.status(400).json(err));

	// db('users').where('id', '=', id).increment('entries', 1).returning('entries').then(entries => {
	// 	if(entries.length){
	// 		res.json(entries);
	// 	} else{
	// 		res.status(404).json('user doesnt exist');	
	// 	}
	// }).catch(err => res.status(400).json('Error getting entries'));

}

module.exports = {
	changeEntries : changeEntries
};