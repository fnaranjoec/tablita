module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("user",
    {
        user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        user_name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        user_email: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        user_phone: {
            allowNull: false,
            unique: true,
            type: DataTypes.CHAR(20)
        },
        user_password: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        user_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        user_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        charset: "utf8"
    }
    )

};

module.exports.down = (queryInterface, ) => {
    queryInterface.dropTable("session");
};
