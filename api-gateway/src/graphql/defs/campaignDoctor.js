const campaignDoctor = `
        campaign_doctor_id: String!
        campaign_id: String!
        doctor_id: String!
        code_type_id: String!
        campaign_doctor_code: String!
        campaign_doctor_status: String!
        campaign_doctor_created: DateTime!
        
        doctor: Doctor
        campaign: Campaign
`;

export { campaignDoctor};