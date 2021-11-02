// const cors = require("cors");
// const express = require("express");
// const app = express();
//
// global.__basedir = __dirname;
//
// var corsOptions = {
//     origin: "http://localhost:8081"
// };
//
// app.use(cors(corsOptions));
//
// const initRoutes = require("../routes/index");
//
// app.use(express.urlencoded({ extended: true }));
// initRoutes(app);
//
//
// let port = 8109;
// app.listen(port, () => {
//     console.log(`Running at localhost:${port}`);
// });

// --------------- IMPORTS SECTION -------------
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import accessEnv from "#root/helpers/accessEnv";

// --------------- CONSTANTS SECTION -------------
// Inicializa los routers
const initRoutes = require("#root/routes/index");


const PORT = accessEnv("PORT", 7111);
const app = express();

// ----------- MIDDLEWARE SECTION ------------
app.use(bodyParser.json({
    limit: '50mb', extende: true
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}))

app.use(
    cors({
        origin: function (origin, cb) { cb(null, true) },
        optionsSuccessStatus: 200,
        credentials: true
    })
);

initRoutes(app);

// ERROR HANDLING
app.use((err, req, res, next) => {
    return res.status(500).json({
        message: `${err.message}`
    });
    
});

// ---------------LAUNCH SECTION -------------
app.listen(PORT, "0.0.0.0", () => {
    console.info(`Active Campaign service listening on ${PORT}`);
});