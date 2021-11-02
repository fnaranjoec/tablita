import ProductsService from "#root/adapters/ProductsService";
import DoctorsService from "#root/adapters/DoctorsService";

const CampaignProduct = {
    product: async (parent, args, context) => {
        return await ProductsService.fetchProductById({product_id: parent.product_id});
    },
    campaign: async (parent, args, context) => {
        return await DoctorsService.fetchCampaignById({campaign_id: parent.campaign_id});
    },
};

export default CampaignProduct;
