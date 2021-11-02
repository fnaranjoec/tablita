import CouponsService from "#root/adapters/CouponsService";

const couponsByCategoryResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCoupons(),
        await CouponsService.fetchCouponsByCategory({category_id: args.category_id})
    ]).then(([totalCount, filteredData]) => {

        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default couponsByCategoryResolver;

