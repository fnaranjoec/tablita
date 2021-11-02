import MediasService from "#root/adapters/MediasService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

const createMediaResolver = async (obj,{category_id, media_name, media_desc, media_slug, media_picture, file=null}) => {


    // SI NO HAY ARCHIVO SOLO CREO EL OBJETO
    if (file===null) {
        return await MediasService.createMedia({
            category_id,
            media_name,
            media_desc,
            media_slug,
            media_picture: (media_picture=="" ? "none" : media_picture),
        });
    }

    // PROCESO PARA SUBIR ARCHIVO
    const PREFIX_FILES = accessEnv("PREFIX_MEDIAS", 'MEDIAS');

    /* Aqui primero graba el archivo luego la entidad */
    var uploaded=null;

    await storeUpload({file}, PREFIX_FILES)
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
        media_picture = uploaded;
        return await MediasService.createMedia({category_id, media_name, media_desc, media_slug, media_picture});
    }


};

export default createMediaResolver;

