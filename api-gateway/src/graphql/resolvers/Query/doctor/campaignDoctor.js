import DoctorsService from "#root/adapters/DoctorsService";

const campaignDoctorsResolver = async(obj, args, context) => {

    return await  Promise.all([
        DoctorsService.countCampaignDoctors(),
        DoctorsService.fetchAllCampaignDoctors({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};

export default campaignDoctorsResolver;

