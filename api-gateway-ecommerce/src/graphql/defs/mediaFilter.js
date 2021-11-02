const mediaFilter = `

      media_id: String
      media_id_not: String
      media_id_in: [String!]
      media_id_notIn: [String!]
      media_id_like: String
      media_id_notLike: String
      media_id_substring: String
      media_id_startsWith: String
      media_id_endsWith: String
      media_id_notSubstring: String
      media_id_notStartsWith: String
      media_id_notEndsWith: String

      category_id: String
      category_id_not: String
      category_id_in: [String!]
      category_id_notIn: [String!]
      category_id_like: String
      category_id_notLike: String
      category_id_substring: String
      category_id_startsWith: String
      category_id_endsWith: String
      category_id_notSubstring: String
      category_id_notStartsWith: String
      category_id_notEndsWith: String

      media_name: String
      media_name_not: String
      media_name_in: [String!]
      media_name_notIn: [String!]
      media_name_like: String
      media_name_notLike: String
      media_name_substring: String
      media_name_startsWith: String
      media_name_endsWith: String
      media_name_notSubstring: String
      media_name_notStartsWith: String
      media_name_notEndsWith: String

      media_desc: String
      media_desc_not: String
      media_desc_in: [String!]
      media_desc_notIn: [String!]
      media_desc_like: String
      media_desc_notLike: String
      media_desc_substring: String
      media_desc_startsWith: String
      media_desc_endsWith: String
      media_desc_notSubstring: String
      media_desc_notStartsWith: String
      media_desc_notEndsWith: String

      media_slug: String
      media_slug_not: String
      media_slug_in: [String!]
      media_slug_notIn: [String!]
      media_slug_like: String
      media_slug_notLike: String
      media_slug_substring: String
      media_slug_startsWith: String
      media_slug_endsWith: String
      media_slug_notSubstring: String
      media_slug_notStartsWith: String
      media_slug_notEndsWith: String

      media_picture: String
      media_picture_not: String
      media_picture_in: [String!]
      media_picture_notIn: [String!]
      media_picture_like: String
      media_picture_notLike: String
      media_picture_substring: String
      media_picture_startsWith: String
      media_picture_endsWith: String
      media_picture_notSubstring: String
      media_picture_notStartsWith: String
      media_picture_notEndsWith: String
      
      media_status: String
      media_status_not: String
      media_status_in: [String!]
      media_status_notIn: [String!]
      media_status_like: String
      media_status_notLike: String
      media_status_substring: String
      media_status_startsWith: String
      media_status_endsWith: String
      media_status_notSubstring: String
      media_status_notStartsWith: String
      media_status_notEndsWith: String
      
      media_created: String
      media_created_between: [String!]
      media_created_notBetween: [String!]
      media_created_greatherThan: String
      media_created_lessThan: String
      media_created_greatherThanOrEqual: String
      media_created_lessThanOrEqual: String
       
`;

export { mediaFilter} ;