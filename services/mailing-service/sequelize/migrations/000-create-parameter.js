module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("parameter",
    {
        parameter_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        parameter_name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(255)
        },
        parameter_desc: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        parameter_value: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00
        },
        parameter_text: {
            type: DataTypes.TEXT,
            defaultValue: ""
        },
        parameter_created: {
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
