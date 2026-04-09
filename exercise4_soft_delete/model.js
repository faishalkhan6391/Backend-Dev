const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  isDeleted: { type: Boolean, default: false }
});

schema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

schema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = mongoose.model("Item", schema);
