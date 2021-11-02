import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";
import CouponsService from "#root/adapters/CouponsService";
import SystemService from "#root/adapters/SystemService";


const mailingCouponResolver = async (obj, args, context) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Access Token Expired!");

    // Valido la informacion que llegue
    if (!args.consummer_id || !args.base64) {
        return new Error("Consummer Id or Image is missing !");
    }

    // Obtengo el consummer
    const consummer = await CouponsService.fetchConsummerById({consummer_id: args.consummer_id});
    // console.log(consummer);

    if (isEmpty(consummer)) return new Error('El Consummer Id is invalid');

    // console.log("args.base64==>", args.base64);

    // let html = `
    //     <h1>Hola, ${consummer.consummer_name}</h1>
    //     <p>Tu cup&oacute;n se gener&oacute; correctamente</p>
    //     <p>Este es tu c&oacute;digo de barra que podras usar para redimirlo en cualquiera de nuestros almacenes afiliados </p>
    //     <img src='${args.base64}' />
    // `;

    let html = `
        <h1>Hola, ${consummer.consummer_name}</h1>
        <p>Tu cup&oacute;n se gener&oacute; correctamente</p>
        <p>Se adjunta a este correo tu c&oacute;digo de barra para que lo puedas usar en cualquiera de nuestros almacenes afiliados </p>
    `;

    const message = await SystemService.sendMessagesMailing({args: {
        from: "info@abbottcupones.com",
        to: consummer.consummer_email,
        subject: "Cupón generado correctamente. Revise su cupon aquí",
        html: `
        <?xml version="1.0" encoding="utf-8"?>
        <!DOCTYPE html>
        <html>
            <header>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            </header>
            <body>${html}</body>
        </html>
        `,
        imageBase64: args.base64,
    }});

    console.log(message);

    return await message;


};

export default mailingCouponResolver ;

