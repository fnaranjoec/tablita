module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("product",
    {
        product_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        brand_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"brand_id",
                model: "brand",
                as: "brand_id",
            }
        },
        product_name: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        product_slug: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        product_desc: {
            type: DataTypes.TEXT
        },
        product_picture: {
            allowNull: false,
            type: DataTypes.STRING(500),
        },
        product_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        product_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        product_sku: {
            allowNull: false,
            type: DataTypes.STRING(50),
        },
    },
    {
        charset: "utf8"
    }
    ).then(() => {
        // return queryInterface.sequelize.query(`ALTER TABLE product ADD UNIQUE INDEX product_name (brand_id, product_name)`);
    })

};
