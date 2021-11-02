import got from "got";
import accessEnv from "#root/helpers/accessEnv";

const MEDIA_SERVICE_URI = accessEnv("MEDIA_SERVICE_URI");

export default class MediasService {


    // ---------------------------------------- CATEGORY -------------------------------------------

    static async fetchAllCategories({args}) {

        const body = await got.post(`${MEDIA_SERVICE_URI}/categories/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countCategories() {

        const body = await got.get(`${MEDIA_SERVICE_URI}/categories/count`).json();
        return body || [];

    };


    static async fetchCategoryById({category_id}) {

        const body = await got.get(`${MEDIA_SERVICE_URI}/categories/${category_id}`).json();

        return body || [];

    };


    static async createCategory({category_name, category_slug, category_desc}) {

        const body = await got.post(`${MEDIA_SERVICE_URI}/categories`, {
            json: {category_name, category_slug, category_desc}
        }).json();

        return body || [];
    };

    //{category_id, category_name, category_slug, category_desc, category_status}
    static async updateCategory({args}) {

        const body = await got.put(`${MEDIA_SERVICE_URI}/categories/${args.category_id}`, {
            // json: {category_name, category_slug, category_desc}
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteCategory({category_id}) {

        const body = await got.delete(`${MEDIA_SERVICE_URI}/categories/${category_id}`).json();

        return body || false;
    };





    // ---------------------------------------- MEDIA -------------------------------------------



    static async fetchAllMedias({args}) {

        const body = await got.post(`${MEDIA_SERVICE_URI}/medias/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countMedias() {

        const body = await got.get(`${MEDIA_SERVICE_URI}/medias/count`).json();
        return body || [];

    };


    static async fetchMediaById({media_id}) {

        const body = await got.get(`${MEDIA_SERVICE_URI}/medias/${media_id}`).json();

        return body || {};

    };

    static async fetchMediasByCategory({category_id}) {

        const body = await got.get(`${MEDIA_SERVICE_URI}/medias/category/${category_id}`).json();

        return body || [];

    };




    static async createMedia({category_id, media_name, media_desc, media_slug, media_picture}) {

        const body= await got.post(`${MEDIA_SERVICE_URI}/medias`, {
            json: {category_id, media_name, media_desc, media_slug, media_picture}
        }).json();

        return body || [];
    };


    //{media_id, category_id, media_name, media_desc, media_picture, media_status}
    static async updateMedia({args}) {

        const body = await got.put(`${MEDIA_SERVICE_URI}/medias/${args.media_id}`, {
            // json: {category_id, media_name, media_desc, media_picture}
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteMedia({media_id}) {

        const body = await got.delete(`${MEDIA_SERVICE_URI}/medias/${media_id}`).json();

        return body || false;
    };


}

