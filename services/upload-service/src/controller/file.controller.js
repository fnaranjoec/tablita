const uploadFile = require("#root/middleware/upload");
const util = require("util");
const path = require("path");
import accessEnv from "#root/helpers/accessEnv";
import fs from 'fs';

// ------------- CONSTANTS ---------------
const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: false, port: 7109, hostname: 'abbottcoupons.veritasoft.site' },
    development: { ssl: false, port: 7109, hostname: '192.168.100.100' }
}

const ENVIRONMENT = accessEnv("ENVIRONMENT", 'development');
const UPLOAD_PATH = accessEnv("UPLOAD_PATH", '/opt/app/uploads');

const CONFIG = configurations[ENVIRONMENT]

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
            message: "Success!",
            url: path.join(`http://${CONFIG.hostname}:${CONFIG.port}/files`, req.file.originalname).replace("http:/", "http://")
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
