const doctorFilter = `

      doctor_id: String
      doctor_id_not: String
      doctor_id_in: [String!]
      doctor_id_notIn: [String!]
      doctor_id_like: String
      doctor_id_notLike: String
      doctor_id_substring: String
      doctor_id_startsWith: String
      doctor_id_endsWith: String
      doctor_id_notSubstring: String
      doctor_id_notStartsWith: String
      doctor_id_notEndsWith: String

      doctor_name: String
      doctor_name_not: String
      doctor_name_in: [String!]
      doctor_name_notIn: [String!]
      doctor_name_like: String
      doctor_name_notLike: String
      doctor_name_substring: String
      doctor_name_startsWith: String
      doctor_name_endsWith: String
      doctor_name_notSubstring: String
      doctor_name_notStartsWith: String
      doctor_name_notEndsWith: String

      doctor_email: String
      doctor_email_not: String
      doctor_email_in: [String!]
      doctor_email_notIn: [String!]
      doctor_email_like: String
      doctor_email_notLike: String
      doctor_email_substring: String
      doctor_email_startsWith: String
      doctor_email_endsWith: String
      doctor_email_notSubstring: String
      doctor_email_notStartsWith: String
      doctor_email_notEndsWith: String
      
      doctor_status: String
      doctor_status_not: String
      doctor_status_in: [String!]
      doctor_status_notIn: [String!]
      doctor_status_like: String
      doctor_status_notLike: String
      doctor_status_substring: String
      doctor_status_startsWith: String
      doctor_status_endsWith: String
      doctor_status_notSubstring: String
      doctor_status_notStartsWith: String
      doctor_status_notEndsWith: String
      
      doctor_created: String
      doctor_created_between: [String!]
      doctor_created_notBetween: [String!]
      doctor_created_greatherThan: String
      doctor_created_lessThan: String
      doctor_created_greatherThanOrEqual: String
      doctor_created_lessThanOrEqual: String

`;

export {doctorFilter};