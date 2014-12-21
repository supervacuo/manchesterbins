var handlers = require('./handlers');

module.exports=function(app) {
	app.get('/', handlers.index);
	app.get('/id/:id', handlers.get);
	app.get('/find/:query', handlers.find);
	app.get('/find/', handlers.find);  // for param (?) searches
	app.get('/about', handlers.about);
}
