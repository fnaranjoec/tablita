import DoctorsService from "#root/adapters/DoctorsService";

const doctorsResolver = async(obj, args, context) => {

    return await  Promise.all([
        DoctorsService.countDoctors(),
        DoctorsService.fetchAllDoctors({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};

export default doctorsResolver;

