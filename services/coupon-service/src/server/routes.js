import {
    // CodeTypeModel,
    // MediaProductModel,
    CommerceTypeModel,
    CouponModel,
    ConsummerModel,
    ParameterModel,
    MediaProductModel,
    ProductModel,
    viewCouponModel,
    CouponsByCategoryModel,
    CouponsByBrandModel,
    CouponsByProductModel,
    CouponsByMediaModel,
    CouponsByCampaignModel,
    CouponsByDoctorModel,
    CouponsRollUp,
    CampaignProductModel,

    ClusterModel,
    ClusterProcessingModel,
    viewClusterProcessingModel,
    viewRedimedCouponModel,
} from "#root/db/models";

import * as sequelize from "sequelize";
import {Sequelize, DataTypes, } from "sequelize";

import csv from 'csv-parser';
import async from 'async';
import fs from 'fs';

import accessEnv from "#root/helpers/accessEnv";
import getDateOffset from "#root/helpers/getDateOffset";

import generateUUID from "#root/helpers/generateUUID";
import getWhere from "#root/helpers/getWhere";
import isEmpty from "lodash/isEmpty";

import moment from "moment";


import sequelizeDB from "./connection";

// import hashPassword from "#root/helpers/hashPassword";
// import passwordCompareSync from "#root/helpers/passwordCompareSync";
// import { addHours } from "date-fns";

