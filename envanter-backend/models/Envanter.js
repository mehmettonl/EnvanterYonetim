const mongoose = require("mongoose");

const EnvanterSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  numara: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Envanter", EnvanterSchema);