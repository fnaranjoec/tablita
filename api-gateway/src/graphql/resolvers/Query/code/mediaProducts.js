import CodesService from "#root/adapters/CodesService";

const mediaProductResolver = async(obj, args, context) => {

    // return await CodesService.fetchAllMediaProducts({args});
    return await  Promise.all([
        CodesService.countMediaProducts(),
        await CodesService.fetchAllMediaProducts({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default mediaProductResolver;

