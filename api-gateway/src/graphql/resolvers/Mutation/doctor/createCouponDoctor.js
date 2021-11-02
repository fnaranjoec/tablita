import CouponsService from "#root/adapters/CouponsService";
import CodesService from "#root/adapters/CodesService";
import ProductsService from "#root/adapters/ProductsService";
import MediasService from "#root/adapters/MediasService";
import SystemService from "#root/adapters/SystemService";
import DoctorsService from "#root/adapters/DoctorsService";

import voucherCoupon from "#root/helpers/voucherCoupon";
import { addDays } from "#root/helpers/datesUtility";

import zeroFill from "#root/helpers/zeroFill";
import isEmpty from "lodash/isEmpty";

// import accessEnv from "#root/helpers/accessEnv";
// import storeUpload from "#root/helpers/storeUpload";

const createCouponDoctorResolver = async (obj, args, context ) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Must authenticate");


    // Valido la informacion que llegue
    if (!args.campaign_doctor_code) {
        return new Error("Campaign DOCTOR CODE data is missing !");
    }

    // Primero verifico si el Consummer existe, si no existe lo creo
    if (!args.consummer_id) args.consummer_id="";
    if (args.consummer_id.length==0) {
        let consummer = await CouponsService.createConsummerDoctor({args})
        args.consummer_id = consummer.consummer_id;
    }


    // Obtengo el campaign doctor
    var campaignDoctor = await DoctorsService.fetchCampaignDoctorByCode({campaign_doctor_code: args.campaign_doctor_code});
    // console.log("campaignDoctor==>", campaignDoctor);
    if (isEmpty(campaignDoctor)) return new Error("001|Code provided is EXPIRED, DELETED or NOT EXIST.");

    // Obtengo el campaign product
    var campaignProduct = await DoctorsService.fetchCampaignProductById({campaign_product_id: args.campaign_product_id});

    // console.log("campaignProduct==>", campaignProduct);
    if (isEmpty(campaignProduct)) return new Error("002|Campaign Product provided is EXPIRED, DELETED or NOT EXIST.");
    // console.log("productID==>", productID);

    var campaignDoctorID= campaignDoctor.campaign_doctor_id;
    var doctorID = campaignDoctor.doctor_id;
    var productID = campaignProduct.product_id;
    // console.log("campaignDoctorID==>", campaignDoctorID);


    // // Obtengo typo de codigo
    // var codeType = await CodesService.fetchCodeTypeById({code_type_id: mediaProduct.code_type_id});
    // console.log(codeType);

    // Obtengo parametros
    var COUPON_SEQUENCE = await SystemService.fetchParameterByName({parameter_name: "COUPON_SEQUENCE"});
    var COUPON_EXPIRE_DAYS = await SystemService.fetchParameterByName({parameter_name: "COUPON_EXPIRE_DAYS"});
    var MAX_CODE_CHARS = await SystemService.fetchParameterByName({parameter_name: "MAX_CODE_CHARS"});
    var FIDELIZATION_CODE = await SystemService.fetchParameterByName({parameter_name: "FIDELIZACION_CODE"});
    var INITIALIZATION_CODE = await SystemService.fetchParameterByName({parameter_name: "INICIALIZACION_CODE"});

    if (isEmpty(COUPON_SEQUENCE)) return new Error("003|Parameter COUPON_SEQUENCE NOT EXIST.");
    if (isEmpty(COUPON_EXPIRE_DAYS)) return new Error("004|Parameter COUPON_EXPIRE_DAYS NOT EXIST.");
    if (isEmpty(MAX_CODE_CHARS)) return new Error("005|Parameter MAX_CODE_CHARS NOT EXIST.");
    if (isEmpty(FIDELIZATION_CODE)) return new Error("006|Parameter FIDELIZATION_CODE NOT EXIST.");
    if (isEmpty(INITIALIZATION_CODE)) return new Error("007|Parameter INITIALIZATION_CODE NOT EXIST.");

    // console.log(`mediaProduct.code_type_id = ${mediaProduct.code_type_id},  FIDELIZATION_CODE = ${FIDELIZATION_CODE.parameter_text}`);
    // console.log(`mediaProduct.code_type_id = ${mediaProduct.code_type_id},  INITIALIZATION_CODE = ${INITIALIZATION_CODE.parameter_text}`);

    var consummerProductCouponFinded;
    var product;
    var brand;

    // BUSCO PRODUCTO Y BRAND
    product = await ProductsService.fetchProductById({product_id: productID});
    // console.log("product==>", product);

    brand= await ProductsService.fetchBrandById({brand_id: product.brand_id});
    // console.log("brand==>", brand);
    // // MEDIA
    // media = await MediasService.fetchMediaById({media_id: mediaProduct.media_id});


    // console.log("INITIALIZATION_CODE.parameter_text==>", INITIALIZATION_CODE.parameter_text);

    switch (campaignDoctor.code_type_id) {
        case INITIALIZATION_CODE.parameter_text :
            console.log("entre a INITIALIZATION");
            // ************************** INICIALIZACION (1 sola vez por producto) ********************
            consummerProductCouponFinded = await CouponsService.fetchCouponByConsumerCampaignProduct({ args: {consummer_id: args.consummer_id, product_id: productID} })
            // console.log("consummerProductCouponFinded  1 ==>", consummerProductCouponFinded);
            if (isEmpty(consummerProductCouponFinded)) return new Error(`008|${brand.brand_name}`);


            // if (consummerProductCouponFinded.count!==0) return {
            //     success: false,
            //     code: 400,
            //     message: "The initialization code has already been used, it is invalid right now!",
            //     data: {}
            // };

            // CREO EL TAG coupon_source por que viene desde el mutation
            args['coupon_source'] = productID;


            break;


        case FIDELIZATION_CODE.parameter_text :
            console.log("entre a FIDELIZATION");
            // ************************** FIDELIZACION (1 sola vez por doctor) ********************
            consummerProductCouponFinded = await CouponsService.fetchCouponByConsumerCampaignDoctor({ args: {consummer_id: args.consummer_id, campaign_doctor_id: campaignDoctorID, product_id: productID, doctor_id: doctorID } });
            // console.log("consummerProductCouponFinded  2 ==>", consummerProductCouponFinded);

            if (consummerProductCouponFinded.count>0) return new Error(`009|${brand.brand_name}`);


            // if (consummerProductCouponFinded.count!==0) return {
            //     success: false,
            //     code: 400,
            //     message: `008|${brand.brand_name}`,
            //     data: {}
            // };

            // CREO EL TAG coupon_source por que viene desde el mutation
            args['coupon_source'] = (campaignDoctorID + "," + productID + "," + doctorID); // Cuando quiero validar las dos cosas al mismo tiempo
            // args['coupon_source'] = (campaignDoctorID);

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

    // *** SEQUENTIAL ***
    // var newSequence= COUPON_SEQUENCE.parameter_value + 1;
    var newSequence= brand.brand_sequential + 1;

    // Creo el cupon con NUMERICO con zeros a la izquierda de la secuencia
    args.coupon_codebar = brand.brand_prefix + zeroFill(newSequence, MAX_CODE_CHARS.parameter_value);

    // // Creo el cupon con CHARECTERS al azar
    // var codeDigits = voucherCoupon((MAX_CODE_CHARS.parameter_value - newSequence.toString().trim().length), 1);
    // args.coupon_codebar = brand.brand_prefix + codeDigits + newSequence.toString().trim();

    if (args.coupon_codebar==="" || args.coupon_codebar===null || args.coupon_codebar===undefined) return new Error("011|Errors when generate CODEBAR !");

    // Asigno expiracion
    args.coupon_expire = await addDays(COUPON_EXPIRE_DAYS.parameter_value);

    // console.log('args.coupon_codebar ==> ', args.coupon_codebar);
    // console.log('args.coupon_expire ==> ', args.coupon_expire);
    // console.log('args.coupon_redimed ==> ', args.coupon_redimed);

    if (!args.coupon_redimed) args['coupon_redimed']=new Date("0000-00-00 00:00:00") ;

    const coupon = await CouponsService.createCoupon({args});

    if (coupon) {

        // SAVE SEQUENTIAL
        // COUPON_SEQUENCE.parameter_value = newSequence;
        // await SystemService.updateParameter({args: COUPON_SEQUENCE});
        brand.brand_sequential = newSequence;
        await ProductsService.updateBrand({args:{brand_id: brand.brand_id, brand_sequential: brand.brand_sequential}})

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

export default createCouponDoctorResolver;

