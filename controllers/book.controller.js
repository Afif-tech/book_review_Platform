const asyncHandler = require("express-async-handler");

const addBook = asyncHandler(async (req, res) => {
    
    try {
        const book = new Book({
            bookName: req.body.bookName,
            description: req.body.description,
            image: req.body.image,
            author: req.body.author
        });

        await book.save();
        req.message = 'Book added successfully!';
        res.redirect("/")
    } catch (err) {
        res.json({ message: err.message, type: 'danger'});
    }
});

module.exports = { addBook };
