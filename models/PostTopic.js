var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PostCategory Model
 * ==================
 */

var PostTopic = new keystone.List('PostTopic', {
	autokey: { from: 'name', path: 'key', unique: true }
});

PostTopic.add({
	name: { type: String, required: true },
	importance: { type: Types.Select, options: 'low, medium, high', default: 'low'},
	icons: { type: String, required: false },
});

PostTopic.relationship({ ref: 'Post', path: 'topics' });

PostTopic.register();
