import { Sequelize } from "sequelize";
import accessEnv from "#root/helpers/accessEnv";

const DB_URI = accessEnv("DB_URI", process.env.DB_URI);

const sequelize = new Sequelize(DB_URI, {
    dialectOptions: {
        charset: "utf8",
        multipleStatements: true,
        // useUTC: false, //for reading from database
    },
    logging: false,
    // timezone: "America/Guayaquil",
    // typeCast: function (field, next) { // for reading from database
    //     switch(field.type){
    //         case 'DATETIME':
    //         case 'TIMESTAMP':
    //             return new Date(field.string());
    //             break;
    //         case 'BIT':
    //             var bytes = field.buffer();
    //             return( bytes[ 0 ] === 1 );
    //             break;
    //         default:
    //             return next();
    //             break;
    //     }
    // },
    // define: {
    //     timestamps: false
    // }
}) ;

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


export default sequelize;