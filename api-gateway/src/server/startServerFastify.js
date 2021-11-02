// ------------- IMPORTS ---------------

// import { ApolloServer } from "apollo-server-express";

// import cors from "cors";
// import express from "express";

import resolvers from "#root/graphql/resolvers";
import typeDefs from "#root/graphql/typeDefs";
import accessEnv from "#root/helpers/accessEnv";

import formatGraphQLErrors from "./formatGraphQLErrors";
import injectSession from "./injectSessionFastify";

// FASTIFY
import { fastify } from "fastify";


// import { Server, IncomingMessage, ServerResponse } from 'http'


// ------------- CONSTANTS ---------------
const PORT = accessEnv("PORT", 7000);

// const apolloServer = new ApolloServer({
//     uploads: {
//         // Limits here should be stricter than config for surrounding
//         // infrastructure such as Nginx so errors can be handled elegantly by
//         // graphql-upload:
//         // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
//         maxFileSize: 10000000, // 10 MB
//         maxFiles: 20,
//     },
//     context: a => a,
//     formatError: formatGraphQLErrors,
//     resolvers,
//     typeDefs,
//     tracing: true,
// });


// ------------- MIDDLEWARE ---------------
// const app = express();

// app.use(cookieParser());

// app.use(
//     cors({
//         origin: function (origin, cb) { cb(null, true) },
//         optionsSuccessStatus: 200,
//         credentials: true
//     })
// );
//
// app.use(injectSession);
//


function asyncLauncher() {

    var promise = new Promise(async (resolve, reject) => {

        const server = fastify();

        const fastifyCors = await require("fastify-cors");
        const fastifyExpress = await require("fastify-express");

        const fastifySession = await require('fastify-session');
        const fastifyCookie = await require('fastify-cookie');
        const bodyParser = await require('body-parser');


        const apolloFastifyOptions = {
            app: server,
            graphqlPath: "/graphql",
            cors: false,
            uploads: {
            // Limits here should be stricter than config for surrounding
            // infrastructure such as Nginx so errors can be handled elegantly by
            // graphql-upload:
            // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
            maxFileSize: 10000000, // 10 MB
                maxFiles: 20,
            },
            context: a => a,
            formatError: formatGraphQLErrors,
            resolvers,
            typeDefs,
            tracing: true,
            };
        const { ApolloServer, aql } = await require('apollo-server-fastify');
        const apolloFastify = new ApolloServer(apolloFastifyOptions);



        try {

            // await server.register(fastifyExpress);
            // do you know we also have cors support?
            // https://github.com/fastify/fastify-cors

            // await server.use(bodyParser.json());
            // await server.use(bodyParser.text({ type: 'application/graphql' }));

            await server.register(fastifyCors);

            await server.register(fastifyCookie);
            await server.register(fastifySession, {secret: 'Gjc*27911972@0992881089001@0913238713'});

            await server.addHook('preHandler', (request, reply, next) => {
                request.session.user = {name: 'max'};
                // console.log(request.session);
                next();
            })

            // await server.register(injectSession);

            await server.register(apolloFastify.createHandler())
            // await apolloServer.applyMiddleware({server, cors: false, path: "/graphql"});


            // await server.addContentTypeParser('application/graphql', { parseAs: 'string' }, function (req, body, done) {
            //     try {
            //         var json = JSON.parse(body)
            //         done(null, json)
            //     } catch (err) {
            //         err.statusCode = 400
            //         done(err, undefined)
            //     }
            // });

            server.listen(PORT, "0.0.0.0", (error) => {
                    if (error) {
                        console.error('FASTIFY GATEWAY starts failed - ', err);
                        return;
                    }

                    console.info(`FASTIFY GATEWAY listening on ${PORT}`);
            });


            resolve() ;

        }
        catch (e) {
            console.log(e);
            reject();
        }

    });

    return promise;
}


//  , {
// origin: (origin, cb) => { cb(null, true) },
//     optionsSuccessStatus: 200,
//     credentials: true
// }
//

// ---------------- LAUNCH ---------------
// app.listen(PORT, "0.0.0.0", (error) => {
//     if (error) throw error;
//     console.info(`API GATEWAY listening on ${PORT}`);
// });

asyncLauncher().then(()=>console.log("Server UP!")).catch(()=>console.log("Server DOWN!"));
