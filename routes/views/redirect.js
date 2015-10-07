var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var to = req.params.url.replace(/\\/g,'/');
	res.redirect(to);

};
