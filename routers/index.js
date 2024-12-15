const express = require('express');
const router = express.Router();
const bookRouter = require("./bookRouter");
const { Book, db } = require('../models');

//render main page
router.get("/", async (req, res) => {
    try {
        // Assuming db.query returns an array of rows as the second element of the result tuple
        const [books] = await db.query('SELECT * FROM books');
        console.log("Books fetched from DB:", books);
        res.render('index', { books });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.use("/", bookRouter);


module.exports = router;