import CouponsService from "#root/adapters/CouponsService";

const couponsByBrandMetricsResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCoupons(),
        await CouponsService.fetchCouponsByBrandMetrics({args})
    ]).then(([totalCount, filteredData]) => {

        return {
            total: totalCount.count,
            filtered: filteredData.rows.length,
            rows: filteredData.rows
        }
    })

};


export default couponsByBrandMetricsResolver;

