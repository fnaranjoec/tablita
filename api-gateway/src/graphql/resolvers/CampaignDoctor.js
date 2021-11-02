import DoctorsService from "#root/adapters/DoctorsService";

const CampaignDoctor = {
    doctor: async (parent, args, context) => {
        // return await DoctorsService.fetchCampaignsByDoctor({campaign_id: parent.campaign_id});
        return await DoctorsService.fetchDoctorById({doctor_id: parent.doctor_id});
    },
};

export default CampaignDoctor;
