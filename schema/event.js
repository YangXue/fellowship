var mongoose = require('mongoose');
var schema = mongoose.Schema;

var eventSchema = new schema({
	eventTitle: {type: String, required: true},
	type: String,
	owner: {type: String, required: true},
	support: Number,
	comments: Object,
	details: Object,
	status: String,
	image: Array,
	createTime: {type: Date, index: true}
});

var Event = mongoose.model('Event',eventSchema);

module.exports = Event;