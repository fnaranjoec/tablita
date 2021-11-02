import ProductsService from "#root/adapters/ProductsService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

// {brand_id, customer_id, brand_name, brand_slug, brand_desc, brand_prefix, brand_picture, brand_status, file=null}
const updateBrandResolver = async (obj, args, context) => {

    // Si no envio rchivo solo actualizo los datos y no subo nada al BUCKET S3
    // file===null

    if (!args.brand_id) {
        return new Error("Brand ID is missing!");
    }

    if (!args.file) {
        // return await ProductsService.updateBrand({brand_id, customer_id, brand_name, brand_slug, brand_desc, brand_prefix, brand_picture, brand_status});
        return await ProductsService.updateBrand({args});
    }

    if (!args.brand_picture) {
        return new Error("File is present but Picture argument is missing!");
    }

    // SI HAY ARCHIVO LO SUBO .....

    // Solo si subo el archivo grabo la marca
    const PREFIX_FILES = accessEnv("PREFIX_BRANDS", 'BRANDS');

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
        // brand_picture = uploaded;
        // return await ProductsService.updateBrand({brand_id, customer_id, brand_name, brand_slug, brand_desc, brand_prefix, brand_picture, brand_status});
        args.brand_picture = uploaded;
        return await ProductsService.updateBrand({args});
    }



};

export default updateBrandResolver;

