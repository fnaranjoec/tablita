const express = require("express");
const router = express.Router();
//const controller = require("#root/controller/file.controller");
const controller = require("#root/controller/activecampaign.controller");

let routes = (app) => {
    //router.post("/upload", controller.upload);
    //router.get("/files", controller.getListFiles);
    //router.get("/files/:name", controller.download);
    router.get("/couponcreator", controller.couponcreator);
    app.use(router);
};

module.exports = routes;
