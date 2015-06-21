var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema ({
	topicTheme: String,
	topicContent: String,
	author: String,
	status: String,
	commingTime: {type: Date, index: true}
})

var Topic = mongoose.model('Topic',topicSchema);

module.exports = Topic;