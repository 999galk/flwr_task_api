const handleUnclosedCalls = (db) => {
	db.select('sess').from('sessions').then(data => {
    	data.forEach(se => {
    		if(se.sess.status){
    			if((se.sess.status === 'saved_successfully') && se.sess.urlId){
					store.get(se.sess.sid, () => {
						db.select('url').from('entries').where('id', '=', se.sess.urlId[0]).then(data => {
    						request.post('https://blooming-scrubland-26588.herokuapp.com/image', {
		                      json: {
		                        "input" : data[0].url
		                      }
		                    }, (error, res, body) => {
		                      if (error) {
		                        console.error(error);
		                        return
		                      }
		                      console.log('clarifai resonse for session after startup:', body);
		                    })
    					});
					})

    			}
    		}
    	})

    })
}

module.exports = {
	handleUnclosedCalls : handleUnclosedCalls
};