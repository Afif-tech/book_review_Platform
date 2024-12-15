const { DataTypes } = require("sequelize");
const { bookmodel } = require("./books");


const ratingModel = (db) => {
    return db.define("Rating", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        rating: {
            type: DataTypes.FLOAT,
        }
    }, {
        foreignKey : {
            name: 'bookId',
            allowNull: false,
            references: {
                model: bookmodel,
                key: 'id'
            }
        }
    })
}

module.exports = { ratingModel };