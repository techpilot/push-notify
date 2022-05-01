const mongoose = require("mongoose");

const endpointSchema = mongoose.Schema({
  endpoint: { type: String, required: true },
  subscription: { type: Object, required: true },
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

const EndpointModel = mongoose.model("endpoint", endpointSchema);

module.exports = EndpointModel;
