import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";
import CouponsService from "#root/adapters/CouponsService";
import SystemService from "#root/adapters/SystemService";


const mailingCouponResolver = async (obj, args, context) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Must authenticate");

    // Valido la informacion que llegue
    if (!args.consummer_id || !args.brand_name || !args.porc_descto || !args.coupon_codebar || !args.base64) {
        return new Error("Consummer Id, Brand name, Descount Percentaje, CodeBar or Image are missing !");
    }

    // Obtengo el consummer
    const consummer = await CouponsService.fetchConsummerById({consummer_id: args.consummer_id});
    // console.log(consummer);

    if (isEmpty(consummer)) return new Error('El Consummer Id is invalid');

    // console.log("args.base64==>", args.base64);

    var imgUrlHeader=`http://abbottcupones.com/mailing/cabecera/${args.brand_name}.jpg`;
    var imgUrlFooter=`http://abbottcupones.com/mailing/cabecera/footer.jpg`;
    // console.log("imgUrl==>", imgUrl);


    // var html = `
    //     <div>
    //         <div>
    //             <div>
    //                 <img src='${imgUrlHeader}' alt='header' />
    //             </div>
    //         </div>
    //         <div>
    //             <h3>Hola, ${consummer.consummer_name}</h3>
    //             <p>Por confiar en ${args.brand_name.toUpperCase()}&reg; &iexcl;Queremos entregarte un gran beneficio por tiempo limitado &iexcl;</p>
    //             <p>Un cup&oacute;n de descuento que podr&aacute;s canjearlo en tu compra en l&iacute;nea, o descargarlo y redimirlo en tu farmacia m&aacute;s cercana. &Uacute;salo y recibir&aacute;s el ${args.porc_descto}% de descuento en tu ${args.brand_name.toUpperCase()}&reg; </p><br>
    //         </div>
    //         <div>
    //             <p>Realiza tu compra en nuestra Tienda Online, da click <a href='https://pequeayuda.com/cupon/${args.coupon_codebar}'>aqu&iacute;</a> . </p>
    //         </div>
    //         <div>
    //             <img src='${imgUrlFooter}' alt='footer' />
    //         </div>
    //     </div>
    // `;

    var html = `
        <div>
            <div>
                <div>
                    <img src='${imgUrlHeader}' alt='header' />
                </div>
            </div>
            <div>
                <h3>Hola, ${consummer.consummer_name}</h3>
                <p>Por confiar en ${args.brand_name.toUpperCase()}&reg; &iexcl;Queremos entregarte un gran beneficio por tiempo limitado &iexcl;</p>
                <p>Un cup&oacute;n de descuento que podr&aacute;s canjearlo en tu compra en l&iacute;nea. &Uacute;salo y recibir&aacute;s el ${args.porc_descto}% de descuento en tu ${args.brand_name.toUpperCase()}&reg; </p><br>
            </div>
            <div>
                <p>Realiza tu compra en nuestra Tienda Online, da click <a href='https://pequeayuda.com/cupon/${args.coupon_codebar}'>aqu&iacute;</a> . </p>
            </div>
        </div>
    `;



    // console.log("HTML==>", html);

    const message = await SystemService.sendMessagesMailing({args: {
        from: "info@abbottcupones.com",
        to: consummer.consummer_email,
        subject: "Cupón generado correctamente. Revise su cupon aquí",
        html: `
        <?xml version="1.0" encoding="utf-8"?>
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
        <html>
            <header>
                <meta http-equiv="content-type" content="text/html; charset=ISO-8859-15"/>
                <meta http-equiv="content-type" content="multipart/related; boundary="a1b2c3d4e3f2g1" />
            </header>
            <body style="background-color:while;color:black;" >${html}</body>
        </html>
        `,
        imageBase64: args.base64,
        fileName: imgUrlHeader,
        path: `http://abbottcupones.com/mailing/cabecera`,
        cid: 'unique@kreata.ee',
    }});

    // console.log("message==>", message);

    return await message;


};

export default mailingCouponResolver ;

