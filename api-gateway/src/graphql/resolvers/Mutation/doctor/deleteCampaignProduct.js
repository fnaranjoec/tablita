import DoctorsService from "#root/adapters/DoctorsService";

const deleteCampaignProductResolver = async (obj, args, context) => {

  if (!args.campaign_product_id) {
      return new Error("Campaign Product ID is missing!");
  }

  return await DoctorsService.deleteCampaignProduct({args});

};

export default deleteCampaignProductResolver;

