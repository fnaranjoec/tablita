import {DataTypes, Model, Sequelize} from "sequelize";
import sequelize from "./connection";


// ********************************************* CATEGORY **************************************
export class CategoryModel extends Model {}
CategoryModel.init(
    {
        category_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        category_name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        category_slug: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        category_desc: {
            allowNull: false,
            type: DataTypes.TEXT()
        },
        category_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        category_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        modelName: "category",
        tableName: "category",
        timestamps: true,
        createdAt: 'category_created',
        updatedAt: false,
        sequelize
    }
);


// ********************************************* MEDIA **************************************
export class MediaModel extends Model {}
MediaModel.init(
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
            type: DataTypes.STRING(100),
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
        modelName: "media",
        tableName: "media",
        timestamps: true,
        createdAt: 'media_created',
        updatedAt: false,
        sequelize
    }
);



// ************************************************ RELATIONS ************************************
CategoryModel.hasMany(MediaModel,{
    foreignKey: "category_id",
});

MediaModel.belongsTo(CategoryModel, {
    foreignKey: 'category_id'
});

