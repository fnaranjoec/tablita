import {
    UserModel,
    UserSessionModel,
    ParameterModel,
    MessageModel,
    RolModel,
    RolUserModel,
    CustomerModel,
    OperatorModel,
} from "#root/db/models";

import * as sequelize from "sequelize";

import nodemailer from "nodemailer";


import accessEnv from "#root/helpers/accessEnv";
import generateUUID from "#root/helpers/generateUUID";
import hashPassword from "#root/helpers/hashPassword";
import getWhere from "#root/helpers/getWhere";
import passwordCompareSync from "#root/helpers/passwordCompareSync";
import * as rabbit from "#root/rabbit";

import { addHours } from "date-fns";

const setupRoutes = app => {
    const ENDPOINT_URI = accessEnv("ENDPOINT_URI");
    const USER_SESSION_EXPIRY_HOURS = accessEnv("USER_SESSION_EXPIRY_HOURS");


    // ---------------------------------------------------- SEND EMAIL --------------------------------------------------------------

    app.post( `${ENDPOINT_URI}/email/send` , async (req, res, next) => {

        // console.log('req.body.content.to==>', req.body.content.to);
        // console.log("req.body.content==> ", req.body.content);


        try {

            // nodemailer.createTestAccount(async (err, account)=>{
            //
            //     // let transporter = await nodemailer.createTransport({
            //     //     host: 'smtp.ethereal.email',
            //     //     port: 587,
            //     //     secure: false,
            //     //     auth: {
            //     //         user: account.user,
            //     //         pass: account.pass
            //     //     }
            //     // });
            //
            //     // ..........
            //
            // });


            // OK FUNCIONA
            let transporter = await nodemailer.createTransport({
                pool: true,
                host: 'mail.acidrainmedialab.com',
                secure: true,
                tls: {
                    rejectUnauthorized: false
                },
                port: 465,
                auth: {
                    user: "abbott@acidrainmedialab.com",
                    pass: "Abbott2020@",
                }
            });

            // let transporter = await nodemailer.createTransport({
            //     pool: true,
            //     host: 'mail.abbottcupones.com',
            //     secure: false,
            //     tls: {
            //         rejectUnauthorized: false
            //     },
            //     port: 587,
            //     auth: {
            //         user: "info@abbottcupones.com",
            //         pass: "Basica2020@",
            //     }
            // });

            // separo correos que vengan con comas
            let recipientsArray = await req.body.content.to.trim().split(",");

            let mailOptions = {
                headers: {
                    'Content-Transfer-Encoding': '8bit',
                    'Connection': 'keep-alive',
                },
                from: req.body.content.from, // Sender address
                to: recipientsArray,
                subject: req.body.content.subject, // Subject line
                html: req.body.content.html, // Plain text body
                attachments: [
                    {   // encoded string as an attachment
                        filename: 'cupon.jpg',
                        content: req.body.content.imageBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                    {
                        filename: req.body.content.fileName,
                        path: req.body.content.path,
                        cid: req.body.content.cid,
                    }
                ]
            };

            await transporter.sendMail(mailOptions, async (error, info)=>{
                if (error){
                    console.log("error===>", error);
                    // return console.log("error===>", error);
                    return await res.json({
                        success: false,
                        message: error.message,
                        data: ""
                    });

                }

                console.log("Message sent: %s", info.messageId);
                // console.log("Preview URL: %s", nodemailer.getTes(info));

            });

            return await res.json({
                success: true,
                message: "Email sent.",
                data: ""
            });


        }
        catch(e){
            console.log("e==>", e)
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }




    });



    // ---------------------------------------------------- ROLES --------------------------------------------------------------

    // *************************************************************************** GET ALL ROLES INFO ***
    app.get( `${ENDPOINT_URI}/roles` , async (req, res, next) => {

        try {
            const roles = await RolModel.findAll({
                order: [['rol_name','asc']],
                attributes: {},
                where: {[sequelize.Op.not] : [{rol_status: "X"}]}
            });
            return res.json(roles);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });





    // ---------------------------------------------------- USERS --------------------------------------------------------------

    // *************************************************************************** GET ALL USERS INFO ***
    app.post( `${ENDPOINT_URI}/users/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter});
        // console.log('filter', filter);

        try {
            const users = await UserModel.findAll({
                order: [['user_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(users);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET USER BY ID INFO ***
    app.get( `${ENDPOINT_URI}/users/:user_id` , async (req, res, next) => {

        try {
            const users = await UserModel.findOne({
                attributes: {},
                where: {
                    user_id: {[sequelize.Op.eq]: req.params.user_id},
                    user_status: {[sequelize.Op.not]: "X"}
                }
            });

            return res.json(users);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** POST CUSTOMER (CREATE CUSTOMER)
    app.post(`${ENDPOINT_URI}/users/customer`, async(req, res, next) => {

        // Valido el body si llega con todos los datos
        const rolClienteCorporativo = await ParameterModel.findOne({
            attributes: {},
            where: {parameter_name: "ROL_CLIENTE_CORPORATIVO"}
        });

        if (!req.body.customer_name || !req.body.customer_address ||  !req.body.customer_picture ) {
            return next (new Error("Customer data are incomplete!"));
        }

        try {

            // Creo primero el usuario
            var USER_ID=generateUUID();
            var PWD=hashPassword(req.body.user_password);

            const newUser = await UserModel.create({
                user_id: USER_ID,
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_phone: req.body.user_phone,
                user_password: PWD,
            });

            // Creo Rol Usuario
            var ROL_USER_ID=generateUUID();
            const newRolUser = await RolUserModel.create({
                rol_user_id: ROL_USER_ID,
                user_id: newUser.user_id,
                rol_id: rolClienteCorporativo.parameter_text,
            });

            var CUSTOMER_ID=generateUUID();
            const newCustomer = await CustomerModel.create({
                customer_id: CUSTOMER_ID,
                rol_user_id: newRolUser.rol_user_id,
                customer_name: req.body.customer_name,
                customer_address: req.body.customer_address,
                customer_phone: req.body.user_phone,
                customer_email: req.body.user_email,
                customer_picture: req.body.customer_picture,
            });


            // Devuelvo nuevo customer
            return res.json(newUser);

        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** POST OPERATOR (CREATE OPERATOR)
    app.post(`${ENDPOINT_URI}/users/operator`, async(req, res, next) => {

        // Valido el body si llega con todos los datos

        const rolOperador = await ParameterModel.findOne({
            attributes: {},
            where: {parameter_name: "ROL_OPERADOR"}
        });

        if (!req.body.user_name || !req.body.user_email ||  !req.body.user_phone ||  !req.body.user_password ) {
            return next (new Error("Operator data are incomplete!"));
        }

        try {


            // Creo primero el operador
            var USER_ID=generateUUID();
            var PWD=hashPassword(req.body.user_password);

            const newUser = await UserModel.create({
                user_id: USER_ID,
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_phone: req.body.user_phone,
                user_password: PWD,
            });

            // Creo Rol Usuario
            var ROL_USER_ID=generateUUID();
            const newRolUser = await RolUserModel.create({
                rol_user_id: ROL_USER_ID,
                user_id: newUser.user_id,
                rol_id: rolOperador.parameter_text,
            });

            // Creo Operador
            console.log('Antes de creal operador');
            var OPERATOR_ID=generateUUID();
            const newOperator = await OperatorModel.create({
                operator_id: OPERATOR_ID,
                rol_user_id: newRolUser.rol_user_id,
            });
            console.log('Despues de creal operador');


            // Devuelvo nuevo usuario
            return res.json(newUser);

        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** PUT USER (UPDATE USER)
    app.put(`${ENDPOINT_URI}/users/:user_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.user_id) {
            return next (new Error("User ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.user_name || !req.body.user_email ||  !req.body.user_phone || !req.body.user_password ) {
        //     return next (new Error("User data are incomplete!"));
        // }

        // const updatedUser = await UserModel.findOne({
        //     attributes: {},
        //     where: {user_id: req.params.user_id, [sequelize.Op.not] : [{user_status: "X"}]}
        // });
        //
        // if (!updatedUser) return next(new Error("Invalid user ID or Deleted"));

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.user_name) updateJSON['user_name'] = req.body.args.user_name;
        if (req.body.args.user_email) updateJSON['user_email'] = req.body.args.user_email;
        if (req.body.args.user_phone) updateJSON['user_phone'] = req.body.args.user_phone;
        if (req.body.args.user_password) updateJSON['user_password'] = hashPassword(req.body.args.user_password);
        if (req.body.args.user_status) updateJSON['user_status'] = req.body.args.user_status;

        console.log(updateJSON);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {



            // // Actualizo primero el usuario
            // var PWD=hashPassword(req.body.user_password);
            // updatedUser.user_name = req.body.user_name;
            // updatedUser.user_email = req.body.user_email;
            // updatedUser.user_phone = req.body.user_phone;
            // updatedUser.user_password = PWD;
            // await updatedUser.save();
            // Actualizo brand

            const [numberOfAffectedRows, affectedRows] = await UserModel.update(updateJSON,
                {
                    where: {user_id: req.params.user_id, [sequelize.Op.not] : [{user_status: "X"}]},
                    returning: true,
                    // plain: true,
                });

            // Devuelvo user actualizado
            const updatedUser = await UserModel.findOne({
                attributes: {},
                where: {user_id: req.params.user_id, [sequelize.Op.not] : [{user_status: "X"}]}
            });

            if (!updatedUser) return next(new Error("Invalid user ID or Deleted"));

            // Devuelvo usuario actualizado
            return res.json(updatedUser);


        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** DELETE USER (DELETE USER)
    app.delete(`${ENDPOINT_URI}/users/:user_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.user_id) {
            return next (new Error("User ID is missing!"));
        }

        const deletedUser = await UserModel.findOne({
            attributes: {},
            where: {user_id: req.params.user_id, [sequelize.Op.not] : [{user_status: "X"}]}
        });

        if (!deletedUser) return next(new Error("Invalid user ID or Deleted"));

        try {

            deletedUser.user_status = "X";
            await deletedUser.save();

            // Devuelvo usuario eliminado
            // return res.end();
            return res.json(true);

        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });





    // ---------------------------------------------------- CUSTOMER --------------------------------------------------------------

    // *************************************************************************** GET ALL CUSTOMERS INFO ***
    app.post( `${ENDPOINT_URI}/customers/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "customer_status"});
        // console.log('filter', filter);

        try {
            const customers = await CustomerModel.findAndCountAll({
                order: [['customer_name','asc']],
                attributes: {},
                where: filter
            });

            return res.json(customers);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** GET COUNT CUSTOMERS ***
    app.get( `${ENDPOINT_URI}/customers/count` , async (req, res, next) => {


        try {
            const customers = await CustomerModel.findAndCountAll();
            return res.json(customers);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET CUSTOMER BY ID INFO ***
    app.get( `${ENDPOINT_URI}/customers/:customer_id` , async (req, res, next) => {

        try {
            const customers = await CustomerModel.findOne({
                attributes: {},
                where: {
                    customer_id: {[sequelize.Op.eq]: req.params.customer_id},
                    customer_status: {[sequelize.Op.not]: "X"}
                }
            });

            return res.json(customers);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });



    // *************************************************************************** PUT CUSTOMER (UPDATE CUSTOMER)
    app.put(`${ENDPOINT_URI}/customers/:customer_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.customer_id) {
            return next (new Error("Customer ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.customer_name || !req.body.customer_address || !req.body.customer_phone || !req.body.customer_email || !req.body.customer_picture) {
        //     return next (new Error("Customer data are incomplete!"));
        // }

        // const updatedCustomer = await CustomerModel.findOne({
        //     attributes: {},
        //     where: {customer_id: req.params.customer_id, [sequelize.Op.not] : [{customer_status: "X"}]}
        // });
        //
        // if (!updatedCustomer) return next(new Error("Invalid customer ID or Deleted"));

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.customer_name) updateJSON['customer_name'] = req.body.args.customer_name;
        if (req.body.args.customer_address) updateJSON['customer_address'] = req.body.args.customer_address;
        if (req.body.args.customer_phone) updateJSON['customer_phone'] = req.body.args.customer_phone;
        if (req.body.args.customer_email) updateJSON['customer_email'] = req.body.args.customer_email;
        if (req.body.args.customer_picture) updateJSON['customer_picture'] = req.body.args.customer_picture;
        if (req.body.args.customer_status) updateJSON['customer_status'] = req.body.args.customer_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            // // Actualizo primero el customer
            // updatedCustomer.customer_name = req.body.customer_name;
            // updatedCustomer.customer_address = req.body.customer_address;
            // updatedCustomer.customer_phone = req.body.customer_phone;
            // updatedCustomer.customer_email = req.body.customer_email;
            // updatedCustomer.customer_picture = req.body.customer_picture;
            // await updatedCustomer.save();

            // Actualizo customer
            const [numberOfAffectedRows, affectedRows] = await CustomerModel.update(updateJSON,
                {
                    where: {customer_id: req.params.customer_id, [sequelize.Op.not] : [{customer_status: "X"}]},
                    returning: true,
                    // plain: true,
                });

            // Devuelvo customer actualizado
            const updatedCustomer = await CustomerModel.findOne({
                attributes: {},
                where: {customer_id: req.params.customer_id, [sequelize.Op.not] : [{customer_status: "X"}]}
            });

            if (!updatedCustomer) return next(new Error("Invalid customer ID or Deleted"));
            // Devuelvo customer actualizado
            return res.json(updatedCustomer);


        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** DELETE CUSTOMER (DELETE CUSTOMER)
    app.delete(`${ENDPOINT_URI}/customers/:customer_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.customer_id) {
            return next (new Error("Customer ID is missing!"));
        }

        const deletedCustomer = await CustomerModel.findOne({
            attributes: {},
            where: {customer_id: req.params.customer_id, [sequelize.Op.not] : [{customer_status: "X"}]}
        });

        if (!deletedCustomer) return next(new Error("Invalid customer ID or Deleted"));

        try {

            deletedCustomer.customer_status = "X";
            await deletedCustomer.save();

            // Devuelvo usuario eliminado
            // return res.end();
            return res.json(true);

        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // ---------------------------------------------------- SESSION --------------------------------------------------------------

    // *************************************************************************** GET ONE SESSION BY ID INFO ***
    app.get( `${ENDPOINT_URI}/sessions/:session_id` , async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.session_id) {
            return next (new Error("Session ID is missing!"));
        }

        try{

            // const userSession = await UserSessionModel.findByPk(req.params.session_id);
            // return res.json(userSession);

            // Si ya tiene un token activo
            const lastUserSession = await UserSessionModel.findOne({
                attributes: {},
                where: {
                    session_id: req.params.session_id,
                    [sequelize.Op.not] : [{session_status: "X"}]
                }
            });

            return res.json(lastUserSession);
        }
        catch(e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }
        }

    });


    // *************************************************************************** POST SESSIONS (CREATE SESSION) ***
    app.post(`${ENDPOINT_URI}/sessions`, async(req, res, next) => {

        // Valido el body si llega con todos los datos
        if (!req.body.user_email || !req.body.user_password ) {
            return next (new Error("Invalid body!"));
        }

        try {
            const user = await UserModel.findOne({
                attributes: {},
                where: {user_email: req.body.user_email}
            });


            // Si no encontro usuario con email enviado
            if (!user) return next(new Error("Invalid email!"));

            // Si la clave no concuerda
            if (!passwordCompareSync(req.body.user_password, user.user_password)) {
                return next(new Error("Incorrect password!"));
            }


            // Si ya tiene un token activo
            const lastUserSession = await UserSessionModel.findOne({
                attributes: {},
                where: {
                    user_id: user.user_id,
                    [sequelize.Op.not] : [{session_status: "X"}]
                }
            });


            if (lastUserSession !== null) return next(new Error("Has token active yet!"));


            // Genero Token
            const expiresAt = addHours(new Date(), USER_SESSION_EXPIRY_HOURS);
            const sessionToken = generateUUID();
            const userSession = await UserSessionModel.create({
                session_id: sessionToken,
                user_id: user.user_id,
                session_access_token: sessionToken,
                session_refresh_token: sessionToken,
                // session_expire: expiresAt,
            });

            return res.json(userSession);

        } catch(e) {
            // console.log(e)
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }



    });


    // *************************************************************************** PUT SESSIONS (UPDATE SESSION) ***
    app.put(`${ENDPOINT_URI}/sessions/:session_id`, async(req, res, next) => {

        if (!req.params.session_id){
            return next (new Error("Session Id is missing!"));
        }

        // Valido el body si llega con todos los datos
        if (!req.body.session_access_token || !req.body.session_refresh_token ) {
            return next (new Error("Tokens are missing!"));
        }

        try {

            var updateJSON = {};
            updateJSON['session_access_token'] = req.body.session_access_token;
            updateJSON['session_refresh_token'] = req.body.session_refresh_token;


            // Actualizo session
            const [numberOfAffectedRows, affectedRows] = await UserSessionModel.update(updateJSON,
                {
                    where: {
                        session_id: req.params.session_id,
                        [sequelize.Op.not] : [{session_status: "X"}]
                    },
                    returning: true,
                    // plain: true,
                });

            // Devuelvo customer actualizado
            const updatedSession = await UserSessionModel.findOne({
                attributes: {},
                where: {
                    session_id: req.params.session_id,
                    [sequelize.Op.not] : [{session_status: "X"}]
                }
            });


            // Devuelvo producto eliminado
            if (affectedRows===0) return new Error("Session id is invalid!");

            return res.json(updatedSession);


        } catch(e) {
            // console.log(e)
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }



    });


    // *************************************************************************** DELETE SESSIONS (DELETE SESSION) ***
    app.delete(`${ENDPOINT_URI}/sessions/:session_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.session_id) {
            return next (new Error("Session ID is missing!"));
        }

        try {


            // BORRADO LOGICO

            var updateJSON = {};
            updateJSON['session_status'] = "X";
            updateJSON['session_expire'] = new Date();


            // Actualizo session
            const [numberOfAffectedRows, affectedRows] = await UserSessionModel.update(updateJSON,
                {
                    where: {
                        session_id: req.params.session_id,
                        [sequelize.Op.not] : [{session_status: "X"}]
                    },
                    returning: true,
                    // plain: true,
                });

            // Devuelvo customer actualizado
            const updatedSession = await UserSessionModel.findOne({
                attributes: {},
                where: {
                    session_id: req.params.session_id,
                    [sequelize.Op.not] : [{session_status: "X"}]
                }
            });


            // Devuelvo producto eliminado
            if (affectedRows===0) return res.json(false);
            return res.json(true);


            // // BORRADO FISICO de la session

            // const userSession = await UserSessionModel.findByPk(req.params.session_id);
            // if (!userSession) return next(new Error("Invalid session ID"));
            // await userSession.destroy();
            // return res.end();

        }
        catch (e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });





    // ---------------------------------------------------- PARAMETER --------------------------------------------------------------

    // *************************************************************************** GET ALL PARAMETERS INFO ***
    app.post( `${ENDPOINT_URI}/parameters/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "parameter_status"});
        // console.log('filter', filter);

        try {
            const parameters = await ParameterModel.findAndCountAll({
                order: [['parameter_name','asc']],
                attributes: {},
                where: filter
            });

            return res.json(parameters);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** GET COUNT PARAMETERS ***
    app.get( `${ENDPOINT_URI}/parameters/count` , async (req, res, next) => {


        try {
            const parameters = await ParameterModel.findAndCountAll();
            return res.json(parameters);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET PARAMETER BY ID INFO ***
    app.get( `${ENDPOINT_URI}/parameters/:parameter_id` , async (req, res, next) => {

        try {
            const parameter = await ParameterModel.findOne({
                attributes: {},
                where: {
                    parameter_id: {[sequelize.Op.eq]: req.params.parameter_id},
                }
            });

            return res.json(parameter);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET PARAMETER BY NAME INFO ***
    app.get( `${ENDPOINT_URI}/parameters/name/:parameter_name` , async (req, res, next) => {

        try {
            const parameter = await ParameterModel.findOne({
                attributes: {},
                where: {
                    parameter_name: {[sequelize.Op.eq]: req.params.parameter_name},
                }
            });

            return res.json(parameter);
        }
        catch (e){
            // return next(e);
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** PUT PARAMETER (UPDATE PARAMETER)
    app.put(`${ENDPOINT_URI}/parameters/:parameter_name`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.parameter_name) {
            return next (new Error("Parameter Name is missing!"));
        }

        // console.log(req.params.parameter_name);

        // // Valido el body si llega con todos los datos
        // if (!req.body.category_name || !req.body.category_slug || !req.body.category_desc) {
        //     return next (new Error("Category data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.parameter_text) updateJSON['parameter_text'] = req.body.args.parameter_text;
        if (req.body.args.parameter_value) updateJSON['parameter_value'] = req.body.args.parameter_value;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await ParameterModel.update(updateJSON,
                {
                    where: {
                        parameter_name: req.params.parameter_name
                    },
                    returning: true,
                    // plain: true,
                });

            // Devuelvo category actualizado
            const updatedParameter = await ParameterModel.findOne({
                attributes: {},
                where: {
                    parameter_name: req.params.parameter_name
                }
            });

            if (!updatedParameter) return next(new Error("Invalid parameter name or Deleted"));
            return res.json(updatedParameter);


        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // ---------------------------------------------------- MESSAGE --------------------------------------------------------------

    // *************************************************************************** GET ALL MESSAGES INFO ***
    app.post( `${ENDPOINT_URI}/messages/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "message_status"});
        // console.log('filter', filter);

        try {
            const messages = await MessageModel.findAndCountAll({
                order: [['message_message','asc']],
                attributes: {},
                where: filter
            });

            return res.json(messages);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** GET COUNT MESSAGES ***
    app.get( `${ENDPOINT_URI}/messages/count` , async (req, res, next) => {


        try {
            const messages = await MessageModel.findAndCountAll();
            return res.json(messages);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET MESSAGE BY ID INFO ***
    app.get( `${ENDPOINT_URI}/messages/:message_id` , async (req, res, next) => {

        try {
            const message = await MessageModel.findOne({
                attributes: {},
                where: {
                    message_id: {[sequelize.Op.eq]: req.params.message_id},
                }
            });

            return res.json(message);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET MESSAGE BY CODE INFO ***
    app.get( `${ENDPOINT_URI}/messages/code/:message_motor/:message_code` , async (req, res, next) => {


        try {
            const message = await MessageModel.findOne({
                attributes: {},
                where: {
                    message_motor: {[sequelize.Op.eq]: req.params.message_motor},
                    message_code: {[sequelize.Op.eq]: req.params.message_code},
                }
            });

            return res.json(message);
        }
        catch (e){
            console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** PUT PARAMETER (UPDATE PARAMETER)
    app.put(`${ENDPOINT_URI}/messages/:message_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.message_id) {
            return next (new Error("Message Id is missing!"));
        }

        // console.log(req.params.message_name);

        // // Valido el body si llega con todos los datos
        // if (!req.body.category_name || !req.body.category_slug || !req.body.category_desc) {
        //     return next (new Error("Category data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.message_motor) updateJSON['message_motor'] = req.body.args.message_motor;
        if (req.body.args.message_errno) updateJSON['message_errno'] = req.body.args.message_errno;
        if (req.body.args.message_code) updateJSON['message_code'] = req.body.args.message_code;
        if (req.body.args.message_state) updateJSON['message_state'] = req.body.args.message_state;
        if (req.body.args.message_message) updateJSON['message_message'] = req.body.args.message_message;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await MessageModel.update(updateJSON,
                {
                    where: {
                        message_id: req.params.message_id
                    },
                    returning: true,
                    // plain: true,
                });

            // Devuelvo category actualizado
            const updatedParameter = await MessageModel.findOne({
                attributes: {},
                where: {
                    message_id: req.params.message_id
                }
            });

            if (!updatedParameter) return next(new Error("Invalid message id or Deleted"));
            return res.json(updatedParameter);


        } catch(e) {
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });




    // ---------------------------------------------------- RABBIT MQ --------------------------------------------------------------

    // *************************************************************************** SEND MESSAGE BROKER ***
    app.post( `${ENDPOINT_URI}/rabbit/send` , async (req, res, next) => {

        // console.log('req.body.args==>', req.body.args);

        try {
            const broker = await rabbit.getInstance();
            const sendReponse = await broker.send('api-gateway', await Buffer.from(JSON.stringify(req.body.args)));
            req.body = "";
            // console.log('sendReponse==>', sendReponse);

            return res.json(sendReponse);
        }
        catch (e){
            console.log(e);
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    
};




export default setupRoutes;

