const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '2c8dcc1c39c242d284f70ebbb9584cdb'
});

const handleApiCall = () => (req,res) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => res.json(data))
	.catch(err => res.status(400).json('Error getting clarifai'));
}

const changeEntries = (db) => (req,res) => {
	const { id } = req.body;
	let found = false;
	
	db('users').where('id', '=', id).increment('entries', 1).returning('entries').then(entries => {
		if(entries.length){
			res.json(entries);
		} else{
			res.status(404).json('user doesnt exist');	
		}
	}).catch(err => res.status(400).json('Error getting entries'));

}

module.exports = {
	changeEntries : changeEntries,
	handleApiCall : handleApiCall
};