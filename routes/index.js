var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var nodemailer = require("nodemailer");
var request = require("request");

// Root Route
router.get("/", function(req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
    res.render("register", { page: 'register' });
});

// handle sign up logic
router.post("/register", function(req, res) {
    // -------------------------- RECAPTCHA --------------------------

    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.flash("error", "Failed reCAPTCHA Verification");
        res.redirect("/register");
    }
    // Put your secret key here.
    var secretKey = "6LdZaN8fAAAAAIzrSfh2TuwZe6TiAfdcON9-TKhX";
    // req.socket.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.socket.remoteAddress;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, function(error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            req.flash("error", "Failed reCAPTCHA Verification");
            res.redirect("/register");
        }

        if (req.body.password !== req.body.repeatpass) {
            req.flash("error", "Passwords Do Not Match!")
            res.redirect("/register");
        } else {
            var newUser = new User({
                username: req.body.username,
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                promoCode: req.body.promocode
            });

            // mailSend(req, "Account Creation", "Welcome To MyTech! Please follow the link to confirm your account:\n localhost:3000/confirm?username=" + req.body.username + "&password=" + req.body.password + "&firstname=" + req.body.firstname + "&lastname=" + req.body.lastname + "&email=" + req.body.email + "&promocode=" + req.body.promoCode);

            mailSend(req, "Account Creation", "Welcome To MyTech!");
            User.register(newUser, req.body.password, function(err, user) {
                if (err) {
                    console.log(err);
                    res.redirect("/register", { error: err.message });
                } else {
                    passport.authenticate("local")(req, res, function() {
                        // req.flash("success", "Confirmation Email Sent!");
                        req.flash("success", "Welcome to MyTech " + user.username);
                        res.redirect("/products");
                    });
                }
            });
        }
    });
    // -------------------------- RECAPTCHA --------------------------
});

// router.get("/confirm", function(req, res) {
//     // if (!req.params.username || !req.params.firstname || !req.params.lastname || !req.params.email || !req.params.password) {
//     //     req.flash("error", "Something went wrong...");
//     //     res.redirect("/register");
//     // }
//     var newUser = new User({
//         username: req.params.username,
//         firstName: req.params.firstname,
//         lastName: req.params.lastname,
//         email: req.params.email,
//         promoCode: req.params.promocode
//     });
//     User.register(newUser, req.params.password, function(err, user) {
//         if (err) {
//             console.log(err);
//             return res.render("register", { error: err.message });
//         }
//         passport.authenticate("local")(req, res, function() {
//             req.flash("success", "Welcome to MyTech " + user.username);
//             res.redirect("/products");
//         });
//     });
// });

// show login routes
router.get("/login", function(req, res) {
    res.render("login", { page: 'login' });
});

// handling login logic
router.post("/login", function(req, res, next) {
        // -------------------------- RECAPTCHA --------------------------

        // g-recaptcha-response is the key that browser will generate upon form submit.
        // if its blank or null means user has not selected the captcha, so return the error.
        if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            req.flash("error", "Failed reCAPTCHA Verification");
            res.redirect("/login");
        }
        // Put your secret key here.
        var secretKey = "6LdZaN8fAAAAAIzrSfh2TuwZe6TiAfdcON9-TKhX";
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.socket.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl, function(error, response, body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if (body.success !== undefined && !body.success) {
                req.flash("error", "Failed reCAPTCHA Verification");
                res.redirect("/login");
            }
            return next();
        });

        // -------------------------- RECAPTCHA --------------------------
    },
    passport.authenticate("local", {
        successRedirect: "/products",
        failureRedirect: "/login"
    }));

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/products");
});

// forgot password route
router.get("/forgot-password", function(req, res) {
    res.render("forgotPassword", { page: 'forgotPassword' });
});

