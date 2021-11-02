import CouponsService from "#root/adapters/CouponsService";

const consumerResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countConsummers(),
        await CouponsService.fetchAllConsummers({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default consumerResolver;

