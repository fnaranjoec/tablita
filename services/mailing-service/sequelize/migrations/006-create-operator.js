module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("operator",
    {
        operator_id: {
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
        operator_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        operator_created: {
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
