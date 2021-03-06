var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/?', routes.views.index); // should have a q mark after /, at least the previous zig one did.
	app.get('/a/:category?', routes.views.a);
	app.post('/a/', routes.views.a);
	app.get('/a/post/:post', routes.views.post);
	app.all('/submit', routes.views.submit);
	app.all('/contact', routes.views.contact);
	app.all('/contributor', routes.views.contributor);
	app.all('/contributor/:name', routes.views.contributor);
	app.all('/redirect/:url', routes.views.redirect);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
