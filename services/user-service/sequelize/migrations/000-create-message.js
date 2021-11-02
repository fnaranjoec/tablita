module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("message",
    {
        message_id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        message_motor: {
            allowNull: false,
            type: DataTypes.CHAR(100)
        },
        message_errno: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        message_code: {
            allowNull: false,
            type: DataTypes.CHAR(100)
        },
        message_state: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        message_message: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
    },
    {
        charset: "utf8"
    }
    )

};
