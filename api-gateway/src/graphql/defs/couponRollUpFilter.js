const couponRollUpFilter = `
      category_name: String
      category_name_not: String
      category_name_in: [String!]
      category_name_notIn: [String!]
      category_name_like: String
      category_name_notLike: String
      category_name_substring: String
      category_name_startsWith: String
      category_name_endsWith: String
      category_name_notSubstring: String
      category_name_notStartsWith: String
      category_name_notEndsWith: String
      category_name_is: String
        
      brand_name: String
      brand_name_not: String
      brand_name_in: [String!]
      brand_name_notIn: [String!]
      brand_name_like: String
      brand_name_notLike: String
      brand_name_substring: String
      brand_name_startsWith: String
      brand_name_endsWith: String
      brand_name_notSubstring: String
      brand_name_notStartsWith: String
      brand_name_notEndsWith: String
      brand_name_is: String
        
      product_name: String
      product_name_not: String
      product_name_in: [String!]
      product_name_notIn: [String!]
      product_name_like: String
      product_name_notLike: String
      product_name_substring: String
      product_name_startsWith: String
      product_name_endsWith: String
      product_name_notSubstring: String
      product_name_notStartsWith: String
      product_name_notEndsWith: String
      product_name_is: String
        
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
      media_name_is: String
        
      coupons_generated: Int
      coupons_generated_between: [Int!]
      coupons_generated_notBetween: [Int!]
      coupons_generated_greatherThan: Int
      coupons_generated_lessThan: Int
      coupons_generated_greatherThanOrEqual: Int
      coupons_generated_lessThanOrEqual: Int
        
      coupons_redimed: Int
      coupons_redimed_between: [Int!]
      coupons_redimed_notBetween: [Int!]
      coupons_redimed_greatherThan: Int
      coupons_redimed_lessThan: Int
      coupons_redimed_greatherThanOrEqual: Int
      coupons_redimed_lessThanOrEqual: Int

      coupons_expired: Int
      coupons_expired_between: [Int!]
      coupons_expired_notBetween: [Int!]
      coupons_expired_greatherThan: Int
      coupons_expired_lessThan: Int
      coupons_expired_greatherThanOrEqual: Int
      coupons_expired_lessThanOrEqual: Int

      coupons_total: Int
      coupons_total_between: [Int!]
      coupons_total_notBetween: [Int!]
      coupons_total_greatherThan: Int
      coupons_total_lessThan: Int
      coupons_total_greatherThanOrEqual: Int
      coupons_total_lessThanOrEqual: Int
`;

export { couponRollUpFilter } ;