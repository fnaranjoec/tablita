import CodesService from "#root/adapters/CodesService";

const { GraphQLDateTime } = require('graphql-iso-date');

const codeTypesResolver = async(obj, args, context) => {

    // return await CodesService.fetchAllCodeTypes({args});
    return await  Promise.all([
        CodesService.countCodeTypes(),
        await CodesService.fetchAllCodeTypes({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};


export default codeTypesResolver;

