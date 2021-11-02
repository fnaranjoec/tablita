import got from "got";
import accessEnv from "#root/helpers/accessEnv";

const CODE_SERVICE_URI = accessEnv("CODE_SERVICE_URI");

export default class CodesService {


    // ---------------------------------------- CODE-TYPE -------------------------------------------

    static async fetchAllCodeTypes({args}) {

        const body = await got.post(`${CODE_SERVICE_URI}/codetypes/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countCodeTypes() {

        const body = await got.get(`${CODE_SERVICE_URI}/codetypes/count`).json();
        return body || [];

    };


    static async fetchCodeTypeById({code_type_id}) {

        const body = await got.get(`${CODE_SERVICE_URI}/codetypes/${code_type_id}`).json();

        return body || {};

    };


    static async createCodeType({code_type_name}) {

        const body = await got.post(`${CODE_SERVICE_URI}/codetypes`, {
            json: {code_type_name}
        }).json();

        return body || [];
    };

    //{code_type_id, code_type_name, code_type_status}
    static async updateCodeType({args}) {

        const body = await got.put(`${CODE_SERVICE_URI}/codetypes/${args.code_type_id}`, {
            // json: {code_type_name}
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteCodeType({code_type_id}) {

        const body = await got.delete(`${CODE_SERVICE_URI}/codetypes/${code_type_id}`).json();

        return body || false;
    };





    // ---------------------------------------- MEDIA-PRODUCT -------------------------------------------



    static async fetchAllMediaProducts({args}) {

        const body = await got.post(`${CODE_SERVICE_URI}/mediaproducts/all`, {json: {args: args}}).json();

        return body || [];

    };


    static async countMediaProducts() {

        const body = await got.get(`${CODE_SERVICE_URI}/mediaproducts/count`).json();
        return body || [];

    };

    
    static async fetchMediaProductById({media_product_id}) {

        const body = await got.get(`${CODE_SERVICE_URI}/mediaproducts/${media_product_id}`).json();
        return body || {};

    };

    static async fetchMediaProductsByMedia({media_id}) {

        const body = await got.get(`${CODE_SERVICE_URI}/mediaproducts/media/${media_id}`).json();
        return body || [];

    };

    static async fetchMediaProductByProduct({product_id}) {

        const body = await got.get(`${CODE_SERVICE_URI}/mediaproducts/product/${product_id}`).json();

        return body || [];

    };

    static async fetchMediaProductByCodeType({code_type_id}) {

        const body = await got.get(`${CODE_SERVICE_URI}/mediaproducts/codetype/${code_type_id}`).json();

        return body || [];

    };


    static async fetchMediaProductByCode({media_product_code}) {

        const body = await got.get(`${CODE_SERVICE_URI}/mediaproducts/code/${media_product_code}`).json();

        return body || {};

    };

    // {media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire}
    static async createMediaProduct({args}) {
        const body= await got.post(`${CODE_SERVICE_URI}/mediaproducts`, {
            json: {args}
        }).json();

        return body || [];
    };


    //{media_product_id, media_id, product_id, code_type_id, media_product_desc, media_product_code,media_product_picture, media_product_expire, media_product_status}
    static async updateMediaProduct({args}) {

        const body = await got.put(`${CODE_SERVICE_URI}/mediaproducts/${args.media_product_id}`, {
            // json: {media_id, product_id, code_type_id, media_product_desc, media_product_code, media_product_picture, media_product_expire, media_product_status}
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteMediaProduct({media_product_id}) {

        const body = await got.delete(`${CODE_SERVICE_URI}/mediaproducts/${media_product_id}`).json();

        return body || false;
    };


}


