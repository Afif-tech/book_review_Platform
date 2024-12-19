require('dotenv').config();
const express = require("express");
const router = require("./routers/index");
const path = require('path');
const { db } = require('./models');
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use("/books", router);
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/books`)
    db.sync();
})