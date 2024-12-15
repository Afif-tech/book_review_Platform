const { DataTypes } = require("sequelize");

const bookmodel = (db) => {
    return db.define("Book", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        bookName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(12000),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING(45),
            allowNull: false,
        }
    })
}

module.exports = { bookmodel };