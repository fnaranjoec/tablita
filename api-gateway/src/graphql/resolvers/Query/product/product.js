import ProductsService from "#root/adapters/ProductsService";
import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";

const productsResolver = async(obj, args, context) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Must authenticate");

    // return await ProductsService.fetchAllProducts({args});
    return await  Promise.all([
        ProductsService.countProducts(),
        await ProductsService.fetchAllProducts({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })


};


export default productsResolver;

