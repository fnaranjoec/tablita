const parameterFilter = `

      parameter_id: String
      parameter_id_not: String
      parameter_id_in: [String!]
      parameter_id_notIn: [String!]
      parameter_id_like: String
      parameter_id_notLike: String
      parameter_id_substring: String
      parameter_id_startsWith: String
      parameter_id_endsWith: String
      parameter_id_notSubstring: String
      parameter_id_notStartsWith: String
      parameter_id_notEndsWith: String

      parameter_name: String
      parameter_name_not: String
      parameter_name_in: [String!]
      parameter_name_notIn: [String!]
      parameter_name_like: String
      parameter_name_notLike: String
      parameter_name_substring: String
      parameter_name_startsWith: String
      parameter_name_endsWith: String
      parameter_name_notSubstring: String
      parameter_name_notStartsWith: String
      parameter_name_notEndsWith: String

      parameter_desc: String
      parameter_desc_not: String
      parameter_desc_in: [String!]
      parameter_desc_notIn: [String!]
      parameter_desc_like: String
      parameter_desc_notLike: String
      parameter_desc_substring: String
      parameter_desc_startsWith: String
      parameter_desc_endsWith: String
      parameter_desc_notSubstring: String
      parameter_desc_notStartsWith: String
      parameter_desc_notEndsWith: String

      parameter_value: Float
      parameter_value_not: Float
      parameter_value_in: [Float!]
      parameter_value_notIn: [Float!]
      parameter_value_like: Float
      parameter_value_notLike: Float
      parameter_value_substring: Float
      parameter_value_startsWith: Float
      parameter_value_endsWith: Float
      parameter_value_notSubstring: Float
      parameter_value_notStartsWith: Float
      parameter_value_notEndsWith: Float
      
      parameter_text: String
      parameter_text_not: String
      parameter_text_in: [String!]
      parameter_text_notIn: [String!]
      parameter_text_like: String
      parameter_text_notLike: String
      parameter_text_substring: String
      parameter_text_startsWith: String
      parameter_text_endsWith: String
      parameter_text_notSubstring: String
      parameter_text_notStartsWith: String
      parameter_text_notEndsWith: String
      
      parameter_created: String
      parameter_created_between: [String!]
      parameter_created_notBetween: [String!]
      parameter_created_greatherThan: String
      parameter_created_lessThan: String
      parameter_created_greatherThanOrEqual: String
      parameter_created_lessThanOrEqual: String
       
`;

export { parameterFilter} ;