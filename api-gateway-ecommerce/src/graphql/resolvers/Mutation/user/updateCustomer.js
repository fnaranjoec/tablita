import UsersService from "#root/adapters/UsersService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

//{customer_id, customer_name, customer_address, customer_phone, customer_email, customer_picture, customer_status, file=null}
const updateCustomerResolver = async (obj, args, context) => {

    // Si no envio archivo solo actualizo los datos y no subo nada al BUCKET S3
    // file===null
    if (!args.customer_id) {
        return new Error("Customer ID is missing!");
    }

    if (!args.file) {
        // return await UsersService.updateCustomer({customer_id, customer_name, customer_address, customer_phone, customer_email, customer_picture, customer_status});
        return await UsersService.updateCustomer({args});
    }

    if (!args.customer_picture) {
        return new Error("File is present but Picture argument is missing!");
    }

    // Solo si subo el archivo grabo la marca
    const PREFIX_FILES = accessEnv("PREFIX_CUSTOMERS", 'CUSTOMERS');

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
        // customer_picture = uploaded;
        // return await UsersService.updateCustomer({customer_id, customer_name, customer_address, customer_phone, customer_email, customer_picture, customer_status});
        args.customer_picture = uploaded;
        return await UsersService.updateCustomer({args});
    }



};

export default updateCustomerResolver;

