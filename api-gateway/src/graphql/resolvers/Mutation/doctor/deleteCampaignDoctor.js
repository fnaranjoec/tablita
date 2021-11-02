import DoctorsService from "#root/adapters/DoctorsService";

const deleteCampaignDoctorResolver = async (obj, args, context) => {

  if (!args.campaign_doctor_id) {
      return new Error("Campaign Doctor ID is missing!");
  }

  return await DoctorsService.deleteCampaignDoctor({args});

};

export default deleteCampaignDoctorResolver;

