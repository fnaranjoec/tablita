// import ProductsService from "#root/adapters/ProductsService";
import CouponsService from "#root/adapters/CouponsService";
import readXlsxFile from 'read-excel-file/node';
import SystemService from "#root/adapters/SystemService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

import isEmpty from "lodash/isEmpty";

import { AuthenticationError } from "apollo-server-express";



const processWorkbook = async ({file, commerceType, uploaded}) => {
    // console.log('file==>', file);

    const schema = {
        'CODEBAR': {
            prop: 'codebar',
            type: String,
            required: true
            // Excel stores dates as integers.
            // E.g. '24/03/2018' === 43183.
            // Such dates are parsed to UTC+0 timezone with time 12:00 .
        },
        'REDIMED': {
            prop: 'redimed',
            type: Date,
            required: true
        },
        'STORE': {
            prop: 'store',
            type: String,
            required: true

            // Excel stores dates as integers.
            // E.g. '24/03/2018' === 43183.
            // Such dates are parsed to UTC+0 timezone with time 12:00 .
        },
        // 'STORE': {
        //     prop: 'contact',
        //     required: true,
        //     parse(value) {
        //         const number = parsePhoneNumber(value)
        //         if (!number) {
        //             throw new Error('invalid')
        //         }
        //         return number
        //     }
        // },
        // // 'COURSE' is not a real Excel file column name,
        // // it can be any string — it's just for code readability.
        // 'STORE': {
        //     prop: 'course',
        //     type: {
        //         'IS FREE': {
        //             prop: 'isFree',
        //             type: Boolean
        //             // Excel stored booleans as numbers:
        //             // `1` is `true` and `0` is `false`.
        //             // Such numbers are parsed to booleans.
        //         },
        //         'COURSE TITLE': {
        //             prop: 'title',
        //             type: String
        //         }
        //     }
        // },
        // 'STATUS': {
        //     prop: 'status',
        //     type: String,
        //     oneOf: [
        //         'SCHEDULED',
        //         'STARTED',
        //         'FINISHED'
        //     ]
        // }
    };


    const { createReadStream, filename, mimetype} = await file;
    const stream = await createReadStream();
    var noRedimed = [];

    await readXlsxFile(stream, {schema}).then(async ({rows, errors} ) => {
        // console.log('noRedimed==>', noRedimed);

        for (const row of rows) {
            // console.log(row.codebar);

            var couponID= await CouponsService.fetchCouponByCodeBar({coupon_codebar: row.codebar});

            if (isEmpty(couponID)) {  // Si no encontro el codebar
                noRedimed.push({codebar: row.codebar, redimed: row.redimed, store: row.store});
            } else {
                const coupon = await CouponsService.redimeFile({coupon_id: couponID.coupon_id, redimed: row.redimed, commerceType: commerceType, uploaded: uploaded});
                if (isEmpty(coupon)) {  // Si hubo un error al redimir
                    noRedimed.push({codebar: row.codebar, redimed: row.redimed, store: row.store});
                }

            }

        }


    });

    return await noRedimed;

};



const redimeFileResolver = async (obj, args, context ) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Access Token Expired!");


    // SI NO HAY ARCHIVO SOLO CREO EL OBJETO
    if (!args.file) return new Error(`Redime file is missing !`);


    // Obtengo el commerce_type_id de la tabla de parametros
    const commerTypeParam= await SystemService.fetchParameterByName({parameter_name: "STORE_TYPE"});
    // Valido el parametro
    if (isEmpty(commerTypeParam)) {
        return (new Error("STORE_TYPE parameter is missing !"));
    }



    // PROCESO PARA SUBIR ARCHIVO
    const PREFIX_REDIME_FILE = accessEnv("PREFIX_REDIME_FILE", 'REDIME-FILE');

    /* Aqui primero graba el archivo luego la entidad */
    var uploaded=null;

    await storeUpload({file: args.file}, PREFIX_REDIME_FILE)
        .then((res) => {
            uploaded=res.path;
        })
        .catch(err => {
            return new Error("Has errors when uploading file!");
        });

    if (uploaded===null || uploaded===undefined) {
        return new Error(`Has errors when uploading file. Target directory could not exists.`);
    }

    // Solo si subio el archivo proceso el archivo
    if (uploaded.length===0) return new Error(`Has errors when uploading file.`);


    const process = await processWorkbook({file: args.file, commerceType: commerTypeParam.parameter_text, uploaded: uploaded});


    var processString="";
    for (const row of process) {
        processString = processString + JSON.stringify(row) + "\r\n";
    }

    if (process.length!==0) {
        return {
            success: true,
            message: "Archivo de Cupónes REDIMIDO PARCIALMENTE: El archivo de cupónes se redimió parcialmente.",
            data: processString
        } ;
    }

    return {
        success: true,
        message: "Archivo de Cupónes REDIMIDO COMPLETAMENTE: El archivo de cupónes se redimió completamente.",
        data: ""
    } ;


};

export default redimeFileResolver;

