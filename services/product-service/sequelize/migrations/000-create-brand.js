module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("brand",
    {
        brand_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        customer_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"customer_id",
                model: "customer",
                as: "customer_id",
            }
        },
        brand_name: {
            allowNull: false,
            type: DataTypes.STRING(150)
        },
        brand_slug: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        brand_desc: {
            type: DataTypes.TEXT
        },
        brand_prefix: {
            allowNull: false,
            type: DataTypes.CHAR(10)
        },
        brand_picture: {
            allowNull: false,
            type: DataTypes.STRING(500),
        },
        brand_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        brand_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        charset: "utf8"
    }
    ).then(() => {
        // return queryInterface.sequelize.query(`ALTER TABLE brand ADD UNIQUE INDEX brand_name (customer_id, brand_name)`);
    })

};

