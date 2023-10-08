const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const floorSchema = new Schema({
  name: String
});
const floor = mongoose.model('Floor', floorSchema);
module.exports = floor;