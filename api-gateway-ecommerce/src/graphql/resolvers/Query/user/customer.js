import UsersService from "#root/adapters/UsersService";

const customersResolver = async(obj, args, context) => {

    // // console.log(args);
    // return await  UsersService.fetchAllCustomers({args});

    return await  Promise.all([
        UsersService.countCustomers(),
        UsersService.fetchAllCustomers({args})
    ]).then(([totalCount, filteredData]) => {
        return {
            total: totalCount.count,
            filtered: filteredData.count,
            rows: filteredData.rows
        }
    })

};

export default customersResolver;

