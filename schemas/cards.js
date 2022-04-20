const mongoose = require("mongoose")

const cardsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: String,
    password: String,
    cards: {type: Array, default: ["regular", "bomber"]}
})

module.exports = mongoose.model("Card", cardsSchema, "cards")