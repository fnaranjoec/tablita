// import ProductsService from "#root/adapters/ProductsService";
// import UsersService from "#root/adapters/UsersService";
import MediasService from "#root/adapters/MediasService";
import CodesService from "#root/adapters/CodesService";

const CodeType = {
    mediaProducts: async (parent, args, context) => {
        return await CodesService.fetchMediaProductByCodeType({code_type_id: parent.code_type_id});
    },
};

export default CodeType;