// forgot password logic
router.post("/forgot-password", function(req, res) {
    // -------------------------- RECAPTCHA --------------------------

    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.flash("error", "Failed reCAPTCHA Verification");
        res.redirect("/forgot-password");
    }
    // Put your secret key here.
    var secretKey = "6LdZaN8fAAAAAIzrSfh2TuwZe6TiAfdcON9-TKhX";
    // req.socket.remoteAddress will provide IP address of connected user.
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.socket.remoteAddress;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, function(error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            req.flash("error", "Failed reCAPTCHA Verification");
            res.redirect("/forgot-password");
        }
        mailSend(req, "Password Reset", "Your Password has been reset to new123. Please log into your account and change it.");

        User.findOne({ email: req.body.email }, (err, user) => {
            // Check if error connecting
            if (err) {
                req.flash("error", err);
                res.redirect("/forgot-password");
            } else {
                // Check if user was found in database
                if (!user) {
                    req.flash("error", "User not found"); // Return error, user was not found in db
                    res.redirect("/forgot-password");
                } else {
                    var password = "new123"
                    user.setPassword(password, function(err) {
                        if (err) {
                            req.flash("error", "Something went wrong! Please try again after sometime");
                            res.redirect("/forgot-password");
                        } else {
                            user.save();
                            req.flash("success", "Your password has been set to new123. Please log into your account and change it.");
                            res.redirect("/login");
                        }
                    });
                }
            }
        });
    });

    // -------------------------- RECAPTCHA --------------------------
});

// forgot password route
router.get("/reset-password", function(req, res) {
    res.render("resetPassword", { page: 'resetPassword' });
});

//router.post("/reset-password",)

// profile route
router.get("/profile", function(req, res) {
    if (!req.isAuthenticated()) {
        req.flash("error", "Must Be Logged In To Do That!");
        res.redirect("/login");
    } else {
        res.render("profile", { page: 'profile' });
    }
});

// update password logic
router.post("/update-password", middleware.isLoggedIn, function(req, res) {
    if (!req.isAuthenticated()) {
        req.flash("error", "Must Be Logged In To Do That!");
        res.redirect("/login");
    }
    if (req.body.newpass !== req.body.repeatpass) {
        req.flash("error", "Passwords Must Match!");
        res.redirect("/profile");
    } else {
        User.findOne({ email: req.body.email2 }, (err, user) => {
            // Check if error connecting
            if (err) {
                req.flash("error", err);
                res.redirect("/profile");
            } else {
                // Check if user was found in database
                if (!user) {
                    req.flash("error", "User not found"); // Return error, user was not found in db
                    res.redirect("/profile");
                } else {
                    user.changePassword(req.body.oldpass, req.body.newpass, function(err) {
                        if (err) {
                            if (err.name === 'IncorrectPasswordError') {
                                req.flash("error", "Incorrect password"); // Return error
                                res.redirect("/profile");
                            } else {
                                req.flash("error", "Something went wrong! Please try again after sometime");
                                res.redirect("/profile");
                            }
                        } else {
                            req.flash("success", "Your password has been changed successfully");
                            res.redirect("/profile");
                        }
                    });
                }
            }
        });
    }
});

// update profile route
router.put("/update-details", middleware.isLoggedIn, function(req, res) {
    User.findOneAndUpdate({ email: req.body.email }, { $set: { firstName: req.body.firstname, lastName: req.body.lastname, phoneNumber: req.body.phone, country: req.body.country, city: req.body.city, street: req.body.street, zipCode: req.body.zip } }, { new: true }, function(err, user) {
        if (err) {
            req.flash("error", "Something Went Wrong...");
            res.redirect("back");
        } else {
            req.flash("success", "Profile Details Changed Successfully!");
            res.redirect("/profile");
        }
    });
});

// about route
router.get("/about", function(req, res) {
    if (!req.isAuthenticated()) {
        req.flash("error", "Must Be Logged In To Do That!");
        res.redirect("login");
    } else {
        res.render("about", { page: 'about' });
    }
});

function mailSend(req, subject, msg) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cslk9522@gmail.com',
            pass: 'CSlk2022'
        }
    });

    var mailOptions = {
        from: 'cslk9522@gmail.com',
        to: req.body.email,
        subject: subject,
        text: msg
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;