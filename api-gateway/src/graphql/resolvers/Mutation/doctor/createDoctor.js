import DoctorsService from "#root/adapters/DoctorsService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

const createDoctorResolver = async (obj, args, context) => {

    // SI NO HAY ARCHIVO SOLO CREO EL OBJETO
    if (!args.file || args.file===null || args.file==="undefined") {
        return await DoctorsService.createDoctor({args});
    }


    // PROCESO PARA SUBIR ARCHIVO
    const PREFIX_FILES = accessEnv("PREFIX_DOCTORS", 'DOCTORS');

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
        args['doctor_picture'] = uploaded;
        return await DoctorsService.createDoctor({args});
    }


    // /* Aqui primero graba la entidad luego el archivo */
    // var newProduct = await ProductsService.createProduct({brand_id, product_name, product_slug, product_desc, product_picture});
    //
    // if (newProduct) {
    //     await storeUpload({file}, UPLOAD_DIR_PRODUCTS, newProduct.product_id)
    //         .then(async (res) => {
    //             return await newProduct
    //         })
    //         .catch(async (err) => {
    //             return await new Error("Has errors when upload file!");
    //         });
    // }


};

export default createDoctorResolver;

