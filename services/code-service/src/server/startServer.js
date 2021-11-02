// --------------- IMPORTS SECTION -------------
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import accessEnv from "#root/helpers/accessEnv";
import setupRoutes from "./routes";

// --------------- CONSTANTS SECTION -------------

const PORT = accessEnv("PORT", 7103);
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

setupRoutes(app);

// ERROR HANDLING
app.use((err, req, res, next) => {
    return res.status(500).json({
        message: err.message
    });
});

// ---------------LAUNCH SECTION -------------
app.listen(PORT, "0.0.0.0", () => {
    console.info(`Code service listening on ${PORT}`);
});