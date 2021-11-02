const userFilter = `

      user_id: String
      user_id_not: String
      user_id_in: [String!]
      user_id_notIn: [String!]
      user_id_like: String
      user_id_notLike: String
      user_id_substring: String
      user_id_startsWith: String
      user_id_endsWith: String
      user_id_notSubstring: String
      user_id_notStartsWith: String
      user_id_notEndsWith: String

      user_name: String
      user_name_not: String
      user_name_in: [String!]
      user_name_notIn: [String!]
      user_name_like: String
      user_name_notLike: String
      user_name_substring: String
      user_name_startsWith: String
      user_name_endsWith: String
      user_name_notSubstring: String
      user_name_notStartsWith: String
      user_name_notEndsWith: String

      user_email: String
      user_email_not: String
      user_email_in: [String!]
      user_email_notIn: [String!]
      user_email_like: String
      user_email_notLike: String
      user_email_substring: String
      user_email_startsWith: String
      user_email_endsWith: String
      user_email_notSubstring: String
      user_email_notStartsWith: String
      user_email_notEndsWith: String
      
      user_phone: String
      user_phone_not: String
      user_phone_in: [String!]
      user_phone_notIn: [String!]
      user_phone_like: String
      user_phone_notLike: String
      user_phone_substring: String
      user_phone_startsWith: String
      user_phone_endsWith: String
      user_phone_notSubstring: String
      user_phone_notStartsWith: String
      user_phone_notEndsWith: String

      user_status: String
      user_status_not: String
      user_status_in: [String!]
      user_status_notIn: [String!]
      user_status_like: String
      user_status_notLike: String
      user_status_substring: String
      user_status_startsWith: String
      user_status_endsWith: String
      user_status_notSubstring: String
      user_status_notStartsWith: String
      user_status_notEndsWith: String
      
      user_created: String
      user_created_between: [String!]
      user_created_notBetween: [String!]
      user_created_greatherThan: String
      user_created_lessThan: String
      user_created_greatherThanOrEqual: String
      user_created_lessThanOrEqual: String
       
`;

export { userFilter };