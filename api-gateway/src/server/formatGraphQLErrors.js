import _ from "lodash";

// import SystemService from "#root/adapters/SystemService";

// **** ESTO USE PARA TRAER EL TEXTO DEL CODIGO DEL MENSAJE QUE ESTA UNA TABLA DE MENSAJES ****
// const getMessage = (code, error) => {
//
//     const message = SystemService.fetchMessageByCode({message_motor: "ABBOTTCOUPONS", message_code: code});
//     return {
//         error: message.message_code,
//         message: message.message_message,
//         path: error.path[0],
//         stacktrace: error.extensions.exception.stacktrace,
//     };
//
// }



//
//
// const formatGraphQLErrors = async (error) => {
//
//     const errorDetails = _.get(error,"originalError.response.body");
//
//     try {
//
//         if (errorDetails) return JSON.parse(errorDetails);
//
//         const err = error.message.split("|");
//
//         const errMsg = await getMessage(err[0], error);
//
//         console.log('errMsg==>', errMsg);
//
//         return errMsg;
//         // return error;
//
//     } catch(e){
//       console.log(e);
//     }
//
//
//
//
//
//
//     // try {
//   //     if (error.message) return JSON.parse({
//   //         success: false,
//   //         error: error.message[0],
//   //         path: error.path[0]
//   //     });
//   //
//   // } catch(e) {
//   //
//   // }
//   //
//   //   return {
//   //       error: error.message,
//   //       path: error.path[0],
//   //       stacktrace: error.extensions.exception.stacktrace,
//   // };
//
//
// };
//
//


const formatGraphQLErrors = error => {

    const errorDetails = _.get(error, 'originalError.response.body')

    try {
        if (errorDetails) return JSON.parse(errorDetails)
    } catch (e) {
        console.log(e);
    }

    const err = error.message.split("|");
    return {
        error: err[0],
        message: err[1],
        path: error.path[0],
        stacktrace: error.extensions.exception.stacktrace,
    }

    // return error

}

export default formatGraphQLErrors;
