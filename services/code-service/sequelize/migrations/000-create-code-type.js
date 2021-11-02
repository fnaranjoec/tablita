module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("code_type",
    {
        code_type_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        code_type_name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        code_type_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        code_type_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        charset: "utf8"
    }
    ).then(() => {
        // return queryInterface.sequelize.query(`ALTER TABLE code_type ADD UNIQUE INDEX code_type_name (code_type_name)`);
    })

};
