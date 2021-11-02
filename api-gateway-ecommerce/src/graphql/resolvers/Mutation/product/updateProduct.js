import ProductsService from "#root/adapters/ProductsService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

//{product_id, brand_id, product_name, product_slug, product_desc, product_picture, product_status, file=null}
const updateProductResolver = async (obj, args, context) => {


    // Si no envio archivo solo actualizo los datos y no subo nada al BUCKET S3
    //file===null
    if (!args.product_id) {
        return new Error("Product ID is missing!");
    }

    if (!args.file) {
        // return await ProductsService.updateProduct({product_id, brand_id, product_name, product_slug, product_desc, product_picture, product_status});
        return await ProductsService.updateProduct({args});
    }

    if (!args.product_picture) {
        return new Error("File is present but Picture argument is missing!");
    }

    // Solo si subo el archivo grabo la marca
    const PREFIX_FILES = accessEnv("PREFIX_PRODUCTS", 'PRODUCTS');

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
        // product_picture = uploaded;
        // return await ProductsService.updateProduct({product_id, brand_id, product_name, product_slug, product_desc, product_picture, product_status});
        args.product_picture = uploaded;
        return await ProductsService.updateProduct({args});
    }


};

export default updateProductResolver;

