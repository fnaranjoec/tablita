module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("rol_user",
    {
        rol_user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        rol_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"rol_id",
                model: "rol",
                as: "rol_id",
            }
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
        rol_user_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        rol_user_created: {
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
