const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '2c8dcc1c39c242d284f70ebbb9584cdb'
});

const handleApiCall = (url, id, sessionData) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, url)
	.then(data => {
		sessionData.status = 'completed';
		console.log('session status:', sessionData.status);
		res.json(data, id);
	}).catch(err => res.status(400).json('Error getting clarifai'));
}

const changeEntries = (db) => (req,res) => {
	const { input } = req.body;
	const sessionData = req.session;

	db('entries').returning('id').insert({url : input}).count('id as CNT').then(id => {
    if(id.length){
    	sessionData.status = 'saved_successfully';
    	console.log('session status:', sessionData.status);
    	handleApiCall(input, id, sessionData);
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
	changeEntries : changeEntries,
	handleApiCall : handleApiCall
};