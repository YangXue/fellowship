var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
	name: String,
	userName: {type: String, required: true, unique: true},
	password:{type: String, required: true},
	email:String,
	occupation: String,
	admin: Boolean,
	selfDiscription: String,
});

var User = mongoose.model('User',userSchema);

module.exports = User;