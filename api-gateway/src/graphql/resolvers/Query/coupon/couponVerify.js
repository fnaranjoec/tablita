import CouponsService from "#root/adapters/CouponsService";
import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";

const couponVerifyResolver = async(obj, args, context) => {

    // console.log("args===>", args);

    // // -------------------------------- AUTENTICACION -----------------------------------
    if (isEmpty(context.req.user)) throw new AuthenticationError("000|Access Token Expired!");


    if (!args.coupon_codebar) return {
        success: false,
        message: "No ha enviado el codigo del cupón.",
        data: {
            id: "",
            sku: "",
            name: "",
            descto: 0,
            expiration: "",
            consummer_name: "",
            consummer_identification: ""
        }
    };


    const coupon = await CouponsService.fetchCouponByCodeBar({coupon_codebar: args.coupon_codebar});
    // console.log('coupon verified ===>', coupon);

    if (isEmpty(coupon)) return {
        success: false,
        message: "Cupón NO VALIDO: Esta expirado, fue ya redimido o no existe el cupón. Verifique por Favor !",
        data: {
            id: "",
            sku: "",
            name: "",
            descto: 0,
            expiration: "",
            consummer_name: "",
            consummer_identification: ""
        }
    };

    return {
        success: true,
        message: `Cupón VALIDO: Para REDIMIR el cupón debe ENVIAR el siguiente ID: ${coupon.coupon_id}`,
        data: {
            id: coupon.coupon_id,
            sku: coupon.product_sku,
            name: coupon.product_name,
            descto: coupon.product_descto,
            expiration: coupon.coupon_expire,
            consummer_name: coupon.consummer_name,
            consummer_identification: coupon.consummer_identification
        }
    } ;

};


export default couponVerifyResolver;

