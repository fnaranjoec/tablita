const couponExtended = `
        coupon_id: String!
        coupon_codebar: String!
        coupon_created: DateTime!
        coupon_status: String!
        coupon_redimed: DateTime
        coupon_redimedFile: DateTime
        coupon_expire: DateTime!
        coupon_device: String
        coupon_redimed_store: String!
        coupon_host: String
        coupon_ip: String
        coupon_latitude: Float
        coupon_longitude: Float
        coupon_source: String!

        media_product_id: String
        media_product_code: String
        
        brand_id: String!
        brand_name: String!
        product_id: String!
        product_name: String!
        media_id: String!
        media_name: String!
        code_type_id: String!
        code_type_name: String!
        
        commerce_type_id: String
        commerce_type_name: String
        
        consummer_id: String!
        consummer_name: String!
        
        category_id: String!
        category_name: String!
        
        campaign_product_id: String
        campaign_id: String
        campaign_name: String
        
        campaign_doctor_id: String
        doctor_id: String
        doctor_name: String

        commerceType: CommerceType
        consummer: Consummer
        
        mediaProduct: MediaProduct
        campaignProduct: CampaignProduct
        campaignDoctor: CampaignDoctor
`;

export { couponExtended } ;