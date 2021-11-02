// import ProductsService from "#root/adapters/ProductsService";
// import accessEnv from "#root/helpers/accessEnv";

import CouponsService from "#root/adapters/CouponsService";
import SystemService from "#root/adapters/SystemService";

import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";

const redimeCouponResolver = async (obj, args, context ) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    if (isEmpty(context.req.user)) throw new AuthenticationError("000|Must authenticate");

    if (!args.coupon_id || !args.coupon_redimed_store) return {
        success: false,
        message: "Código de Verificación o Store del cupón no ha sido enviado !",
        data: ""
    };


    // Obtengo el commerce_type_id de la tabla de parametros
    const commerTypeParam= await SystemService.fetchParameterByName({parameter_name: "ECOMMERCE_TYPE"});


    // Valido el parametro
    if (isEmpty(commerTypeParam)) {
        return (new Error("ECOMMERCE_TYPE parameter is missing !"));
    }

    // Asigno tipo de commercio ECOMMERCE
    args.commerce_type_id = commerTypeParam.parameter_text;

    const coupon = await CouponsService.redimeCoupon({args});
    // console.log('coupon==>', coupon);

    if (isEmpty(coupon)) return {
        success: false,
        message: "Código de Verificación NO VALIDO",
        data: ""
    };

    return {
        success: true,
        message: "Cupón REDIMIDO: El cupón se redimió satisfactoriamente.",
        data: {
            id: coupon.coupon_id,
            sku: coupon.product_sku,
            name: coupon.product_name,
            descto: coupon.product_descto,
            consummer_name: coupon.consummer_name,
            consummer_identification: coupon.consummer_identification
        }
    } ;


};

export default redimeCouponResolver;

