import {DataTypes, Model, Sequelize} from "sequelize";
import {
    CustomerModel,
    BrandModel,
    ProductModel,
} from "#root/db/models";

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


    // -------------------------------------------------- BRANDS -----------------------------------------------------
    // *************************************************************************** GET ALL BRANDS INFO ***
    app.post( `${ENDPOINT_URI}/brands/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "brand_status"});
        // console.log('filter', filter);


        try {
            const brands = await BrandModel.findAndCountAll({
                order: [['brand_name','asc']],
                attributes: {},
                where: filter,
            });

            return res.json(brands);
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


    // *************************************************************************** GET COUNT BRANDS ***
    app.get( `${ENDPOINT_URI}/brands/count` , async (req, res, next) => {


        try {
            const brands = await BrandModel.findAndCountAll();
            return res.json(brands);
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


    // *************************************************************************** GET ALL BRANDS BY CUSTOMER INFO ***
    app.get( `${ENDPOINT_URI}/brands/customer/:customer_id` , async (req, res, next) => {

        try {
            const brands = await BrandModel.findAll({
                order: [['brand_name','asc']],
                attributes: {},
                where: {customer_id: req.params.customer_id, [sequelize.Op.not] : [{brand_status: "X"}]}
            });
            return res.json(brands);
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


    // *************************************************************************** GET BRAND BY ID ***
    app.get( `${ENDPOINT_URI}/brands/:brand_id` , async (req, res, next) => {

        try {
            const brands = await BrandModel.findOne({
                attributes: {},
                where: {brand_id: req.params.brand_id, [sequelize.Op.not] : [{brand_status: "X"}]}
            });
            return res.json(brands);
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


    // *************************************************************************** POST BRAND (CREATE BRAND)
    app.post(`${ENDPOINT_URI}/brands`, async(req, res, next) => {

        // Valido el body si llega con todos los datos
        if (!req.body.customer_id || !req.body.brand_name || !req.body.brand_slug ||
            !req.body.brand_desc || !req.body.brand_prefix || !req.body.brand_picture ) {
            return next (new Error("Brand data are incomplete!"));
        }


        try {

            // Creo marca
            var BRAND_ID=generateUUID();

            const newBrand = await BrandModel.create({
                brand_id: BRAND_ID,
                customer_id: req.body.customer_id,
                brand_name: req.body.brand_name,
                brand_slug: req.body.brand_slug,
                brand_desc: req.body.brand_desc,
                brand_prefix: req.body.brand_prefix,
                brand_picture: req.body.brand_picture,
                brand_sequential: 0,
                // brand_sequential: req.body.brand_sequential,
            });



            // Devuelvo nueva marca
            return res.json(newBrand);

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


    // *************************************************************************** PUT BRAND (UPDATE BRAND)

    app.put(`${ENDPOINT_URI}/brands/:brand_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.brand_id) {
            return next (new Error("Brand ID is missing!"));
        }

        //// Valido el body si llega con todos los datos
        // if (!req.body.customer_id ||  !req.body.brand_name || !req.body.brand_slug ||
        //     !req.body.brand_desc || !req.body.brand_prefix || !req.body.brand_picture || !req.body.brand_status) {
        //     return next (new Error("Brand data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.brand_name) updateJSON['brand_name'] = req.body.args.brand_name;
        if (req.body.args.brand_slug) updateJSON['brand_slug'] = req.body.args.brand_slug;
        if (req.body.args.brand_desc) updateJSON['brand_desc'] = req.body.args.brand_desc;
        if (req.body.args.brand_prefix) updateJSON['brand_prefix'] = req.body.args.brand_prefix;
        if (req.body.args.brand_picture) updateJSON['brand_picture'] = req.body.args.brand_picture;
        if (req.body.args.brand_status) updateJSON['brand_status'] = req.body.args.brand_status;
        if (req.body.args.brand_sequential) updateJSON['brand_sequential'] = req.body.args.brand_sequential;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }



        try {

            // Actualizo brand
            const [numberOfAffectedRows, affectedRows] = await BrandModel.update(updateJSON,
            {
                where: {brand_id: req.params.brand_id, [sequelize.Op.not] : [{brand_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo brand actualizado
            const updatedBrand = await BrandModel.findOne({
                attributes: {},
                where: {brand_id: req.params.brand_id, [sequelize.Op.not] : [{brand_status: "X"}]}
            });

            if (!updatedBrand) return next(new Error("Invalid brand ID or Deleted"));
            return res.json(updatedBrand);

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


    // *************************************************************************** DELETE BRAND (DELETE BRAND)
    app.delete(`${ENDPOINT_URI}/brands/:brand_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.brand_id) {
            return next (new Error("Brand ID is missing!"));
        }

        try {

            // Actualizo brand como X
            const [numberOfAffectedRows, affectedRows] = await BrandModel.update({
                brand_status: "X",
            },{
                where: {brand_id: req.params.brand_id, [sequelize.Op.not] : [{brand_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo brand eliminado
            if (affectedRows==0) return next(new Error("Invalid brand ID or Deleted"));
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






    // -------------------------------------------------- PRODUCTS -----------------------------------------------------


    // *************************************************************************** GET ALL PRODUCTS INFO ***
    app.post( `${ENDPOINT_URI}/products/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "product_status"});
        // console.log('filter', filter);

        try {
            const products = await ProductModel.findAndCountAll({
                order: [['product_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(products);

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

    // *************************************************************************** GET COUNT PRODUCTS ***
    app.get( `${ENDPOINT_URI}/products/count` , async (req, res, next) => {


        try {
            const products = await ProductModel.findAndCountAll();
            return res.json(products);
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


    // *************************************************************************** GET ALL PRODUCTS BY BRAND INFO ***
    app.get( `${ENDPOINT_URI}/products/brand/:brand_id` , async (req, res, next) => {

        try {
            const products = await ProductModel.findAll({
                order: [['product_name','asc']],
                attributes: {},
                where: {brand_id: req.params.brand_id, [sequelize.Op.not] : [{product_status: "X"}]},
            });
            return res.json(products);
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


    // *************************************************************************** GET PRODUCT BY ID INFO ***
    app.get( `${ENDPOINT_URI}/products/:product_id` , async (req, res, next) => {

        try {
            const products = await ProductModel.findOne({
                attributes: {},
                where: {product_id: req.params.product_id, [sequelize.Op.not] : [{product_status: "X"}]},
            });
            return res.json(products);
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


    // *************************************************************************** POST PRODUCT (CREATE PRODUCT)
    app.post(`${ENDPOINT_URI}/products`, async(req, res, next) => {

        // Valido el body si llega con todos los datos
        if (!req.body.brand_id || !req.body.product_name || !req.body.product_slug ||
            !req.body.product_desc || !req.body.product_picture || !req.body.product_sku) {
            return next (new Error("Product data are incomplete!"));
        }


        try {

            // Creo producto
            var PRODUCT_ID=generateUUID();

            const newProduct = await ProductModel.create({
                product_id: PRODUCT_ID,
                brand_id: req.body.brand_id,
                product_name: req.body.product_name,
                product_slug: req.body.product_slug,
                product_desc: req.body.product_desc,
                product_picture: req.body.product_picture,
                product_sku: req.body.product_sku,
            });



            // Devuelvo nuevo producto
            return res.json(newProduct);

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


    // *************************************************************************** PUT PRODUCT (UPDATE PRODUCT)
    app.put(`${ENDPOINT_URI}/products/:product_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.product_id) {
            return next (new Error("Product ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.brand_id ||
        //     !req.body.product_name ||
        //     !req.body.product_slug ||
        //     !req.body.product_desc ||
        //     !req.body.product_picture ||
        //     !req.body.product_status
        // ) {
        //     return next (new Error("Product data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.product_name) updateJSON['product_name'] = req.body.args.product_name;
        if (req.body.args.product_slug) updateJSON['product_slug'] = req.body.args.product_slug;
        if (req.body.args.product_desc) updateJSON['product_desc'] = req.body.args.product_desc;
        if (req.body.args.product_picture) updateJSON['product_picture'] = req.body.args.product_picture;
        if (req.body.args.product_sku) updateJSON['product_sku'] = req.body.args.product_sku;
        if (req.body.args.brand_id) updateJSON['brand_id'] = req.body.args.brand_id;
        if (req.body.args.product_status) updateJSON['product_status'] = req.body.args.product_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            // Actualizo product
            const [numberOfAffectedRows, affectedRows] = await ProductModel.update(updateJSON,
            {
                where: {product_id: req.params.product_id, [sequelize.Op.not] : [{product_status: "X"}]},
                returning: true,
                // plain: true,
            });


            // Devuelvo product actualizado
            const updatedProduct = await ProductModel.findOne({
                attributes: {},
                where: {product_id: req.params.product_id, [sequelize.Op.not] : [{product_status: "X"}]}
            });

            if (!updatedProduct) return next(new Error("Invalid product ID or Deleted"));
            return res.json(updatedProduct);


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


    // *************************************************************************** DELETE PRODUCT (DELETE PRODUCT)
    app.delete(`${ENDPOINT_URI}/products/:product_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.product_id) {
            return next (new Error("Product ID is missing!"));
        }

        try {

            // Actualizo brand como X
            const [numberOfAffectedRows, affectedRows] = await ProductModel.update({
                product_status: "X",
            },{
                where: {product_id: req.params.product_id, [sequelize.Op.not] : [{product_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo producto eliminado
            if (affectedRows==0) return next(new Error("Invalid product ID or Deleted"));
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

