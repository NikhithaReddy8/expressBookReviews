const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = { username, password };
    users.push(newUser);

    return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', function (req, res) {
    const booksList = JSON.stringify(books, null, 2);
    return res.status(200).json({ books: booksList });
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
