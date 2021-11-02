import MediasService from "#root/adapters/MediasService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

//{media_id, category_id, media_name, media_desc, media_picture, media_status, file=null}
const updateMediaResolver = async (obj, args, context) => {

    // Si no envio archivo solo actualizo los datos y no subo nada al BUCKET S3
    //file===null
    if (!args.media_id) {
        return new Error("Media ID is missing!");
    }

    if (!args.file) {
        // return await MediasService.updateMedia({media_id, category_id, media_name, media_desc, media_picture, media_status});
        return await MediasService.updateMedia({args});
    }

    if (!args.media_picture) {
        return new Error("File is present but Picture argument is missing!");
    }

    // Solo si subo el archivo grabo la marca
    const PREFIX_FILES = accessEnv("PREFIX_MEDIAS", 'MEDIAS');


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
        // media_picture = uploaded;
        // return await MediasService.updateMedia({media_id, category_id, media_name, media_desc, media_picture, media_status});
        args.media_picture = uploaded;
        return await MediasService.updateMedia({args});
    }


};

export default updateMediaResolver;

