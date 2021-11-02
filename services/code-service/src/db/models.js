import {DataTypes, Model, QueryTypes , Sequelize} from "sequelize";
import sequelize from "./connection";


// ********************************************* CODE_TYPE **************************************
export class CodeTypeModel extends Model {}
CodeTypeModel.init(
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
        modelName: "code_type",
        tableName: "code_type",
        timestamps: true,
        createdAt: 'code_type_created',
        updatedAt: false,
        sequelize
    }
);


// ********************************************* MEDIA_PRODUCT **************************************
export class MediaProductModel extends Model {}
MediaProductModel.init(
    {
        media_product_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        code_type_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"code_type_id",
                model: "code_type",
                as: "code_type_id",
            }
        },
        media_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"media_id",
                model: "media",
                as: "media_id",
            }
        },
        product_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"product_id",
                model: "product",
                as: "product_id",
            }
        },
        media_product_desc: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        media_product_code: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        media_product_picture: {
            allowNull: false,
            type: DataTypes.STRING(500),
        },
        media_product_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        media_product_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        media_product_expire: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        media_product_descto: {
            allowNull: false,
            defaultValue: 0,
            type: DataTypes.FLOAT
        },
    },
    {
        modelName: "media_product",
        tableName: "media_product",
        timestamps: true,
        createdAt: 'media_product_created',
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
        }
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




// ********************************************* COUPON **************************************
export class CouponModel extends Model {}
CouponModel.init(
    {
        coupon_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        media_product_id: {
            allowNull: true,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"media_product_id",
                model: "media_product",
                as: "media_product_id",
            }
        },
        campaign_product_id: {
            allowNull: true,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"campaign_product_id",
                model: "campaign_product",
                as: "campaign_product_id",
            }
        },
        campaign_doctor_id: {
            allowNull: true,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"campaign_doctor_id",
                model: "campaign_doctor",
                as: "campaign_doctor_id",
            }
        },
        commerce_type_id: {
            allowNull: true,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"commerce_type_id",
                model: "commerce_type",
                as: "commerce_type_id",
            }
        },
        consummer_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"consummer_id",
                model: "consummer",
                as: "consummer_id",
            }
        },
        coupon_codebar: {
            allowNull: false,
            type: DataTypes.STRING(20)
        },
        coupon_source: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        coupon_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        coupon_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        coupon_expire: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        coupon_redimed: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        coupon_host: {
            allowNull: true,
            type: DataTypes.CHAR(20),
        },
        coupon_ip: {
            allowNull: true,
            type: DataTypes.CHAR(20),
        },
        coupon_latitude: {
            allowNull: true,
            type: DataTypes.FLOAT,
            defaultValue: 0.000000
        },
        coupon_longitude: {
            allowNull: true,
            type: DataTypes.FLOAT,
            defaultValue: 0.000000
        },
        coupon_device: {
            allowNull: true,
            type: DataTypes.CHAR(20),
        },
        coupon_redimed_file: {
            allowNull: true,
            type: DataTypes.STRING(500),
        },
        coupon_redimed_store: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },

    },
    {
        modelName: "coupon",
        tableName: "coupon",
        timestamps: true,
        createdAt: 'coupon_created',
        updatedAt: false,
        sequelize
    }
);



// *************************************************** STORE PROCEDURE ***************************************
// --- MEDIA PRODUCT CODE METRICS ---
export const MetricsCoupons = sequelize.define('metricscoupons',
    {
        brand_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        brand_name: {
            allowNull: false,
            type: DataTypes.CHAR(150),
        },
        product_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        product_name: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        media_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        media_name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        media_product_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        media_product_code: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        coupon_qty_generated: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupon_qty_redimed: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupon_qty_expired: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }

);

// export class MetricsCoupons {}
// MetricsCoupons.init(
//     {
//         brand_id: {
//             allowNull: false,
//             type: DataTypes.STRING(36),
//         },
//         brand_name: {
//             allowNull: false,
//             type: DataTypes.CHAR(150),
//         },
//         product_id: {
//             allowNull: false,
//             type: DataTypes.STRING(36),
//         },
//         product_name: {
//             allowNull: false,
//             type: DataTypes.STRING(255),
//         },
//         media_id: {
//             allowNull: false,
//             type: DataTypes.STRING(36),
//         },
//         media_name: {
//             allowNull: false,
//             type: DataTypes.CHAR(100),
//         },
//         media_product_id: {
//             allowNull: false,
//             type: DataTypes.STRING(36),
//         },
//         media_product_code: {
//             allowNull: false,
//             type: DataTypes.CHAR(100),
//         },
//         coupon_qty_generated: {
//             allowNull: false,
//             type: DataTypes.INTEGER,
//         },
//         coupon_qty_redimed: {
//             allowNull: false,
//             type: DataTypes.INTEGER,
//         },
//         coupon_qty_expired: {
//             allowNull: false,
//             type: DataTypes.INTEGER,
//         },
//     },
//     {
//         modelName: "MetricsCoupons",
//         timestamps: true,
//         createdAt: false,
//         updatedAt: false,
//         sequelize
//     }
// );
//

// ************************************************ RELATIONS ************************************

CodeTypeModel.hasMany(MediaProductModel,{
    foreignKey: "code_type_id",
});

MediaProductModel.belongsTo(CodeTypeModel, {
    foreignKey: 'code_type_id'
});




MediaProductModel.hasOne(ProductModel,{
    foreignKey: "product_id",
});

ProductModel.belongsTo(MediaProductModel, {
    foreignKey: 'product_id'
});




MediaProductModel.hasOne(MediaModel,{
    foreignKey: "media_id",
});

MediaModel.belongsTo(MediaProductModel, {
    foreignKey: 'media_id'
});



MediaProductModel.hasMany(CouponModel,{
    foreignKey: "media_product_id",
});

CouponModel.belongsTo(MediaProductModel, {
    foreignKey: 'media_product_id'
});

