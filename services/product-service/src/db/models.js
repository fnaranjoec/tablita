import {DataTypes, Model, Sequelize} from "sequelize";
import sequelize from "./connection";


// ********************************************* CUSTOMER **************************************
export class CustomerModel extends Model {}
CustomerModel.init(
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
        modelName: "customer",
        tableName: "customer",
        timestamps: true,
        createdAt: 'customer_created',
        updatedAt: false,
        sequelize
    }
);


// ********************************************* BRAND **************************************
export class BrandModel extends Model {}
BrandModel.init(
    {
        brand_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        customer_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"customer_id",
                model: "customer",
                as: "customer_id",
            }
        },
        brand_name: {
            allowNull: false,
            type: DataTypes.STRING(150),
        },
        brand_slug: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        brand_desc: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        brand_prefix: {
            allowNull: false,
            type: DataTypes.CHAR(10),
        },
        brand_picture: {
            allowNull: false,
            type: DataTypes.STRING(500),
        },
        brand_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        brand_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        brand_sequential: {
            allowNull: false,
            type: DataTypes.BIGINT(),
            defaultValue: 0
        },
    },
    {
        modelName: "brand",
        tableName: "brand",
        timestamps: true,
        createdAt: 'brand_created',
        updatedAt: false,
        sequelize
    }
);



// ********************************************* PRODUCT **************************************
export class ProductModel extends Model {}
ProductModel.init(
    {
        product_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        brand_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"brand_id",
                model: "brand",
                as: "brand_id",
            }
        },
        product_name: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        product_slug: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        product_desc: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        product_picture: {
            allowNull: false,
            type: DataTypes.STRING(500),
        },
        product_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        product_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        product_sku: {
            allowNull: false,
            type: DataTypes.STRING(50),
        },

    },
    {
        modelName: "product",
        tableName: "product",
        timestamps: true,
        createdAt: 'product_created',
        updatedAt: false,
        sequelize
    }
);


// ************************************************ RELATIONS ************************************
CustomerModel.hasMany(BrandModel,{
    foreignKey: "customer_id",
});

BrandModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id'
});

BrandModel.hasMany(ProductModel,{
    foreignKey: "brand_id",
});

ProductModel.belongsTo(BrandModel,{
    foreignKey: "brand_id",
});
