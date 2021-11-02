module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("customer",
    {
        customer_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        rol_user_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"rol_user_id",
                model: "rol_user",
                as: "rol_user_id",
            }
        },
        customer_name: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        customer_address: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        customer_phone: {
            allowNull: false,
            type: DataTypes.CHAR(20)
        },
        customer_email: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        customer_picture: {
            allowNull: false,
            type: DataTypes.STRING(500)
        },
        customer_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        customer_created: {
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

