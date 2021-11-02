import DoctorsService from "#root/adapters/DoctorsService";

const deleteCampaignResolver = async (obj, args, context) => {

  if (!args.campaign_id) {
      return new Error("Campaign ID is missing!");
  }

  return await DoctorsService.deleteCampaign({args});

};

export default deleteCampaignResolver;

