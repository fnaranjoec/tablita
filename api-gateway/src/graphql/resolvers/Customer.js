import ProductsService from "#root/adapters/ProductsService";

const Customer = {
    brands: async (parent, args, context) => {
        return await ProductsService.fetchBrandsByCustomer({customer_id: parent.customer_id});
    }
};

export default Customer;
