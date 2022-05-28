var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    id: String,
    username: String,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    promoCode: String,
    phoneNumber: String,
    country: String,
    city: String,
    street: String,
    zipCode: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);