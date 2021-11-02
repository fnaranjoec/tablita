import UsersService from "#root/adapters/UsersService";
import accessEnv from "#root/helpers/accessEnv";
import storeUpload from "#root/helpers/storeUpload";

// const createUserResolver = async (obj,
//                                   {user_name, user_email, user_phone, user_password, rol_id, customer_name, customer_address, customer_phone, customer_email, customer_picture}
//                                  ) => {
//
//
//   return await UsersService.createUser(
//                                       {user_name, user_email, user_phone, user_password, rol_id, customer_name, customer_address, customer_phone, customer_email, customer_picture}
//                                       );
//
// };
//
//

const createUserResolver = async (obj, args, context) => {

    if (!args.customer_name && !args.customer_address) {
        // OPERATOR
        return await UsersService.createOperator(
            {
                user_name:args.user_name,
                user_email: args.user_email,
                user_phone: args.user_phone,
                user_password: args.user_password
            }
        );


    }

    // SI NO HAY ARCHIVO SOLO CREO EL OBJETO
    if (!args.file || args.file===null || args.file===undefined) {
        return await UsersService.createCustomer(
            {
                user_name:args.user_name,
                user_email: args.user_email,
                user_phone: args.user_phone,
                user_password: args.user_password,
                customer_name: args.customer_name,
                customer_address: args.customer_address,
                customer_picture: args.customer_picture=="" ? "none" : args.customer_picture,
            }
        );
    }


    // PROCESO PARA SUBIR ARCHIVO
    const PREFIX_FILES = accessEnv("PREFIX_CUSTOMERS", 'CUSTOMERS');

    /* Aqui primero graba el archivo luego la entidad */
    var uploaded=null;

    await storeUpload({file: await args.file}, PREFIX_FILES)
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
        args.customer_picture = uploaded;

        return await UsersService.createCustomer(
            {
                user_name:args.user_name,
                user_email: args.user_email,
                user_phone: args.user_phone,
                user_password: args.user_password,
                customer_name: args.customer_name,
                customer_address: args.customer_address,
                customer_picture: args.customer_picture
            }
        );
    }



};

export default createUserResolver;

