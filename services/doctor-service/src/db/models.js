import {DataTypes, Model, Sequelize} from "sequelize";
import sequelize from "./connection";

// ********************************************* PARAMETER **************************************
export class ParameterModel extends Model {}
ParameterModel.init(
    {
        parameter_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        parameter_name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(255)
        },
        parameter_desc: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        parameter_value: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00
        },
        parameter_text: {
            type: DataTypes.TEXT,
            defaultValue: ""
        },
        parameter_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        modelName: "parameter",
        tableName: "parameter",
        timestamps: true,
        createdAt: 'parameter_created',
        updatedAt: false,
        sequelize
    }
);

// ********************************************* MESSAGE **************************************
export class MessageModel extends Model {}
MessageModel.init(
    {
        message_id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        message_motor: {
            allowNull: false,
            type: DataTypes.CHAR(100)
        },
        message_errno: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        message_code: {
            allowNull: false,
            type: DataTypes.CHAR(100)
        },
        message_state: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        message_message: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
    },
    {
        modelName: "message",
        tableName: "message",
        createdAt: false,
        updatedAt: false,
        sequelize
    }
);


// ********************************************* COMMERCE_TYPE **************************************
export class CommerceTypeModel extends Model {}
CommerceTypeModel.init(
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
        modelName: "commerce_type",
        tableName: "commerce_type",
        timestamps: true,
        createdAt: 'commerce_type_created',
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
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"media_product_id",
                model: "media_product",
                as: "media_product_id",
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



// ********************************************* CONSUMMER **************************************
export class ConsummerModel extends Model {}
ConsummerModel.init(
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
        consummer_origin: {
            allowNull: true,
            type: DataTypes.CHAR(20),
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
        modelName: "consummer",
        tableName: "consummer",
        timestamps: true,
        createdAt: 'consummer_created',
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
            type: DataTypes.CHAR(20),
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



// ********************************************* DOCTOR **************************************
export class DoctorModel extends Model {}
DoctorModel.init(
    {
        doctor_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        doctor_name: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        doctor_email: {
            allowNull: false,
            type: DataTypes.STRING(500)
        },
        doctor_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        doctor_created: {
            allowNull: false,
            type: DataTypes.DATE,
        },

    },
    {
        modelName: "doctor",
        tableName: "doctor",
        timestamps: true,
        createdAt: 'doctor_created',
        updatedAt: false,
        sequelize
    }
);


// ********************************************* CAMPAIGN **************************************
export class CampaignModel extends Model {}
CampaignModel.init(
    {
        campaign_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        campaign_name: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        campaign_slug: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        campaign_prefix: {
            allowNull: false,
            type: DataTypes.STRING(10)
        },
        campaign_desc: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        campaign_picture: {
            allowNull: false,
            type: DataTypes.STRING(500)
        },
        campaign_expire: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        campaign_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        campaign_created: {
            allowNull: false,
            type: DataTypes.DATE,
        },

    },
    {
        modelName: "campaign",
        tableName: "campaign",
        timestamps: true,
        createdAt: 'campaign_created',
        updatedAt: false,
        sequelize
    }
);


// ********************************************* CAMPAIGN-DOCTOR **************************************
export class CampaignDoctorModel extends Model {}
CampaignDoctorModel.init(
    {
        campaign_doctor_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        campaign_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"campaign_id",
                model: "campaign",
                as: "campaign_id",
            }
        },
        doctor_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"doctor_id",
                model: "doctor",
                as: "doctor_id",
            }
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
        campaign_doctor_code: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        campaign_doctor_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        campaign_doctor_created: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        modelName: "campaign_doctor",
        tableName: "campaign_doctor",
        timestamps: true,
        createdAt: 'campaign_doctor_created',
        updatedAt: false,
        sequelize
    }
);



// ********************************************* CAMPAIGN-PRODUCT **************************************
export class CampaignProductModel extends Model {}
CampaignProductModel.init(
    {
        campaign_product_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        campaign_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
            onUpdate: "CASCADE",
            references: {
                key:"campaign_id",
                model: "campaign",
                as: "campaign_id",
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
        campaign_product_descto: {
            allowNull: false,
            type: DataTypes.FLOAT,
            defaultValue: 0.00
        },
        campaign_product_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        campaign_product_created: {
            allowNull: false,
            type: DataTypes.DATE,
        }
    },
    {
        modelName: "campaign_product",
        tableName: "campaign_product",
        timestamps: true,
        createdAt: 'campaign_product_created',
        updatedAt: false,
        sequelize
    }
);






// *************************************************** VIEWS ***************************************
// --- COUPON ---
export class viewCouponModel extends Model {}
viewCouponModel.init(
    {
        coupon_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        coupon_codebar: {
            allowNull: false,
            type: DataTypes.STRING(20)
        },
        coupon_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        coupon_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        coupon_redimed: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        coupon_redimed_file: {
            allowNull: true,
            type: DataTypes.STRING(500),
        },
        coupon_expire: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        coupon_device: {
            allowNull: true,
            type: DataTypes.CHAR(20),
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
        media_product_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        media_product_code: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
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
            type: DataTypes.CHAR(255),
        },
        media_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        media_name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        code_type_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        code_type_name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        commerce_type_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        commerce_type_name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        consummer_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        consummer_name: {
            allowNull: false,
            type: DataTypes.CHAR(255),
        },
        coupon_source: {
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        category_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        category_name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
    },
    {
        modelName: "vwCoupon",
        tableName: "vwCoupon",
        timestamps: true,
        createdAt: 'coupon_created',
        updatedAt: false,
        sequelize
    }
);



// --- COUPONS BY CATEGORY ---
export class CouponsByCategoryModel extends Model {}
CouponsByCategoryModel.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        dates: {
            allowNull: false,
            type: DataTypes.DATEONLY,
        },
        coupons_generated: {
            allowNull: false,
            type: DataTypes.DECIMAL,
        },
        coupons_redimed: {
            allowNull: false,
            type: DataTypes.DECIMAL,
        },
        coupons_expired: {
            allowNull: false,
            type: DataTypes.DECIMAL,
        },
    },
    {
        sequelize,
        modelName: "vwCouponsByCategory",
        tableName: "vwCouponsByCategory",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        underscored : false,
    }


);