const setupRoutes = app => {
    const ENDPOINT_URI = accessEnv("ENDPOINT_URI");
    // const USER_SESSION_EXPIRY_HOURS = accessEnv("USER_SESSION_EXPIRY_HOURS");

    // ------------------------------------------------- COMMERCE_TYPE ------------------------------------------

    // *************************************************************************** GET ALL COMMERCE_TYPES INFO ***
    app.post( `${ENDPOINT_URI}/commercetypes/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "commerce_type_status"});
        // console.log('filter', filter);

        try {
            const commerceTypes = await CommerceTypeModel.findAndCountAll({
                order: [['commerce_type_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(commerceTypes);
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

    // *************************************************************************** GET COUNT CODE-TYPES ***
    app.get( `${ENDPOINT_URI}/commercetypes/count` , async (req, res, next) => {

        try {
            const commerceTypes = await CommerceTypeModel.findAndCountAll();
            return res.json(commerceTypes);
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


    // *************************************************************************** GET COMMERCE_TYPE BY ID INFO ***
    app.get( `${ENDPOINT_URI}/commercetypes/:commerce_type_id` , async (req, res, next) => {

        try {
            const commerceType = await CommerceTypeModel.findOne({
                attributes: {},
                where: {
                    commerce_type_id: req.params.commerce_type_id ,
                    [sequelize.Op.not] : [{commerce_type_status: "X"}]
                }
            });
            return res.json(commerceType);
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


    // *************************************************************************** POST COMMERCE_TYPE (CREATE COMMERCE_TYPE)
    app.post(`${ENDPOINT_URI}/commercetypes`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.commerce_type_name) {
            return next (new Error("Commerce Types data are incomplete!"));
        }


        try {

            // Creo commerce type
            var COMMERCE_TYPE_ID=generateUUID();

            const newCommerceType = await CommerceTypeModel.create({
                commerce_type_id: COMMERCE_TYPE_ID,
                commerce_type_name: req.body.commerce_type_name,
            });

            // Devuelvo nueva code type
            return res.json(newCommerceType);

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


    // *************************************************************************** PUT COMMERCE TYPE (UPDATE COMMERCE TYPE)
    app.put(`${ENDPOINT_URI}/commercetypes/:commerce_type_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.commerce_type_id) {
            return next (new Error("Commerce Type ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.commerce_type_name) {
        //     return next (new Error("Commerce Type data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.commerce_type_name) updateJSON['commerce_type_name'] = req.body.args.commerce_type_name;
        if (req.body.args.commerce_type_status) updateJSON['commerce_type_status'] = req.body.args.commerce_type_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CommerceTypeModel.update(updateJSON,
            {
                where: {
                    commerce_type_id: req.params.commerce_type_id,
                    [sequelize.Op.not] : [{commerce_type_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type actualizado
            const updatedCommerceType = await CommerceTypeModel.findOne({
                attributes: {},
                where: {
                    commerce_type_id: req.params.commerce_type_id,
                    [sequelize.Op.not] : [{commerce_type_status: "X"}]
                }
            });

            if (!updatedCommerceType) return next(new Error("Invalid commerce type ID or Deleted"));
            return res.json(updatedCommerceType);


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


    // *************************************************************************** DELETE COMMERCE TYPE (DELETE COMMERCE TYPE)
    app.delete(`${ENDPOINT_URI}/commercetypes/:commerce_type_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.commerce_type_id) {
            return next (new Error("Commerce Type ID is missing!"));
        }

        try {

            // Actualizo code type como X
            const [numberOfAffectedRows, affectedRows] = await CommerceTypeModel.update({
                commerce_type_status: "X",
            },{
                where: {commerce_type_id: req.params.commerce_type_id, [sequelize.Op.not] : [{commerce_type_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo code type eliminado
            if (affectedRows==0) return next(new Error("Invalid commerce type ID or Deleted"));
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




    // ------------------------------------------------- CONSUMMER ------------------------------------------

    // *************************************************************************** GET ALL CONSUMMERS INFO ***
    app.post( `${ENDPOINT_URI}/consummers/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "consummer_status"});
        // console.log('filter', filter);

        try {
            const consummers = await ConsummerModel.findAndCountAll({
                order: [['consummer_name','asc']],
                attributes: {},
                where: filter
            });
            console.log("consummers==>", consummers);
            return res.json(consummers);
        }
        catch (e){
            // return next(e);
            // console.log("e===>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUNT CODE-TYPES ***
    app.get( `${ENDPOINT_URI}/consummers/count` , async (req, res, next) => {

        try {
            const consummers = await ConsummerModel.findAndCountAll();
            return res.json(consummers);
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


    // *************************************************************************** GET CONSUMMER BY ID INFO ***
    app.get( `${ENDPOINT_URI}/consummers/:consummer_id` , async (req, res, next) => {

        // console.log(req.params);

        try {
            const consummer = await ConsummerModel.findOne({
                attributes: {},
                where: {
                    consummer_id: req.params.consummer_id,
                    [sequelize.Op.not] : [{consummer_status: "X"}]
                }
            });
            return res.json(consummer);
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
    

    // *************************************************************************** GET CONSUMMER BY IDENTIFICATION ***
    app.get( `${ENDPOINT_URI}/consummers/identification/:consummer_identification` , async (req, res, next) => {
    
        try {
            const consummer = await ConsummerModel.findOne({
                attributes: {},
                where: {
                    consummer_identification: req.params.consummer_identification,
                    [sequelize.Op.not] : [{consummer_status: "X"}]
                }
            });
            return res.json(consummer);
        }
        catch (e){
            // return next(e);
            switch (e.name) {
                case "SequelizeUniqueConstraintError":
                    // return next({message: `Constraint Error: ${e.errors[0].message.replace(/"/g, "'")}`});
                    // return next({code:500, message: `Este email ya se encuentra registrado`});
                    return next(`Datos duplicados: ${e.errors[0].message.replace(/"/g, "'")}`);
                    break;
                case "SequelizeDatabaseError":
                    return next({message: `Database Error: ${e.parent.sqlMessage.replace(/"/g, "'")}`});
                    break;
                default:
                    return next({message: `Unknown error: ${e.message.replace(/"/g, "'")}`});
            }

        }

    });
    

    // *************************************************************************** GET CONSUMMER BY EMAIL ***
    app.get( `${ENDPOINT_URI}/consummers/email/:consummer_email` , async (req, res, next) => {

        try {
            const consummer = await ConsummerModel.findOne({
                attributes: {},
                where: {
                    consummer_email: req.params.consummer_email,
                    // [sequelize.Op.not] : [{consummer_status: "X"}]
                }
            });
            return res.json(consummer);
        }
        catch (e){
            // return next(e);
            switch (e.name) {
                case "SequelizeUniqueConstraintError":
                    // return next({message: `Constraint Error: ${e.errors[0].message.replace(/"/g, "'")}`});
                    // return next({code:500, message: `Este email ya se encuentra registrado`});
                    return next(`Datos duplicados: ${e.errors[0].message.replace(/"/g, "'")}`);
                    break;
                case "SequelizeDatabaseError":
                    return next({message: `Database Error: ${e.parent.sqlMessage.replace(/"/g, "'")}`});
                    break;
                default:
                    return next({message: `Unknown error: ${e.message.replace(/"/g, "'")}`});
            }

        }

    });


    // *************************************************************************** POST CONSUMMER (CREATE CONSUMMER)
    app.post(`${ENDPOINT_URI}/consummers`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.args.consummer_name || !req.body.args.consummer_email || !req.body.args.consummer_identification ||
            !req.body.args.consummer_phone || !req.body.args.consummer_city || !req.body.args.consummer_dob ) {
            return next (new Error("Consummer data are incomplete!"));
        }


        try {

            // Creo media product
            var CONSUMMER_ID=generateUUID();

            const newConsummer = await ConsummerModel.create({
                consummer_id: CONSUMMER_ID,
                consummer_name: req.body.args.consummer_name,
                consummer_email: req.body.args.consummer_email,
                consummer_identification: req.body.args.consummer_identification,
                consummer_phone: req.body.args.consummer_phone,
                consummer_city: req.body.args.consummer_city,
                consummer_dob: req.body.args.consummer_dob,
                consummer_origin: req.body.args.consummer_origin,
            });

            // Devuelvo nuevo media product
            return res.json(newConsummer);

        } catch(e) {
            // // return next(e);
            // console.log("e==>", e);
            // if (e.errors===undefined) {
            //     return next(new Error(e.parent.code))
            //     // return next(new Error(e.parent.sqlMessage))
            // } else {
            //     return next(new Error(e.errors[0].message))
            // }

            // Error Handling
            // console.log("e->", e.name);
            switch (e.name) {
                case "SequelizeUniqueConstraintError":
                    // return next({message: `Constraint Error: ${e.errors[0].message.replace(/"/g, "'")}`});
                    // return next({code:500, message: `Este email ya se encuentra registrado`});
                    return next(`Datos duplicados: ${e.errors[0].message.replace(/"/g, "'")}`);
                    break;
                case "SequelizeDatabaseError":
                    return next({message: `Database Error: ${e.parent.sqlMessage.replace(/"/g, "'")}`});
                    break;
                default:
                    return next({message: `Unknown error: ${e.message.replace(/"/g, "'")}`});
            }


        }


    });


    // *************************************************************************** PUT CONSUMMER (UPDATE CONSUMMER)
    app.put(`${ENDPOINT_URI}/consummers/:consummer_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.consummer_id) {
            return next (new Error("Consummer ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.consummer_id || !req.body.consummer_name || !req.body.consummer_email ||
        //     !req.body.consummer_identification || !req.body.consummer_phone || !req.body.consummer_city ||
        //     !req.body.consummer_dob) {
        //     return next (new Error("Consummer data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.consummer_name) updateJSON['consummer_name'] = req.body.args.consummer_name;
        if (req.body.args.consummer_email) updateJSON['consummer_email'] = req.body.args.consummer_email;
        if (req.body.args.consummer_identification) updateJSON['consummer_identification'] = req.body.args.consummer_identification;
        if (req.body.args.consummer_phone) updateJSON['consummer_phone'] = req.body.args.consummer_phone;
        if (req.body.args.consummer_city) updateJSON['consummer_city'] = req.body.args.consummer_city;
        if (req.body.args.consummer_dob) updateJSON['consummer_dob'] = req.body.args.consummer_dob;
        if (req.body.args.consummer_origin) updateJSON['consummer_origin'] = req.body.args.consummer_origin;
        if (req.body.args.consummer_status) updateJSON['consummer_status'] = req.body.args.consummer_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }


        try {

            const [numberOfAffectedRows, affectedRows] = await ConsummerModel.update(updateJSON,
            {
                where: {
                    consummer_id: req.params.consummer_id,
                    [sequelize.Op.not] : [{consummer_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo media product actualizado
            const updatedConsummer = await ConsummerModel.findOne({
                attributes: {},
                where: {
                    consummer_id: req.params.consummer_id,
                    [sequelize.Op.not] : [{consummer_status: "X"}]
                }
            });


            if (!updatedConsummer) return next(new Error("Invalid consummer ID or Deleted"));
            return res.json(updatedConsummer);


        } catch(e) {
            // // return next(e);
            // if (e.errors===undefined) {
            //     return next(new Error(e.parent.code))
            //     // return next(new Error(e.parent.sqlMessage))
            // } else {
            //     return next(new Error(e.errors[0].message))
            // }

            // Error Handling
            //console.log("e->",e);
            switch (e.name) {
                case "SequelizeUniqueConstraintError":
                    // return next({message: `Constraint Error: ${e.errors[0].message.replace(/"/g, "'")}`});
                    return next({message: `Este email ya se encuentra registrado`});
                    break;
                case "SequelizeDatabaseError":
                    return next({message: `Database Error: ${e.parent.sqlMessage.replace(/"/g, "'")}`});
                    break;
                default:
                    return next({message: `Unknown error: ${e.message.replace(/"/g, "'")}`});
            }


        }


    });


    // *************************************************************************** DELETE CONSUMMER (DELETE CONSUMMER)
    app.delete(`${ENDPOINT_URI}/consummers/:consummer_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.consummer_id) {
            return next (new Error("Consummer ID is missing!"));
        }

        const deletedConsummer = await ConsummerModel.findOne({
            attributes: {},
            where: {
                consummer_id: req.params.consummer_id,
                [sequelize.Op.not] : [{consummer_status: "X"}]
            }
        });

        if (!deletedConsummer) return next(new Error("Invalid consummer ID or Deleted"));

        try {

            // Actualizo media product como X
            const [numberOfAffectedRows, affectedRows] = await ConsummerModel.update({
                consummer_status: "X",
            },{
                where: {consummer_id: req.params.consummer_id, [sequelize.Op.not] : [{consummer_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo media product eliminado
            if (affectedRows==0) return next(new Error("Invalid consummer ID or Deleted"));
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



    // ------------------------------------------------- COUPON ------------------------------------------

    // *************************************************************************** GET ALL COUPON INFO ***
    app.post( `${ENDPOINT_URI}/coupons/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "coupon_status"});
        // console.log('filter', filter);

        try {
            const coupons = await viewCouponModel.findAndCountAll({
                raw: true,
                order: [['coupon_created','desc']],
                attributes: {},
                where: filter
            });

            // console.log("coupons on /coupons/all ==>", coupons);

            return res.json(coupons);
        }
        catch (e){
            // return next(e);
            // console.log("e=====>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET ROLLUP COUPON INFO ***
    app.post( `${ENDPOINT_URI}/coupons/rollup` , async (req, res, next) => {

        // console.log("req.body.args==>",req.body.args);
        const objFilter = JSON.parse(JSON.stringify(req.body));
        // console.log("obj==>",objFilter);

        const filter = await getWhere({filter: objFilter.filter, status: null});

        try {
            const coupons = await CouponsRollUp.findAndCountAll({
                order: [['category_name','asc'], ['brand_name','asc'], ['product_name','asc'], ['media_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(coupons);
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



    // *************************************************************************** GET COUNT CODE-TYPES ***
    app.get( `${ENDPOINT_URI}/coupons/count` , async (req, res, next) => {

        try {
            const coupons = await CouponModel.findAndCountAll();
            return res.json(coupons);
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


    // *************************************************************************** GET COUPON BY ID INFO ***
    app.get( `${ENDPOINT_URI}/coupons/:coupon_id` , async (req, res, next) => {

        try {
            const coupon = await CouponModel.findOne({
                attributes: {},
                where: {
                    coupon_id: req.params.coupon_id,
                    [sequelize.Op.not] : [{coupon_status: "X"}]
                }
            });
            return res.json(coupon);
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

    // *************************************************************************** GET COUPON BY ID CONSUMMER ***
    app.get( `${ENDPOINT_URI}/coupons/consummer/:consummer_id/:media_product_code` , async (req, res, next) => {

        try {
            const coupon = await viewCouponModel.findOne({
                attributes: {},
                where: {
                    [sequelize.Op.and]: {
                        consummer_id: req.params.consummer_id,
                        media_product_code: req.params.media_product_code
                    }
                }
            });
            return res.json(coupon);
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


    // *************************************************************************** GET COUPON BY CODEBAR INFO ***
    app.get( `${ENDPOINT_URI}/coupons/codebar/:coupon_codebar` , async (req, res, next) => {

        // console.log("req.params==>", req.params);

        try {
            var coupon;
            var mediaProductCoupon;
            var campaignProductCoupon;
            var productCoupon;

            coupon = await CouponModel.findOne({
                raw: true,
                attributes: {},
                where: {
                    [sequelize.Op.and] : {
                        coupon_codebar: {[sequelize.Op.eq]: req.params.coupon_codebar },
                        coupon_expire: {[sequelize.Op.gte]: new Date() },
                        coupon_redimed: {[sequelize.Op.is]: null },
                        coupon_status: {[sequelize.Op.not]: ["X", "I", "R"] },
                    }
                }
            });

            if (coupon===null) return next (new Error("Invalid coupon code bar,  Deleted or Redimmed !"));

            // console.log(`coupon========>${JSON.stringify(coupon)}`);
            // if (coupon) {
            //     console.log( (coupon.coupon_expire>new Date()) ? "true" : "false" );
            //     console.log('coupon==>', coupon);
            // }

            var consummer = await ConsummerModel.findOne({
                raw: true,
                attributes: {},
                where: {
                    [sequelize.Op.and] : {
                        consummer_id: {[sequelize.Op.eq]: coupon.consummer_id },
                    }
                }
            });


            // console.log("coupon==>", coupon);

            if (coupon.media_product_id !== null ) {
                // Es CUPON NORMAL
                mediaProductCoupon = await MediaProductModel.findOne({
                    raw: true,
                    attributes: {},
                    where: {
                        media_product_id: coupon.media_product_id,
                        [sequelize.Op.not] : [{media_product_status: ["X", "I"]}]
                    }
                });

                productCoupon = await ProductModel.findOne({
                    raw: true,
                    attributes: {},
                    where: {
                        product_id: mediaProductCoupon.product_id,
                        [sequelize.Op.not] : [{product_status: ["X", "I"]}]
                    }
                });

                //Agrego este item <product_sku>
                // coupon.dataValues.product_sku = productCoupon.product_sku;
                // coupon.dataValues.product_descto = mediaProductCoupon.media_product_descto;
                coupon.product_sku = productCoupon.product_sku;
                coupon.product_name = productCoupon.product_name;
                coupon.product_descto = mediaProductCoupon.media_product_descto;
                coupon.consummer_name = consummer.consummer_name;
                coupon.consummer_identification = consummer.consummer_identification;

            } else {
                // Es CUPON MEDICO
                campaignProductCoupon = await CampaignProductModel.findOne({
                    raw: true,
                    attributes: {},
                    where: {
                        campaign_product_id: coupon.campaign_product_id,
                        [sequelize.Op.not] : [{campaign_product_status: ["X", "I"]}]
                    }
                });


                productCoupon = await ProductModel.findOne({
                    raw: true,
                    attributes: {},
                    where: {
                        product_id: campaignProductCoupon.product_id,
                        [sequelize.Op.not] : [{product_status: ["X", "I"]}]
                    }
                });



                //Agrego este item <product_sku>
                // coupon.dataValues.product_descto = campaignProductCoupon.campaign_product_descto;
                // coupon.dataValues.product_sku = productCoupon.product_sku;
                coupon.product_sku = productCoupon.product_sku;
                coupon.product_name = productCoupon.product_name;
                coupon.product_descto = campaignProductCoupon.campaign_product_descto;
                coupon.consummer_name = consummer.consummer_name;
                coupon.consummer_identification = consummer.consummer_identification;

            }

            // console.log('coupon==>', coupon);

            return res.json(coupon);
        }
        catch (e){
            console.log("e===>", e);
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPON BY CODEBAR INFO ***
    app.get( `${ENDPOINT_URI}/coupons/codebar/simple/:coupon_codebar` , async (req, res, next) => {

        // console.log("req.params==>", req.params);

        try {
            var coupon;
            var mediaProductCoupon;
            var campaignProductCoupon;
            var productCoupon;

            coupon = await CouponModel.findOne({
                raw: true,
                attributes: {},
                where: {
                    [sequelize.Op.and] : {
                        coupon_codebar: {[sequelize.Op.eq]: req.params.coupon_codebar },
                        coupon_expire: {[sequelize.Op.gte]: new Date() },
                        coupon_redimed: {[sequelize.Op.is]: null },
                        coupon_status: {[sequelize.Op.not]: ["X", "R", "I"] },
                    }
                }
            });

            return res.json(coupon);
        }
        catch (e){
            // console.log("e===>", e);
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** POST COUPON (CREATE COUPON)
    app.post(`${ENDPOINT_URI}/coupons`, async(req, res, next) => {

        // Valido el body si llega con todos los datos
        console.log(`req.body.args-->${JSON.stringify(req.body.args)}`);
        
        if (!req.body.args.consummer_id || !req.body.args.coupon_codebar || !req.body.args.coupon_expire &&
            (!req.body.args.media_product_id || !req.body.args.campaign_product_id  )
            ) {
            return next (new Error("Coupon Media Product, Campaign Product, Consummer or Expire Date data is missing !"));
        }

        // Armo el JSON de Creacion solo con los campos que vienen
        var createJSON = {};
        // Creo media product
        var COUPON_ID=generateUUID();
        createJSON['coupon_id'] = COUPON_ID;
        if (req.body.args.media_product_id) createJSON['media_product_id'] = req.body.args.media_product_id;
        if (req.body.args.campaign_product_id) createJSON['campaign_product_id'] = req.body.args.campaign_product_id;
        if (req.body.args.commerce_type_id) createJSON['commerce_type_id'] = req.body.args.commerce_type_id;
        if (req.body.args.consummer_id) createJSON['consummer_id'] = req.body.args.consummer_id;
        if (req.body.args.coupon_codebar) createJSON['coupon_codebar'] = req.body.args.coupon_codebar;
        if (req.body.args.coupon_expire) createJSON['coupon_expire'] = req.body.args.coupon_expire;
        if (req.body.args.coupon_host) createJSON['coupon_host'] = req.body.args.coupon_host;
        if (req.body.args.coupon_ip) createJSON['coupon_ip'] = req.body.args.coupon_ip;
        if (req.body.args.coupon_latitude) createJSON['coupon_latitude'] = req.body.args.coupon_latitude;
        if (req.body.args.coupon_longitude) createJSON['coupon_longitude'] = req.body.args.coupon_longitude;
        if (req.body.args.coupon_device) createJSON['coupon_device'] = req.body.args.coupon_device;
        if (req.body.args.coupon_source) createJSON['coupon_source'] = req.body.args.coupon_source;

        // console.log(Object.entries(updateJSON).length);

        if (isEmpty(createJSON)) {
            return next (new Error("Nothing to create !"));
        }


        try {

            const newCoupon = await CouponModel.create(createJSON);

            // Devuelvo nuevo cupon
            return res.json(newCoupon);

        } catch(e) {
            console.log(`e-->${JSON.stringify(e)}`);
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** PUT COUPON (UPDATE COUPON)
    app.put(`${ENDPOINT_URI}/coupons/:coupon_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.coupon_id) {
            return next (new Error("Coupon ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.coupon_id || !req.body.media_product_id || !req.body.commerce_type_id ||
        //     !req.body.consummer_id || !req.body.coupon_codebar || !req.body.coupon_expire ) {
        //     return next (new Error("Coupon data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.media_product_id) updateJSON['media_product_id'] = req.body.args.media_product_id;
        if (req.body.args.campaign_product_id) updateJSON['campaign_product_id'] = req.body.args.campaign_product_id;
        if (req.body.args.commerce_type_id) updateJSON['commerce_type_id'] = req.body.args.commerce_type_id;
        if (req.body.args.consummer_id) updateJSON['consummer_id'] = req.body.args.consummer_id;
        if (req.body.args.coupon_codebar) updateJSON['coupon_codebar'] = req.body.args.coupon_codebar;
        if (req.body.args.coupon_expire) updateJSON['coupon_expire'] = req.body.args.coupon_expire;
        if (req.body.args.coupon_redimed) updateJSON['coupon_redimed'] = req.body.args.coupon_redimed;
        if (req.body.args.coupon_host) updateJSON['coupon_host'] = req.body.args.coupon_host;
        if (req.body.args.coupon_ip) updateJSON['coupon_ip'] = req.body.args.coupon_ip;
        if (req.body.args.coupon_latitude) updateJSON['coupon_latitude'] = req.body.args.coupon_latitude;
        if (req.body.args.coupon_longitude) updateJSON['coupon_longitude'] = req.body.args.coupon_longitude;
        if (req.body.args.coupon_device) updateJSON['coupon_longitude'] = req.body.args.coupon_device;
        if (req.body.args.coupon_status) updateJSON['coupon_status'] = req.body.args.coupon_status;

        // console.log(Object.entries(updateJSON).length);

        if (isEmpty(updateJSON)) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CouponModel.update(updateJSON,
            {
                where: {
                    coupon_id: req.params.coupon_id, 
                    [sequelize.Op.not] : [{coupon_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo media product actualizado
            const updatedCoupon = await CouponModel.findOne({
                attributes: {},
                where: {
                    coupon_id: req.params.coupon_id, 
                    [sequelize.Op.not] : [{coupon_status: "X"}]
                }
            });

            if (!updatedCoupon) return next(new Error("Invalid coupon ID or Deleted"));
            return res.json(updatedCoupon);


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


    // *************************************************************************** PUT COUPON (REDIME COUPON)
    app.put(`${ENDPOINT_URI}/coupons/redime/:coupon_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.coupon_id || !req.body.args.coupon_redimed_store) {
            return next (new Error("Coupon ID or STORE are missing!"));
        }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        // updateJSON['coupon_redimed'] = new Date();
        updateJSON['coupon_redimed'] = getDateOffset(-5);
        updateJSON['coupon_status'] = "R";
        if (req.body.args.commerce_type_id) updateJSON['commerce_type_id'] = req.body.args.commerce_type_id;
        if (req.body.args.coupon_host) updateJSON['coupon_host'] = req.body.args.coupon_host;
        if (req.body.args.coupon_ip) updateJSON['coupon_ip'] = req.body.args.coupon_ip;
        if (req.body.args.coupon_latitude) updateJSON['coupon_latitude'] = req.body.args.coupon_latitude;
        if (req.body.args.coupon_longitude) updateJSON['coupon_longitude'] = req.body.args.coupon_longitude;
        if (req.body.args.coupon_device) updateJSON['coupon_device'] = req.body.args.coupon_device;
        if (req.body.args.coupon_redimed_store) updateJSON['coupon_redimed_store'] = req.body.args.coupon_redimed_store;

        // console.log(Object.entries(updateJSON).length);

        if (isEmpty(updateJSON)) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CouponModel.update(updateJSON,
            {
                where: {
                    [sequelize.Op.and]: {
                        coupon_id: req.params.coupon_id,
                        [sequelize.Op.not] : [{coupon_status: ["X", "I", "R"]}]
                    }

                },
                returning: true,
            });


            if (affectedRows==0) return next (new Error("Invalid coupon ID,  Deleted or Redimmed !"));


            // Devuelvo media product actualizado
            var updatedCoupon = await CouponModel.findOne({
                raw: true,
                attributes: {},
                where: {
                    coupon_id: req.params.coupon_id,
                    coupon_status : {[sequelize.Op.eq]: "R"}
                }
            });

            var mediaProductCoupon;
            var campaignProductCoupon;
            var productCoupon;
            var consummerCoupon;


            if (updatedCoupon.media_product_id !== null ) {
                // CUPON NORMAL
                mediaProductCoupon = await MediaProductModel.findOne({
                    attributes: {},
                    where: {
                        media_product_id: updatedCoupon.media_product_id,
                        [sequelize.Op.not] : [{media_product_status: ["X", "I"]}]
                    }
                });


                productCoupon = await ProductModel.findOne({
                    attributes: {},
                    where: {
                        product_id: mediaProductCoupon.product_id,
                        [sequelize.Op.not] : [{product_status: ["X", "I"]}]
                    }
                });

                consummerCoupon = await ConsummerModel.findOne({
                    attributes: {},
                    where: {
                        consummer_id: updatedCoupon.consummer_id,
                    }
                });

                //Agrego este item <product_sku>
                // updatedCoupon.dataValues.product_sku = productCoupon.product_sku;
                // updatedCoupon.dataValues.product_descto = mediaProductCoupon.media_product_descto;
                updatedCoupon.product_sku = productCoupon.product_sku;
                updatedCoupon.product_name = productCoupon.product_name;
                updatedCoupon.product_descto = mediaProductCoupon.media_product_descto;
                updatedCoupon.consummer_name = consummerCoupon.consummer_name;
                updatedCoupon.consummer_identification = consummerCoupon.consummer_identification;


            } else {
                // CUPON MEDICO
                campaignProductCoupon = await CampaignProductModel.findOne({
                    attributes: {},
                    where: {
                        campaign_product_id: updatedCoupon.campaign_product_id,
                        [sequelize.Op.not] : [{campaign_product_status: ["X", "I"]}]
                    }
                });

                productCoupon = await ProductModel.findOne({
                    attributes: {},
                    where: {
                        product_id: campaignProductCoupon.product_id,
                        [sequelize.Op.not] : [{product_status: ["X", "I"]}]
                    }
                });


                consummerCoupon = await ConsummerModel.findOne({
                    attributes: {},
                    where: {
                        consummer_id: updatedCoupon.consummer_id,
                    }
                });


                //Agrego este item <product_sku>
                // updatedCoupon.dataValues.product_sku = productCoupon.product_sku;
                // updatedCoupon.dataValues.product_descto = campaignProductCoupon.campaign_product_descto;
                updatedCoupon.product_sku = productCoupon.product_sku;
                updatedCoupon.product_name = productCoupon.product_name;
                updatedCoupon.product_descto = campaignProductCoupon.campaign_product_descto;
                updatedCoupon.consummer_name = consummerCoupon.consummer_name;
                updatedCoupon.consummer_identification = consummerCoupon.consummer_identification;

            }

            // console.log('updatedCoupon==>', updatedCoupon);

            if (!updatedCoupon) return next(new Error("Invalid coupon ID, Deleted or Redimmed"));


            return res.json(updatedCoupon);


        } catch(e) {

            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** PUT COUPON ARRAY (REDIME COUPON ARRAY)
    app.post(`${ENDPOINT_URI}/coupons/redime/array`, async(req, res, next) => {

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var couponsProccessedKeyArray = [];
        for(const _coupon of req.body.args.coupons) {
            let updateJSON = {};
            updateJSON['coupon_redimed'] = new Date();
            updateJSON['coupon_status'] = "R";
            updateJSON['coupon_redime_store'] = req.body.args.store;
            couponsProccessedKeyArray.push(_coupon.coupon_id);
        }

        try {

            console.log(`Procesando: ${JSON.stringify(couponsProccessedKeyArray)}`);

            let recs= await sequelizeDB.getQueryInterface().bulkUpdate(
                'coupon',
                {
                    coupon_redimed: new Date(),
                    coupon_status: "R",
                    coupon_redimed_store: req.body.args.store
                },
                {
                    coupon_id: {[Sequelize.Op.in]: couponsProccessedKeyArray},
                    coupon_status: {
                        [Sequelize.Op.not]: ["X", "I", "R"]
                    }
                },
                {type: Sequelize.QueryTypes.BULKUPDATE}
                );

            let couponsProccessedArray = [];
            let redimedCouponsArray=[];

            if (recs==0) {
                for(const _coupon of req.body.args.coupons) {
                    couponsProccessedArray.push( {
                        coupon_id: _coupon.coupon_id,
                        coupon_error: true,
                        coupon_message: `Invalid coupon ID,  Deleted or Redimmed !`,
                        coupon_sku: null
                    })
                }
                console.log(`Respondiendo: ${JSON.stringify(couponsProccessedArray)}`);
                return res.json(couponsProccessedArray);
            }

            try {
                redimedCouponsArray = await viewRedimedCouponModel.findAll({
                    raw: true,
                    attributes: {},
                    where: {
                        coupon_id: {[Sequelize.Op.in]: [couponsProccessedKeyArray]}
                    }
                });

                // valido cuales fueron redimidos o no
                if (redimedCouponsArray){
                    for(const _coupon of req.body.args.coupons) {
                        let redimed=redimedCouponsArray.find(x => x.coupon_id==_coupon.coupon_id);
                        if (redimed){
                            couponsProccessedArray.push( {
                                coupon_id: _coupon.coupon_id,
                                coupon_error: false,
                                coupon_message: `Cupón REDIMIDO: El cupón se redimió satisfactoriamente.`,
                                coupon_sku: `${redimed.product_sku}`,
                                coupon_name: `${redimed.product_name}`,
                                consummer_name: `${redimed.consummer_name}`,
                                consummer_identification: `${redimed.consummer_identification}`
                            })
                        } else {
                            couponsProccessedArray.push( {
                                coupon_id: _coupon.coupon_id,
                                coupon_error: true,
                                coupon_message: `Invalid coupon ID,  Deleted or Redimmed !`,
                                coupon_sku: null,
                                coupon_name: null,
                                consummer_name: null,
                                consummer_identification: null
                            })
                        }
                    }
                    console.log(`Respondiendo: ${JSON.stringify(couponsProccessedArray)}`);
                    return res.json(couponsProccessedArray);
                }
            }
            catch (e){
               // console.log(`error ----> ${JSON.stringify(e.message)}`);
                console.log(`Respondiendo: ${JSON.stringify(e.message)}`);
                return next(new Error(`Error finding redimed files: ${JSON.stringify(e.message)}`))
            }
        } catch(e) {
            // console.log(e);
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }
        }
    });

    // *************************************************************************** PUT COUPON (REDIME FILE)
    app.put(`${ENDPOINT_URI}/coupons/redime/file/:coupon_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.coupon_id) {
            return next (new Error("Coupon ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.coupon_id || !req.body.media_product_id || !req.body.commerce_type_id ||
        //     !req.body.consummer_id || !req.body.coupon_codebar || !req.body.coupon_expire ) {
        //     return next (new Error("Coupon data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        updateJSON['coupon_redimed'] = req.body.redimed;
        updateJSON['coupon_status'] = "R";
        updateJSON['commerce_type_id'] = req.body.commerceType;
        updateJSON['coupon_redimed_file'] = req.body.uploaded;


        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CouponModel.update(updateJSON,
            {
                where: {
                    coupon_id: req.params.coupon_id,
                    [sequelize.Op.not] : [{coupon_status: ["X", "I", "R"]}]
                },
                returning: true,
                // plain: true,
            });


            if (affectedRows===0) return next (new Error("Invalid coupon ID,  Deleted or Redimmed !"));


            // Devuelvo media product actualizado
            const updatedCoupon = await CouponModel.findOne({
                attributes: {},
                where: {
                    coupon_id: req.params.coupon_id,
                    coupon_status : {[sequelize.Op.eq]: "R"}
                }
            });

            // console.log('updatedCoupon==>', updatedCoupon);

            if (!updatedCoupon) return next(new Error("Invalid coupon ID, Deleted or Redimmed"));

            return res.json(updatedCoupon);


        } catch(e) {
            // console.log(e);
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** DELETE COUPON (DELETE COUPON)
    app.delete(`${ENDPOINT_URI}/coupons/:coupon_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.coupon_id) {
            return next (new Error("Coupon ID is missing!"));
        }

        const deletedCoupon = await CouponModel.findOne({
            attributes: {},
            where: {
                coupon_id: req.params.coupon_id,
                [sequelize.Op.not] : [{coupon_status: "X"}]
            }
        });

        if (!deletedCoupon) return next(new Error("Invalid coupon ID or Deleted"));

        try {

            // Actualizo media product como X
            const [numberOfAffectedRows, affectedRows] = await CouponModel.update({
                coupon_status: "X",
            },{
                where: {
                    coupon_id: req.params.coupon_id,
                    [sequelize.Op.not] : [{coupon_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo media product eliminado
            if (affectedRows==0) return next(new Error("Invalid coupon ID or Deleted"));
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



    // *************************************************************************** GET COUPON BY CONSUMMER-PRODUCT INFO ***
    app.post( `${ENDPOINT_URI}/coupons/consummer/product` , async (req, res, next) => {

        // const dateTime = await moment().format('YYYY-MM-DDTHH:mm:ss.SSS000');
        // const dateTime = await moment().utc().format('YYYY-MM-DD HH:mm:ss');

        try {
            const coupons = await CouponModel.findAndCountAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        consummer_id: req.body.consummer_id ,
                        coupon_source: req.body.product_id ,
                        coupon_expire: { [sequelize.Op.gte]: moment() },
                        [sequelize.Op.not] : [{coupon_status: ["X", "R"]}]

                    }],
                }
            });

            // console.log("coupons en /coupons/consummer/product==>", coupons);

            return res.json(coupons);
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



    // *************************************************************************** GET COUPON BY CONSUMMER-MEDIA INFO ***
    app.post( `${ENDPOINT_URI}/coupons/consummer/media` , async (req, res, next) => {

        // const dateTime = await moment().format('YYYY-MM-DDTHH:mm:ss.SSS000');
        // const dateTime = await moment().utc().format('YYYY-MM-DD HH:mm:ss');

        try {
            const coupons = await CouponModel.findAndCountAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        consummer_id: req.body.consummer_id ,
                        coupon_source: (req.body.media_id + "," + req.body.product_id) ,
                        coupon_expire: { [sequelize.Op.gte]: moment() },
                        [sequelize.Op.not] : [{coupon_status: ["X", "R"]}]

                    }],
                }
            });

            return res.json(coupons);
        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPON BY CAMPAIGN-DOCTOR INFO ***
    app.post( `${ENDPOINT_URI}/coupons/campaign/doctor` , async (req, res, next) => {

        // const dateTime = await moment().format('YYYY-MM-DDTHH:mm:ss.SSS000');
        // const dateTime = await moment().utc().format('YYYY-MM-DD HH:mm:ss');

        try {
            const coupons = await CouponModel.findAndCountAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        consummer_id: { [sequelize.Op.eq]: req.body.consummer_id },
                        // coupon_source: { [sequelize.Op.like]: '%' + req.body.campaign_doctor_id  + '%' } ,
                        coupon_source: { [sequelize.Op.like]: (req.body.campaign_doctor_id + "," + req.body.product_id + "," + req.body.doctor_id) } ,
                        coupon_expire: { [sequelize.Op.gte]: moment() },
                        coupon_status: { [sequelize.Op.not]: ["X", "R"]},

                    }],
                }
            });

            return res.json(coupons);
        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPON BY COMMERCE-TYPE INFO ***
    app.get( `${ENDPOINT_URI}/coupons/commerceType/:commerce_type_id` , async (req, res, next) => {


        try {
            const coupons = await CouponModel.findAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        commerce_type_id: req.params.commerce_type_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);
        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPON BY MEDIA_PRODUCT INFO ***
    app.get( `${ENDPOINT_URI}/coupons/media_product/:media_product_id` , async (req, res, next) => {

        try {
            const coupons = await CouponModel.findAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        media_product_id: req.params.media_product_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);

        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPON BY CONSUMMER INFO ***
    app.get( `${ENDPOINT_URI}/coupons/consummer/:consummer_id` , async (req, res, next) => {


        try {
            const coupons = await CouponModel.findAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        consummer_id: req.body.consummer_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);
        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // ------------------------------------------------------ VIEWS ---------------------------

    // *************************************************************************** GET COUPONS BY CATEGORY_ID INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byCategory/:category_id` , async (req, res, next) => {

        try {
            const coupons = await viewCouponModel.findAndCountAll({
                raw: true,
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        category_id: req.params.category_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);

        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPONS BY BRAND_ID INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byBrand/:brand_id` , async (req, res, next) => {

        try {
            const coupons = await viewCouponModel.findAndCountAll({
                raw: true,
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        brand_id: req.params.brand_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            // console.log("coupons==>", coupons);
            return res.json(coupons);

        }
        catch (e) {
            // console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });




    // *************************************************************************** GET COUPONS BY PRODUCT_ID INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byProduct/:product_id` , async (req, res, next) => {

        try {
            const coupons = await viewCouponModel.findAndCountAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        product_id: req.params.product_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);

        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPONS BY MEDIA_ID INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byMedia/:media_id` , async (req, res, next) => {

        try {
            const coupons = await viewCouponModel.findAndCountAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        media_id: req.params.media_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);

        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });



    // *************************************************************************** GET COUPONS BY CAMPAIGN_ID INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byCampaign/:campaign_id` , async (req, res, next) => {

        try {
            const coupons = await viewCouponModel.findAndCountAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        campaign_id: req.params.campaign_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);

        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });



    // *************************************************************************** GET COUPONS BY DOCTOR_ID INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byDoctor/:doctor_id` , async (req, res, next) => {

        try {
            const coupons = await viewCouponModel.findAndCountAll({
                order: [['coupon_created','asc']],
                attributes: {},
                where: {
                    [sequelize.Op.and] : [{
                        doctor_id: req.params.doctor_id ,
                        [sequelize.Op.not] : [{coupon_status: ["X"]}]

                    }],
                }
            });

            return res.json(coupons);

        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });



    // *************************************************************************** GET COUPONS METRICS BY CATEGORY INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byCategoryMetrics/:category_id/:from/:to` , async (req, res, next) => {

        // Inicializo WHERE
        var xWhere;
        xWhere={
            [sequelize.Op.and] : [],
        };

        var xAttributes;

        xAttributes={
            attributes: [
                'id',
                'name',
                [ Sequelize.fn('sum', Sequelize.col('coupons_generated')), 'coupons_generated'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_redimed')), 'coupons_redimed'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_expired')), 'coupons_expired'],
            ],
            group: ['id', 'name'],
            where: xWhere,
            order: Sequelize.literal('name ASC'),
            raw: true
        };


        if (
            req.params.category_id ==="undefined" &&
            req.params.from==="undefined" &&
            req.params.to==="undefined"
        ) {
            xWhere={};
        } else {

            if (req.params.category_id && req.params.category_id!=='undefined') {

                // Agrego filtro por categoria
                xWhere[sequelize.Op.and].push({
                    id: req.params.category_id ,
                });

                // Agrego filtro por fechas
                if (req.params.from!=="undefined" && req.params.to!=="undefined") {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });
                }

                xAttributes={
                    attributes: [
                        'id',
                        'name',
                        'dates',
                        'coupons_generated',
                        'coupons_redimed',
                        'coupons_expired',
                    ],
                    where: xWhere,
                    order: Sequelize.literal('name ASC'),
                    raw: true,
                };


            } else {

                if (req.params.from && req.params.to) {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };


                }

            }

        }



        // console.log("xWhere==>", xWhere);

        try {

            var coupons = await CouponsByCategoryModel.findAndCountAll(xAttributes);
            // console.log("coupons==>", JSON.stringify(coupons));
            return res.json(coupons);
        }
        catch (e){
            // console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });




    // *************************************************************************** GET COUPONS METRICS BY BRAND INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byBrandMetrics/:brand_id/:from/:to` , async (req, res, next) => {

        // Inicializo WHERE
        var xWhere;
        xWhere={
            [sequelize.Op.and] : [],
        };


        var xAttributes;

        xAttributes={
            attributes: [
                'id',
                'name',
                [ Sequelize.fn('sum', Sequelize.col('coupons_generated')), 'coupons_generated'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_redimed')), 'coupons_redimed'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_expired')), 'coupons_expired'],
            ],
            group: ['id', 'name'],
            where: xWhere,
            order: Sequelize.literal('name ASC'),
            raw: true
        };



        if (req.params.brand_id ==="undefined" && req.params.from==="undefined" && req.params.to==="undefined") {
            xWhere={};
        } else {

            if (req.params.brand_id && req.params.brand_id!=='undefined') {

                // Agrego filtro por brand
                xWhere[sequelize.Op.and].push({
                    id: req.params.brand_id ,
                });

                // Agrego filtro por fechas
                if (req.params.from!=="undefined" && req.params.to!=="undefined") {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });
                }

                xAttributes={
                    attributes: [
                        'id',
                        'name',
                        'dates',
                        'coupons_generated',
                        'coupons_redimed',
                        'coupons_expired',
                    ],
                    where: xWhere,
                    order: Sequelize.literal('name ASC'),
                    raw: true,
                };


            } else {

                if (req.params.from && req.params.to) {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };

                }

            }

        }

        // console.log("xWhere==>", xWhere);

        try {
            const coupons = await CouponsByBrandModel.findAndCountAll(xAttributes);
            // console.log("coupons==>", coupons);
            return res.json(coupons);
        }
        catch (e){
            // console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPONS METRICS BY PRODUCT INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byProductMetrics/:product_id/:from/:to` , async (req, res, next) => {

        // Inicializo WHERE
        var xWhere;
        xWhere={
            [sequelize.Op.and] : [],
        };

        var xAttributes;

        xAttributes={
            attributes: [
                'id',
                'name',
                [ Sequelize.fn('sum', Sequelize.col('coupons_generated')), 'coupons_generated'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_redimed')), 'coupons_redimed'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_expired')), 'coupons_expired'],
            ],
            group: ['id', 'name'],
            where: xWhere,
            order: Sequelize.literal('name ASC'),
            raw: true
        };

        if (req.params.product_id==="undefined" && req.params.from==="undefined" && req.params.to==="undefined") {
            xWhere={};
        } else {

            if (req.params.product_id && req.params.product_id!=='undefined') {
                // Agrego filtro por prdoucto
                xWhere[sequelize.Op.and].push({
                    id: req.params.product_id ,
                });

                // Agrego filtro por fechas
                if (req.params.from!=="undefined" && req.params.to!=="undefined") {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };

                }

            } else {

                if (req.params.from && req.params.to) {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };

                }
            }


        }


        // console.log("xWhere==>", xWhere);
        // console.log("xAttributes==>", xAttributes);

        try {
            const coupons = await CouponsByProductModel.findAndCountAll(xAttributes);
            // console.log("coupons==>", coupons);
            return res.json(coupons);

        }
        catch (e){
            console.log('e==>',e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET COUPONS METRICS BY MEDIA INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byMediaMetrics/:media_id/:from/:to` , async (req, res, next) => {

        // Inicializo WHERE
        var xWhere;
        xWhere={
            [sequelize.Op.and] : [],
        };

        var xAttributes;

        xAttributes={
            attributes: [
                'id',
                'name',
                [ Sequelize.fn('sum', Sequelize.col('coupons_generated')), 'coupons_generated'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_redimed')), 'coupons_redimed'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_expired')), 'coupons_expired'],
            ],
            group: ['id', 'name'],
            where: xWhere,
            order: Sequelize.literal('name ASC'),
            raw: true
        };


        if (req.params.media_id==="undefined" && req.params.from==="undefined" && req.params.to==="undefined") {
            xWhere={};
        } else {

            if (req.params.media_id && req.params.media_id!=='undefined') {

                // Agrego filtro por categoria
                xWhere[sequelize.Op.and].push({
                    id: req.params.media_id ,
                });

                // Agrego filtro por fechas
                if (req.params.from!=="undefined" && req.params.to!=="undefined") {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });
                }

                xAttributes={
                    attributes: [
                        'id',
                        'name',
                        'dates',
                        'coupons_generated',
                        'coupons_redimed',
                        'coupons_expired',
                    ],
                    where: xWhere,
                    order: Sequelize.literal('name ASC'),
                    raw: true,
                };


            } else {

                if (req.params.from && req.params.to) {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };

                }

            }

        }


        // console.log("xWhere==>", xWhere);


        try {
            const coupons = await CouponsByMediaModel.findAndCountAll(xAttributes);

            // console.log("coupons==>", coupons);

            return res.json(coupons);

        }
        catch (e){
            // console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });
    


    // *************************************************************************** GET COUPONS METRICS BY CAMPAIGN INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byCampaignMetrics/:campaign_id/:from/:to` , async (req, res, next) => {

        // Inicializo WHERE
        var xWhere;
        xWhere={
            [sequelize.Op.and] : [],
        };

        var xAttributes;

        xAttributes={
            attributes: [
                'id',
                'name',
                [ Sequelize.fn('sum', Sequelize.col('coupons_generated')), 'coupons_generated'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_redimed')), 'coupons_redimed'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_expired')), 'coupons_expired'],
            ],
            group: ['id', 'name'],
            where: xWhere,
            order: Sequelize.literal('name ASC'),
            raw: true
        };


        if (
            req.params.campaign_id ==="undefined" &&
            req.params.from==="undefined" &&
            req.params.to==="undefined"
        ) {
            xWhere={};
        } else {

            if (req.params.campaign_id && req.params.campaign_id!=='undefined') {

                // Agrego filtro por categoria
                xWhere[sequelize.Op.and].push({
                    id: req.params.campaign_id ,
                });

                // Agrego filtro por fechas
                if (req.params.from!=="undefined" && req.params.to!=="undefined") {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };

                }

            } else {

                if (req.params.from && req.params.to) {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };

                }

            }

        }



        // console.log("xWhere==>", xWhere);

        try {

            var coupons = await CouponsByCampaignModel.findAndCountAll(xAttributes);
            // console.log("coupons==>", JSON.stringify(coupons));
            return res.json(coupons);
        }
        catch (e){
            // console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    

    // *************************************************************************** GET COUPONS METRICS BY DOCTOR INFO ***
    app.get( `${ENDPOINT_URI}/coupons/byDoctorMetrics/:doctor_id/:from/:to` , async (req, res, next) => {

        // Inicializo WHERE
        var xWhere;
        xWhere={
            [sequelize.Op.and] : [],
        };


        var xAttributes;

        xAttributes={
            attributes: [
                'id',
                'name',
                [ Sequelize.fn('sum', Sequelize.col('coupons_generated')), 'coupons_generated'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_redimed')), 'coupons_redimed'],
                [ Sequelize.fn('sum', Sequelize.col('coupons_expired')), 'coupons_expired'],
            ],
            group: ['id', 'name'],
            where: xWhere,
            order: Sequelize.literal('name ASC'),
            raw: true
        };


        if (
            req.params.doctor_id ==="undefined" &&
            req.params.from==="undefined" &&
            req.params.to==="undefined"
        ) {
            xWhere={};
        } else {

            if (req.params.doctor_id && req.params.doctor_id!=='undefined') {

                // Agrego filtro por categoria
                xWhere[sequelize.Op.and].push({
                    id: req.params.doctor_id ,
                });

                // Agrego filtro por fechas
                if (req.params.from!=="undefined" && req.params.to!=="undefined") {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });

                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };


                }

            } else {

                if (req.params.from && req.params.to) {
                    xWhere[sequelize.Op.and].push({
                        dates: {
                            [sequelize.Op.between]: [req.params.from, req.params.to]
                        }
                    });


                    xAttributes={
                        attributes: [
                            'id',
                            'name',
                            'dates',
                            'coupons_generated',
                            'coupons_redimed',
                            'coupons_expired',
                        ],
                        where: xWhere,
                        order: Sequelize.literal('name ASC'),
                        raw: true,
                    };


                }

            }

        }



        // console.log("xWhere==>", xWhere);

        try {

            var coupons = await CouponsByDoctorModel.findAndCountAll(xAttributes);
            // console.log("coupons==>", JSON.stringify(coupons));
            return res.json(coupons);
        }
        catch (e){
            // console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // ---------------------------------------------------- CLUSTER ---------------------------------------------
    // *************************************************************************** CLUSTERS BATCH FILE ***
    app.post(`${ENDPOINT_URI}/clusters/batchfile`, async(req, res, next) => {
        // Valido el body si llega con todos los datos
        if (!req.body.args.uriBatchFile) {
            return next (new Error("Cluster batch file is missing!"));
        }
        var uriBatchFile = req.body.args.uriBatchFile;
        console.log(`batchFile ==> ${uriBatchFile}`);

        // Batch Inserter
        var inserter = async.cargo(function(clusters, inserterCallback) {

                ClusterModel.bulkCreate(clusters).then(function() {
                        inserterCallback();
                    }
                );
            },
            400
        );

        // Read with ReadStream
        fs.createReadStream(uriBatchFile)
            .pipe(csv())

            .on('error', (error) => {
                throw new Error(`No se pudo procesar archivo CSV: ${error.message}`);
            })

            .on('data', (row) => {
                inserter.push({
                                client_id: row["id_cliente"],
                                recency: row["Recency"],
                                frequency: row["Frequency"],
                                amount: row["Monto"],
                                cluster: row["Cluster"],
                                cluster_name: row["Nombre del cluster"],
                                client_fname: row["nombre_cliente"],
                                client_lname: row["apellido_cliente"],
                                email: row["EMAIL"],
                                branch: row["SUCURSAL"]
                            });
            })

            .on('end', () => {
                inserter.drain = function() {
                    doneLoadingCallback();
                }
            });


    });


    // *************************************************************************** GET ALL CLUSTERS ***
    app.get( `${ENDPOINT_URI}/clusters/all` , async (req, res, next) => {

        try {
            const clusters = await ClusterModel.findAll({
                raw:true,
                attributes: {},
            });
            return res.json(clusters);
        }
        catch (e){
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** GET COUNT CLUSTERS ***
    app.get( `${ENDPOINT_URI}/clusters/count` , async (req, res, next) => {

        try {
            const clustersCount = await ClusterModel.count();
            return res.json({count: clustersCount});
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

    // *************************************************************************** GET ALL CLUSTERS PROCESSING ***
    app.get( `${ENDPOINT_URI}/clusters/processing` , async (req, res, next) => {

        try {
            const clustersProcessing = await viewClusterProcessingModel.findAll({
                raw:true,
                attributes: {},
            });
            return res.json(clustersProcessing);
        }
        catch (e){s
            // return next(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** GET COUNT CLUSTER PROCESSING  ***
    app.get( `${ENDPOINT_URI}/clusters/processing/count` , async (req, res, next) => {

        try {
            const clustersProcessingCount = await viewClusterProcessingModel.count();
            return res.json({count: clustersProcessingCount});
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


    // *************************************************************************** POST CLUSTER (CREATE CLUSTER)
    app.post(`${ENDPOINT_URI}/clusters`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.args.client_id || !req.body.args.recency || !req.body.args.frequency ||
            !req.body.args.amount || !req.body.args.cluster || !req.body.args.cluster_name ||
            !req.body.args.client_fname || !req.body.args.branch
        ) {
            return next (new Error("Cluster data are incomplete!"));
        }
        try {
            const cluster = await ClusterModel.findOne({
                attributes: {},
                where: {
                    client_id: req.body.args.client_id
                }
            });
            // ****** Cluster doesn't exists then CREATE ******
            if (!cluster){
                const newCluster = await ClusterModel.create({
                    client_id: req.body.args.client_id,
                    recency: req.body.args.recency,
                    frequency: req.body.args.frequency,
                    amount: req.body.args.amount,
                    cluster: req.body.args.cluster,
                    cluster_name: req.body.args.cluster_name,
                    client_fname: req.body.args.client_fname,
                    client_lname: req.body.args.client_lname,
                    email: req.body.args.email,
                    branch: req.body.args.branch,
                });
                // Devuelvo nuevo objeto
                return res.json(newCluster);
            } else {
            // ****** Cluster exists then UPDATE ******
                var updateJSON = {};
                if (req.body.args.recency && (req.body.args.recency!=cluster.recency)) updateJSON['recency'] = req.body.args.recency;
                if (req.body.args.frequency && (req.body.args.frequency!=cluster.frequency)) updateJSON['frequency'] = req.body.args.frequency;
                if (req.body.args.amount && (req.body.args.amount!=cluster.amount)) updateJSON['amount'] = req.body.args.amount;
                if (req.body.args.cluster && (req.body.args.cluster!=cluster.cluster)) updateJSON['cluster'] = req.body.args.cluster;
                if (req.body.args.cluster_name && (req.body.args.cluster_name!=cluster.cluster_name)) updateJSON['cluster_name'] = req.body.args.cluster_name;
                if (req.body.args.client_fname && (req.body.args.client_fname!=cluster.client_fname)) updateJSON['client_fname'] = req.body.args.client_fname;
                if (req.body.args.client_lname && (req.body.args.client_lname!=cluster.client_lname)) updateJSON['client_lname'] = req.body.args.client_lname;
                if (req.body.args.email && (req.body.args.email!=cluster.email)) updateJSON['email'] = req.body.args.email;
                if (req.body.args.branch && (req.body.args.branch!=cluster.branch)) updateJSON['branch'] = req.body.args.branch;

                // If data comes changes then UPDATE
                if (Object.entries(updateJSON).length > 0) {

                    console.log(`Actualizo ==> ${JSON.stringify(updateJSON)}`);

                    const [numberOfAffectedRows, affectedRows] = await ClusterModel.update(updateJSON,
                        {
                            where: {
                                client_id: req.body.args.client_id,
                            },
                            returning: true,
                            // plain: true,
                        });
                }
            }
        } catch(e) {
            // Error Handling
            //console.log("e->",e);
            switch (e.name) {
                case "SequelizeUniqueConstraintError":
                    // return next({message: `Constraint Error: ${e.errors[0].message.replace(/"/g, "'")}`});
                    return next({message: `Este email ya se encuentra registrado`});
                    break;
                case "SequelizeDatabaseError":
                    return next({message: `Database Error: ${e.parent.sqlMessage.replace(/"/g, "'")}`});
                    break;
                default:
                    return next({message: `Unknown error: ${e.message.replace(/"/g, "'")}`});
            }


        }


    });


    // *************************************************************************** POST CLUSTERPROCESSING (CREATE CLUSTERPROCESSING)
    app.post(`${ENDPOINT_URI}/clustersprocessing`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.args.client_id) {
            return next (new Error("ClusterProcessing ID data is missing!"));
        }
        try {
            const clusterProcessing = await ClusterProcessingModel.findOne({
                attributes: {},
                where: {
                    client_id: req.body.args.client_id
                }
            });
            // ****** ClusterProcessing doesn't exists then CREATE ******
            if (!clusterProcessing){
                const newClusterProcessing = await ClusterProcessingModel.create({
                    client_id: req.body.args.client_id
                });
                // Devuelvo nuevo objeto
                return res.json(newClusterProcessing);
            }

        } catch(e) {
            // Error Handling
            //console.log("e->",e);
            switch (e.name) {
                case "SequelizeUniqueConstraintError":
                    // return next({message: `Constraint Error: ${e.errors[0].message.replace(/"/g, "'")}`});
                    return next({message: `Este email ya se encuentra registrado`});
                    break;
                case "SequelizeDatabaseError":
                    return next({message: `Database Error: ${e.parent.sqlMessage.replace(/"/g, "'")}`});
                    break;
                default:
                    return next({message: `Unknown error: ${e.message.replace(/"/g, "'")}`});
            }
        }
    });



    // *************************************************************************** CLEAN CLUSTERS PROCESSING  ***
    app.get( `${ENDPOINT_URI}/clustersprocessing/clean` , async (req, res, next) => {

        try {
            await ClusterProcessingModel.destroy({
                where: {},
                truncate: true
            });

            return res.json({response: true});
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


    /*
    * db.User.destroy()
    * */


};


export default setupRoutes;

