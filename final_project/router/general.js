const express = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const booklist = require('./booksdb.js');
//let books = require("./booksdb.js");

const fs = require('fs').promises; // Use the promise-based version of fs

async function initialize_books() {
    try{
        const data = await fs.readFile('./booksdb.json', 'utf8');
        console.log("=== The loadbooks data < ",data," >")
        return JSON.parse(data);
    }catch (error){
        console.error('Error reading file:', error);
    }   
} 
/*
function loadBooks() {
    fs.readFile('./booksdb.json', 'utf8')
	// Handle the resolved state of the promise
	.then((data) => { 
		// This block will execute if the file is read successfully
	    console.log(" in the then block ",data); 		// Print the file content to the console
        return JSON.parse(data);
    }) 
	
	 // Handle the rejected state of the promise
	.catch((err) => { 
		// This block will execute if there is an error reading the file
	console.error('Error reading file:', err); // Print the error message to the console
	});
}*/
/*
async function initialize() {
    try {
        let promise = await initialize_books(); // Wait for the books to be loaded
        console.log(" In initialize () === ",promise," ===="); // Now you have access to the actual books object
    } catch (error) {
        console.error("Error loading books:", error);
    }
}
*/

//initialize_books();
//console.log(" persisted ",persisted_books); // Now you have access to the actual books object
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (the_username) => {
    console.log("Compare  the existing users  <" ,users,">","<",the_username,">");
    let userswithsamename = users.filter((the_username) => {
        for (let i = 0; i < users.length; i++) {
            console.log("Comparing  <" ,users[i].username,"> with incoming user <",the_username,">");
            if (users[i] === the_username) {
                
                return users[i].username ;
            }
        }
        console.log("  No match found ")
    });
   console.log("userwithsamename <",userswithsamename,">");
  return userswithsamename.length > 0;
};


public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;
    
  if (username ) {
    
    if (!doesExist(username)) {
        console.log ("User <",username, "> doesn't exist ");
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered."} );
    } else {
        console.log ("User <",username, "> doesn't exists ");
      return res.status(404).json({ message: "User already exists! " });
    }
  } 
  return res.status(404).json({message: "Something Went Wrong - Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res){
  //res.send(JSON.stringify({books}, null, 4));
 let persisted_books = initialize_books();
 console.log (" Persisted Books coming out of initialize_books <", persisted_books," >");
 let the_books = Object.values(persisted_books);
 res.send(JSON.stringify({the_books}, null, 4));
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    let isbn = parseInt(req.params.isbn);
       // Filter the users array to find users whose lastName matches the extracted lastName parameter
    isbn-=1;
    //let the_book = books[isbn];
    let the_book = persisted_books[isbn-1];
        // Send the filtered_lastname array as the response to the client
    //console.log ("Books Read from file <",persisted_books,">")
    //console.log("  The Review Found ", the_book);
    res.send(the_book);
    //return res.status(300).json({message: "Yet to be implemented 3 ", the_book });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    console.log("The Object.values === ",Object.values(books)," ===== ");
    const the_author = req.params.author;
     // Filter the users array to find users whose lastName matches the extracted lastName parameter
    const the_book = booklist.find(item=>item.author === the_author);
    console.log (" The Book <",the_book,">");
    res.send(the_book);

  //return res.status(300).json({message: "Yet to be implemented 4 " });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const title = req.params.title;
    const the_book = books.find(item=>item.title === title);
    res.send(the_book);
  //return res.status(300).json({message: "Yet to be implemented 5"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   
    let isbn = parseInt(req.params.isbn);
    console.log(req.params)
  // Filter the users array to find users whose lastName matches the extracted lastName parameter
    isbn -=1;
   // let the_book = booklist[book_index];
    let the_book = books[isbn];
    let the_reviews = the_book.reviews;
    console.log("  The Review Found ", the_reviews );
    res.send(the_reviews);
 // return res.status(300).json({message: "Yet to be implemented 6 ",the_book});
});

module.exports.general = public_users;

