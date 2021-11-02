import ProductsService from "#root/adapters/ProductsService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

const createBrandResolver = async (obj,{customer_id, brand_name, brand_slug, brand_desc, brand_prefix, brand_picture, brand_sequential, file=null}) => {

    // SI NO HAY ARCHIVO SOLO CREO EL OBJETO
    if (file===null) {
        return await ProductsService.createBrand({
            customer_id,
            brand_name,
            brand_slug,
            brand_desc,
            brand_prefix,
            brand_picture: (brand_picture=="" ? "none" : brand_picture),
            brand_sequential,
        });
    }



    // PROCESO PARA SUBIR ARCHIVO
    const PREFIX_FILES = accessEnv("PREFIX_BRANDS", 'BRANDS');



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
        brand_picture = uploaded;
        return await ProductsService.createBrand({customer_id, brand_name, brand_slug, brand_desc, brand_prefix, brand_picture, brand_sequential});
    }


    // /* Aqui primero graba la entidad luego el archivo */
    // var newBrand = await ProductsService.createBrand({customer_id, brand_name, brand_slug, brand_desc, brand_picture});
    //
    // if (newBrand) {
    //     await storeUpload({file}, UPLOAD_DIR_BRANDS, newBrand.brand_id)
    //         .then(async (res) => {
    //             return await newBrand
    //         })
    //         .catch(async (err) => {
    //             return await new Error("Has errors when upload file!");
    //         });
    // }



};

export default createBrandResolver;

