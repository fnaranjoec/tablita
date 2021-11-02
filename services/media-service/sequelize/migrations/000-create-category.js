module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("category",
    {
        category_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        category_name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        category_slug: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        category_desc: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        category_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        category_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        charset: "utf8"
    }
    ).then(() => {
        // return queryInterface.sequelize.query(`ALTER TABLE category ADD UNIQUE INDEX category_name (category_name)`);
    })

};
