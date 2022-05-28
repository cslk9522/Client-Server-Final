var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Product = require("./models/product"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    productRoutes = require("./routes/products"),
    indexRoutes = require("./routes/index");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


// --------------- Localhost DB connection ---------------
// mongoose.connect('mongodb://localhost:27017/MyTechDB', {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// });

// --------------- Connect to Online DB ---------------
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb+srv://client_server:158613963@cluster0.bu0jf.mongodb.net/MyTechDB?retryWrites=true&w=majority", { dbname: "MyTechDB" }, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("ERROR:", err.message);
});


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is just a simple secret",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// requiring routes
app.use(indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments", commentRoutes);

app.get('*', function(req, res) {
    res.status(404).send("<h1>Error 404! <br> Page not found on the server</h1>");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("The MyTech Server Has Started!");
});