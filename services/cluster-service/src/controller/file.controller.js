const uploadFile = require("#root/middleware/upload");
const path = require("path");

import accessEnv from "#root/helpers/accessEnv";
import normalizeFileName from "#root/middleware/normalize";
import fs from 'fs';
import csv from 'csv-parser';
import request from 'request';
import axios from 'axios';
import isEmpty from "lodash/isEmpty";


// ------------- CONSTANTS ---------------
const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: false, port: 7110, hostname: 'abbottcoupons.veritasoft.site' },
    development: { ssl: false, port: 7110, hostname: '127.0.0.0' }
}


const ENVIRONMENT = accessEnv("ENVIRONMENT", 'development');
const UPLOAD_PATH = accessEnv("UPLOAD_PATH", '/opt/app/uploads');
const COUPON_SERVICE_URI = accessEnv("COUPON_SERVICE_URI", 'http://172.20.0.1:7104/api/v1');

const CONFIG = configurations[ENVIRONMENT]

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        req.file["originalname"]=normalizeFileName(req.file["originalname"]);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        // Process with http
        // await processWorkbook({filePath: path.join(`http://localhost:${CONFIG.port}/files`, req.file.originalname).replace("http:/", "http://")});
        // Process with local URI
        await processWorkbook({filePath: req.file.path});

        res.status(200).send({
            message: "Success!",
            url: path.join(`http://localhost:${CONFIG.port}/files`, req.file.originalname).replace("http:/", "http://")
        });

    } catch (err) {

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });

    }
};

const processWorkbook = async ({filePath}) => {
    const schema = {
        'client_id': {
            prop: 'id_cliente',
            type: String,
            required: true
        },
        'recency': {
            prop: 'Recency',
            type: Number,
            required: true
        },
        'frequency': {
            prop: 'Frequency',
            type: Number,
            required: true
        },
        'amount': {
            prop: 'Monto',
            type: Number,
            required: true
        },
        'cluster': {
            prop: 'Cluster',
            type: Number,
            required: true
        },
        'cluster_name': {
            prop: 'Nombre del cluster',
            type: Number,
            required: true
        },
        'client_fname': {
            prop: 'nombre_cliente',
            type: String,
            required: true
        },
        'client_lname': {
            prop: 'apellido_cliente',
            type: String,
            required: true
        },
        'email': {
            prop: 'EMAIL',
            type: String,
            required: true
        },
        'branch': {
            prop: 'SUCURSAL',
            type: String,
            required: true
        },
    };

    var noProcess = [];
    var resultsCSV = [];
    const xData =  {
        _filePath: filePath,
        _noProcess: noProcess,
        getNoProcess: async function() {
            try {

                const axiosInstance = await axios.create({
                    baseURL: `${COUPON_SERVICE_URI}`,
                    // headers: { 'X-Custom-Header': 'foo' },
                    // `timeout` specifies the number of milliseconds before the request times out.
                    // If the request takes longer than `timeout`, the request will be aborted.
                    timeout: (1000 * 60 * 3)
                    // `maxContentLength` defines the max size of the http response content allowed
                    // maxContentLength: 2000,
                    // see https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index for all axiosoptions.
                });

                axiosInstance.defaults.timeout = (1000 * 60 * 3);


                // Read with ReadStream
                fs.createReadStream(this._filePath)
                    .pipe(csv())

                    .on('error', (error) => {
                        throw new Error(`No se pudo procesar archivo CSV: ${error.message}`);
                    })

                    .on('data', (row) => {
                        resultsCSV.push(row);
                    })

                    .on('end', async () => {


                        // // Insert with batch file
                        // axiosInstance.post(`/clusters/batchfile`, {
                        //     args:{
                        //         uriBatchFile: this._filePath
                        //     }
                        // }).then((resp)=>{
                        //     console.log(`resp ==> ${JSON.stringify(resp)}`);
                        // }).catch((err)=>{
                        //     console.log(`err ==> ${JSON.stringify(err)}`);
                        // });

                        for (const row of resultsCSV) {
                            await axiosInstance.post(`/clusters`, {
                                args:{
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
                                }
                            });
                            // .then((resp)=>{
                            //     console.log(`resp ==> ${JSON.stringify(resp)}`);
                            // }).catch((err)=>{
                            //     console.log(`err ==> ${JSON.stringify(err)}`);
                            // });
                        }

                    });

                // Clean ClustersProcessing
                var respClean = await axiosInstance.get(`/clustersprocessing/clean`);

                if (!respClean["data"].response){
                    throw new Error(`No se pudo limpiar la tabla clusters_processing`);
                }

                return true;
            }
            catch (e) {
                console.log(`error===> ${e.message}`);
                return false;
            }

        }
    };
    return xData.getNoProcess();
};

const getListFiles = (req, res) => {
    // const directoryPath = __basedir + "/resources/static/assets/uploads/";
    // const directoryPath = path.join(path.dirname(require.main.filename), "resources/static/assets/uploads/") ;
    // const directoryPath = "/opt/app/uploads" ;
    fs.readdir(UPLOAD_PATH, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: path.join(UPLOAD_PATH , file) ,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const download = (req, res) => {
    const fileName = req.params.name;
    // const directoryPath = __basedir + "/resources/static/assets/uploads/";
    // const directoryPath = path.join(path.dirname(require.main.filename), "resources/static/assets/uploads/") ;
    // const directoryPath = "/opt/app/uploads" ;

    res.download(path.join(UPLOAD_PATH , fileName), fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
};
