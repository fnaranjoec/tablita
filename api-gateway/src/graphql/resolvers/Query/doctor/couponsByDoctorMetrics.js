import CouponsService from "#root/adapters/CouponsService";

const couponsByDoctorMetricsResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCoupons(),
        await CouponsService.fetchCouponsByDoctorMetrics({args})
    ]).then(([totalCount, filteredData]) => {

        return {
            total: totalCount.count,
            filtered: filteredData.rows.length,
            rows: filteredData.rows
        }
    })

};


export default couponsByDoctorMetricsResolver;

