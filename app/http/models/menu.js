const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const menuSchema = new Schema({
  name: { type: String, required: true, },
  image: { type: String, required: true, },
  price: { type: Number, required: true, },
  status: { type: String, required: true, },
  slug:{type:String, slug:"name", unique:true, slug_padding_size:2}
});

module.exports = mongoose.model('Menu', menuSchema)
