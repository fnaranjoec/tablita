import got from "got";
import accessEnv from "#root/helpers/accessEnv";

const USER_SERVICE_URI = accessEnv("USER_SERVICE_URI");

export default class UsersService {

    // ----------------------------------------------------- ROLES ----------------------------------------------------

    static async fetchAllRoles() {

        const body = await got.get(`${USER_SERVICE_URI}/roles`).json();

        return body || [];

    };

    // ----------------------------------------------------- USER ----------------------------------------------------

    static async fetchAllUsers({args}) {

        const body = await got.post(`${USER_SERVICE_URI}/users/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async fetchUserById({user_id}) {

        const body = await got.get(`${USER_SERVICE_URI}/users/${user_id}`).json();

        return body || [];

    };

    static async createCustomer({user_name, user_email, user_phone, user_password, customer_name, customer_address, customer_picture}) {

        const body= await got.post(`${USER_SERVICE_URI}/users/customer`, {
            json: {user_name, user_email, user_phone, user_password, customer_name, customer_address, customer_picture}
        }).json();

        return body || [];
    };

    static async createOperator({user_name, user_email, user_phone, user_password}) {

        const body= await got.post(`${USER_SERVICE_URI}/users/operator`, {
            json: {user_name, user_email, user_phone, user_password}
        }).json();

        return body || [];
    };

    //{user_id, user_name, user_email, user_phone, user_password, user_status}
    static async updateUser({args}) {

        const body= await got.put(`${USER_SERVICE_URI}/users/${args.user_id}`, {
            // json: {user_name, user_email, user_phone, user_password}
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteUser({user_id}) {

        const body= await got.delete(`${USER_SERVICE_URI}/users/${user_id}`).json();

        return body || false;
    };

    // ----------------------------------------------------- CUSTOMER ----------------------------------------------------

    static async fetchAllCustomers({args}) {

        const body = await got.post(`${USER_SERVICE_URI}/customers/all`, {json: {args: args}}).json();

        return body || [];

    };

    static async countCustomers() {

        const body = await got.get(`${USER_SERVICE_URI}/customers/count`).json();
        // console.log('Consulta 1', body);
        return body || [];

    };

    static async fetchCustomerById({customer_id}) {

        const body = await got.get(`${USER_SERVICE_URI}/customers/${customer_id}`).json();

        return body || [];

    };

    //{customer_id, customer_name, customer_address, customer_phone, customer_email, customer_picture, customer_status}
    static async updateCustomer({args}) {

        const body= await got.put(`${USER_SERVICE_URI}/customers/${args.customer_id}`, {
            // json: {customer_name, customer_address, customer_phone, customer_email, customer_picture}
            json: {args}
        }).json();

        return body || [];
    };

    static async deleteCustomer({customer_id}) {

        const body= await got.delete(`${USER_SERVICE_URI}/customers/${customer_id}`).json();

        return body || false;
    };



    // ----------------------------------------------------- SESSION ----------------------------------------------------

    static async createUserSession({user_email, user_password}) {

        const body= await got.post(`${USER_SERVICE_URI}/sessions`, {
            json: {user_email, user_password}
        }).json();


        return body || [];
    };

    static async updateUserSession({session_id, session_access_token, session_refresh_token}) {

        const body= await got.put(`${USER_SERVICE_URI}/sessions/${session_id}`, {
            json: {session_access_token, session_refresh_token}
        }).json();


        return body || [];
    };

    static async fetchUserSessionById({session_id}) {

        const body = await got.get(`${USER_SERVICE_URI}/sessions/${session_id}`).json();
        return body || {};

    };

    static async deleteUserSession({session_id}) {

        // const body= await got.delete(`${USER_SERVICE_URI}/sessions/${session_id}`).json();
        const body= await got.delete(`${USER_SERVICE_URI}/sessions/${session_id}`).json();
        return body || false;

    };




}


