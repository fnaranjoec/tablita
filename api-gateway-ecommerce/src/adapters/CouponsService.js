import got from "got";
import accessEnv from "#root/helpers/accessEnv";

const COUPON_SERVICE_URI = accessEnv("COUPON_SERVICE_URI");

export default class CouponsService {


    // ---------------------------------------- CODE-TYPE -------------------------------------------

    static async fetchAllCommerceTypes({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/commercetypes/all`, {json: {args: args}}).json();

        return body || [];

    };


    static async countCommerceTypes() {

        const body = await got.get(`${COUPON_SERVICE_URI}/commercetypes/count`).json();
        return body || [];

    };


    static async fetchCommerceTypeById({commerce_type_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/commercetypes/${commerce_type_id}`).json();

        return body || [];

    };


    static async createCommerceType({commerce_type_name}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/commercetypes`, {
            json: {commerce_type_name}
        }).json();
        return body || [];


    };

    static async updateCommerceType({args}) {

        const body = await got.put(`${COUPON_SERVICE_URI}/commercetypes/${args.commerce_type_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteCommerceType({commerce_type_id}) {

        const body = await got.delete(`${COUPON_SERVICE_URI}/commercetypes/${commerce_type_id}`).json();

        return body || false;
    };





    // ---------------------------------------- CONSUMMER -------------------------------------------


    static async fetchAllConsummers({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/consummers/all`, {json: {args: args}}).json();


        return body || [];

    };



    static async countConsummers() {

        const body = await got.get(`${COUPON_SERVICE_URI}/consummers/count`).json();
        return body || [];

    };

    static async fetchConsummerById({consummer_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/consummers/${consummer_id}`).json();
        return body || {};

    };


    static async createConsummer({args}) {

        args['consummer_origin']="COMMERCE";
        const body= await got.post(`${COUPON_SERVICE_URI}/consummers`, {
            json: {args}
        }).json();

        return body || [];
    };


    static async createConsummerDoctor({args}) {

        args['consummer_origin']="DOCTOR";
        const body= await got.post(`${COUPON_SERVICE_URI}/consummers`, {
            json: {args}
        }).json();

        return body || [];
    };



    static async updateConsummer({args}) {

        const body = await got.put(`${COUPON_SERVICE_URI}/consummers/${consummer_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteConsummer({consummer_id}) {

        const body = await got.delete(`${COUPON_SERVICE_URI}/consummers/${consummer_id}`).json();

        return body || false;
    };


    // ---------------------------------------- COUPON -------------------------------------------


    static async fetchAllCoupons({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/coupons/all`, {json: {args: args}}).json();

        return body || [];

    };


    static async countCoupons() {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/count`).json();
        return body || [];

    };


    static async fetchCouponById({coupon_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/${coupon_id}`).json();
        return body || {};

    };


    static async fetchCouponByCodeBar({coupon_codebar}) {
        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/codebar/${coupon_codebar}`).json();
        return body || {};

    };


    static async fetchCouponByCodeBarSimple({coupon_codebar}) {
        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/codebar/simple/${coupon_codebar}`).json();
        return body || {};

    };

    static async fetchCouponByConsumerProduct({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/coupons/consummer/product`, {json: args}).json();

        return body || [];
    };

    static async fetchCouponByConsumerMedia({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/coupons/consummer/media`, {json: args}).json();

        return body || [];
    };


    static async fetchCouponByConsumerCampaignProduct({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/coupons/campaign/product`, {json: args}).json();

        return body || [];
    };



    static async fetchCouponByConsumerCampaignDoctor({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/coupons/campaign/doctor`, {json: args}).json();

        return body || [];
    };


    static async fetchCouponsByCommerceType({commerce_type_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/commerceType/${commerce_type_id}`).json();

        return body || [];
    };

    static async fetchCouponsByConsummer({consummer_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/consummer/${consummer_id}`).json();

        return body || [];
    };


    static async fetchCouponsByMediaProduct({media_product_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/media_product/${media_product_id}`).json();
        return body || [];
    };


    static async createCoupon({args}) {

        const body= await got.post(`${COUPON_SERVICE_URI}/coupons`, {
            json: {args}
        }).json();

        return body || [];
    };



    static async updateCoupon({args}) {


        const body = await got.put(`${COUPON_SERVICE_URI}/coupons/${args.coupon_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async redimeCoupon({args}) {

        const body = await got.put(`${COUPON_SERVICE_URI}/coupons/redime/${args.coupon_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async redimeCouponArray({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/coupons/redime/array`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async redimeFile({coupon_id, redimed, commerceType, uploaded}) {

        const body = await got.put(`${COUPON_SERVICE_URI}/coupons/redime/file/${coupon_id}`, {
            json: {redimed, commerceType, uploaded}
        }).json();

        return body || [];
    };

    static async deleteCoupon({coupon_id}) {

        const body = await got.delete(`${COUPON_SERVICE_URI}/coupons/${coupon_id}`).json();

        return body || false;
    };

    // ---------------------------------------- COUPON REPORTS -------------------------------------------
    static async fetchCouponsByCategory({category_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byCategory/${category_id}`).json();

        return body || [];
    };

    static async fetchCouponsByBrand({brand_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byBrand/${brand_id}`).json();

        return body || [];
    };


    static async fetchCouponsByProduct({product_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byProduct/${product_id}`).json();

        return body || [];
    };


    static async fetchCouponsByMedia({media_id}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byMedia/${media_id}`).json();

        return body || [];
    };



    static async fetchCouponsByCategoryMetrics({args}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byCategoryMetrics/${args.category_id}/${args.from}/${args.to}`).json();

        return body || [];
    };


    static async fetchCouponsByBrandMetrics({args}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byBrandMetrics/${args.brand_id}/${args.from}/${args.to}`).json();

        return body || [];
    };


    static async fetchCouponsByProductMetrics({args}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byProductMetrics/${args.product_id}/${args.from}/${args.to}`).json();

        return body || [];
    };


    static async fetchCouponsByMediaMetrics({args}) {

        const body = await got.get(`${COUPON_SERVICE_URI}/coupons/byMediaMetrics/${args.media_id}/${args.from}/${args.to}`).json();

        return body || [];
    };

    static async fetchCouponsRollUp({args}) {

        const body = await got.post(`${COUPON_SERVICE_URI}/coupons/rollup`, {json: args}).json();

        return body || [];
    };


}


