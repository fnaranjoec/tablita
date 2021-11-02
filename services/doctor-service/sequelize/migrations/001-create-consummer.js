module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("consummer",
    {
        consummer_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        consummer_name: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        consummer_email: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        consummer_identification: {
            allowNull: false,
            type: DataTypes.CHAR(20)
        },
        consummer_phone: {
            allowNull: false,
            type: DataTypes.CHAR(20)
        },
        consummer_city: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        consummer_dob: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        consummer_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        consummer_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },

    },
    {
        charset: "utf8"
    }
    ).then(() => {
        return queryInterface.sequelize.query(`ALTER TABLE consummer ADD UNIQUE INDEX consummer_identification (consummer_identification)`);
    })

};
