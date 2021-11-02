import {
    CodeTypeModel,
    MediaProductModel,
    MetricsCoupons,
    CouponModel,
} from "#root/db/models";

import sequelizeDB from "#root/db/connection";

import * as sequelize from "sequelize";

import accessEnv from "#root/helpers/accessEnv";

import generateUUID from "#root/helpers/generateUUID";
import getWhere from "#root/helpers/getWhere";

// import hashPassword from "#root/helpers/hashPassword";
// import passwordCompareSync from "#root/helpers/passwordCompareSync";
// import { addHours } from "date-fns";

const setupRoutes = app => {
    const ENDPOINT_URI = accessEnv("ENDPOINT_URI");
    // const USER_SESSION_EXPIRY_HOURS = accessEnv("USER_SESSION_EXPIRY_HOURS");

    // ------------------------------------------------- CODE_TYPE ------------------------------------------

    // *************************************************************************** GET ALL CODE_TYPES INFO ***
    app.post( `${ENDPOINT_URI}/codetypes/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "code_type_status"});
        // console.log('filter', filter);

        try {
            const codetypes = await CodeTypeModel.findAndCountAll({
                order: [['code_type_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(codetypes);
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
    app.get( `${ENDPOINT_URI}/codetypes/count` , async (req, res, next) => {

        try {
            const codeTypes = await CodeTypeModel.findAndCountAll();
            return res.json(codeTypes);
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


    // *************************************************************************** GET CODE_TYPE BY ID INFO ***
    app.get( `${ENDPOINT_URI}/codetypes/:code_type_id` , async (req, res, next) => {

        try {
            const codetypes = await CodeTypeModel.findOne({
                attributes: {},
                where: {
                    code_type_id: req.params.code_type_id ,
                    [sequelize.Op.not] : [{code_type_status: "X"}]
                }
            });
            return res.json(codetypes);
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




    // *************************************************************************** POST CODE_TYPE (CREATE CODE_TYPE)
    app.post(`${ENDPOINT_URI}/codetypes`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.code_type_name) {
            return next (new Error("Code Types data are incomplete!"));
        }


        try {

            // Creo categoria
            var CODE_TYPE_ID=generateUUID();

            const newCodeType = await CodeTypeModel.create({
                code_type_id: CODE_TYPE_ID,
                code_type_name: req.body.code_type_name,
            });

            // Devuelvo nueva code type
            return res.json(newCodeType);

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


    // *************************************************************************** PUT CODE TYPE (UPDATE CODE TYPE)
    app.put(`${ENDPOINT_URI}/codetypes/:code_type_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.code_type_id) {
            return next (new Error("Code Type ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.code_type_name) {
        //     return next (new Error("Code Type data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.code_type_name) updateJSON['code_type_name'] = req.body.args.code_type_name;
        if (req.body.args.code_type_status) updateJSON['code_type_status'] = req.body.args.code_type_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        
        try {

            const [numberOfAffectedRows, affectedRows] = await CodeTypeModel.update(updateJSON,
            {
                where: {
                    code_type_id: req.params.code_type_id,
                    [sequelize.Op.not] : [{code_type_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type actualizado
            const updatedCodeType = await CodeTypeModel.findOne({
                attributes: {},
                where: {
                    code_type_id: req.params.code_type_id,
                    [sequelize.Op.not] : [{code_type_status: "X"}]
                }
            });

            if (!updatedCodeType) return next(new Error("Invalid code type ID or Deleted"));

            return res.json(updatedCodeType);


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


    // *************************************************************************** DELETE CODE TYPE (DELETE CODE TYPE)
    app.delete(`${ENDPOINT_URI}/codetypes/:code_type_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.code_type_id) {
            return next (new Error("Code Type ID is missing!"));
        }

        try {

            // Actualizo code type como X
            const [numberOfAffectedRows, affectedRows] = await CodeTypeModel.update({
                code_type_status: "X",
            },{
                where: {code_type_id: req.params.code_type_id, [sequelize.Op.not] : [{code_type_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo code type eliminado
            if (affectedRows==0) return next(new Error("Invalid code type ID or Deleted"));
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




    // ------------------------------------------------- MEDIA-PRODUCT ------------------------------------------

    // *************************************************************************** GET ALL MEDIA-PRODUCT INFO ***
    app.post( `${ENDPOINT_URI}/mediaproducts/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "media_product_status"});
        // console.log('filter', filter);

        try {
            const mediaProduct = await MediaProductModel.findAndCountAll({
                order: [['media_product_created','desc']],
                attributes: {},
                where: filter
            });
            return res.json(mediaProduct);
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


    // *************************************************************************** GET COUNT MEDIA-PRODUCT ***
    app.get( `${ENDPOINT_URI}/mediaproducts/count` , async (req, res, next) => {

        try {
            const mediaProduct = await MediaProductModel.findAndCountAll();
            return res.json(mediaProduct);
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


    // *************************************************************************** GET ALL MEDIA-PRODUCT BY ID INFO ***
    app.get( `${ENDPOINT_URI}/mediaproducts/:media_product_id` , async (req, res, next) => {

        try {
            const mediaProduct = await MediaProductModel.findOne({
                attributes: {},
                where: {
                    media_product_id: req.params.media_product_id,
                    [sequelize.Op.not] : [{media_product_status: "X"}]
                }
            });
            return res.json(mediaProduct);
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

    // *************************************************************************** GET ALL MEDIA-PRODUCT BY MEDIA INFO ***
    app.get( `${ENDPOINT_URI}/mediaproducts/media/:media_id` , async (req, res, next) => {

        try {
            const mediaProduct = await MediaProductModel.findAll({
                order: [['media_product_created','desc']],
                attributes: {},
                where: {
                    media_id: req.params.media_id,
                    [sequelize.Op.not] : [{media_product_status: "X"}]
                }
            });
            return res.json(mediaProduct);
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

    // *************************************************************************** GET ALL MEDIA-PRODUCT BY PRODUCT INFO ***
    app.get( `${ENDPOINT_URI}/mediaproducts/product/:product_id` , async (req, res, next) => {

        try {
            const mediaProduct = await MediaProductModel.findAll({
                order: [['media_product_created','desc']],
                attributes: {},
                where: {
                    product_id: req.params.product_id,
                    [sequelize.Op.not] : [{media_product_status: "X"}]
                }
            });
            return res.json(mediaProduct);
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


    // *************************************************************************** GET ALL MEDIA-PRODUCT BY CODE TYPE INFO ***
    app.get( `${ENDPOINT_URI}/mediaproducts/codetype/:code_type_id` , async (req, res, next) => {

        try {
            const mediaProduct = await MediaProductModel.findAll({
                order: [['media_product_created','desc']],
                attributes: {},
                where: {
                    code_type_id: req.params.code_type_id,
                    [sequelize.Op.not] : [{media_product_status: "X"}]
                }
            });
            return res.json(mediaProduct);
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


    // *************************************************************************** GET ALL MEDIA-PRODUCT BY CODE ***
    app.get( `${ENDPOINT_URI}/mediaproducts/code/:media_product_code` , async (req, res, next) => {

        try {
            const mediaProduct = await MediaProductModel.findOne({
                attributes: {},
                where: {
                    media_product_code: req.params.media_product_code,
                    [sequelize.Op.not] : [{media_product_status: ["X", "I"]}]
                }
            });
            return res.json(mediaProduct);
        }
        catch (e){
            // console.log(e);
            // console.log(`------------ Error Code: ${e.parent.code}, Fields: ${e.fields}, Table: ${e.table}`);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // // ----------------------------------------- STORE PROCEDURE -------------------------------------------
    //
    // // *************************************************************************** GET ALL COUPON INFO ***
    // app.post( `${ENDPOINT_URI}/mediaproducts/code/metrics` , async (req, res, next) => {
    //
    //     const filter = await getWhere({filter: req.body.args.filter, status: "coupon_status"});
    //     // console.log('filter', filter);
    //
    //     try {
    //
    //
    //         // Callee is the model definition. This allows you to easily map a query to a predefined model
    //         const MetricsCoupons = await sequelizeDB.query("CALL spsCoupons(:brand_id, :product_id, :media_id)", {
    //             type: sequelize.QueryTypes.RAW,
    //             replacements: {
    //                 brand_id: !req.body.args.filter.brand_id ? null: req.body.args.filter.brand_id,
    //                 product_id: !req.body.args.filter.product_id ? null: req.body.args.filter.product_id,
    //                 media_id: !req.body.args.filter.media_id ? null: req.body.args.filter.media_id
    //             },
    //             plain: true,
    //             // model: MetricsCoupons,
    //             mapToModel: true, // pass true here if you have any mapped fields
    //             connection: sequelizeDB,
    //
    //         });
    //
    //         // console.log("MetricsCoupons==>", JSON.stringify(MetricsCoupons));
    //
    //         // .then(function(response){
    //         //     // res.json(response);
    //         //     console.log("response==>", JSON.stringify(response));
    //         // }).error(function(err){
    //         //     // res.json(err);
    //         //     console.log("err==>", err);
    //         // });
    //
    //
    //         // const coupons = await MetricsCoupons.findAndCountAll({
    //         //     order: [['media_product_code','asc']],
    //         //     attributes: {},
    //         //     where: filter
    //         // });
    //
    //         // return res.json(coupons);
    //         return res.json(MetricsCoupons);
    //
    //     }
    //     catch (e){
    //         // return next(e);
    //         // console.log("e===> ", e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    // });



    // *************************************************************************** POST MEDIA-PRODUCT (CREATE MEDIA-PRODUCT)
    app.post(`${ENDPOINT_URI}/mediaproducts`, async(req, res, next) => {

        // console.log('args==>', req.body.args);

        // Valido el body si llega con todos los datos
        if (!req.body.args.media_id || !req.body.args.product_id || !req.body.args.code_type_id ||
            !req.body.args.media_product_desc ||  !req.body.args.media_product_picture ||
            !req.body.args.media_product_expire || !req.body.args.media_product_descto) {
            return next (new Error("Media Product data are incomplete!"));
        }


        try {

            // Creo media product
            var MEDIA_PRODUCT_ID=generateUUID();

            const newMediaProduct = await MediaProductModel.create({
                media_product_id: MEDIA_PRODUCT_ID,
                media_id: req.body.args.media_id,
                product_id: req.body.args.product_id,
                code_type_id: req.body.args.code_type_id,
                media_product_desc: req.body.args.media_product_desc,
                media_product_code: req.body.args.media_product_code,
                media_product_picture: req.body.args.media_product_picture,
                media_product_expire: req.body.args.media_product_expire,
                media_product_descto: req.body.args.media_product_descto,
            });

            // Devuelvo nuevo media product
            return res.json(newMediaProduct);

        } catch(e) {
            console.log(e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }


    });


    // *************************************************************************** PUT MEDIA-PRODUCT (UPDATE MEDIA-PRODUCT)
    app.put(`${ENDPOINT_URI}/mediaproducts/:media_product_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.media_product_id) {
            return next (new Error("Media Product ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.media_id || !req.body.product_id || !req.body.code_type_id ||
        //     !req.body.media_product_desc ||  !req.body.media_product_code ||
        //     !req.body.media_product_picture ||  !req.body.media_product_expire) {
        //     return next (new Error("Media Product data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.media_id) updateJSON['media_id'] = req.body.args.media_id;
        if (req.body.args.product_id) updateJSON['product_id'] = req.body.args.product_id;
        if (req.body.args.code_type_id) updateJSON['code_type_id'] = req.body.args.code_type_id;
        if (req.body.args.media_product_desc) updateJSON['media_product_desc'] = req.body.args.media_product_desc;
        if (req.body.args.media_product_code) updateJSON['media_product_code'] = req.body.args.media_product_code;
        if (req.body.args.media_product_picture) updateJSON['media_product_picture'] = req.body.args.media_product_picture;
        if (req.body.args.media_product_expire) updateJSON['media_product_expire'] = req.body.args.media_product_expire;
        if (req.body.args.media_product_status) updateJSON['media_product_status'] = req.body.args.media_product_status;
        if (req.body.args.media_product_descto) updateJSON['media_product_descto'] = req.body.args.media_product_descto;


        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }


        try {

            const [numberOfAffectedRows, affectedRows] = await MediaProductModel.update(updateJSON,
            {
                where: {
                    media_product_id: req.params.media_product_id,
                    [sequelize.Op.not] : [{media_product_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo media product actualizado
            const updatedMediaProduct = await MediaProductModel.findOne({
                attributes: {},
                where: {media_product_id: req.params.media_product_id, [sequelize.Op.not] : [{media_product_status: "X"}]}
            });

            if (!updatedMediaProduct) return next(new Error("Invalid media product ID or Deleted"));
            return res.json(updatedMediaProduct);


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


    // *************************************************************************** DELETE MEDIA-PRODUCT (DELETE MEDIA-PRODUCT)
    app.delete(`${ENDPOINT_URI}/mediaproducts/:media_product_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.media_product_id) {
            return next (new Error("Media Product ID is missing!"));
        }

        const deletedMediaProduct = await MediaProductModel.findOne({
            attributes: {},
            where: {media_product_id: req.params.media_product_id, [sequelize.Op.not] : [{media_product_status: "X"}]}
        });

        if (!deletedMediaProduct) return next(new Error("Invalid media product ID or Deleted"));


        // VERIFICO QUE NO TENGA CUPONES GENERADOS
        const coupons = await CouponModel.findAll({
            attributes: {},
            where: {media_product_id: req.params.media_product_id, [sequelize.Op.not] : [{coupon_status: "X"}]}
        });
        if (coupons) return next(new Error("Media Product has generated coupons, can't delete it  !!!"));


        try {

            // Actualizo media product como X
            const [numberOfAffectedRows, affectedRows] = await MediaProductModel.update({
                media_product_status: "X",
            },{
                where: {media_product_id: req.params.media_product_id, [sequelize.Op.not] : [{media_product_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo media product eliminado
            if (affectedRows==0) return next(new Error("Invalid media product ID or Deleted"));
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


};

export default setupRoutes;

