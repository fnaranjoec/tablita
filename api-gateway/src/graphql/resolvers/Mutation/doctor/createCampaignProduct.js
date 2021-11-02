
import DoctorsService from "#root/adapters/DoctorsService";
import ProductsService from "#root/adapters/ProductsService";
import isEmpty from "lodash/isEmpty";
import accessEnv from "#root/helpers/accessEnv";

const createCampaignProductResolver = async (obj, args, context) => {

    // Valido el body si llega con todos los datos
    if (!args.campaign_id || !args.product_id ) {
        return new Error("001|Campaign Product data are incomplete !!!");
    }

    const product= await ProductsService.fetchProductById({product_id: args.product_id});
    // console.log("campaign==>", campaign);

    if (isEmpty(product))  return new Error(`002|Product Id is invalid, deleted or not exist.`);

    return await DoctorsService.createCampaignProduct({args});
};

export default createCampaignProductResolver;

