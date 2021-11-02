// --------------- IMPORTS SECTION -------------
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

// import rabbit from '#root/rabbit';

import accessEnv from "#root/helpers/accessEnv";
import setupRoutes from "./routes";

import got from "got";

import Queue from 'bull';


// --------------- CONSTANTS SECTION -------------

const PORT = accessEnv("PORT", 7105);
const app = express();
const MAILING_SERVICE_URI = accessEnv("MAILING_SERVICE_URI");
const REDIS_HOST = accessEnv("REDIS_HOST");

// ----------- MIDDLEWARE SECTION ------------
app.use(bodyParser.json({
    limit: '50mb', extende: true
}));

app.use(bodyParser.text({
    type: 'application/graphql'
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

    console.info(`Mailing service listening on ${PORT}`);

    // 1. Initiating the Queue
    const readMailQueue = new Queue('sendMail', {
        redis: {
            host: `${REDIS_HOST}`,
            port: 6379,
            family: 4,
            connectTimeout: 60000,

        }
    });


    // 2. Consumer
    readMailQueue.process(async (job, done) => {
        const body =  await got.post(`${MAILING_SERVICE_URI}/email/send`, {
            json: {
                content: job.data
            }
        }).json();

        done(null, `Sent mail to:  ${job.data.to}`);

        // console.log("body on queue ==>", body);

    });

    // // Leyendo mensajes de RabbitMQ
    // rabbit.getInstance()
    //     .then(async (broker) => {
    //
    //         await broker.subscribe('mailing', async (msg, ack) => {
    //
    //             const body =  await got.post(`${MAILING_SERVICE_URI}/email/send`, {
    //                 json: {content: JSON.parse(msg.content.toString())}
    //             }).json();
    //
    //             // console.log('body==>', body);
    //
    //             await ack()
    //         })
    //     })

});
