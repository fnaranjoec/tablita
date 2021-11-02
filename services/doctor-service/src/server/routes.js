import {
    // // CodeTypeModel,
    // // MediaProductModel,
    // CommerceTypeModel,
    // CouponModel,
    // ConsummerModel,
    // MediaProductModel,
    // ProductModel,
    // viewCouponModel,
    // CouponsByBrandModel,
    // CouponsByProductModel,
    // CouponsByMediaModel,
    // CouponsByCategoryModel,
    // CouponsRollUp,
    ParameterModel,
    DoctorModel,
    CampaignModel,
    CampaignDoctorModel,
    CampaignProductModel,
} from "#root/db/models";

import * as sequelize from "sequelize";

import accessEnv from "#root/helpers/accessEnv";

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

    // ------------------------------------------------- DOCTOR ------------------------------------------

    // *************************************************************************** GET ALL DOCTORS INFO ***
    app.post( `${ENDPOINT_URI}/doctors/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "doctor_status"});
        // console.log('filter', filter);

        try {
            const doctors = await DoctorModel.findAndCountAll({
                order: [['doctor_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(doctors);
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
    app.get( `${ENDPOINT_URI}/doctors/count` , async (req, res, next) => {

        try {
            const doctor = await DoctorModel.findAndCountAll();
            return res.json(doctor);
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


    // *************************************************************************** GET DOCTOR BY ID INFO ***
    app.get( `${ENDPOINT_URI}/doctors/:doctor_id` , async (req, res, next) => {

        try {
            const doctor = await DoctorModel.findOne({
                attributes: {},
                where: {
                    doctor_id: req.params.doctor_id ,
                    [sequelize.Op.not] : [{doctor_status: "X"}]
                }
            });
            return res.json(doctor);
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


    // *************************************************************************** POST DOCTOR (CREATE DOCTOR)
    app.post(`${ENDPOINT_URI}/doctors`, async(req, res, next) => {

        // console.log("req.body==>", req.body);

        // Valido el body si llega con todos los datos
        if (!req.body.args.doctor_name || !req.body.args.doctor_email) {
            return next (new Error("Doctor data are incomplete!"));
        }


        try {

            // Creo commerce type
            var DOCTOR_ID=generateUUID();


            // Obtengo el ROL DOCTOR
            const rolDoctor= await ParameterModel.findOne({
                row: true,
                attributes: {},
                where: {
                    parameter_name: 'ROL_DOCTOR' ,
                }
            });



            const newDoctor = await DoctorModel.create({
                doctor_id: DOCTOR_ID,
                rol_user_id: rolDoctor.parameter_text,
                doctor_name: req.body.args.doctor_name,
                doctor_email: req.body.args.doctor_email
            });


            // Devuelvo nueva code type
            return res.json(newDoctor);

        } catch(e) {

            // return next(e);
            // console.log("e=>", e.toString());

            if (e.errors==="undefined") {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }
        }


    });


    // *************************************************************************** PUT DOCTOR (UPDATE DOCTOR)
    app.put(`${ENDPOINT_URI}/doctors/:doctor_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.doctor_id) {
            return next (new Error("Doctor ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.doctor_name) {
        //     return next (new Error("Commerce Type data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.doctor_name) updateJSON['doctor_name'] = req.body.args.doctor_name;
        if (req.body.args.doctor_email) updateJSON['doctor_email'] = req.body.args.doctor_email;
        if (req.body.args.doctor_status) updateJSON['doctor_status'] = req.body.args.doctor_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await DoctorModel.update(updateJSON,
            {
                where: {
                    doctor_id: req.params.doctor_id,
                    [sequelize.Op.not] : [{doctor_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type actualizado
            const updatedDoctor = await DoctorModel.findOne({
                attributes: {},
                where: {
                    doctor_id: req.params.doctor_id,
                    [sequelize.Op.not] : [{doctor_status: "X"}]
                }
            });

            if (!updatedDoctor) return next(new Error("Invalid Doctor ID or Deleted"));
            return res.json(updatedDoctor);


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


    // *************************************************************************** DELETE DOCTOR (DELETE DOCTOR)
    app.delete(`${ENDPOINT_URI}/doctors/:doctor_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.doctor_id) {
            return next (new Error("Doctor ID is missing!"));
        }

        try {

            // Actualizo code type como X
            const [numberOfAffectedRows, affectedRows] = await DoctorModel.update({
                doctor_status: "X",
            },{
                where: {doctor_id: req.params.doctor_id, [sequelize.Op.not] : [{doctor_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo code type eliminado
            if (affectedRows==0) return next(new Error("Invalid Doctor ID or Deleted"));
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



    // ------------------------------------------------- CAMPAIGN ------------------------------------------

    // *************************************************************************** GET ALL CAMPAIGNS INFO ***
    app.post( `${ENDPOINT_URI}/campaigns/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "campaign_status"});
        // console.log('filter', filter);

        try {
            const campaigns = await CampaignModel.findAndCountAll({
                order: [['campaign_name','asc']],
                attributes: {},
                where: filter
            });
            return res.json(campaigns);
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

    // *************************************************************************** GET COUNT CAMPAINGS ***
    app.get( `${ENDPOINT_URI}/campaigns/count` , async (req, res, next) => {

        try {
            const campaigns = await CampaignModel.findAndCountAll();
            return res.json(campaigns);
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


    // *************************************************************************** GET CAMPAIGN BY ID INFO ***
    app.get( `${ENDPOINT_URI}/campaigns/:campaign_id` , async (req, res, next) => {

        try {
            const campaign = await CampaignModel.findOne({
                attributes: {},
                where: {
                    campaign_id: req.params.campaign_id ,
                    [sequelize.Op.not] : [{campaign_status: "X"}]
                }
            });
            return res.json(campaign);
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


    // *************************************************************************** POST CAMPAIGN (CREATE CAMPAIGN)
    app.post(`${ENDPOINT_URI}/campaigns`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.args.campaign_name || !req.body.args.campaign_slug || !req.body.args.campaign_desc ||
            !req.body.args.campaign_picture || !req.body.args.campaign_expire) {
            return next (new Error("Campaign data are incomplete!"));
        }


        try {

            // Creo commerce type
            var CAMPAIGN_ID=generateUUID();

            const newCampaign = await CampaignModel.create({
                campaign_id: CAMPAIGN_ID,
                campaign_name: req.body.args.campaign_name,
                campaign_slug: req.body.args.campaign_slug,
                campaign_prefix: req.body.args.campaign_prefix,
                campaign_desc: req.body.args.campaign_desc,
                campaign_picture: req.body.args.campaign_picture,
                campaign_expire: req.body.args.campaign_expire,
            });

            // Devuelvo nueva code type
            return res.json(newCampaign);

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


    // *************************************************************************** PUT CAMPAIGN (UPDATE CAMPAIGN)
    app.put(`${ENDPOINT_URI}/campaigns/:campaign_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.campaign_id) {
            return next (new Error("Campaign ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.campaign_name) {
        //     return next (new Error("Commerce Type data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.campaign_name) updateJSON['campaign_name'] = req.body.args.campaign_name;
        if (req.body.args.campaign_slug) updateJSON['campaign_slug'] = req.body.args.campaign_slug;
        if (req.body.args.campaign_desc) updateJSON['campaign_desc'] = req.body.args.campaign_desc;
        if (req.body.args.campaign_picture) updateJSON['campaign_picture'] = req.body.args.campaign_picture;
        if (req.body.args.campaign_expire) updateJSON['campaign_expire'] = req.body.args.campaign_expire;
        if (req.body.args.campaign_status) updateJSON['campaign_status'] = req.body.args.campaign_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CampaignModel.update(updateJSON,
            {
                where: {
                    campaign_id: req.params.campaign_id,
                    [sequelize.Op.not] : [{campaign_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type actualizado
            const updatedCampaign = await CampaignModel.findOne({
                attributes: {},
                where: {
                    campaign_id: req.params.campaign_id,
                    [sequelize.Op.not] : [{campaign_status: "X"}]
                }
            });

            if (!updatedCampaign) return next(new Error("Invalid Campaign ID or Deleted"));
            return res.json(updatedCampaign);


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


    // *************************************************************************** DELETE CAMPAIGN (DELETE CAMPAIGN)
    app.delete(`${ENDPOINT_URI}/campaigns/:campaign_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.campaign_id) {
            return next (new Error("Campaign ID is missing!"));
        }

        try {

            // Actualizo code type como X
            const [numberOfAffectedRows, affectedRows] = await CampaignModel.update({
                campaign_status: "X",
            },{
                where: {campaign_id: req.params.campaign_id, [sequelize.Op.not] : [{campaign_status: "X"}]},
                returning: true,
                // plain: true,
            });

            // Devuelvo code type eliminado
            if (affectedRows==0) return next(new Error("Invalid Campaign ID or Deleted"));
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




    // ------------------------------------------------- CAMPAIGN-DOCTOR ------------------------------------------

    // *************************************************************************** GET ALL CAMPAIGN-DOCTORS INFO ***
    app.post( `${ENDPOINT_URI}/campaign-doctors/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "campaign_doctor_status"});
        // console.log('filter', filter);

        try {
            const campaignDoctors = await CampaignDoctorModel.findAndCountAll({
                order: [['campaign_doctor_created','desc']],
                attributes: {},
                where: filter
            });
            return res.json(campaignDoctors);
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

    // *************************************************************************** GET COUNT CAMPAIGN-DOCTORS ***
    app.get( `${ENDPOINT_URI}/campaign-doctors/count` , async (req, res, next) => {

        try {
            const campaignDoctors = await CampaignDoctorModel.findAndCountAll();
            return res.json(campaignDoctors);
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


    // *************************************************************************** GET CAMPAIGN-DOCTOR BY ID INFO ***
    app.get( `${ENDPOINT_URI}/campaign-doctors/:campaign_doctor_id` , async (req, res, next) => {

        try {
            const campaignDoctor = await CampaignDoctorModel.findOne({
                attributes: {},
                where: {
                    campaign_doctor_id: req.params.campaign_doctor_id ,
                    [sequelize.Op.not] : [{campaign_doctor_status: "X"}]
                }
            });
            return res.json(campaignDoctor);
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



    // *************************************************************************** GET CAMPAIGNS BY DOCTOR ID ***
    app.get( `${ENDPOINT_URI}/campaign-doctors/doctor/:doctor_id` , async (req, res, next) => {

        try {
            const campaigns = await CampaignDoctorModel.findAll({
                attributes: {},
                where: {
                    doctor_id: req.params.doctor_id ,
                    [sequelize.Op.not] : [{campaign_doctor_status: "X"}]
                }
            });

            return res.json(campaigns);
        }
        catch (e){
            // return next(e);
            // console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });


    // *************************************************************************** GET DOCTORS BY CAMPAIGN ID ***
    app.get( `${ENDPOINT_URI}/campaign-doctors/campaign/:campaign_id` , async (req, res, next) => {

        try {
            const doctorsCampaign = await CampaignDoctorModel.findAll({
                attributes: {},
                where: {
                    campaign_id: req.params.campaign_id,
                    [sequelize.Op.not] : [{campaign_doctor_status: "X"}]
                }
            });

            return res.json(doctorsCampaign);
        }
        catch (e){
            // return next(e);
            // console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });

    // *************************************************************************** GET DOCTORS BY CODE ***
    app.get( `${ENDPOINT_URI}/campaign-doctors/code/:campaign_doctor_code` , async (req, res, next) => {

        // console.log("req.params.campaign_doctor_code==>", req.params.campaign_doctor_code);

        try {
            const campaignDoctor = await CampaignDoctorModel.findOne({
                raw: true,
                attributes: {},
                where: {
                    [sequelize.Op.and] : {
                        campaign_doctor_code: {[sequelize.Op.like]: '%' + req.params.campaign_doctor_code + '%'} ,
                        campaign_doctor_status: {[sequelize.Op.not]: "X"},
                    }
                }
            });

            return res.json(campaignDoctor);
        }
        catch (e){
            // return next(e);
            console.log("e==>", e);
            if (e.errors===undefined) {
                return next(new Error(e.parent.code))
                // return next(new Error(e.parent.sqlMessage))
            } else {
                return next(new Error(e.errors[0].message))
            }

        }

    });




    // *************************************************************************** POST CAMPAIGN-DOCTOR (CREATE CAMPAIGN-DOCTOR)
    app.post(`${ENDPOINT_URI}/campaign-doctors`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.args.campaign_id || !req.body.args.doctor_id ||
            !req.body.args.code_type_id || !req.body.args.campaign_doctor_code) {
            return next (new Error("Campaign Doctor data are incomplete!"));
        }


        try {

            // Creo commerce type
            var CAMPAIGN_DOCTOR_ID=generateUUID();

            const newCampaign = await CampaignDoctorModel.create({
                campaign_doctor_id: CAMPAIGN_DOCTOR_ID,
                campaign_id: req.body.args.campaign_id,
                doctor_id: req.body.args.doctor_id,
                code_type_id: req.body.args.code_type_id,
                campaign_doctor_code: req.body.args.campaign_doctor_code,
            });

            // Devuelvo nueva code type
            return res.json(newCampaign);

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


    // *************************************************************************** PUT CAMPAIGN-DOCTOR (UPDATE CAMPAIGN-DOCTOR)
    app.put(`${ENDPOINT_URI}/campaign-doctors/:campaign_doctor_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.campaign_doctor_id) {
            return next (new Error("Campaign Doctor ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.campaign_doctor_name) {
        //     return next (new Error("Commerce Type data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.campaign_id) updateJSON['campaign_id'] = req.body.args.campaign_id;
        if (req.body.args.doctor_id) updateJSON['doctor_id'] = req.body.args.doctor_id;
        if (req.body.args.code_type_id) updateJSON['code_type_id'] = req.body.args.code_type_id;
        if (req.body.args.campaign_doctor_code) updateJSON['campaign_doctor_code'] = req.body.args.campaign_doctor_code;
        if (req.body.args.campaign_doctor_status) updateJSON['campaign_doctor_status'] = req.body.args.campaign_doctor_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CampaignDoctorModel.update(updateJSON,
            {
                where: {
                    campaign_doctor_id: req.params.campaign_doctor_id,
                    [sequelize.Op.not] : [{campaign_doctor_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type actualizado
            const updatedCampaignDoctor = await CampaignDoctorModel.findOne({
                attributes: {},
                where: {
                    campaign_doctor_id: req.params.campaign_doctor_id,
                    [sequelize.Op.not] : [{campaign_doctor_status: "X"}]
                }
            });

            if (!updatedCampaignDoctor) return next(new Error("Invalid Campaign Doctor ID or Deleted"));
            return res.json(updatedCampaignDoctor);


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


    // *************************************************************************** DELETE CAMPAIGN-DOCTOR (DELETE CAMPAIGN-DOCTOR)
    app.delete(`${ENDPOINT_URI}/campaign-doctors/:campaign_doctor_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.campaign_doctor_id) {
            return next (new Error("Campaign Doctor ID is missing!"));
        }

        try {

            // Actualizo code type como X
            const [numberOfAffectedRows, affectedRows] = await CampaignDoctorModel.update({
                campaign_doctor_status: "X",
            },{
                where: {
                    campaign_doctor_id: req.params.campaign_doctor_id,
                    [sequelize.Op.not] : [{campaign_doctor_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type eliminado
            if (affectedRows==0) return next(new Error("Invalid Campaign Doctor ID or Deleted"));
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




    // *************************************************************************** POST CAMPAIGN-DOCTOR (CAMPAIGN-DOCTOR FILE)
    app.post(`${ENDPOINT_URI}/campaign-doctors/file/:campaign_id`, async(req, res, next) => {


        // Valido el body si llega con el ID
        if (!req.params.campaign_id) {
            return next (new Error("Campaign ID is missing!"));
        }

        try {

            // // Verifico si evento existe
            // const campaign = await CampaignModel.findOne({
            //     attributes: {},
            //     where: {campaign_id: req.params.campaign_id, [sequelize.Op.not] : [{campaign_status: "X"}]},
            // });
            //
            // // if (isEmpty(campaign)) return next(new Error("Campaign event ID doesn't exist or Deleted"));
            // if (isEmpty(campaign)) return new Error("Campaign event ID doesn't exist or Deleted");


            // Verifico si doctor no existe lo creo sino obtengo ID
            const doctor = await DoctorModel.findOne({
                attributes: {},
                where: {
                    [sequelize.Op.or] : [
                        {doctor_email: req.body.doctor_email},
                        {doctor_name: req.body.doctor_name},
                    ],
                    [sequelize.Op.not] : [{doctor_status: "X"}]},
            });

            // Si no existe lo creo
            var newDoctor;
            if (isEmpty(doctor)){
                newDoctor= await DoctorModel.create({
                    doctor_id: generateUUID(),
                    doctor_name: req.body.doctor_name,
                    doctor_email: req.body.doctor_email,
                });
            }

            // Obtengo prefijo
            const campaign = await CampaignModel.findOne({
                attributes: {},
                where: {campaign_id: req.params.campaign_id, [sequelize.Op.not] : [{campaign_status: "X"}]},
            });


            // CREO CAMPAIGN-DOCTOR
            const newCampaignDoctor = await CampaignDoctorModel.create({
                campaign_doctor_id: generateUUID(),
                campaign_id: req.params.campaign_id,
                doctor_id: isEmpty(doctor) ? newDoctor.doctor_id: doctor.doctor_id,
                code_type_id: req.body.code_type_id,
                campaign_doctor_code: `${req.body.campaign_doctor_code}`,
            });

            // Devuelvo nuevo campaign-doctor
            return res.json(newCampaignDoctor);


        } catch(e) {
            // console.log(e);
            // return next(e);
            console.log("e==>", e);
            return res.json({});
            // if (e.errors===undefined) {
            //     return next(new Error(e.parent.code))
            //     // return next(new Error(e.parent.sqlMessage))
            // } else {
            //     return next(new Error(e.errors[0].message))
            // }

        }


    });




    // ------------------------------------------------- CAMPAIGN-PRODUCT ------------------------------------------

    // *************************************************************************** GET ALL CAMPAIGN-PRODUCTS INFO ***
    app.post( `${ENDPOINT_URI}/campaign-products/all` , async (req, res, next) => {

        const filter = await getWhere({filter: req.body.args.filter, status: "campaign_product_status"});
        // console.log('filter', filter);

        try {
            const campaignProducts = await CampaignProductModel.findAndCountAll({
                order: [['campaign_product_created','desc']],
                attributes: {},
                where: filter
            });
            return res.json(campaignProducts);
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

    // *************************************************************************** GET COUNT CAMPAIGN-PRODUCTS ***
    app.get( `${ENDPOINT_URI}/campaign-products/count` , async (req, res, next) => {

        try {
            const campaignProducts = await CampaignProductModel.findAndCountAll();
            return res.json(campaignProducts);
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


    // *************************************************************************** GET CAMPAIGN-PRODUCT BY ID INFO ***
    app.get( `${ENDPOINT_URI}/campaign-products/:campaign_product_id` , async (req, res, next) => {

        // console.log("req.params.campaign_product_id==>", req.params.campaign_product_id);
        try {
            const campaignProduct = await CampaignProductModel.findOne({
                attributes: {},
                where: {
                    [sequelize.Op.and] : {
                        campaign_product_id: { [sequelize.Op.eq]: `${req.params.campaign_product_id}` } ,
                        campaign_product_status: { [sequelize.Op.not]: "X" },

                    }
                }
            });
            return res.json(campaignProduct);
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


    // *************************************************************************** GET CAMPAIGNS BY PRODUCT ID ***
    app.get( `${ENDPOINT_URI}/campaign-products/product/:product_id` , async (req, res, next) => {

        try {
            const campaignProduct = await CampaignProductModel.findAll({
                attributes: {},
                where: {
                    product_id: req.params.product_id ,
                    [sequelize.Op.not] : [{campaign_product_status: "X"}]
                }
            });
            return res.json(campaignProduct);
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


    // *************************************************************************** GET PRODUCTS BY CAMPAIGN ID ***
    app.get( `${ENDPOINT_URI}/campaign-products/campaign/:campaign_id` , async (req, res, next) => {

        try {
            const productsCampaign = await CampaignProductModel.findAll({
                attributes: {},
                where: {
                    campaign_id: req.params.campaign_id ,
                    [sequelize.Op.not] : [{campaign_product_status: "X"}]
                }
            });
            return res.json(productsCampaign);
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


    // *************************************************************************** POST CAMPAIGN-PRODUCT (CREATE CAMPAIGN-PRODUCT)
    app.post(`${ENDPOINT_URI}/campaign-products`, async(req, res, next) => {


        // Valido el body si llega con todos los datos
        if (!req.body.args.campaign_id || !req.body.args.product_id ) {
            return next (new Error("Campaign Product data are incomplete!"));
        }


        try {

            // Creo commerce type
            var CAMPAIGN_PRODUCT_ID=generateUUID();

            const newCampaignProduct = await CampaignProductModel.create({
                campaign_product_id: CAMPAIGN_PRODUCT_ID,
                campaign_id: req.body.args.campaign_id,
                product_id: req.body.args.product_id,
                campaign_product_descto: req.body.args.campaign_product_descto,
            });

            // Devuelvo nueva code type
            return res.json(newCampaignProduct);

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


    // *************************************************************************** PUT CAMPAIGN-PRODUCT (UPDATE CAMPAIGN-PRODUCT)
    app.put(`${ENDPOINT_URI}/campaign-products/:campaign_product_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.campaign_product_id) {
            return next (new Error("Campaign Product ID is missing!"));
        }

        // // Valido el body si llega con todos los datos
        // if (!req.body.campaign_product_name) {
        //     return next (new Error("Commerce Type data are incomplete!"));
        // }

        // Armo el JSON de Actualizacion solo con los campos que vienen
        var updateJSON = {};
        if (req.body.args.campaign_id) updateJSON['campaign_id'] = req.body.args.campaign_id;
        if (req.body.args.product_id) updateJSON['product_id'] = req.body.args.product_id;
        if (req.body.args.campaign_product_descto) updateJSON['campaign_product_descto'] = req.body.args.campaign_product_descto;
        if (req.body.args.campaign_product_status) updateJSON['campaign_product_status'] = req.body.args.campaign_product_status;

        // console.log(Object.entries(updateJSON).length);

        if (Object.entries(updateJSON).length === 0) {
            return next (new Error("Nothing to update !"));
        }

        try {

            const [numberOfAffectedRows, affectedRows] = await CampaignProductModel.update(updateJSON,
            {
                where: {
                    campaign_product_id: req.params.campaign_product_id,
                    [sequelize.Op.not] : [{campaign_product_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type actualizado
            const updatedCampaignProduct = await CampaignProductModel.findOne({
                attributes: {},
                where: {
                    campaign_product_id: req.params.campaign_product_id,
                    [sequelize.Op.not] : [{campaign_product_status: "X"}]
                }
            });

            if (!updatedCampaignProduct) return next(new Error("Invalid Campaign Product ID or Deleted"));
            return res.json(updatedCampaignProduct);


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


    // *************************************************************************** DELETE CAMPAIGN-PRODUCT (DELETE CAMPAIGN-PRODUCT)
    app.delete(`${ENDPOINT_URI}/campaign-products/:campaign_product_id`, async(req, res, next) => {

        // Valido el body si llega con el ID
        if (!req.params.campaign_product_id) {
            return next (new Error("Campaign Product ID is missing!"));
        }

        try {

            // Actualizo code type como X
            const [numberOfAffectedRows, affectedRows] = await CampaignProductModel.update({
                campaign_product_status: "X",
            },{
                where: {
                    campaign_product_id: req.params.campaign_product_id,
                    [sequelize.Op.not] : [{campaign_product_status: "X"}]
                },
                returning: true,
                // plain: true,
            });

            // Devuelvo code type eliminado
            if (affectedRows==0) return next(new Error("Invalid Campaign Product ID or Deleted"));
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

    // // ------------------------------------------------- CONSUMMER ------------------------------------------
    //
    // // *************************************************************************** GET ALL CONSUMMERS INFO ***
    // app.post( `${ENDPOINT_URI}/consummers/all` , async (req, res, next) => {
    //
    //     const filter = await getWhere({filter: req.body.args.filter, status: "consummer_status"});
    //     // console.log('filter', filter);
    //
    //     try {
    //         const consummers = await ConsummerModel.findAndCountAll({
    //             order: [['consummer_name','asc']],
    //             attributes: {},
    //             where: filter
    //         });
    //         return res.json(consummers);
    //     }
    //     catch (e){
    //         // return next(e);
    //         // console.log("e===>", e);
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
    //
    //
    // // *************************************************************************** GET COUNT CODE-TYPES ***
    // app.get( `${ENDPOINT_URI}/consummers/count` , async (req, res, next) => {
    //
    //     try {
    //         const consummers = await ConsummerModel.findAndCountAll();
    //         return res.json(consummers);
    //     }
    //     catch (e){
    //         // return next(e);
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
    //
    //
    // // *************************************************************************** GET CONSUMMER BY ID INFO ***
    // app.get( `${ENDPOINT_URI}/consummers/:consummer_id` , async (req, res, next) => {
    //
    //     // console.log(req.params);
    //
    //     try {
    //         const consummer = await ConsummerModel.findOne({
    //             attributes: {},
    //             where: {
    //                 consummer_id: req.params.consummer_id,
    //                 [sequelize.Op.not] : [{consummer_status: "X"}]
    //             }
    //         });
    //         return res.json(consummer);
    //     }
    //     catch (e){
    //         // return next(e);
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
    //
    // // *************************************************************************** POST CONSUMMER (CREATE CONSUMMER)
    // app.post(`${ENDPOINT_URI}/consummers`, async(req, res, next) => {
    //
    //
    //     // Valido el body si llega con todos los datos
    //     if (!req.body.args.consummer_name || !req.body.args.consummer_email || !req.body.args.consummer_identification ||
    //         !req.body.args.consummer_phone || !req.body.args.consummer_city || !req.body.args.consummer_dob ) {
    //         return next (new Error("Consummer data are incomplete!"));
    //     }
    //
    //
    //     try {
    //
    //         // Creo media product
    //         var CONSUMMER_ID=generateUUID();
    //
    //         const newConsummer = await ConsummerModel.create({
    //             consummer_id: CONSUMMER_ID,
    //             consummer_name: req.body.args.consummer_name,
    //             consummer_email: req.body.args.consummer_email,
    //             consummer_identification: req.body.args.consummer_identification,
    //             consummer_phone: req.body.args.consummer_phone,
    //             consummer_city: req.body.args.consummer_city,
    //             consummer_dob: req.body.args.consummer_dob,
    //         });
    //
    //         // Devuelvo nuevo media product
    //         return res.json(newConsummer);
    //
    //     } catch(e) {
    //         // return next(e);
    //         console.log("e==>", e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    //
    // // *************************************************************************** PUT CONSUMMER (UPDATE CONSUMMER)
    // app.put(`${ENDPOINT_URI}/consummers/:consummer_id`, async(req, res, next) => {
    //
    //     // Valido el body si llega con el ID
    //     if (!req.params.consummer_id) {
    //         return next (new Error("Consummer ID is missing!"));
    //     }
    //
    //     // // Valido el body si llega con todos los datos
    //     // if (!req.body.consummer_id || !req.body.consummer_name || !req.body.consummer_email ||
    //     //     !req.body.consummer_identification || !req.body.consummer_phone || !req.body.consummer_city ||
    //     //     !req.body.consummer_dob) {
    //     //     return next (new Error("Consummer data are incomplete!"));
    //     // }
    //
    //     // Armo el JSON de Actualizacion solo con los campos que vienen
    //     var updateJSON = {};
    //     if (req.body.args.consummer_name) updateJSON['consummer_name'] = req.body.args.consummer_name;
    //     if (req.body.args.consummer_email) updateJSON['consummer_email'] = req.body.args.consummer_email;
    //     if (req.body.args.consummer_identification) updateJSON['consummer_identification'] = req.body.args.consummer_identification;
    //     if (req.body.args.consummer_phone) updateJSON['consummer_phone'] = req.body.args.consummer_phone;
    //     if (req.body.args.consummer_city) updateJSON['consummer_city'] = req.body.args.consummer_city;
    //     if (req.body.args.consummer_dob) updateJSON['consummer_dob'] = req.body.args.consummer_dob;
    //     if (req.body.args.consummer_status) updateJSON['consummer_status'] = req.body.args.consummer_status;
    //
    //     // console.log(Object.entries(updateJSON).length);
    //
    //     if (Object.entries(updateJSON).length === 0) {
    //         return next (new Error("Nothing to update !"));
    //     }
    //
    //
    //     try {
    //
    //         const [numberOfAffectedRows, affectedRows] = await ConsummerModel.update(updateJSON,
    //         {
    //             where: {
    //                 consummer_id: req.params.consummer_id,
    //                 [sequelize.Op.not] : [{consummer_status: "X"}]
    //             },
    //             returning: true,
    //             // plain: true,
    //         });
    //
    //         // Devuelvo media product actualizado
    //         const updatedConsummer = await ConsummerModel.findOne({
    //             attributes: {},
    //             where: {
    //                 consummer_id: req.params.consummer_id,
    //                 [sequelize.Op.not] : [{consummer_status: "X"}]
    //             }
    //         });
    //
    //
    //         if (!updatedConsummer) return next(new Error("Invalid consummer ID or Deleted"));
    //         return res.json(updatedConsummer);
    //
    //
    //     } catch(e) {
    //         // return next(e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    //
    // // *************************************************************************** DELETE CONSUMMER (DELETE CONSUMMER)
    // app.delete(`${ENDPOINT_URI}/consummers/:consummer_id`, async(req, res, next) => {
    //
    //     // Valido el body si llega con el ID
    //     if (!req.params.consummer_id) {
    //         return next (new Error("Consummer ID is missing!"));
    //     }
    //
    //     const deletedConsummer = await ConsummerModel.findOne({
    //         attributes: {},
    //         where: {
    //             consummer_id: req.params.consummer_id,
    //             [sequelize.Op.not] : [{consummer_status: "X"}]
    //         }
    //     });
    //
    //     if (!deletedConsummer) return next(new Error("Invalid consummer ID or Deleted"));
    //
    //     try {
    //
    //         // Actualizo media product como X
    //         const [numberOfAffectedRows, affectedRows] = await ConsummerModel.update({
    //             consummer_status: "X",
    //         },{
    //             where: {consummer_id: req.params.consummer_id, [sequelize.Op.not] : [{consummer_status: "X"}]},
    //             returning: true,
    //             // plain: true,
    //         });
    //
    //         // Devuelvo media product eliminado
    //         if (affectedRows==0) return next(new Error("Invalid consummer ID or Deleted"));
    //         // return res.end();
    //         return res.json(true);
    //
    //     } catch(e) {
    //         // return next(e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    //
    //
    // // ------------------------------------------------- COUPON ------------------------------------------
    //
    // // *************************************************************************** GET ALL COUPON INFO ***
    // app.post( `${ENDPOINT_URI}/coupons/all` , async (req, res, next) => {
    //
    //     const filter = await getWhere({filter: req.body.args.filter, status: "coupon_status"});
    //     // console.log('filter', filter);
    //
    //     try {
    //         const coupons = await CouponModel.findAndCountAll({
    //             order: [['coupon_created','desc']],
    //             attributes: {},
    //             where: filter
    //         });
    //
    //         // console.log("coupons on /coupons/all ==>", coupons);
    //
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // return next(e);
    //         // console.log("e=====>", e);
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
    //
    //
    // // *************************************************************************** GET ROLLUP COUPON INFO ***
    // app.post( `${ENDPOINT_URI}/coupons/rollup` , async (req, res, next) => {
    //
    //     // console.log("req.body.args==>",req.body.args);
    //     const objFilter = JSON.parse(JSON.stringify(req.body));
    //     // console.log("obj==>",objFilter);
    //
    //     const filter = await getWhere({filter: objFilter.filter, status: null});
    //
    //     try {
    //         const coupons = await CouponsRollUp.findAndCountAll({
    //             order: [['category_name','asc'], ['brand_name','asc'], ['product_name','asc'], ['media_name','asc']],
    //             attributes: {},
    //             where: filter
    //         });
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // return next(e);
    //         // console.log(e);
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
    //
    //
    //
    // // *************************************************************************** GET COUNT CODE-TYPES ***
    // app.get( `${ENDPOINT_URI}/coupons/count` , async (req, res, next) => {
    //
    //     try {
    //         const coupons = await CouponModel.findAndCountAll();
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // return next(e);
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
    //
    //
    // // *************************************************************************** GET COUPON BY ID INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/:coupon_id` , async (req, res, next) => {
    //
    //     try {
    //         const coupon = await CouponModel.findOne({
    //             attributes: {},
    //             where: {
    //                 coupon_id: req.params.coupon_id,
    //                 [sequelize.Op.not] : [{coupon_status: "X"}]
    //             }
    //         });
    //         return res.json(coupon);
    //     }
    //     catch (e){
    //         // return next(e);
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
    //
    //
    // // *************************************************************************** GET COUPON BY CODEBAR INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/codebar/:coupon_codebar` , async (req, res, next) => {
    //
    //     // console.log("req.params==>", req.params);
    //
    //     try {
    //         const coupon = await CouponModel.findOne({
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : {
    //                     coupon_codebar: {[sequelize.Op.eq]: req.params.coupon_codebar },
    //                     coupon_expire: {[sequelize.Op.gte]: new Date() },
    //                     coupon_redimed: {[sequelize.Op.is]: null },
    //                     coupon_status: {[sequelize.Op.not]: ["X", "R", "I"] },
    //                 }
    //             }
    //         });
    //
    //         if (coupon===null) return next (new Error("Invalid coupon code bar,  Deleted or Redimmed !"));
    //
    //         // console.log('coupon========>', coupon);
    //         // if (coupon) {
    //         //     console.log( (coupon.coupon_expire>new Date()) ? "true" : "false" );
    //         //     console.log('coupon==>', coupon);
    //         // }
    //
    //         const mediaProductCoupon = await MediaProductModel.findOne({
    //             attributes: {},
    //             where: {
    //                 media_product_id: coupon.media_product_id,
    //                 [sequelize.Op.not] : [{media_product_status: ["X", "I"]}]
    //             }
    //         });
    //
    //         const productCoupon = await ProductModel.findOne({
    //             attributes: {},
    //             where: {
    //                 product_id: mediaProductCoupon.product_id,
    //                 [sequelize.Op.not] : [{product_status: ["X", "I"]}]
    //             }
    //         });
    //
    //         //Agrego este item <product_sku>
    //         coupon.dataValues.product_sku = productCoupon.product_sku;
    //         coupon.dataValues.product_descto = mediaProductCoupon.media_product_descto;
    //
    //         return res.json(coupon);
    //     }
    //     catch (e){
    //         // console.log("e===>", e);
    //         // return next(e);
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
    //
    //
    // // *************************************************************************** POST COUPON (CREATE COUPON)
    // app.post(`${ENDPOINT_URI}/coupons`, async(req, res, next) => {
    //
    //     // Valido el body si llega con todos los datos
    //     if (!req.body.args.media_product_id || !req.body.args.consummer_id ||
    //         !req.body.args.coupon_codebar || !req.body.args.coupon_expire ) {
    //         return next (new Error("Coupon Media Product, Consummer or Expire Date data is missing !"));
    //     }
    //
    //     // Armo el JSON de Creacion solo con los campos que vienen
    //     var createJSON = {};
    //     // Creo media product
    //     var COUPON_ID=generateUUID();
    //     createJSON['coupon_id'] = COUPON_ID;
    //     if (req.body.args.media_product_id) createJSON['media_product_id'] = req.body.args.media_product_id;
    //     if (req.body.args.commerce_type_id) createJSON['commerce_type_id'] = req.body.args.commerce_type_id;
    //     if (req.body.args.consummer_id) createJSON['consummer_id'] = req.body.args.consummer_id;
    //     if (req.body.args.coupon_codebar) createJSON['coupon_codebar'] = req.body.args.coupon_codebar;
    //     if (req.body.args.coupon_expire) createJSON['coupon_expire'] = req.body.args.coupon_expire;
    //     if (req.body.args.coupon_host) createJSON['coupon_host'] = req.body.args.coupon_host;
    //     if (req.body.args.coupon_ip) createJSON['coupon_ip'] = req.body.args.coupon_ip;
    //     if (req.body.args.coupon_latitude) createJSON['coupon_latitude'] = req.body.args.coupon_latitude;
    //     if (req.body.args.coupon_longitude) createJSON['coupon_longitude'] = req.body.args.coupon_longitude;
    //     if (req.body.args.coupon_device) createJSON['coupon_device'] = req.body.args.coupon_device;
    //     if (req.body.args.coupon_source) createJSON['coupon_source'] = req.body.args.coupon_source;
    //
    //     // console.log(Object.entries(updateJSON).length);
    //
    //     if (Object.entries(createJSON).length === 0) {
    //         return next (new Error("Nothing to create !"));
    //     }
    //
    //
    //     try {
    //
    //         const newCoupon = await CouponModel.create(createJSON);
    //
    //         // Devuelvo nuevo cupon
    //         return res.json(newCoupon);
    //
    //     } catch(e) {
    //         // console.log(e)
    //         // return next(e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    //
    // // *************************************************************************** PUT COUPON (UPDATE COUPON)
    // app.put(`${ENDPOINT_URI}/coupons/:coupon_id`, async(req, res, next) => {
    //
    //     // Valido el body si llega con el ID
    //     if (!req.params.coupon_id) {
    //         return next (new Error("Coupon ID is missing!"));
    //     }
    //
    //     // // Valido el body si llega con todos los datos
    //     // if (!req.body.coupon_id || !req.body.media_product_id || !req.body.commerce_type_id ||
    //     //     !req.body.consummer_id || !req.body.coupon_codebar || !req.body.coupon_expire ) {
    //     //     return next (new Error("Coupon data are incomplete!"));
    //     // }
    //
    //     // Armo el JSON de Actualizacion solo con los campos que vienen
    //     var updateJSON = {};
    //     if (req.body.args.media_product_id) updateJSON['media_product_id'] = req.body.args.media_product_id;
    //     if (req.body.args.commerce_type_id) updateJSON['commerce_type_id'] = req.body.args.commerce_type_id;
    //     if (req.body.args.consummer_id) updateJSON['consummer_id'] = req.body.args.consummer_id;
    //     if (req.body.args.coupon_codebar) updateJSON['coupon_codebar'] = req.body.args.coupon_codebar;
    //     if (req.body.args.coupon_expire) updateJSON['coupon_expire'] = req.body.args.coupon_expire;
    //     if (req.body.args.coupon_redimed) updateJSON['coupon_redimed'] = req.body.args.coupon_redimed;
    //     if (req.body.args.coupon_host) updateJSON['coupon_host'] = req.body.args.coupon_host;
    //     if (req.body.args.coupon_ip) updateJSON['coupon_ip'] = req.body.args.coupon_ip;
    //     if (req.body.args.coupon_latitude) updateJSON['coupon_latitude'] = req.body.args.coupon_latitude;
    //     if (req.body.args.coupon_longitude) updateJSON['coupon_longitude'] = req.body.args.coupon_longitude;
    //     if (req.body.args.coupon_device) updateJSON['coupon_longitude'] = req.body.args.coupon_device;
    //     if (req.body.args.coupon_status) updateJSON['coupon_status'] = req.body.args.coupon_status;
    //
    //     // console.log(Object.entries(updateJSON).length);
    //
    //     if (Object.entries(updateJSON).length === 0) {
    //         return next (new Error("Nothing to update !"));
    //     }
    //
    //     try {
    //
    //         const [numberOfAffectedRows, affectedRows] = await CouponModel.update(updateJSON,
    //         {
    //             where: {
    //                 coupon_id: req.params.coupon_id, 
    //                 [sequelize.Op.not] : [{coupon_status: "X"}]
    //             },
    //             returning: true,
    //             // plain: true,
    //         });
    //
    //         // Devuelvo media product actualizado
    //         const updatedCoupon = await CouponModel.findOne({
    //             attributes: {},
    //             where: {
    //                 coupon_id: req.params.coupon_id, 
    //                 [sequelize.Op.not] : [{coupon_status: "X"}]
    //             }
    //         });
    //
    //         if (!updatedCoupon) return next(new Error("Invalid coupon ID or Deleted"));
    //         return res.json(updatedCoupon);
    //
    //
    //     } catch(e) {
    //         // return next(e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    //
    // // *************************************************************************** PUT COUPON (REDIME COUPON)
    // app.put(`${ENDPOINT_URI}/coupons/redime/:coupon_id`, async(req, res, next) => {
    //
    //     // Valido el body si llega con el ID
    //     if (!req.params.coupon_id) {
    //         return next (new Error("Coupon ID is missing!"));
    //     }
    //
    //     // // Valido el body si llega con todos los datos
    //     // if (!req.body.coupon_id || !req.body.media_product_id || !req.body.commerce_type_id ||
    //     //     !req.body.consummer_id || !req.body.coupon_codebar || !req.body.coupon_expire ) {
    //     //     return next (new Error("Coupon data are incomplete!"));
    //     // }
    //
    //     // Armo el JSON de Actualizacion solo con los campos que vienen
    //     var updateJSON = {};
    //     updateJSON['coupon_redimed'] = new Date();
    //     updateJSON['coupon_status'] = "R";
    //     if (req.body.args.commerce_type_id) updateJSON['commerce_type_id'] = req.body.args.commerce_type_id;
    //     if (req.body.args.coupon_host) updateJSON['coupon_host'] = req.body.args.coupon_host;
    //     if (req.body.args.coupon_ip) updateJSON['coupon_ip'] = req.body.args.coupon_ip;
    //     if (req.body.args.coupon_latitude) updateJSON['coupon_latitude'] = req.body.args.coupon_latitude;
    //     if (req.body.args.coupon_longitude) updateJSON['coupon_longitude'] = req.body.args.coupon_longitude;
    //     if (req.body.args.coupon_device) updateJSON['coupon_longitude'] = req.body.args.coupon_device;
    //
    //     // console.log(Object.entries(updateJSON).length);
    //
    //     if (Object.entries(updateJSON).length === 0) {
    //         return next (new Error("Nothing to update !"));
    //     }
    //
    //     try {
    //
    //         const [numberOfAffectedRows, affectedRows] = await CouponModel.update(updateJSON,
    //         {
    //             where: {
    //                 coupon_id: req.params.coupon_id,
    //                 [sequelize.Op.not] : [{coupon_status: ["X", "I", "R"]}]
    //             },
    //             returning: true,
    //             // plain: true,
    //         });
    //
    //
    //         if (affectedRows===0) return next (new Error("Invalid coupon ID,  Deleted or Redimmed !"));
    //
    //
    //         // Devuelvo media product actualizado
    //         var updatedCoupon = await CouponModel.findOne({
    //             attributes: {},
    //             where: {
    //                 coupon_id: req.params.coupon_id,
    //                 coupon_status : {[sequelize.Op.eq]: "R"}
    //             }
    //         });
    //
    //         const mediaProductCoupon = await MediaProductModel.findOne({
    //             attributes: {},
    //             where: {
    //                 media_product_id: updatedCoupon.media_product_id,
    //                 [sequelize.Op.not] : [{media_product_status: ["X", "I"]}]
    //             }
    //         });
    //
    //         const productCoupon = await ProductModel.findOne({
    //             attributes: {},
    //             where: {
    //                 product_id: mediaProductCoupon.product_id,
    //                 [sequelize.Op.not] : [{product_status: ["X", "I"]}]
    //             }
    //         });
    //
    //
    //         // console.log('updatedCoupon==>', updatedCoupon);
    //
    //         if (!updatedCoupon) return next(new Error("Invalid coupon ID, Deleted or Redimmed"));
    //
    //         //Agrego este item <product_sku>
    //         updatedCoupon.dataValues.product_sku = productCoupon.product_sku;
    //         updatedCoupon.dataValues.product_descto = mediaProductCoupon.media_product_descto;
    //
    //         return res.json(updatedCoupon);
    //
    //
    //     } catch(e) {
    //         console.log(e);
    //         // return next(e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    // // *************************************************************************** PUT COUPON (REDIME FILE)
    // app.put(`${ENDPOINT_URI}/coupons/redime/file/:coupon_id`, async(req, res, next) => {
    //
    //     // Valido el body si llega con el ID
    //     if (!req.params.coupon_id) {
    //         return next (new Error("Coupon ID is missing!"));
    //     }
    //
    //     // // Valido el body si llega con todos los datos
    //     // if (!req.body.coupon_id || !req.body.media_product_id || !req.body.commerce_type_id ||
    //     //     !req.body.consummer_id || !req.body.coupon_codebar || !req.body.coupon_expire ) {
    //     //     return next (new Error("Coupon data are incomplete!"));
    //     // }
    //
    //     // Armo el JSON de Actualizacion solo con los campos que vienen
    //     var updateJSON = {};
    //     updateJSON['coupon_redimed'] = req.body.redimed;
    //     updateJSON['coupon_status'] = "R";
    //     updateJSON['commerce_type_id'] = req.body.commerceType;
    //     updateJSON['coupon_redimed_file'] = req.body.uploaded;
    //
    //
    //     // console.log(Object.entries(updateJSON).length);
    //
    //     if (Object.entries(updateJSON).length === 0) {
    //         return next (new Error("Nothing to update !"));
    //     }
    //
    //     try {
    //
    //         const [numberOfAffectedRows, affectedRows] = await CouponModel.update(updateJSON,
    //         {
    //             where: {
    //                 coupon_id: req.params.coupon_id,
    //                 [sequelize.Op.not] : [{coupon_status: ["X", "I", "R"]}]
    //             },
    //             returning: true,
    //             // plain: true,
    //         });
    //
    //
    //         if (affectedRows===0) return next (new Error("Invalid coupon ID,  Deleted or Redimmed !"));
    //
    //
    //         // Devuelvo media product actualizado
    //         const updatedCoupon = await CouponModel.findOne({
    //             attributes: {},
    //             where: {
    //                 coupon_id: req.params.coupon_id,
    //                 coupon_status : {[sequelize.Op.eq]: "R"}
    //             }
    //         });
    //
    //         // console.log('updatedCoupon==>', updatedCoupon);
    //
    //         if (!updatedCoupon) return next(new Error("Invalid coupon ID, Deleted or Redimmed"));
    //
    //         return res.json(updatedCoupon);
    //
    //
    //     } catch(e) {
    //         // console.log(e);
    //         // return next(e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    //
    // // *************************************************************************** DELETE COUPON (DELETE COUPON)
    // app.delete(`${ENDPOINT_URI}/coupons/:coupon_id`, async(req, res, next) => {
    //
    //     // Valido el body si llega con el ID
    //     if (!req.params.coupon_id) {
    //         return next (new Error("Coupon ID is missing!"));
    //     }
    //
    //     const deletedCoupon = await CouponModel.findOne({
    //         attributes: {},
    //         where: {
    //             coupon_id: req.params.coupon_id,
    //             [sequelize.Op.not] : [{coupon_status: "X"}]
    //         }
    //     });
    //
    //     if (!deletedCoupon) return next(new Error("Invalid coupon ID or Deleted"));
    //
    //     try {
    //
    //         // Actualizo media product como X
    //         const [numberOfAffectedRows, affectedRows] = await CouponModel.update({
    //             coupon_status: "X",
    //         },{
    //             where: {
    //                 coupon_id: req.params.coupon_id,
    //                 [sequelize.Op.not] : [{coupon_status: "X"}]
    //             },
    //             returning: true,
    //             // plain: true,
    //         });
    //
    //         // Devuelvo media product eliminado
    //         if (affectedRows==0) return next(new Error("Invalid coupon ID or Deleted"));
    //         // return res.end();
    //         return res.json(true);
    //
    //     } catch(e) {
    //         // return next(e);
    //         if (e.errors===undefined) {
    //             return next(new Error(e.parent.code))
    //             // return next(new Error(e.parent.sqlMessage))
    //         } else {
    //             return next(new Error(e.errors[0].message))
    //         }
    //
    //     }
    //
    //
    // });
    //
    //
    //
    // // *************************************************************************** GET COUPON BY CONSUMMER-PRODUCT INFO ***
    // app.post( `${ENDPOINT_URI}/coupons/consummer/product` , async (req, res, next) => {
    //
    //     // const dateTime = await moment().format('YYYY-MM-DDTHH:mm:ss.SSS000');
    //     // const dateTime = await moment().utc().format('YYYY-MM-DD HH:mm:ss');
    //
    //     try {
    //         const coupons = await CouponModel.findAndCountAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     consummer_id: req.body.consummer_id ,
    //                     coupon_source: req.body.product_id ,
    //                     coupon_expire: { [sequelize.Op.gte]: moment() },
    //                     [sequelize.Op.not] : [{coupon_status: ["X", "R"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         // console.log("coupons en /coupons/consummer/product==>", coupons);
    //
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // return next(e);
    //         // console.log(e);
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
    //
    //
    //
    // // *************************************************************************** GET COUPON BY CONSUMMER-MEDIA INFO ***
    // app.post( `${ENDPOINT_URI}/coupons/consummer/media` , async (req, res, next) => {
    //
    //     // const dateTime = await moment().format('YYYY-MM-DDTHH:mm:ss.SSS000');
    //     // const dateTime = await moment().utc().format('YYYY-MM-DD HH:mm:ss');
    //
    //     try {
    //         const coupons = await CouponModel.findAndCountAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     consummer_id: req.body.consummer_id ,
    //                     coupon_source: (req.body.media_id + "," + req.body.product_id) ,
    //                     coupon_expire: { [sequelize.Op.gte]: moment() },
    //                     [sequelize.Op.not] : [{coupon_status: ["X", "R"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // *************************************************************************** GET COUPON BY COMMERCE-TYPE INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/commerceType/:commerce_type_id` , async (req, res, next) => {
    //
    //
    //     try {
    //         const coupons = await CouponModel.findAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     commerce_type_id: req.params.commerce_type_id ,
    //                     [sequelize.Op.not] : [{coupon_status: ["X"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // *************************************************************************** GET COUPON BY MEDIA_PRODUCT INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/media_product/:media_product_id` , async (req, res, next) => {
    //
    //     try {
    //         const coupons = await CouponModel.findAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     media_product_id: req.params.media_product_id ,
    //                     [sequelize.Op.not] : [{coupon_status: ["X"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // *************************************************************************** GET COUPON BY CONSUMMER INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/consummer/:consummer_id` , async (req, res, next) => {
    //
    //
    //     try {
    //         const coupons = await CouponModel.findAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     consummer_id: req.body.consummer_id ,
    //                     [sequelize.Op.not] : [{coupon_status: ["X"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // ------------------------------------------------------ VIEWS ---------------------------
    //
    // // *************************************************************************** GET COUPONS BY CATEGORY_ID INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byCategory/:category_id` , async (req, res, next) => {
    //
    //     try {
    //         const coupons = await viewCouponModel.findAndCountAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     category_id: req.params.category_id ,
    //                     [sequelize.Op.not] : [{coupon_status: ["X"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // *************************************************************************** GET COUPONS BY BRAND_ID INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byBrand/:brand_id` , async (req, res, next) => {
    //
    //     try {
    //         const coupons = await viewCouponModel.findAndCountAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     brand_id: req.params.brand_id ,
    //                     [sequelize.Op.not] : [{coupon_status: ["X"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    //
    //
    // // *************************************************************************** GET COUPONS BY PRODUCT_ID INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byProduct/:product_id` , async (req, res, next) => {
    //
    //     try {
    //         const coupons = await viewCouponModel.findAndCountAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     product_id: req.params.product_id ,
    //                     [sequelize.Op.not] : [{coupon_status: ["X"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // *************************************************************************** GET COUPONS BY MEDIA_ID INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byMedia/:media_id` , async (req, res, next) => {
    //
    //     try {
    //         const coupons = await viewCouponModel.findAndCountAll({
    //             order: [['coupon_created','asc']],
    //             attributes: {},
    //             where: {
    //                 [sequelize.Op.and] : [{
    //                     media_id: req.params.media_id ,
    //                     [sequelize.Op.not] : [{coupon_status: ["X"]}]
    //
    //                 }],
    //             }
    //         });
    //
    //         return res.json(coupons);
    //
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // *************************************************************************** GET COUPONS METRICS BY CATEGORY INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byCategoryMetrics/:category_id/:from/:to` , async (req, res, next) => {
    //
    //     // Inicializo WHERE
    //     var xWhere;
    //     xWhere={
    //         [sequelize.Op.and] : [],
    //     };
    //
    //     if (req.params.category_id ==="undefined" && req.params.from==="undefined" && req.params.to==="undefined") {
    //         xWhere={};
    //     } else {
    //
    //         if (req.params.category_id && req.params.category_id!=='undefined') {
    //
    //             // Agrego filtro por categoria
    //             xWhere[sequelize.Op.and].push({
    //                 id: req.params.category_id ,
    //             });
    //
    //             // Agrego filtro por fechas
    //             if (req.params.from!=="undefined" && req.params.to!=="undefined") {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //             }
    //
    //         } else {
    //
    //             if (req.params.from && req.params.to) {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //
    //             }
    //
    //         }
    //
    //     }
    //
    //
    //
    //     // console.log("xWhere==>", xWhere);
    //
    //     try {
    //
    //         var coupons = await CouponsByCategoryModel.findAndCountAll({
    //             order: [['dates','asc']],
    //             attributes: {},
    //             where: xWhere,
    //         });
    //         // console.log("coupons==>", JSON.stringify(coupons));
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // console.log("e==>", e);
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
    //
    //
    //
    //
    // // *************************************************************************** GET COUPONS METRICS BY BRAND INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byBrandMetrics/:brand_id/:from/:to` , async (req, res, next) => {
    //
    //     // Inicializo WHERE
    //     var xWhere;
    //     xWhere={
    //         [sequelize.Op.and] : [],
    //     };
    //
    //     if (req.params.brand_id ==="undefined" && req.params.from==="undefined" && req.params.to==="undefined") {
    //         xWhere={};
    //     } else {
    //
    //         if (req.params.brand_id && req.params.brand_id!=='undefined') {
    //
    //             // Agrego filtro por brand
    //             xWhere[sequelize.Op.and].push({
    //                 id: req.params.brand_id ,
    //             });
    //
    //             // Agrego filtro por fechas
    //             if (req.params.from!=="undefined" && req.params.to!=="undefined") {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //             }
    //
    //         } else {
    //
    //             if (req.params.from && req.params.to) {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //
    //             }
    //
    //         }
    //
    //     }
    //
    //     // console.log("xWhere==>", xWhere);
    //
    //     try {
    //         const coupons = await CouponsByBrandModel.findAndCountAll({
    //             order: [['dates','asc']],
    //             attributes: {},
    //             where: xWhere,
    //         });
    //         // console.log("coupons==>", coupons);
    //         return res.json(coupons);
    //     }
    //     catch (e){
    //         // console.log("e==>", e);
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
    //
    //
    // // *************************************************************************** GET COUPONS METRICS BY PRODUCT INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byProductMetrics/:product_id/:from/:to` , async (req, res, next) => {
    //
    //     // Inicializo WHERE
    //     var xWhere;
    //     xWhere={
    //         [sequelize.Op.and] : [],
    //     };
    //
    //
    //     if (req.params.product_id==="undefined" && req.params.from==="undefined" && req.params.to==="undefined") {
    //         xWhere={};
    //     } else {
    //
    //         if (req.params.product_id && req.params.product_id!=='undefined') {
    //             // Agrego filtro por prdoucto
    //             xWhere[sequelize.Op.and].push({
    //                 id: req.params.product_id ,
    //             });
    //
    //             // Agrego filtro por fechas
    //             if (req.params.from!=="undefined" && req.params.to!=="undefined") {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //             }
    //
    //         } else {
    //
    //             if (req.params.from && req.params.to) {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //
    //             }
    //         }
    //
    //     }
    //
    //
    //     // console.log("xWhere==>", xWhere);
    //
    //     try {
    //         const coupons = await CouponsByProductModel.findAndCountAll({
    //             order: [['dates','asc']],
    //             attributes: {},
    //             where: xWhere
    //         });
    //
    //         // console.log("coupons==>", coupons);
    //
    //         return res.json(coupons);
    //
    //     }
    //     catch (e){
    //         // console.log(e);
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
    //
    //
    // // *************************************************************************** GET COUPONS METRICS BY MEDIA INFO ***
    // app.get( `${ENDPOINT_URI}/coupons/byMediaMetrics/:media_id/:from/:to` , async (req, res, next) => {
    //
    //     // Inicializo WHERE
    //     var xWhere;
    //     xWhere={
    //         [sequelize.Op.and] : [],
    //     };
    //
    //     if (req.params.media_id==="undefined" && req.params.from==="undefined" && req.params.to==="undefined") {
    //         xWhere={};
    //     } else {
    //
    //         if (req.params.media_id && req.params.media_id!=='undefined') {
    //
    //             // Agrego filtro por categoria
    //             xWhere[sequelize.Op.and].push({
    //                 id: req.params.media_id ,
    //             });
    //
    //             // Agrego filtro por fechas
    //             if (req.params.from!=="undefined" && req.params.to!=="undefined") {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //             }
    //
    //         } else {
    //
    //             if (req.params.from && req.params.to) {
    //                 xWhere[sequelize.Op.and].push({
    //                     dates: {
    //                         [sequelize.Op.between]: [req.params.from, req.params.to]
    //                     }
    //                 });
    //
    //             }
    //
    //         }
    //
    //     }
    //
    //
    //     // console.log("xWhere==>", xWhere);
    //
    //
    //     try {
    //         const coupons = await CouponsByMediaModel.findAndCountAll({
    //             order: [['dates','asc']],
    //             attributes: {},
    //             where: xWhere
    //         });
    //
    //         // console.log("coupons==>", coupons);
    //
    //         return res.json(coupons);
    //
    //     }
    //     catch (e){
    //         // console.log(e);
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
    


};


export default setupRoutes;

