import accessEnv from "#root/helpers/accessEnv";

const util = require("util");
const path = require("path");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const UPLOAD_PATH = accessEnv("UPLOAD_PATH", '/opt/app/uploads');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const directoryPath = path.join(path.dirname(require.main.filename), "resources/static/assets/uploads/") ;
        // const directoryPath = "/opt/app/uploads" ;
        // cb(null, __basedir + "/resources/static/assets/uploads/");
        cb(null, UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
