var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	//post categories - or rather types. grab from the admin console.
	var hot = '5603ccd1c76d43f64cdfb8e2';
	var headline = '560525db32be16ec52c7fe09';
	var top3 = '560536921f4ef90953b4a1e7';
	var textarticle = '56054db2429768e556442ce6';
	var featurelink = '560f549c821e1b6d2b1589a0';
	var unlisted = '560fea99754d026b11321dc2';

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'a';
	locals.headline = 'Site headline';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: [],
		topics: [],
		hot: [],
	};
	
	// Load the current post
	view.on('get', function(next) {
		keystone.list('PostTopic').model.find().exec(function(err, results) { 
			// when topics gets too many, gonna have to limit the low importance ones & sort by date.
			results.forEach(function (result) {
				if (!result.icons) result.icons = 'none';
			});
			locals.data.topics = results; 		
			});
		keystone.list('Post').model.find()
			.where('state','published')
			.where('slug').nin([locals.filters.post])
			.where('categories').nin([unlisted])
			.sort('-views').limit('5')
			.exec(function(err, results) {
			locals.data.hot = results; });
		keystone.list('Post').model.find().where('categories').in([featurelink])
			.where('state','published')
			.sort('-views').limit('4')
			.exec(function(err, results) {
			locals.data.featurelink = results; });
		keystone.list('Post').model.find().where('categories').in([headline])
			.where('state','published')
			.sort('-publishedDate').exec(function(err, results) {
			locals.headline = results[0].title; });
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author topics categories');
		q.exec(function(err, result) {
			if (result) { //uh, i added this. whole section could use some major optimization.
			result.content.brief=result.content.brief.replace(/&lt;/g,'<');
			result.content.brief=result.content.brief.replace(/&gt;/g,'>');
			result.content.extended=result.content.extended.replace(/&lt;/g,'<');
			result.content.extended=result.content.extended.replace(/&gt;/g,'>');
			result.views = result.views + Math.floor(Math.random() * 5) + 1  ;
			result.save(function(err) { });
			result.content.extended=result.content.extended.replace(/<img src="(?!http)/g, '<img src="http://localhost:3000/uploads/');
			result.content.brief=result.content.brief.replace(/<img src="(?!http)/g, '<img src="http://localhost:3000/uploads/');
			locals.data.post = result;
			
			}
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
	
};
