module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface
    return queryInterface.createTable("coupon",
    {
        coupon_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        media_product_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"media_product_id",
                model: "media_product",
                as: "media_product_id",
            }
        },
        commerce_type_id: {
            allowNull: true,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"commerce_type_id",
                model: "commerce_type",
                as: "commerce_type_id",
            }
        },
        consummer_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"consummer_id",
                model: "consummer",
                as: "consummer_id",
            }
        },
        coupon_source: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        coupon_codebar: {
            allowNull: false,
            type: DataTypes.STRING(20)
        },
        coupon_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        coupon_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        coupon_expire: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        coupon_redimed: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        coupon_host: {
            allowNull: true,
            type: DataTypes.CHAR(20),
        },
        coupon_ip: {
            allowNull: true,
            type: DataTypes.CHAR(20),
        },
        coupon_latitude: {
            allowNull: true,
            type: DataTypes.FLOAT,
            defaultValue: 0.000000
        },
        coupon_longitude: {
            allowNull: true,
            type: DataTypes.FLOAT,
            defaultValue: 0.000000
        },
        coupon_device: {
            allowNull: true,
            type: DataTypes.CHAR(20),
        },
        coupon_redimed_file: {
            allowNull: true,
            type: DataTypes.STRING(500),
        },

    },
    {
        charset: "utf8"
    }
    ).then(() => {
        return queryInterface.sequelize.query(`ALTER TABLE coupon ADD UNIQUE INDEX coupon_codebar (coupon_codebar)`);
    })

};
