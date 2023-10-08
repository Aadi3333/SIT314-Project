const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lightSchema = new Schema({
    name: String,
    room: String,
    floor: String,
    state: Boolean,
    colour: String,
    brightness: Number
});

const light = mongoose.model('Light', lightSchema);
module.exports = light;