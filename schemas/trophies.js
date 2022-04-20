const mongoose = require("mongoose")

const trophiesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: String,
    password: String,
    trophies: {type: Number, default: 100}
})

module.exports = mongoose.model("Trophy", trophiesSchema, "trophies")