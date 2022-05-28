var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var promoSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    promoCode: { type: String, unique: true },
    description: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Promo", promoSchema);