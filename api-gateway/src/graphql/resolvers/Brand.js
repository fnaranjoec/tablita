import ProductsService from "#root/adapters/ProductsService";
import UsersService from "#root/adapters/UsersService";

const Brand = {


    customer: async (parent, args, context) => {
        return await UsersService.fetchCustomerById({customer_id: parent.customer_id})
    },
    products: async (parent, args, context) => {
        return await ProductsService.fetchProductsByBrand({brand_id: parent.brand_id});
    },
};

export default Brand;

