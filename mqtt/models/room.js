const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const roomSchema = new Schema({
	floor: String,
	name: String
});
const room = mongoose.model('Room', roomSchema);
module.exports = room;