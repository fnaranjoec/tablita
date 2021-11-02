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

// ********************************************* ROL **************************************
export class RolModel extends Model {}
RolModel.init(
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
        modelName: "rol",
        tableName: "rol",
        timestamps: true,
        createdAt: 'rol_created',
        updatedAt: false,
        sequelize
    }
);

// ********************************************* USER **************************************
export class UserModel extends Model {}
UserModel.init(
    {
        user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        user_name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        user_email: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        user_phone: {
            allowNull: false,
            unique: true,
            type: DataTypes.CHAR(20)
        },
        user_password: {
            allowNull: false,
            type: DataTypes.CHAR(20)
        },
        user_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        user_created: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    {
        modelName: "user",
        tableName: "user",
        timestamps: true,
        createdAt: 'user_created',
        updatedAt: false,
        defaultScope: {
          rawAttributes: {exclude: ["user_password"]}
        },
        sequelize
    }
);

// ********************************************* ROL USER **************************************
export class RolUserModel extends Model {}
RolUserModel.init(
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
        modelName: "rol_user",
        tableName: "rol_user",
        timestamps: true,
        createdAt: 'rol_user_created',
        updatedAt: false,
        sequelize
    }
);


// ********************************************* SESSION **************************************
export class UserSessionModel extends Model {}
UserSessionModel.init(
    {
        session_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        user_id: {
            allowNull: false,
            type: DataTypes.STRING(36),
        },
        session_access_token: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        session_refresh_token: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        session_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        session_created: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },
        session_expire: {
            allowNull: true,
            type: DataTypes.DATE,
        }
    },
    {
        modelName: "session",
        tableName: "session",
        timestamps: true,
        createdAt: 'session_created',
        updatedAt: false,
        sequelize
    }
);


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
        }
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

// ****************************************** RELATIONS ***********************************

CustomerModel.hasMany(BrandModel,{
    foreignKey: "customer_id",
});

BrandModel.belongsTo(CustomerModel, {
    foreignKey: 'customer_id'
});




// ********************************************* OPERATOR **************************************
export class OperatorModel extends Model {}
OperatorModel.init(
    {
        operator_id: {
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
        operator_status: {
            allowNull: false,
            type: DataTypes.CHAR(1),
            defaultValue: "A"
        },
        operator_created: {
            allowNull: false,
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        }
    },
    {
        modelName: "operator",
        tableName: "operator",
        timestamps: true,
        createdAt: 'operator_created',
        updatedAt: false,
        sequelize
    }
);

