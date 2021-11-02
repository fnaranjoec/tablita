import CouponsService from "#root/adapters/CouponsService";

const commerceTypesResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCommerceTypes(),
        await CouponsService.fetchAllCommerceTypes({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default commerceTypesResolver;

