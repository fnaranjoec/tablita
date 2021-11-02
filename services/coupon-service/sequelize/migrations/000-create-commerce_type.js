module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("commerce_type",
    {
        commerce_type_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        commerce_type_name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        commerce_type_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        commerce_type_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        charset: "utf8"
    }
    ).then(() => {
        // return queryInterface.sequelize.query(`ALTER TABLE commerce_type ADD UNIQUE INDEX commerce_type_name (commerce_type_name)`);
    })

};
