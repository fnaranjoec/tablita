module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.createTable("media",
    {
        media_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        category_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"category_id",
                model: "category",
                as: "category_id",
            }
        },
        media_name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        media_desc: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        media_slug: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        media_picture: {
            allowNull: false,
            type: DataTypes.STRING(500),
        },
        media_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        media_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        charset: "utf8"
    }
    ).then(() => {
        // return queryInterface.sequelize.query(`ALTER TABLE media ADD UNIQUE INDEX media_name (category_id, media_name)`);
    })

};
