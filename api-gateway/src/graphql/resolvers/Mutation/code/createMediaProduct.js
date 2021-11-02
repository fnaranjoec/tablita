import CodesService from "#root/adapters/CodesService";
import ProductsService from "#root/adapters/ProductsService";
import MediasService from "../../../../adapters/MediasService";

import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";
// import voucher_codes from "voucher-code-generator";


//{media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire, file=null}
const createMediaProductResolver = async (obj, args, context) => {

    // Valido el body si llega con todos los datos
    if (!args.media_id || !args.product_id || !args.code_type_id ||
        !args.media_product_desc || !args.media_product_expire) {
        return new Error("021|Media Product data are incomplete !!!");
    }


    // Generar CODE VAUCHER

    const media= await MediasService.fetchMediaById({media_id: args.media_id});
    // console.log(media);
    if (Object.keys(media).length===0)  return new Error(`022|Media Id is invalid, deleted or not exist.`);

    const product= await ProductsService.fetchProductById({product_id: args.product_id});
    // console.log(product);
    if (Object.keys(product).length===0)  return new Error(`023|Product Id is invalid, deleted or not exist.`);

    const brand= await ProductsService.fetchBrandById({brand_id: product.brand_id});
    // console.log(brand);
    if (Object.keys(brand).length===0)  return new Error(`024|Brand Id is invalid, deleted or not exist.`);

    const codeType= await CodesService.fetchCodeTypeById({code_type_id: args.code_type_id});
    // console.log(brand);
    if (Object.keys(codeType).length===0)  return new Error(`025|Code Type Id is invalid, deleted or not exist.`);

    // GENERO MEDIA-PRODUCT CODE
    args.media_product_code= codeType.code_type_name.substring(0,1).toLowerCase() + media.media_slug.toString().trim() + product.product_slug.toString().trim();

    // VERIFICO SI HAY UN MEDIA PRODUCT ACTIVO
    const mediaProductCodeActive = await CodesService.fetchMediaProductByCode({media_product_code: args.media_product_code});
    // console.log(isObjectEmpty(mediaProductCodeActive));
    if (Object.keys(mediaProductCodeActive).length!==0) return new Error(`026|Media Product Code: ${args.media_product_code}, has active yet.`);

    // SI NO HAY ARCHIVO SOLO CREO EL OBJETO
    if (!args.file) {
        if (!args.media_product_picture) args.media_product_picture="none";
        return await CodesService.createMediaProduct({args});
    }


    // PROCESO ---------------> PARA SUBIR ARCHIVO

    if (!args.media_product_picture) {
        return new Error("027|File is present but Picture argument is missing!");
    }

    const PREFIX_FILES = accessEnv("PREFIX_MEDIA_PRODUCT", 'MEDIA-PRODUCT');
    const MAX_CODE_CHARS = accessEnv("MAX_CODE_CHARS", '20');

    /* Aqui primero graba el archivo luego la entidad */
    var uploaded=null;

    await storeUpload({file: args.file}, PREFIX_FILES)
        .then((res) => {
            uploaded=res.path;
        })
        .catch(err => {
            return new Error("028|Has errors when uploading file!");
        });

    if (uploaded===null || uploaded===undefined) {
        return new Error(`029|Has errors when uploading file. Target directory could not exists.`);
    }

    if (uploaded.length>0) {
        args.media_product_picture = uploaded;
        // {media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire}
        return await CodesService.createMediaProduct({args});
    }


};

export default createMediaProductResolver;

