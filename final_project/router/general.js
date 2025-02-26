const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Push a new user object into the users array based on query parameters from the request
  users.push({
    "username": req.body.username,
    "password": req.body.password
  });
  // Send a success message as the response, indicating the user has been added
  res.send("The user " + req.query.username + " has been added!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.id;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const booksByAuthor = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).send('No books found by this author');
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleName = req.params.title;
  const booksByTitle = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === titleName.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).send('No books found by this title');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.id;
  const book = books[isbn]; // Assuming 'books' is your data object

  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).send('Reviews not found for this ISBN');
  }
});

module.exports.general = public_users;
