// import ProductsService from "#root/adapters/ProductsService";
// import accessEnv from "#root/helpers/accessEnv";

import CouponsService from "#root/adapters/CouponsService";
import SystemService from "#root/adapters/SystemService";

import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";

const redimeCouponArrayResolver = async (obj, args, context ) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Must authenticate");

    if (!args.coupons || !args.store) return {
        success: false,
        message: "Cupónes o Store no han sido enviados !",
        data: ""
    };

    if (args.coupons.length==0) return {
        success: false,
        message: "No hay cupónes que procesar !",
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

    // Procesar array de cupones
    let couponsProccessedArray = await CouponsService.redimeCouponArray({args});

    return {
        success: true,
        message: "El array de cupónes se procesó satisfactoriamente.",
        data: JSON.parse(JSON.stringify(couponsProccessedArray))
    } ;
};

export default redimeCouponArrayResolver;

