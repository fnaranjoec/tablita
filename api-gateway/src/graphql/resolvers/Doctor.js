import DoctorsService from "#root/adapters/DoctorsService";

const Doctor = {
    campaigns: async (parent, args, context) => {
        return await DoctorsService.fetchCampaignsByDoctor({doctor_id: parent.doctor_id});
    }
};

export default Doctor;
