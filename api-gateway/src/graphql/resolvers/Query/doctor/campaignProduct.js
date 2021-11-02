import DoctorsService from "#root/adapters/DoctorsService";

const campaignProductsResolver = async(obj, args, context) => {

    return await  Promise.all([
        DoctorsService.countCampaignProducts(),
        DoctorsService.fetchAllCampaignProducts({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};

export default campaignProductsResolver;

