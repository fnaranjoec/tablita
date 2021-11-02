module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("rol",
    {
        rol_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        rol_name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        rol_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        rol_created: {
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
