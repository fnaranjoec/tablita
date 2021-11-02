import DoctorsService from "#root/adapters/DoctorsService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

const updateCampaignResolver = async (obj, args, context) => {


    // Si no envio archivo solo actualizo los datos y no subo nada al BUCKET S3
    //file===null
    if (!args.campaign_id) {
        return new Error("Campaign ID is missing!");
    }

    if (!args.file || args.file===null || args.file==="undefined") {
        return await DoctorsService.updateCampaign({args});
    }

    if (!args.campaign_picture) {
        return new Error("File is present but Picture is missing!");
    }

    // Solo si subo el archivo grabo la marca
    const PREFIX_FILES = accessEnv("PREFIX_CAMPAIGNS", 'CAMPAIGNS');

    /* Aqui primero graba el archivo luego la entidad */
    var uploaded=null;

    await storeUpload({file: args.file}, PREFIX_FILES)
        .then((res) => {
            uploaded=res.path;
        })
        .catch(err => {
            return new Error("Has errors when uploading file!");
        });

    if (uploaded===null || uploaded===undefined) {
        return new Error(`Has errors when uploading file. Target directory could not exists.`);
    }

    if (uploaded.length>0) {
        args['campaign_picture'] = uploaded;
        return await DoctorsService.updateCampaign({args});
    }


};

export default updateCampaignResolver;

