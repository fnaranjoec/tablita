const campaignProductFilter = `

      campaign_product_id: String
      campaign_product_id_not: String
      campaign_product_id_in: [String!]
      campaign_product_id_notIn: [String!]
      campaign_product_id_like: String
      campaign_product_id_notLike: String
      campaign_product_id_substring: String
      campaign_product_id_startsWith: String
      campaign_product_id_endsWith: String
      campaign_product_id_notSubstring: String
      campaign_product_id_notStartsWith: String
      campaign_product_id_notEndsWith: String

      campaign_id: String
      campaign_id_not: String
      campaign_id_in: [String!]
      campaign_id_notIn: [String!]
      campaign_id_like: String
      campaign_id_notLike: String
      campaign_id_substring: String
      campaign_id_startsWith: String
      campaign_id_endsWith: String
      campaign_id_notSubstring: String
      campaign_id_notStartsWith: String
      campaign_id_notEndsWith: String

      campaign_product_descto: Float
      campaign_product_descto_between: [Float!]
      campaign_product_descto_notBetween: [Float!]
      campaign_product_descto_greatherThan: Float
      campaign_product_descto_lessThan: Float
      campaign_product_descto_greatherThanOrEqual: Float
      campaign_product_descto_lessThanOrEqual: Float
      
      product_id: String
      product_id_not: String
      product_id_in: [String!]
      product_id_notIn: [String!]
      product_id_like: String
      product_id_notLike: String
      product_id_substring: String
      product_id_startsWith: String
      product_id_endsWith: String
      product_id_notSubstring: String
      product_id_notStartsWith: String
      product_id_notEndsWith: String

      campaign_product_status: String
      campaign_product_status_not: String
      campaign_product_status_in: [String!]
      campaign_product_status_notIn: [String!]
      campaign_product_status_like: String
      campaign_product_status_notLike: String
      campaign_product_status_substring: String
      campaign_product_status_startsWith: String
      campaign_product_status_endsWith: String
      campaign_product_status_notSubstring: String
      campaign_product_status_notStartsWith: String
      campaign_product_status_notEndsWith: String
      
      campaign_product_created: String
      campaign_product_created_between: [String!]
      campaign_product_created_notBetween: [String!]
      campaign_product_created_greatherThan: String
      campaign_product_created_lessThan: String
      campaign_product_created_greatherThanOrEqual: String
      campaign_product_created_lessThanOrEqual: String

`;

export {campaignProductFilter};