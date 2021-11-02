import DoctorsService from "#root/adapters/DoctorsService";

const Campaign = {
    doctors: async (parent, args, context) => {
        // return await DoctorsService.fetchCampaignsByDoctor({campaign_id: parent.campaign_id});
        return await DoctorsService.fetchDoctorsByCampaign({campaign_id: parent.campaign_id});
    },
    products: async (parent, args, context) => {
        // return await DoctorsService.fetchCampaignsByProduct({campaign_id: parent.campaign_id});
        return await DoctorsService.fetchProductsByCampaign({campaign_id: parent.campaign_id});
    }
};

export default Campaign;
