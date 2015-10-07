var keystone = require('keystone');
var Submission = keystone.list('Submission');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'submit';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.data = {post: {title: 'Interesting every day', content: {brief: ''}, image: {url: 'http://localhost:3000/images/logo.png'} }};
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'submit' }, function(next) {
		
		var newSubmission = new Submission.model(),
			updater = newSubmission.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, message',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});
	
	view.render('submit');
	
};
