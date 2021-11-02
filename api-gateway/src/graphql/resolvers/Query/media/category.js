import MediasService from "#root/adapters/MediasService";

const categoriesResolver = async(obj, args, context) => {

    // return await MediasService.fetchAllCategories({args});
    return await  Promise.all([
        MediasService.countCategories(),
        await MediasService.fetchAllCategories({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })


};


export default categoriesResolver;

