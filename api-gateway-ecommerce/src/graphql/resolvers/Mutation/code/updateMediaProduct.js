import CodesService from "#root/adapters/CodesService";
import ProductsService from "#root/adapters/ProductsService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";
import MediasService from "../../../../adapters/MediasService";
import isEmpty from "lodash/isEmpty";

//{media_product_id, media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire, media_product_status, file=null}
const updateMediaProductResolver = async (obj, args, context ) => {

    if (!args.media_product_id) {
        return new Error("Media Product ID is missing!");
    }


    // Generar CODE VAUCHER SOLO SI ESTA VACIO
    const media = await MediasService.fetchMediaById({media_id: args.media_id});
    const product = await ProductsService.fetchProductById({product_id: args.product_id});
    const brand = await ProductsService.fetchBrandById({brand_id: product.brand_id});
    const codeType= await CodesService.fetchCodeTypeById({code_type_id: args.code_type_id});

    if (args.media_id) {
        if (Object.keys(media).length === 0) return new Error(`Media Id is invalid, deleted or not exist.`);
    }

    if (args.product_id) {
        if (Object.keys(product).length === 0) return new Error(`Product Id is invalid, deleted or not exist.`);
    }

    if (product.brand_id) {
        if (Object.keys(brand).length === 0) return new Error(`Brand Id is invalid, deleted or not exist.`);
    }

    if (args.code_type_id){
        if (Object.keys(codeType).length===0)  return new Error(`Code Type Id is invalid, deleted or not exist.`);
    }


    // verifico si viene CODE en los argumentos y si esta vacio
    // console.log('args.media_product_code==>', args.media_product_code);
    if (args.media_product_code){
        // if (args.media_product_code !== null || args.media_product_code !== undefined) {
        // }
        if (args.media_product_code.length === 0) {
            args.media_product_code= media.media_slug.toString().trim() + product.product_slug.toString().trim();

            // VERIFICO SI HAY UN MEDIA PRODUCT ACTIVO
            const mediaProductCodeActive = await CodesService.fetchMediaProductByCode({media_product_code: args.media_product_code});
            // console.log(isObjectEmpty(mediaProductCodeActive));
            if (Object.keys(mediaProductCodeActive).length!==0) return new Error(`Media Product Code: ${args.media_product_code}, has active yet.`);

        }
    }



    // Si no envio archivo solo actualizo los datos y no subo nada al BUCKET S3
    // file===null
    if (!args.file) {
        // return await CodesService.updateMediaProduct({media_product_id, media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire, media_product_status});
        return await CodesService.updateMediaProduct({args});
    }


    if (!args.media_product_picture) {
        return new Error("File is present but Picture argument is missing!");
    }

    // Solo si subo el archivo grabo la marca
    const PREFIX_FILES = accessEnv("PREFIX_MEDIA_PRODUCT", 'MEDIA-PRODUCT');

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
        // media_product_picture=uploaded;
        // return await CodesService.updateMediaProduct({media_product_id, media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire, media_product_status});
        args.media_product_picture=uploaded;
        return await CodesService.updateMediaProduct({args});
    }

};

export default updateMediaProductResolver;

