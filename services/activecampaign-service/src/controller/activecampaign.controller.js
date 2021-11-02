/*
* EN EL CONTAINER DE ACTIVE CAMPAIGN INSTALAR
* #apt-get update && apt-get install -y chromium
* */

const util = require("util");
const path = require("path");
const CircularJSON  = require("circular-json");
import accessEnv from "#root/helpers/accessEnv";
import qrGenerator from "#root/helpers/qrGenerator";
import htmlToImage from "#root/helpers/htmlToImage";
import fs from 'fs';
import axios from 'axios';
import isEmpty from "lodash/isEmpty";

// ------------- CONSTANTS ---------------
const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: false, port: 7111, hostname: 'tablita.veritasoft.site' },
    development: { ssl: false, port: 7111, hostname: '192.168.100.100' }
};


const ENVIRONMENT = accessEnv("ENVIRONMENT", 'development');
const COUPON_SERVICE_URI = accessEnv("COUPON_SERVICE_URI", 'http://localhost:7104/api/v1');
const USER_SERVICE_URI = accessEnv("USER_SERVICE_URI", 'http://localhost:7100/api/v1');
const ACTIVECAMPAIGN_URI = accessEnv("ACTIVECAMPAIGN_URI", 'https://fnaranjoec.api-us1.com/api/3');
const ACTIVECAMPAIGN_TOKEN = accessEnv("ACTIVECAMPAIGN_TOKEN", '3d5811914e07564beebe5817b232380e6068a26901c4c4277dcb05bcb76d5ce5124dacc3');


const CONFIG = configurations[ENVIRONMENT];

