import { Sequelize } from "sequelize";
import accessEnv from "#root/helpers/accessEnv";

const DB_URI = accessEnv("DB_URI", process.env.DB_URI);

const sequelizeDB = new Sequelize(DB_URI, {
    dialectOptions: {
        charset: "utf8",
        multipleStatements: true
    },
    logging: false,
    // define: {
    //     timestamps: false
    // }
}) ;

sequelizeDB
    .authenticate()
    .then(() => {
        console.log('Connection database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


export default sequelizeDB;