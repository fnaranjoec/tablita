import {
    CategoryModel,
    MediaModel,
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

    // ------------------------------------------------- CATEGORY ------------------------------------------

    // *************************************************************************** GET ALL CATEGORIES INFO ***
    app.post( `${ENDPOINT_URI}/categories/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "category_status"});
        // console.log('filter', filter);

        try {
            const categories = await CategoryModel.findAndCountAll({
                order: [['category_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(categories);
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


    // *************************************************************************** GET COUNT CATEGORY ***
    app.get( `${ENDPOINT_URI}/categories/count` , async (req, res, next) => {


        try {
            const categories = await CategoryModel.findAndCountAll();
            return res.json(categories);
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


    // *************************************************************************** GET ALL CATEGORIES INFO ***
    app.get( `${ENDPOINT_URI}/categories/:category_id` , async (req, res, next) => {

        try {
            const categories = await CategoryModel.findOne({
                attributes: {},
                where: {
                    category_id: req.params.category_id,
                    [sequelize.Op.not] : [{category_status: "X"}]
                }
            });
            return res.json(categories);
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


    // *************************************************************************** POST CATEGORY (CREATE CATEGORY)
    app.post(`${ENDPOINT_URI}/categories`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.category_name || !req.body.category_slug || !req.body.category_desc) {
            return next (new Error("Category data are incomplete!"));
        }


        try {

            // Creo categoria
            var CATEGORY_ID=generateUUID();

            const newCategory = await CategoryModel.create({
                category_id: CATEGORY_ID,
                category_name: req.body.category_name,
                category_slug: req.body.category_slug,
                category_desc: req.body.category_desc
            });

            // Devuelvo nueva marca
            return res.json(newCategory);

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


    // *************************************************************************** PUT CATEGORY (UPDATE CATEGORY)
    app.put(`${ENDPOINT_URI}/categories/:category_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.category_id) {
            return next (new Error("Category ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.category_name || !req.body.category_slug || !req.body.category_desc) {
        //     return next (new Error("Category data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.category_name) updateJSON['category_name'] = req.body.args.category_name;
        if (req.body.args.category_slug) updateJSON['category_slug'] = req.body.args.category_slug;
        if (req.body.args.category_desc) updateJSON['category_desc'] = req.body.args.category_desc;
        if (req.body.args.category_status) updateJSON['category_status'] = req.body.args.category_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CategoryModel.update(updateJSON,
            {
                where: {category_id: req.params.category_id, [sequelize.Op.not] : [{category_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo category actualizado
            const updatedCategory = await CategoryModel.findOne({
                attributes: {},
                where: {category_id: req.params.category_id, [sequelize.Op.not] : [{category_status: "X"}]}
            });

            if (!updatedCategory) return next(new Error("Invalid category ID or Deleted"));
            return res.json(updatedCategory);


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


    // *************************************************************************** DELETE CATEGORY (DELETE CATEGORY)
    app.delete(`${ENDPOINT_URI}/categories/:category_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.category_id) {
            return next (new Error("Category ID is missing!"));
        }

        try {

            // Actualizo categoria como X
            const [numberOfAffectedRows, affectedRows] = await CategoryModel.update({
                category_status: "X",
            },{
                where: {category_id: req.params.category_id, [sequelize.Op.not] : [{category_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo brand eliminado
            if (affectedRows==0) return next(new Error("Invalid category ID or Deleted"));
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




    // ------------------------------------------------- MEDIA ------------------------------------------

    // *************************************************************************** GET ALL MEDIA INFO ***
    app.post( `${ENDPOINT_URI}/medias/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "media_status"});
        // console.log('filter', filter);

        try {
            const medias = await MediaModel.findAndCountAll({
                order: [['media_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(medias);
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


    // *************************************************************************** GET COUNT MEDIA ***
    app.get( `${ENDPOINT_URI}/medias/count` , async (req, res, next) => {

        try {
            const medias = await MediaModel.findAndCountAll();
            return res.json(medias);
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


    // *************************************************************************** GET MEDIA BY ID INFO ***
    app.get( `${ENDPOINT_URI}/medias/:media_id` , async (req, res, next) => {

        try {
            const media = await MediaModel.findOne({
                attributes: {},
                where: {
                    media_id: req.params.media_id,
                    [sequelize.Op.not] : [{media_status: "X"}]
                }
            });
            return res.json(media);
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

    // *************************************************************************** GET MEDIAS BY CATEGORY INFO ***
    app.get( `${ENDPOINT_URI}/medias/category/:category_id` , async (req, res, next) => {

        try {
            const medias = await MediaModel.findAll({
                order: [['media_name','asc']],
                attributes: {},
                where: {
                    category_id: req.params.category_id,
                    [sequelize.Op.not] : [{media_status: "X"}]
                }
            });
            return res.json(medias);
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

    // *************************************************************************** POST MEDIA (CREATE MEDIA)
    app.post(`${ENDPOINT_URI}/medias`, async(req, res, next) => {

        // Valido el body si llega con todos los datos
        if (!req.body.category_id || !req.body.media_name || !req.body.media_picture ) {
            return next (new Error("Media data are incomplete!"));
        }


        try {

            // Creo media
            var MEDIA_ID=generateUUID();

            const newMedia = await MediaModel.create({
                media_id: MEDIA_ID,
                category_id: req.body.category_id,
                media_name: req.body.media_name,
                media_desc: req.body.media_desc,
                media_slug: req.body.media_slug,
                media_picture: req.body.media_picture,
            });



            // Devuelvo nuevo producto
            return res.json(newMedia);

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


    // *************************************************************************** PUT MEDIA (UPDATE MEDIA)
    app.put(`${ENDPOINT_URI}/medias/:media_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.media_id) {
            return next (new Error("Media ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.category_id || !req.body.media_name || !req.body.media_picture) {
        //     return next (new Error("Media data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.category_id) updateJSON['category_id'] = req.body.args.category_id;
        if (req.body.args.media_name) updateJSON['media_name'] = req.body.args.media_name;
        if (req.body.args.media_desc) updateJSON['media_desc'] = req.body.args.media_desc;
        if (req.body.args.media_slug) updateJSON['media_slug'] = req.body.args.media_slug;
        if (req.body.args.media_picture) updateJSON['media_picture'] = req.body.args.media_picture;
        if (req.body.args.media_status) updateJSON['media_status'] = req.body.args.media_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }


        try {

            const [numberOfAffectedRows, affectedRows] = await MediaModel.update(updateJSON,
            {
                where: {media_id: req.params.media_id, [sequelize.Op.not] : [{media_status: "X"}]},
                returning: true,

                // plain: true,
            });

            // Devuelvo customer actualizado
            const updatedMedia = await MediaModel.findOne({
                attributes: {},
                where: {media_id: req.params.media_id, [sequelize.Op.not] : [{media_status: "X"}]}
            });

            if (!updatedMedia) return next(new Error("Invalid media ID or Deleted"));
            return res.json(updatedMedia);


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


    // *************************************************************************** DELETE MEDIA (DELETE MEDIA)
    app.delete(`${ENDPOINT_URI}/medias/:media_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.media_id) {
            return next (new Error("Media ID is missing!"));
        }

        const deletedMedia = await MediaModel.findOne({
            attributes: {},
            where: {media_id: req.params.media_id, [sequelize.Op.not] : [{media_status: "X"}]}
        });

        if (!deletedMedia) return next(new Error("Invalid media ID or Deleted"));

        try {

            // Actualizo media como X
            const [numberOfAffectedRows, affectedRows] = await MediaModel.update({
                media_status: "X",
            },{
                where: {media_id: req.params.media_id, [sequelize.Op.not] : [{media_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo producto eliminado
            if (affectedRows==0) return next(new Error("Invalid media ID or Deleted"));
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

