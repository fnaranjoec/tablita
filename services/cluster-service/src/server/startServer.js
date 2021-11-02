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
import axios from 'axios';

import accessEnv from "#root/helpers/accessEnv";


var cron =  require('node-cron');

// --------------- CONSTANTS SECTION -------------
const initRoutes = require("#root/routes/index");
const PORT = accessEnv("PORT", 7110);
const app = express();
const COUPON_SERVICE_URI = accessEnv("COUPON_SERVICE_URI", 'http://localhost:7104/api/v1');
const CircularJSON  = require("circular-json");

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
        message: err.message
    });
});



/**
 * Initialize CRON-JON
 * Se ejecuta cada 5 minutos
 **/
cron.schedule('*/1 * * * *', async function() {
    // console.log('running a task every 1 minutes');
    processBatch();
});

const processBatch = async () => {
    const axiosInstance = await axios.create({
        baseURL: `${COUPON_SERVICE_URI}`,
        // headers: { 'X-Custom-Header': 'foo' },
        // `timeout` specifies the number of milliseconds before the request times out.
        // If the request takes longer than `timeout`, the request will be aborted.
        timeout: (1000 * 60 * 3)
        // `maxContentLength` defines the max size of the http response content allowed
        // maxContentLength: 2000,
        // see https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index for all axiosoptions.
    });
    axiosInstance.defaults.timeout = (1000 * 60 * 3);

    var clustersCount = await axiosInstance.get(`/clusters/count`);
    var clustersProcessing = await axiosInstance.get(`/clusters/processing`);
    var clustersProcessingCount = await axiosInstance.get(`/clusters/processing/count`);

    // All clusters are processed
    if (clustersProcessingCount["data"].count==0) {
        console.log("+++ All clusters are sent to ActiveCampaign. Nothing to process yet...");
        return
    }

    for (const row of clustersProcessing["data"]) {
        // console.log(`row ==> ${JSON.stringify(row)}`);

        // Enviar al api de ActiveCampaign
        // ........

        // *** GRABAR en Tabla ClusterProcessing
        // ........
        await axiosInstance.post(`/clustersprocessing`, {args:{client_id: row["client_id"]}});
    // axiosInstance.post(`/clustersprocessing`, {args:{client_id: row["client_id"]}})
	// .then((res)=>{
	//   console.log(`res=>${res}`);
	// })
	// .catch((err)=>{
	//   console.log(`err=>${err.message}`);
	// });
    }

    // *** La tabla se debe limpiar solo cuando PROCESE un nuevo CSV

};


// ---------------LAUNCH SECTION -------------
app.listen(PORT, "0.0.0.0", () => {
    console.info(`Cluster service listening on ${PORT}`);
});
