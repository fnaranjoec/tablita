const campaign = `
        campaign_id: String!
        campaign_name: String!
        campaign_slug: String!
        campaign_prefix: String!
        campaign_desc: String!
        campaign_picture: String!
        campaign_expire: DateTime!
        campaign_status: String!
        campaign_created: DateTime!
        doctors: [CampaignDoctor!]
        products: [CampaignProduct!]
`;

export { campaign};