// --- COUPONS BY BRAND ---
export class CouponsByBrandModel extends Model {}
CouponsByBrandModel.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        name: {
            allowNull: false,
            type: DataTypes.CHAR(150),
        },
        dates: {
            allowNull: false,
            type: DataTypes.DATEONLY,
        },
        coupons_generated: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupons_redimed: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupons_expired: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    },
    {
        modelName: "vwCouponsByBrand",
        tableName: "vwCouponsByBrand",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        sequelize
    }
);

// --- COUPONS BY PRODUCT ---
export class CouponsByProductModel extends Model {}
CouponsByProductModel.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        name: {
            allowNull: false,
            type: DataTypes.CHAR(255),
        },
        dates: {
            allowNull: false,
            type: DataTypes.DATEONLY,
        },
        coupons_generated: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupons_redimed: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupons_expired: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    },
    {
        modelName: "vwCouponsByProduct",
        tableName: "vwCouponsByProduct",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        sequelize
    }
);

// --- COUPONS BY MEDIA ---
export class CouponsByMediaModel extends Model {}
CouponsByMediaModel.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        dates: {
            allowNull: false,
            type: DataTypes.DATEONLY,
        },
        coupons_generated: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupons_redimed: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        coupons_expired: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    },
    {
        modelName: "vwCouponsByMedia",
        tableName: "vwCouponsByMedia",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        sequelize
    }
);

// --- COUPONS ROLLUP ---
export class CouponsRollUp extends Model {}
CouponsRollUp.init(
    {
        category_name: {
            type: DataTypes.CHAR(100),
        },
        brand_name: {
            type: DataTypes.CHAR(150),
        },
        product_name: {
            type: DataTypes.CHAR(255),
        },
        media_name: {
            type: DataTypes.CHAR(100),
        },
        coupons_generated: {
            type: DataTypes.INTEGER,
        },
        coupons_redimed: {
            type: DataTypes.INTEGER,
        },
        coupons_expired: {
            type: DataTypes.INTEGER,
        },
        coupons_total: {
            type: DataTypes.INTEGER,
        },
    },
    {
        modelName: "vwCouponsRollUp",
        tableName: "vwCouponsRollUp",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        sequelize
    }
);
CouponsRollUp.removeAttribute('id');





// ************************************************ RELATIONS ************************************

CommerceTypeModel.hasMany(CouponModel,{
    foreignKey: "commerce_type_id",
});

CouponModel.belongsTo(CommerceTypeModel, {
    foreignKey: 'commerce_type_id'
});




MediaProductModel.hasMany(CouponModel,{
    foreignKey: "media_product_id",
});


CouponModel.belongsTo(MediaProductModel, {
    foreignKey: 'media_product_id'
});




ConsummerModel.hasMany(CouponModel,{
    foreignKey: "consummer_id",
});

CouponModel.belongsTo(ConsummerModel, {
    foreignKey: 'consummer_id'
});


ProductModel.hasMany(MediaProductModel,{
    foreignKey: "product_id",
});




DoctorModel.hasMany(CampaignDoctorModel,{
    foreignKey: "doctor_id",
});

CampaignDoctorModel.belongsTo(DoctorModel, {
    foreignKey: 'doctor_id'
});


CampaignModel.hasMany(CampaignDoctorModel,{
    foreignKey: "campaign_id",
});

CampaignDoctorModel.belongsTo(CampaignModel, {
    foreignKey: 'campaign_id'
});


CampaignModel.hasMany(CampaignProductModel,{
    foreignKey: "campaign_id",
});

CampaignProductModel.belongsTo(CampaignModel, {
    foreignKey: 'campaign_id'
});


ProductModel.hasMany(CampaignProductModel,{
    foreignKey: "product_id",
});

CampaignProductModel.belongsTo(ProductModel, {
    foreignKey: 'product_id'
});
