var mongoose = require("mongoose");
var Product = require("./models/product");
var Comment = require("./models/comment");

var data = [{
        name: "MacBook Pro",
        image: "https://img.ksp.co.il/item/193727/b_1.jpg?v=5",
        price: 1000,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Xiaomi Redmi Note 11",
        image: "https://img.ksp.co.il/item/195337/b_1.jpg?v=5",
        price: 500,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Acer Predator Helios 300",
        image: "https://d3m9l0v76dty0.cloudfront.net/system/photos/7990729/large/d31ed6bce0fce9959ceb12a4f74c1064.jpg",
        price: 800,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB() {

    const db = mongoose.connection;
    db.collection("promoCodes").insertOne({
        "id": "1",
        "promoCode": "3XCRt",
        "description": ["10% discount"],
    });

    db.collection("promoCodes").insertOne({
        "id": "2",
        "promoCode": "4DFG",
        "description": ["My desc"],
    });

    db.collection("promoCodes").insertOne({
        "id": "3",
        "promoCode": "6DSQW",
        "description": ["My new description"],
    });

    // //Remove all products
    // Product.deleteMany({}, function(err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log("removed products!");
    //     Comment.deleteMany({}, function(err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log("removed comments!");
    //         //add a few products
    //         data.forEach(function(seed) {
    //             Product.create(seed, function(err, product) {
    //                 if (err) {
    //                     console.log(err)
    //                 } else {
    //                     console.log("added a product");
    //                     //create a comment
    //                     Comment.create({
    //                         text: "This product is great, but I wish it was cheaper",
    //                         author: "Homer"
    //                     }, function(err, comment) {
    //                         if (err) {
    //                             console.log(err);
    //                         } else {
    //                             product.comments.push(comment);
    //                             product.save();
    //                             console.log("Created new comment");
    //                         }
    //                     });
    //                 }
    //             });
    //         });
    //     });
    // });
}

module.exports = seedDB;