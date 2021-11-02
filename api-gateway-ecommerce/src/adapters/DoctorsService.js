import got from "got";
import accessEnv from "#root/helpers/accessEnv";

const DOCTOR_SERVICE_URI = accessEnv("DOCTOR_SERVICE_URI");

export default class DoctorsService {


    // ---------------------------------------- DOCTOR -------------------------------------------

    static async fetchAllDoctors({args}) {

        const body = await got.post(`${DOCTOR_SERVICE_URI}/doctors/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countDoctors() {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/doctors/count`).json();
        return body || [];

    };


    static async fetchDoctorById({doctor_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/doctors/${doctor_id}`).json();

        return body || [];

    };


    static async createDoctor({args}) {

        const body = await got.post(`${DOCTOR_SERVICE_URI}/doctors`, {
            json: {args}
        }).json();

        return body || [];
    };

    //{doctor_id, doctor_name, doctor_slug, doctor_desc, doctor_status}
    static async updateDoctor({args}) {

        const body = await got.put(`${DOCTOR_SERVICE_URI}/doctors/${args.doctor_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteDoctor({args}) {

        const body = await got.delete(`${DOCTOR_SERVICE_URI}/doctors/${args.doctor_id}`).json();

        return body || false;
    };





    // ---------------------------------------- CAMPAIGN -------------------------------------------



    static async fetchAllCampaigns({args}) {

        const body = await got.post(`${DOCTOR_SERVICE_URI}/campaigns/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countCampaigns() {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaigns/count`).json();
        return body || [];

    };


    static async fetchCampaignById({campaign_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaigns/${campaign_id}`).json();

        return body || {};

    };



    static async createCampaign({args}) {

        const body= await got.post(`${DOCTOR_SERVICE_URI}/campaigns`, {
            json: {args}
        }).json();

        return body || [];
    };


    static async updateCampaign({args}) {

        const body = await got.put(`${DOCTOR_SERVICE_URI}/campaigns/${args.campaign_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteCampaign({args}) {

        const body = await got.delete(`${DOCTOR_SERVICE_URI}/campaigns/${args.campaign_id}`).json();

        return body || false;
    };



    // ---------------------------------------- CAMPAIGN-DOCTOR -------------------------------------------


    static async fetchAllCampaignDoctors({args}) {

        const body = await got.post(`${DOCTOR_SERVICE_URI}/campaign-doctors/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countCampaignDoctors() {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-doctors/count`).json();
        return body || [];

    };


    static async fetchCampaignDoctorById({campaign_doctor_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-doctors/${campaign_doctor_id}`).json();

        return body || {};

    };



    static async fetchCampaignsByDoctor({doctor_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-doctors/doctor/${doctor_id}`).json();

        return body || [];

    };


    static async fetchDoctorsByCampaign({campaign_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-doctors/campaign/${campaign_id}`).json();

        return body || [];

    };


    static async createCampaignDoctor({args}) {

        const body= await got.post(`${DOCTOR_SERVICE_URI}/campaign-doctors`, {
            json: {args}
        }).json();

        return body || [];
    };


    static async fetchCampaignDoctorByCode({campaign_doctor_code}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-doctors/code/${campaign_doctor_code}`).json();

        return body || {};

    };


    static async updateCampaignDoctor({args}) {

        const body = await got.put(`${DOCTOR_SERVICE_URI}/campaign-doctors/${args.campaign_doctor_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteCampaignDoctor({args}) {

        const body = await got.delete(`${DOCTOR_SERVICE_URI}/campaign-doctors/${args.campaign_doctor_id}`).json();

        return body || false;
    };

    // -------------------------------------------- FROM FILE ---------------------------------------
    static async createCampaignDoctorFromFile({campaign_id, doctor_name, doctor_email, campaign_doctor_code, code_type_id, uploaded}) {


        const body = await got.post(`${DOCTOR_SERVICE_URI}/campaign-doctors/file/${campaign_id}`, {
            json: {doctor_name, doctor_email, campaign_doctor_code, code_type_id, uploaded}
        }).json();

        return body || [];
    };


    // ---------------------------------------- CAMPAIGN-PRODUCT -------------------------------------------


    static async fetchAllCampaignProducts({args}) {

        const body = await got.post(`${DOCTOR_SERVICE_URI}/campaign-products/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countCampaignProducts() {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-products/count`).json();
        return body || [];

    };

    static async fetchCampaignProductById({campaign_product_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-products/${campaign_product_id}`).json();

        return body || {};

    };


    static async fetchCampainsByProduct({product_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-products/product/${product_id}`).json();

        return body || [];

    };


    static async fetchProductsByCampaign({campaign_id}) {

        const body = await got.get(`${DOCTOR_SERVICE_URI}/campaign-products/campaign/${campaign_id}`).json();

        return body || [];

    };



    static async createCampaignProduct({args}) {

        const body= await got.post(`${DOCTOR_SERVICE_URI}/campaign-products`, {
            json: {args}
        }).json();

        return body || [];
    };


    static async updateCampaignProduct({args}) {

        const body = await got.put(`${DOCTOR_SERVICE_URI}/campaign-products/${args.campaign_product_id}`, {
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteCampaignProduct({args}) {

        const body = await got.delete(`${DOCTOR_SERVICE_URI}/campaign-products/${args.campaign_product_id}`).json();

        return body || false;
    };






}

