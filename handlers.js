var request = require('superagent'),
	cheerio = require('cheerio');

var url = "http://www.manchester.gov.uk/bincollections";

function uprnselect(uprn, callback) {
	request
		.post(url)
		.send("uprnselect=" + uprn)
		.end(function(e, r){
			var $doc = cheerio.load(r.text),
				$collection = $doc("div.collection");
			callback($doc)
			// console.log($collection);
		});
}

module.exports = {
	index: function(req, res) {
		res.render('index', {'title': 'Start'})
	},
	get: function(req, res) {
		if (isNaN(parseInt(req.params.id))) {
			res.redirect('/');
		}
		var query = req.query.query;

		uprnselect(req.params.id, function($doc){
			res.render('get', {
				collection: $doc.html('div.collection'),
				collection_for: $doc('h3').first().text(),
				title: 'Collection',
				return_to_query: query
			});
		});
	},
	find: function(req, res) {
		var query = typeof(req.query.query) === 'undefined' ? req.params.query : req.query.query;
		request
			.post(url)
			.send("pcorstreet=" + query)
			.end(function(e, r){
				var $doc = cheerio.load(r.text);

				debugger;
				if ($doc("p.errormessage").length > 0) {
					return res.render('get', {error: true, title: 'Error'});
				}
				
				var $uprnselect = $doc('#uprnselect'),
					uprns = $uprnselect.find('option').map(function(i, el) {
						return {
							id: $doc(el).attr('value'),
							name: $doc(el).text().trim()
						}
					}).get();
					uprnselect(uprns[0].id, function($doc){
						res.render('get', {
							uprns: uprns, 
							query: query,
							collection: $doc.html('div.collection'),
							title: 'Collection'
						});
					});
			});
	},
	about: function(req, res) {
		res.render('about', {'title': 'About'})
	}
}
