const { Router } = require("express");
const multer = require('multer');
const upload = multer().none();
const { Book, Rating, Review } = require("../models");

const router = Router();

// Create new book
router.route("/add").post( upload, async (req, res) => {   
    try {
        console.log(req.body);
        const book = new Book({
            bookName: req.body.bookName,
            description: req.body.description,
            image: req.body.image,
            author: req.body.author
        });

        await book.save();
        req.session.message = {
            type: 'success',
            message: 'User added successfully!',
        };
        res.redirect("/books")
    } catch (err) {
        res.json({ message: err.message, type: 'danger'});
    }
});

// render add book page
router.route("/add").get( (req, res) => {
    res.render("add_book");
})

// View book by ID
router.route("/:id").get(async (req, res) => {
    console.log(`Fetching book with ID: ${req.params.id}`);
    const id = req.params.id;
  
    try {
      const book = await Book.findByPk(id, {
        include: [{
          model: Rating,
          attributes: ['id', 'rating']
        }, 
        {
          model: Review,
          attributes: ['review']
        }]
      });
  
      if (!book) {
        return res.redirect("/");
      }
      console.log(book)
      // Calculate average rating using Sequelize methods (optional)
      const averageRating = book.Ratings?.length
            ? book.Ratings.reduce((acc, rating) => acc + rating.dataValues.rating, 0) / book.Ratings.length
            : 0;

      const numberOfRatings = await Rating.count({
        where: {bookId: id}
      })
            
      console.log(`Average rating: ${averageRating}`)
      console.log("Ratings:", book.Ratings.map(r => r.dataValues));

      res.render("book", {
        book,
        averageRating,
        numberOfRatings
      });
    } catch (err) {
      console.error(err);
      res.redirect("/");
    }
});

// Post Ratings
// router.route("/:id").post( async (req, res) => {
//     const bookId = req.body.bookId;
//     const rating = req.body.rating;
  
//     try {
//       await pool.query('INSERT INTO ratings (book_id, rating) VALUES (?, ?)', [bookId, rating]);
//       res.redirect(`/books/${bookId}`); // Redirect to specific book page
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error rating book');
//     }
// });

// Post Ratings
router.route("/:id/ratings").post(async (req, res) => {
    const { rating } = req.body;
    const bookId = req.params.id;

    try {
        // Use Sequelize ORM to insert a new rating
        await Rating.create({ bookId, rating });

        // Redirect to the book's page
        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rating book');
    }
});

// Add comment
router.route("/:id/reviews").post(async (req, res) => {
    const { review } = req.body;
    const bookId = req.params.id;

    try {
        // Create review and associate it with the book
        await Review.create({
            review,
            bookId, // Include the bookId to establish the association
        });

        req.session.message = {
            type: 'success',
            message: 'Comment added!',
        };

        res.redirect(`/books/${bookId}`);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).send("Error adding comment");
    }
});

router.route("/:id/delete").get( async (req, res) => {
    const bookId = req.params.id;

    try {
        await Rating.destroy({ where: { bookId } });
        await Review.destroy({ where: { bookId } });
        
        const book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        await book.destroy();

        req.session.message = {
            type: 'Success',
            message: 'Book deleted'
        }

        res.redirect("/books");
    } catch (error) {
        res.status(500).send('Error deleting the book')
    }
})


module.exports = router;

