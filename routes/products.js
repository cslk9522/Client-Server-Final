var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - Show All Products
router.get("/", function(req, res) {
    //Get all products from DB
    Product.find({}, function(err, allProducts) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/index", { products: allProducts, page: 'products' });
        }
    });
});

//CREATE - Add New Product to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newProduct = { name: name, image: image, price: price, description: desc, author: author };
    //Create a new product and save to DB
    Product.create(newProduct, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //Redirect to products page
            res.redirect("/products");
        }
    });
});

//NEW - Show Form To Create New Product
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("products/new");
});

//SHOW - Shows More Info About One Product
router.get("/:id", function(req, res) {
    //find the product with provided ID
    Product.findById(req.params.id).populate("comments").exec(function(err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that product
            res.render("products/show", { product: foundProduct });
        }
    });
});

//EDIT PRODUCT ROUTE
router.get("/:id/edit", middleware.checkProductOwnership, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        res.render("products/edit", { product: foundProduct });
    });
});


//UPDATE PRODUCT ROUTE
router.put("/:id", middleware.checkProductOwnership, function(req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct) {
        if (err) {
            res.redirect("/products");
        } else {
            res.redirect("/products/" + req.params.id);
        }
    });
});

//DESTROY PRODUCT
router.delete("/:id", middleware.checkProductOwnership, (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, productRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({ _id: { $in: productRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/products");
        });
    });
});

module.exports = router;