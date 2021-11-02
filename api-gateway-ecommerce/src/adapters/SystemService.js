import got from "got";
import accessEnv from "#root/helpers/accessEnv";

const USER_SERVICE_URI = accessEnv("USER_SERVICE_URI");

export default class SystemService {


    // ----------------------------------------------------- PARAMETERS ----------------------------------------------------
    static async fetchAllParameters({args}) {

        const body = await got.post(`${USER_SERVICE_URI}/parameters/all`, {json: {args: args}}).json();

        return body || [];

    };


    static async countParameters() {

        const body = await got.get(`${USER_SERVICE_URI}/parameters/count`).json();
        // console.log('Consulta 1', body);
        return body || [];

    };


    static async fetchParameterById({parameter_id}) {

        const body = await got.get(`${USER_SERVICE_URI}/parameters/${parameter_id}`).json();

        return body || [];

    };


    static async fetchParameterByName({parameter_name}) {

        const body = await got.get(`${USER_SERVICE_URI}/parameters/name/${parameter_name}`).json();
        return body || {};

    };

    static async updateParameter({args}) {
        // console.log('args ==> ', args);

        const body= await got.put(`${USER_SERVICE_URI}/parameters/${args.parameter_name}`, {
            json: {args}
        }).json();

        return body || [];
    };

    // ----------------------------------------------------- MESSAGE ----------------------------------------------------
    static async fetchAllMessages({args}) {

        const body = await got.post(`${USER_SERVICE_URI}/messages/all`, {json: {args: args}}).json();

        return body || [];

    };


    static async countMessages() {

        const body = await got.get(`${USER_SERVICE_URI}/messages/count`).json();
        // console.log('Consulta 1', body);
        return body || [];

    };


    static async fetchMessageById({message_id}) {

        const body = await got.get(`${USER_SERVICE_URI}/messages/${message_id}`).json();

        return body || {};

    };


    static async fetchMessageByCode({message_motor, message_code}) {

        const body = await got.get(`${USER_SERVICE_URI}/messages/code/${message_motor}/${message_code}`).json();
        return body || {};

    };


    static async updateMessage({args}) {
        // console.log('args ==> ', args);

        const body= await got.put(`${USER_SERVICE_URI}/messages/${args.message_id}`, {
            json: {args}
        }).json();

        return body || [];
    };


    // ------------------------------------------------  RABBIT MQ  ----------------------------------
    static async sendMessagesMailing({args}) {

        const body = await got.post(`${USER_SERVICE_URI}/rabbit/send/mailing`, {json: {args: args}}).json();
        return body || {};

    };


}


