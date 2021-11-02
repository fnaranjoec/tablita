import DoctorsService from "#root/adapters/DoctorsService";

const campaignsResolver = async(obj, args, context) => {

    return await  Promise.all([
        DoctorsService.countCampaigns(),
        DoctorsService.fetchAllCampaigns({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};

export default campaignsResolver;

