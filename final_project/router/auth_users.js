const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { body } = require("express/lib/request");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsameusername = users.filter((user) => {
    return user.username === username;
  });

  return userswithsameusername.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body.user;
  if (!user) {
    return res.status(404).json({ message: "Unable to find user" });
  }
  // Generate JWT access token
  let accessToken = jwt.sign({
    data: user
  }, 'access', { expiresIn: 60 * 60 });
  // Store access token in session
  req.session.authorization = {
    accessToken
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.params.review;
  let user = users[review];
  if (user) {
    let review  = req.body.reviews;

    if (review) {
      user["review"] = review;
    }

    users[review] = user;
    res.send(`User with the review ${review} was updated.`);
  } else {
    res.send("Unable to review!");
  }
});

// delete book reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const review = req.params.review;

  if (review) {
  users = users.filter((user) => user.review !== review);

    res.send(`User with the review ${review} was deleted.`);
  } else {
    res.send("Unable to delete review!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