const couponcreator = async  (req, res) => {
    
    var contactActiveCampaign;
    var newConsummer;
    var consummer;
    var coupon;
    
    // ----------------------- OBTENGO PLANTLLA PARAMETRO ---------------------

    // console.log(`plantilla-> ${CircularJSON.stringify(plantilla.data.parameter_text)}`);
    try {
        var plantilla = await axios({
            method: "GET",
            url:`${USER_SERVICE_URI}/parameters/name/COUPONCODETEMPLATE`,
        });
    }
    catch (err) {
        res.status(500).send({
            message: `Error al obtener plantilla <couponcodetemplate> : ${err.message} `,
        });
    }

    // *** CONSULTO EN ACTIVE CAMPAIGN ***
    console.log(`Consultando en ActiveCampaign...`);
    try {
        contactActiveCampaign = await axios({
            method: "GET",
            url:`${ACTIVECAMPAIGN_URI}/contacts/${req.query.cedula}`,
            headers: {
                'Accept': 'application/json',
                'Api-Token': `${ACTIVECAMPAIGN_TOKEN}`
            }
        });
        // console.log(`contactActiveCampaign.data.contact-->${CircularJSON.stringify(contactActiveCampaign.data.contact)}`);
        // Si no existe tampoco en ActiveCampaign retorno error
        if (contactActiveCampaign.data.contact==null) {
            res.status(500).send({
                message: "Cedula no existe en Active Campaign",
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message: `Error al contactar Active Campaign , contactId no podria existir: ${err.message} `,
        });
    }
    // console.log(`Contact ActiveCampaign: ${CircularJSON.stringify(contactActiveCampaign.data.contact)}`);
    
    
    
    
    // ----------------------- VERIFICO CONSUMMER ---------------------
    try {
        
        consummer = await axios({
            method: "GET",
            url:`${COUPON_SERVICE_URI}/consummers/identification/${contactActiveCampaign.data.contact.id}`,
        });
        
        if (consummer.data==null){
            consummer = await axios({
                method: "GET",
                url:`${COUPON_SERVICE_URI}/consummers/email/${contactActiveCampaign.data.contact.email}`,
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message: `Error al verificar consummer : ${err.message} `,
        });
    }
    
    // Si no existe consummer local voy a traerDatos de *** ACTIVECAMPAIGN
    if (consummer.data==null) {
        try {
            console.log(`Creando Consummer...`);
            let objConsummer={
                consummer_id: "0" ,
                consummer_identification: req.query.cedula ,
                consummer_name: contactActiveCampaign.data.contact.firstName.trim() + " " + contactActiveCampaign.data.contact.lastName.trim(),
                consummer_email: contactActiveCampaign.data.contact.email.length==0 ? `${req.query.cedula}@activecampaign.com`: contactActiveCampaign.data.contact.email,
                consummer_phone: contactActiveCampaign.data.contact.phone.length==0? "0000000000" : contactActiveCampaign.data.contact.phone,
                consummer_city: "none",
                consummer_dob: contactActiveCampaign.data.contact.cdate,
                consummer_origin: "ACTIVECAMPAIGN"
            };
            // console.log(`objConsummer-->${CircularJSON.stringify(objConsummer)}`);
            newConsummer = await axios({
                method: "POST",
                url:`${COUPON_SERVICE_URI}/consummers`,
                data:{args:objConsummer},
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            // console.log(`newConsummer.data-->${CircularJSON.stringify(newConsummer.data)}`);
            consummer.data= newConsummer.data;
        }
        catch (err){
            console.log(`error de controlador-->${CircularJSON.stringify(err)}`)
            res.status(500).send({
                message: `Error al crear Consummer : ${err.message} `,
            });
        }
    }
    
    // ----------------------- VERIFICO CUPON ---------------------
    console.log(`FINAL consummer.data-->${CircularJSON.stringify(consummer.data)}`);
    try {
        coupon = await axios({
            method: "GET",
            url:`${COUPON_SERVICE_URI}/coupons/consummer/${consummer.data.consummer_id}/${req.query.code}`,
        });
    }
    catch (err) {
        res.status(500).send({
            message: `Error al verificar cupon : ${err.message} `,
        });
    }
    console.log(`coupon.data-->${CircularJSON.stringify(coupon.data)}`);

    if (coupon.data==null){
        // -- CREO EL CUPON --
        console.log(`Creando Coupon...`);
        try  {
            
            var newCoupon = await axios({
                method: "POST",
                // url:"http://gateway-tablita:7000/graphql",
                url:"http://67.205.139.228:7000/graphql",
                data:{
                    query: `mutation ($media_product_code: String!, $consummer_id: String!, $commerce_type_id: String!) {
                            createCoupon(media_product_code: $media_product_code, consummer_id: $consummer_id, commerce_type_id: $commerce_type_id)
                                {
                                coupon_id
                                media_product_id
                                campaign_product_id
                                commerce_type_id
                                consummer_id
                                coupon_codebar
                                coupon_status
                                coupon_created
                                coupon_expire
                                }
                    }`,
                    variables: {
                        media_product_code: req.query.code,
                        consummer_id: consummer.data.consummer_id,
                        commerce_type_id: "31581187-3c0d-479d-8bee-bc555a166092"
                    }
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(`newCoupon-->${CircularJSON.stringify(newCoupon.data)}`);
            if (newCoupon.data.errors!=null){
                res.status(500).send({
                    message: `Error al crear cupon ERRORS : ${CircularJSON.stringify(newCoupon.data.errors)} `,
                });
            }
            let finalCoupon = newCoupon.data.data.createCoupon;
            let img64=qrGenerator(finalCoupon.coupon_codebar);
            // console.log(`img64-->${img64}`);
            const imageBuffer = await htmlToImage(`${plantilla.data.parameter_text.replace('${base64}', img64).replace('${finalcoupon}',finalCoupon.coupon_codebar )}`);
            res.set('Content-Type', 'image/png');
            res.set('Content-Length', imageBuffer.length);
            res.end(imageBuffer);
        }
        catch (err){
            console.log(`error al crear cupon: ${CircularJSON.stringify(err)}`);
            res.status(500).send({
                message: `Error al crear cupon : ${err.message}`,
            });
        }
    } else {
        console.log('Consummer ya tiene cupon');
        let finalCoupon = coupon.data;
        let img64=qrGenerator(finalCoupon.coupon_codebar);
        // console.log(`img64-->${img64}`);
        console.log('Generando imagen con puppeteer');
        const imageBuffer = await htmlToImage(`${plantilla.data.parameter_text.replace('${base64}', img64).replace('${finalcoupon}',finalCoupon.coupon_codebar )}`);
        res.set('Content-Type', 'image/png');
        res.set('Content-Length', imageBuffer.length);
        res.end(imageBuffer);
    }
};


module.exports = {
    couponcreator,
};
