import DoctorsService from "#root/adapters/DoctorsService";
import accessEnv from "#root/helpers/accessEnv";

const updateCampaignProductResolver = async (obj, args, context) => {

    if (!args.campaign_product_id) {
        return new Error("Campaign Product ID is missing!");
    }

    return await DoctorsService.updateCampaignProduct({args});

};

export default updateCampaignProductResolver;

