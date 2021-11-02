import ProductsService from "#root/adapters/ProductsService";
import isEmpty from "lodash/isEmpty";
import { AuthenticationError } from "apollo-server-express";

const brandsResolver = async(obj, args, context) => {

    // // -------------------------------- AUTENTICACION -----------------------------------
    // if (isEmpty(context.req.user)) throw new AuthenticationError("000|Access Token Expired!");

    // return await ProductsService.fetchAllBrands({args});
    return await  Promise.all([
        ProductsService.countBrands(),
        await ProductsService.fetchAllBrands({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};

export default brandsResolver;

