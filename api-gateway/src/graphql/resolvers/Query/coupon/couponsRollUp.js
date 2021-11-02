import CouponsService from "#root/adapters/CouponsService";

const couponsRollUpResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCoupons(),
        await CouponsService.fetchCouponsRollUp({args})
    ]).then(([totalCount, filteredData]) => {

        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default couponsRollUpResolver;

