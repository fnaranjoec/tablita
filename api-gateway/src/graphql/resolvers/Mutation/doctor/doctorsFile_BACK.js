import readXlsxFile from 'read-excel-file/node';
import csv from 'csv-parser';

import fs from 'fs';
import request from 'request';

import voucher_codes from "voucher-code-generator";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";
import generateCodeDoctor from "#root/helpers/generateCodeDoctor";
import isEmpty from "lodash/isEmpty";

import DoctorsService from "#root/adapters/DoctorsService";
import CodesService from "#root/adapters/CodesService";

import { AuthenticationError } from "apollo-server-express";

// const processWorkbook = async ({file, uploaded, campaign_id, code_type_id}) => {
const processWorkbook = async ({filePath, campaign_id, code_type_id}) => {
    // console.log('file==>', file);
    console.log(`fs.realpathSync(".") ==> ${fs.realpathSync(".")}`);

    const schema = {
        'NOMBRE': {
            prop: 'nombre',
            type: String,
            required: true
            // Excel stores dates as integers.
            // E.g. '24/03/2018' === 43183.
            // Such dates are parsed to UTC+0 timezone with time 12:00 .
        },
        'APELLIDO': {
            prop: 'apellido',
            type: Date,
            required: true
        },
        'EMAIL': {
            prop: 'email',
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


    var noProcess = [];
    var codes=[];
    var resultsCSV = [];
    var campaign_doctor_code="";

    // const { createReadStream, filename, mimetype} = await file;
    // // const stream = await createReadStream();

    // Genero ReadStream con el filePath enviado
    // const xData= await createReadStream()
    const campaign = await DoctorsService.fetchCampaignById({campaign_id: campaign_id});

    const xData =  {
        _filePath: filePath,
        _noProcess: noProcess,
        _campaign_prefix: campaign.campaign_prefix,
        getNoProcess: async function() {

            try {
                await request(this._filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                        resultsCSV.push(data);
                    } )
                    .on('end', async () => {



                        // console.log(resultsCSV);
                        for (const row of resultsCSV) {
                            console.log((row.nombre + ',' + row.apellido));
                            // console.log("row==>", row);

                            let fName= row.nombre.indexOf(" ")<0 ? row.nombre.replace(/\s/g, "").toLowerCase() : row.nombre.substring(0,row.nombre.indexOf(" ")).replace(/\s/g, "").toLowerCase();
                            let lName= row.apellido.replace(/\s/g, "").toLowerCase();

                            const doctor = await DoctorsService.createCampaignDoctorFromFile({
                                campaign_id: campaign_id,
                                doctor_name: (row.nombre + ',' + row.apellido),
                                doctor_email: row.email,
                                campaign_doctor_code: `dr@${fName}${lName}` ,
                                // campaign_doctor_code: generateCodeDoctor({campaign_prefix: this._campaign_prefix, doctor_email: row.email}) ,
                                code_type_id: code_type_id,
                                uploaded: filePath
                            });

                            if (isEmpty(doctor)) {  // Si hubo un error al crear Campaign-Doctor
                                // console.log(`doctor_name: ${row.nombre} ${row.apellido}, doctor_email: ${row.email}`);
                                noProcess.push({doctor_name: (row.nombre + ' ' + row.apellido), doctor_email: row.email});
                            }

                        }
                });
                return true;
            }
            catch (e) {
                return false;
            }



        }
    }

    return xData.getNoProcess();

    // await readXlsxFile(stream, {schema}).then(async ({rows, errors} ) => {
    //     // console.log('noRedimed==>', noRedimed);
    //
    //     var codes=[];
    //     var event_assistant_code="";
    //
    //
    //     for (const row of rows) {
    //         console.log((row.nombre + ' ' + row.apellido));
    //
    //         // Genero codigo
    //         event_assistant_code = voucher_codes.generate({
    //             length: 8,
    //             count: 1,
    //             charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#*"
    //             // postfix: `${new Date.getYear()}`
    //         })[0];
    //
    //         // Verifico que no se repita el codigo en el lote generado
    //         while ( codes.filter(x=>x.code==event_assistant_code) ) {
    //             event_assistant_code = voucher_codes.generate({
    //                 length: 8,
    //                 count: 1,
    //                 charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#*"
    //                 // postfix: `${new Date.getYear()}`
    //             })[0];
    //         }
    //
    //         // Si es unico lo guardo en el lote
    //         codes.push({code: event_assistant_code});
    //
    //
    //         // creo el asistente
    //         const coupon = await EventService.createEventAssistantFromFile({event_id: event_id, event_assistant_name: (row.nombre + ' ' + row.apellido), event_assistant_email: row.email, event_assistant_code: event_assistant_code, uploaded: uploaded});
    //         if (isEmpty(coupon)) {  // Si hubo un error al redimir
    //             noProcess.push({event_assistant_name: (row.nombre + ' ' + row.apellido), event_assistant_email: row.email});
    //         }
    //
    //     }
    //
    //
    // });


};



const doctorsFileResolver = async (obj, args, context ) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Must authenticate");


    // SI NO HAY ARCHIVO SOLO CREO EL OBJETO
    if (!args.filePath || !args.campaign_id || !args.code_type_id) return new Error(`Doctors file, Campaign ID or Code Type ID are missing !`);

    // Verifico si campaña existe
    const campaign = await DoctorsService.fetchCampaignById({campaign_id: args.campaign_id});
    if (isEmpty(campaign)) return new Error("Campaign event ID doesn't exist or Deleted");


    // Verifico si code_type existe
    const codeType = await CodesService.fetchCodeTypeById({code_type_id: args.code_type_id});
    if (isEmpty(codeType)) return new Error("Code Type ID doesn't exist or Deleted");

    // // PROCESO PARA SUBIR ARCHIVO
    // const PREFIX_DOCTORS_FILE = accessEnv("PREFIX_DOCTORS_FILE", 'DOCTORS-FILE');
    //
    // /* Aqui primero graba el archivo luego la entidad */
    // var uploaded=null;
    //
    // await storeUpload({file: args.file}, PREFIX_DOCTORS_FILE)
    //     .then((res) => {
    //         uploaded=res.path;
    //     })
    //     .catch(err => {
    //         return new Error("Has errors when uploading file!");
    //     });
    //
    // if (uploaded===null || uploaded===undefined) {
    //     return new Error(`Has errors when uploading file. Target directory could not exists.`);
    // }
    //
    // // Solo si subio el archivo proceso el archivo
    // if (uploaded.length===0) return new Error(`Has errors when uploading file.`);
    //
    //
    // var process=[];
    // process = processWorkbook({file: args.file, uploaded: uploaded, campaign_id: args.campaign_id, code_type_id: args.code_type_id});
    // // process = await processWorkbook({file: args.file, uploaded: uploaded, campaign_id: args.campaign_id, code_type_id: args.code_type_id});
    // process.then(res => console.log("res==>",res)).catch(error => console.log(error));

    try {
        processWorkbook({filePath: args.filePath, campaign_id: args.campaign_id, code_type_id: args.code_type_id})
            .then(res=>{console.log('res=',res)})
            .catch(error=>{console.log(error)});

        return {
            success: true,
            message: "Archivo de Doctores PROCESADO CORRECTAMENTE." ,
            data: "Success"
        } ;

    }
    catch (e) {
        return {
            success: false,
            message: "Hubo problemas al procesar archivo de lotes.",
            data: e.message
        } ;
    }

    // var processString="";
    // for (const row of process) {
    //     processString = processString + JSON.stringify(row) + "\r\n";
    // }
    //
    // if (process.length!==0) {
    //     return {
    //         success: true,
    //         message: "Archivo de Doctores PROCESADO PARCIALMENTE: El archivo de doctores se procesó parcialmente.",
    //         data: processString
    //     } ;
    // }
    //
    // return {
    //     success: true,
    //     message: "Archivo de Doctores PROCESADO COMPLETAMENTE: El archivo de doctores se procesó completamente.",
    //     data: ""
    // } ;


};

export default doctorsFileResolver;

