const campaignProduct = `
        campaign_product_id: String!
        campaign_id: String!
        product_id: String!
        campaign_product_descto: Float!
        campaign_product_status: String!
        campaign_product_created: DateTime!
        
        product: Product
        campaign: Campaign
`;

export { campaignProduct};