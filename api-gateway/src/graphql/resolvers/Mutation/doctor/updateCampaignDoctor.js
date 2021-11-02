import DoctorsService from "#root/adapters/DoctorsService";
import accessEnv from "#root/helpers/accessEnv";

const updateCampaignDoctorResolver = async (obj, args, context) => {

    if (!args.campaign_doctor_id) {
        return new Error("Campaign Doctor ID is missing!");
    }

    return await DoctorsService.updateCampaignDoctor({args});

};

export default updateCampaignDoctorResolver;

