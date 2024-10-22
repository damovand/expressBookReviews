const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented 1"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 // return res.status(300).json({message: "Yet to be implemented 2"});
  //res.send(JSON.stringify({books}, null, 4));
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
   let isbn = parseInt(req.params.isbn);
       // Filter the users array to find users whose lastName matches the extracted lastName parameter
    isbn-=1
    let booklist = Object.values(books);
    let the_book = booklist[isbn]
    //const the_book = the_key.values;
        // Send the filtered_lastname array as the response to the client
    res.send(the_book);

    //return res.status(300).json({message: "Yet to be implemented 3 ", the_book });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
  // Filter the users array to find users whose lastName matches the extracted lastName parameter
  let booklist = Object.values(books);
  const the_book = booklist.find(item=>item.author === author)
    // Send the filtered_lastname array as the response to the client
  res.send(the_book);
  //return res.status(300).json({message: "Yet to be implemented 4 ", the_book });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented 5"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented 6"});
});

module.exports.general = public_users;
