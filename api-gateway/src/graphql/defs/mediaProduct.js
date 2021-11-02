const mediaProduct = `
        media_product_id: String!
        media_id: String!
        product_id: String!
        code_type_id: String!
        media_product_desc: String!
        media_product_code: String
        media_product_picture: String!
        media_product_status: String!
        media_product_created: DateTime!
        media_product_expire: DateTime!
        media_product_descto: Float!
        
        media: Media
        product: Product
        codeType: CodeType
        coupons: [Coupon!]
`;

export { mediaProduct} ;