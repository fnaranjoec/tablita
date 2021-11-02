import got from "got";
import accessEnv from "#root/helpers/accessEnv";

const PRODUCT_SERVICE_URI = accessEnv("PRODUCT_SERVICE_URI");

export default class UsersService {

    // ----------------------------------------------- BRANDS -------------------------------------

    static async fetchAllBrands({args}) {

        const body = await got.post(`${PRODUCT_SERVICE_URI}/brands/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countBrands() {

        const body = await got.get(`${PRODUCT_SERVICE_URI}/brands/count`).json();
        // console.log('Consulta 1', body);
        return body || [];

    };


    static async fetchBrandById({brand_id}) {

        const body = await got.get(`${PRODUCT_SERVICE_URI}/brands/${brand_id}`).json();

        return body || {} ;

    };

    static async fetchBrandsByCustomer({customer_id}) {

        const body = await got.get(`${PRODUCT_SERVICE_URI}/brands/customer/${customer_id}`).json();

        return body || [] ;

    };


    static async createBrand({customer_id, brand_name, brand_slug, brand_desc, brand_prefix, brand_picture}) {

        const body = await got.post(`${PRODUCT_SERVICE_URI}/brands`, {
            json: {customer_id, brand_name, brand_slug, brand_desc, brand_prefix, brand_picture}
        }).json();

        return body || [];
    };


    static async updateBrand({args}) {

        const body = await got.put(`${PRODUCT_SERVICE_URI}/brands/${args.brand_id}`, {
            json: {args}
        }).json();

        return body || [];
    };


    static async deleteBrand({brand_id}) {

        const body = await got.delete(`${PRODUCT_SERVICE_URI}/brands/${brand_id}`).json();

        return body || false;
    };



    // ----------------------------------------------- PRODUCT -------------------------------------



    static async fetchAllProducts({args}) {

        const body = await got.post(`${PRODUCT_SERVICE_URI}/products/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countProducts() {

        const body = await got.get(`${PRODUCT_SERVICE_URI}/products/count`).json();
        // console.log('Consulta 1', body);
        return body || [];

    };


    static async fetchProductById({product_id}) {

        const body = await got.get(`${PRODUCT_SERVICE_URI}/products/${product_id}`).json();

        return body || {};

    };


    static async fetchProductsByBrand({brand_id}) {

        const body = await got.get(`${PRODUCT_SERVICE_URI}/products/brand/${brand_id}`).json();

        return body || [];

    };


    static async createProduct({brand_id, product_name, product_slug, product_desc, product_picture, product_sku}) {

        const body= await got.post(`${PRODUCT_SERVICE_URI}/products`, {
            json: {brand_id, product_name, product_slug, product_desc, product_picture, product_sku}
        }).json();

        return body || [];
    };


    //{product_id, brand_id, product_name, product_slug, product_desc, product_picture, product_status}
    static async updateProduct({args}) {


        const body= await got.put(`${PRODUCT_SERVICE_URI}/products/${args.product_id}`, {
            // json: {brand_id, product_name, product_slug, product_desc, product_picture, product_status}
            json: {args}
        }).json();

        return body || [];
    };


    static async deleteProduct({product_id}) {

        const body= await got.delete(`${PRODUCT_SERVICE_URI}/products/${product_id}`).json();

        return body || false;
    };




}


