// ------------- IMPORTS ---------------
import { ApolloServer} from "apollo-server-express";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import resolvers from "#root/graphql/resolvers";
import typeDefs from "#root/graphql/typeDefs";
import accessEnv from "#root/helpers/accessEnv";
import validateTokensMiddleware from "#root/helpers/validateTokensMiddleware";

import fs from 'fs'
import https from 'https'
import http from 'http'

import formatGraphQLErrors from "./formatGraphQLErrors";
// import injectSession from "./injectSession";



// ------------- CONSTANTS ---------------
const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'abbottcoupons.veritasoft.site' },
    development: { ssl: false, port: 7000, hostname: 'localhost' }
}


const ENVIRONMENT = accessEnv("ENVIRONMENT", 'development');
//const PORT = accessEnv("PORT", 7000);
const CONFIG = configurations[ENVIRONMENT]
const SSL_PATH = (__dirname + '/ssl/');

const apolloServer = new ApolloServer({
    uploads: {
        // Limits here should be stricter than config for surrounding
        // infrastructure such as Nginx so errors can be handled elegantly by
        // graphql-upload:
        // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
        maxFileSize: 50000000, // 50 MB
        maxFiles: 20,
    },
    // context: a => a,
    context: ({ req, res }) => ({ req, res }),
    formatError: formatGraphQLErrors,
    resolvers,
    typeDefs,
    tracing: true,
});


// ------------- MIDDLEWARE ---------------
var app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: function (origin, cb) { cb(null, true) },
        optionsSuccessStatus: 200,
        credentials: true
    })
);

// app.use(injectSession);
app.use(validateTokensMiddleware);

apolloServer.applyMiddleware({
    app,
    cors: false,
    path: "/graphql",
    bodyParserConfig: {
        limit: '50mb',
    },
});



// ---------------- LAUNCH ---------------
var server;
if (CONFIG.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root. Make sure
    // these files are secured.
    server = https.createServer(
        {
            key: fs.readFileSync(`${SSL_PATH}${ENVIRONMENT}/privkey.pem`),
            cert: fs.readFileSync(`${SSL_PATH}${ENVIRONMENT}/fullchain.pem`),
        },
        app
    );
} else {
    server = http.createServer(app);
}


// app.listen(PORT, "0.0.0.0", (error) => {
//     if (error) throw error;
//     console.info(`API GATEWAY listening on ${PORT}`);
// });

server.listen({port: CONFIG.port}, () =>
    console.log(
        '🚀 Server ready at',
        `http${CONFIG.ssl ? 's' : ''}://${CONFIG.hostname}:${CONFIG.port}${apolloServer.graphqlPath}`
    )
);


