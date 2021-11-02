import CouponsService from "#root/adapters/CouponsService";
import CodesService from "../../adapters/CodesService";
import DoctorsService from "#root/adapters/DoctorsService";


const CouponExtended = {
    commerceType: async (parent, args, context) => {
        return await CouponsService.fetchCommerceTypeById({commerce_type_id: parent.commerce_type_id});
    },
    consummer: async (parent, args, context) => {
        return await CouponsService.fetchConsummerById({consummer_id: parent.consummer_id});
    },
    mediaProduct: async (parent, args, context) => {
        if (parent.media_product_id==null){return null}
        const medPro= await CodesService.fetchMediaProductById({media_product_id: parent.media_product_id});
        return medPro;
    },
    campaignProduct: async (parent, args, context) => {
        if (parent.campaign_product_id==null){return null}
        const camPro = await DoctorsService.fetchCampaignProductById({campaign_product_id: parent.campaign_product_id});
        return camPro;
    },
    campaignDoctor: async (parent, args, context) => {
        if (parent.campaign_doctor_id==null){return null}
        const camDoc = await DoctorsService.fetchCampaignDoctorById({campaign_doctor_id: parent.campaign_doctor_id});
        return camDoc;
    },
};

export default CouponExtended;

