import CouponsService from "#root/adapters/CouponsService";
import CodesService from "#root/adapters/CodesService";
import ProductsService from "#root/adapters/ProductsService";
import MediasService from "#root/adapters/MediasService";
import SystemService from "#root/adapters/SystemService";

import voucherCoupon from "#root/helpers/voucherCoupon";
import { addDays } from "#root/helpers/datesUtility";

import isEmpty from "lodash/isEmpty";

import zeroFill from "#root/helpers/zeroFill";

// import accessEnv from "#root/helpers/accessEnv";
// import storeUpload from "#root/helpers/storeUpload";

const createCouponResolver = async (obj, args, context ) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Must authenticate");


    // Valido la informacion que llegue
    if (!args.media_product_code) {
        return new Error("Media Product CODE data is missing !");
    }

    // Primero verifico si el Consummer existe, si no existe lo creo
    if (!args.consummer_id) args.consummer_id="";
    if (args.consummer_id.length==0) {
        let consummer = await CouponsService.createConsummer({args});
        args.consummer_id = consummer.consummer_id;
    }


    // Obtengo el media product
    var mediaProduct = await CodesService.fetchMediaProductByCode({media_product_code: args.media_product_code});
    // console.log("mediaProduct==>", mediaProduct);
    // console.log(Object.keys(mediaProduct).length);
    // console.log(mediaProduct.constructor === Object);

    // if (mediaProduct.length==0) return new Error("Code provided is EXPIRED, DELETED or NOT EXIST.");
    if (Object.keys(mediaProduct).length === 0) return new Error("001|Code provided is EXPIRED, DELETED or NOT EXIST.");

    args.media_product_id= mediaProduct.media_product_id;
    // console.log(args.media_product_id);


    // // Obtengo typo de codigo
    // var codeType = await CodesService.fetchCodeTypeById({code_type_id: mediaProduct.code_type_id});
    // console.log(codeType);

    // Obtengo parametros
    var COUPON_SEQUENCE = await SystemService.fetchParameterByName({parameter_name: "COUPON_SEQUENCE"});
    var COUPON_EXPIRE_DAYS = await SystemService.fetchParameterByName({parameter_name: "COUPON_EXPIRE_DAYS"});
    var MAX_CODE_CHARS = await SystemService.fetchParameterByName({parameter_name: "MAX_CODE_CHARS"});
    var FIDELIZATION_CODE = await SystemService.fetchParameterByName({parameter_name: "FIDELIZACION_CODE"});
    var INITIALIZATION_CODE = await SystemService.fetchParameterByName({parameter_name: "INICIALIZACION_CODE"});

    // Sino existen parametros
    if (Object.keys(COUPON_SEQUENCE).length == 0) return new Error("002|Parameter COUPON_SEQUENCE NOT EXIST.");
    if (Object.keys(COUPON_EXPIRE_DAYS).length == 0) return new Error("003|Parameter COUPON_EXPIRE_DAYS NOT EXIST.");
    if (Object.keys(MAX_CODE_CHARS).length == 0) return new Error("004|Parameter MAX_CODE_CHARS NOT EXIST.");
    if (Object.keys(FIDELIZATION_CODE).length == 0) return new Error("005|Parameter FIDELIZATION_CODE NOT EXIST.");
    if (Object.keys(INITIALIZATION_CODE).length == 0) return new Error("006|Parameter INITIALIZATION_CODE NOT EXIST.");

    // console.log(`mediaProduct.code_type_id = ${mediaProduct.code_type_id},  FIDELIZATION_CODE = ${FIDELIZATION_CODE.parameter_text}`);
    // console.log(`mediaProduct.code_type_id = ${mediaProduct.code_type_id},  INITIALIZATION_CODE = ${INITIALIZATION_CODE.parameter_text}`);

    var consummerProductCouponFinded;
    var product;
    var brand;
    var media;

    // BUSCO PRODUCTO Y BRAND
    product = await ProductsService.fetchProductById({product_id: mediaProduct.product_id});
    brand= await ProductsService.fetchBrandById({brand_id: product.brand_id});
    // MEDIA
    media = await MediasService.fetchMediaById({media_id: mediaProduct.media_id});

    switch (mediaProduct.code_type_id) {
        case INITIALIZATION_CODE.parameter_text :
            // ************************** INICIALIZACION (1 sola vez por producto) ********************
            consummerProductCouponFinded = await CouponsService.fetchCouponByConsumerProduct({ args: {consummer_id: args.consummer_id, product_id: product.product_id} })
            // console.log('consummerProductCouponFinded==>', consummerProductCouponFinded);

            // if (consummerProductCouponFinded.count!==0) return new Error("007|The initialization code has already been used, it is invalid right now!");
            if (consummerProductCouponFinded.count!==0) return new Error(`007|${brand.brand_name}`);


            // if (consummerProductCouponFinded.count!==0) return {
            //     success: false,
            //     code: 400,
            //     message: "The initialization code has already been used, it is invalid right now!",
            //     data: {}
            // };

            // CREO EL TAG coupon_source por que viene desde el mutation
            args['coupon_source'] = product.product_id;


            break;


        case FIDELIZATION_CODE.parameter_text :
            // ************************** FIDELIZACION (1 sola vez por medio) ********************
            consummerProductCouponFinded = await CouponsService.fetchCouponByConsumerMedia({ args: {consummer_id: args.consummer_id, media_id: media.media_id, product_id: product.product_id } });
            // console.log('consummerProductCouponFinded==>', consummerProductCouponFinded);

            // `008|The fidelization code has already been used, it is invalid right now!`
            if (consummerProductCouponFinded.count!==0) return new Error(`008|${brand.brand_name}`);


            // if (consummerProductCouponFinded.count!==0) return {
            //     success: false,
            //     code: 400,
            //     message: `008|${brand.brand_name}`,
            //     data: {}
            // };

            // CREO EL TAG coupon_source por que viene desde el mutation
            args['coupon_source'] = (media.media_id + "," + product.product_id);
            // args['coupon_source'] = media.media_id;

            break;


        default:
            return new Error("009|Code Type provided is EXPIRED, DELETED or NOT EXIST.");

            // return {
            //     success: false,
            //     code: 401,
            //     message: `008|${brand.brand_name}`,
            //     data: {}
            // };

            break;
    }

    if (brand.brand_prefix=="" || brand.brand_prefix==null  || brand.brand_prefix==undefined) return new Error("010|Brand's prefix is empty");


    // // *** SEQUENTIAL ***
    // // var newSequence= COUPON_SEQUENCE.parameter_value + 1;
    // var newSequence= brand.brand_sequential + 1;
    // // Creo el cupon NUMERICO con zeros a la izquierda de la secuencia
    // args.coupon_codebar = brand.brand_prefix + zeroFill(newSequence, MAX_CODE_CHARS.parameter_value);

    // *** ALEATORIO ***
    // Creo el codigo de cupon con CHARECTERS ALEATORIOS y verifico que no exista en cupones
    var codeDigits="";
    while (codeDigits.length==0){
        codeDigits= voucherCoupon(MAX_CODE_CHARS.parameter_value, 1);
        let codebar = await CouponsService.fetchCouponByCodeBarSimple({coupon_codebar: codeDigits});
        if (!isEmpty(codebar)) codeDigits="";
    }

    args.coupon_codebar = codeDigits;

    if (args.coupon_codebar==="" || args.coupon_codebar===null || args.coupon_codebar===undefined) return new Error("011|Errors when generate CODEBAR !");

    // Asigno expiracion
    args.coupon_expire = await addDays(COUPON_EXPIRE_DAYS.parameter_value);

    if (!args.coupon_redimed) args['coupon_redimed']=new Date("0000-00-00 00:00:00") ;

    const coupon = await CouponsService.createCoupon({args});

    if (coupon) {

        // // SAVE SEQUENTIAL
        // // COUPON_SEQUENCE.parameter_value = newSequence;
        // // await SystemService.updateParameter({args: COUPON_SEQUENCE});
        // brand.brand_sequential = newSequence;
        // await ProductsService.updateBrand({args:{brand_id: brand.brand_id, brand_sequential: brand.brand_sequential}});
        return await coupon;
        // return {
        //     success: true,
        //     code: 200,
        //     message: "COUPON successfully generated.",
        //     data: coupon
        // };

    } else {
        // OK FUNCIONABA return new Error("012|Errors when generate coupon !");
        return {
            success: false,
            code: 402,
            message: "Errors when generate coupon !",
            data: {}
        };

    }

};

export default createCouponResolver;

