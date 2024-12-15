const { DataTypes } = require("sequelize");
const { bookmodel } = require("./books");

const reviewModel = (db) => {
    return db.define("Review", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        review: {
            type: DataTypes.STRING(12000),
            allowNull: false,
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

module.exports = { reviewModel };