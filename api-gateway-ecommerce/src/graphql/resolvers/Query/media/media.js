import MediasService from "#root/adapters/MediasService";

const mediasResolver = async(obj, args, context) => {

    // return await MediasService.fetchAllMedias({args});
    return await  Promise.all([
        MediasService.countMedias(),
        await MediasService.fetchAllMedias({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default mediasResolver;

