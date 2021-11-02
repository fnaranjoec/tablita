import CouponsService from "#root/adapters/CouponsService";

const couponsByCampaignResolver = async(obj, args, context) => {

    return await  Promise.all([
        CouponsService.countCoupons(),
        await CouponsService.fetchCouponsByCampaign({campaign_id: args.campaign_id})
    ]).then(([totalCount, filteredData]) => {

        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default couponsByCampaignResolver;

