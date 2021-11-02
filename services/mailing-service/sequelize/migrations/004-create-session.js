module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("session",
    {
        session_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        user_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"user_id",
                model: "user",
                as: "user_id",
            }
        },
        session_access_token: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        session_refresh_token: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        session_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        session_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        session_expire: {
            allowNull: true,
            type: DataTypes.DATE,
        }
    },
    {
        charset: "utf8"
    }
    )

}