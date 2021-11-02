const campaignFilter = `

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

      campaign_name: String
      campaign_name_not: String
      campaign_name_in: [String!]
      campaign_name_notIn: [String!]
      campaign_name_like: String
      campaign_name_notLike: String
      campaign_name_substring: String
      campaign_name_startsWith: String
      campaign_name_endsWith: String
      campaign_name_notSubstring: String
      campaign_name_notStartsWith: String
      campaign_name_notEndsWith: String

      campaign_slug: String
      campaign_slug_not: String
      campaign_slug_in: [String!]
      campaign_slug_notIn: [String!]
      campaign_slug_like: String
      campaign_slug_notLike: String
      campaign_slug_substring: String
      campaign_slug_startsWith: String
      campaign_slug_endsWith: String
      campaign_slug_notSubstring: String
      campaign_slug_notStartsWith: String
      campaign_slug_notEndsWith: String
      
      campaign_prefix: String
      campaign_prefix_not: String
      campaign_prefix_in: [String!]
      campaign_prefix_notIn: [String!]
      campaign_prefix_like: String
      campaign_prefix_notLike: String
      campaign_prefix_substring: String
      campaign_prefix_startsWith: String
      campaign_prefix_endsWith: String
      campaign_prefix_notSubstring: String
      campaign_prefix_notStartsWith: String
      campaign_prefix_notEndsWith: String
      
      campaign_desc: String
      campaign_desc_not: String
      campaign_desc_in: [String!]
      campaign_desc_notIn: [String!]
      campaign_desc_like: String
      campaign_desc_notLike: String
      campaign_desc_substring: String
      campaign_desc_startsWith: String
      campaign_desc_endsWith: String
      campaign_desc_notSubstring: String
      campaign_desc_notStartsWith: String
      campaign_desc_notEndsWith: String
      
      campaign_picture: String
      campaign_picture_not: String
      campaign_picture_in: [String!]
      campaign_picture_notIn: [String!]
      campaign_picture_like: String
      campaign_picture_notLike: String
      campaign_picture_substring: String
      campaign_picture_startsWith: String
      campaign_picture_endsWith: String
      campaign_picture_notSubstring: String
      campaign_picture_notStartsWith: String
      campaign_picture_notEndsWith: String
      
      campaign_expire: String
      campaign_expire_between: [String!]
      campaign_expire_notBetween: [String!]
      campaign_expire_greatherThan: String
      campaign_expire_lessThan: String
      campaign_expire_greatherThanOrEqual: String
      campaign_expire_lessThanOrEqual: String

      campaign_status: String
      campaign_status_not: String
      campaign_status_in: [String!]
      campaign_status_notIn: [String!]
      campaign_status_like: String
      campaign_status_notLike: String
      campaign_status_substring: String
      campaign_status_startsWith: String
      campaign_status_endsWith: String
      campaign_status_notSubstring: String
      campaign_status_notStartsWith: String
      campaign_status_notEndsWith: String
      
      campaign_created: String
      campaign_created_between: [String!]
      campaign_created_notBetween: [String!]
      campaign_created_greatherThan: String
      campaign_created_lessThan: String
      campaign_created_greatherThanOrEqual: String
      campaign_created_lessThanOrEqual: String

`;

export {campaignFilter};