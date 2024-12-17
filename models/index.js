const { Sequelize } = require("sequelize");
const { bookmodel } = require("./books");
const { ratingModel } = require("./rating");
const { reviewModel } = require("./review");
require("dotenv").config;

const db = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    dialect: "mysql",
});

const Book = bookmodel(db);
const Rating = ratingModel(db);
const Review = reviewModel(db);

Book.hasMany(Rating, { foreignKey: 'bookId', onDelete: 'CASCADE'});
Rating.belongsTo(Book, {foreignKey: 'bookId'});

Book.hasMany(Review, { foreignKey: 'bookId', onDelete: 'CASCADE'});
Review.belongsTo(Book, { foreignKey: 'bookId'});

module.exports = { db, Book, Rating, Review };