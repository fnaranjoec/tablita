module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("media_product",
    {
        media_product_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        code_type_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"code_type_id",
                model: "code_type",
                as: "code_type_id",
            }
        },
        media_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"media_id",
                model: "media",
                as: "media_id",
            }
        },
        product_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"product_id",
                model: "product",
                as: "product_id",
            }
        },
        media_product_desc: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        media_product_code: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        media_product_picture: {
            allowNull: false,
            type: DataTypes.STRING(500),
        },
        media_product_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        media_product_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        media_product_expire: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        media_product_descto: {
            allowNull: false,
            defaultValue: 0,
            type: DataTypes.FLOAT
        },
    },
    {
        charset: "utf8"
    }
    ).then(() => {
        // return queryInterface.sequelize.query(`ALTER TABLE media_product ADD UNIQUE INDEX media_product_code (media_product_code)`);
    })

};
