const express = require('express');
const axios = require('axios');
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

public_users.get('/', async function (req, res) {
    try {
        const booksList = await axios.get('http://localhost:3000/api/books');
        return res.status(200).json({ books: booksList.data });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books list" });
    }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params;
    try {
        const bookDetail = await axios.get(`http://localhost:3000/api/book/${isbn}`);
        return res.status(200).json({ book: bookDetail.data });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params;
    try {
        const booksByAuthor = await axios.get(`http://localhost:3000/api/author/${author}`);
        return res.status(200).json({ books: booksByAuthor.data });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;
    try {
        const booksByTitle = await axios.get(`http://localhost:3000/api/title/${title}`);
        return res.status(200).json({ books: booksByTitle.data });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

public_users.get('/review/:isbn', async function (req, res) {
    const { isbn } = req.params;
    try {
        const bookReviews = await axios.get(`http://localhost:3000/api/review/${isbn}`);
        return res.status(200).json({ reviews: bookReviews.data });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book reviews" });
    }
});

module.exports.general = public_users;
