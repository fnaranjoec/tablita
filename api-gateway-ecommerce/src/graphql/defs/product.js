const product = `
        product_id: String!
        product_name: String!
        product_slug: String!
        product_desc: String!
        product_picture: String!
        product_status: String!
        product_created: DateTime!
        product_sku: String!
        brand_id: String!
        brand: Brand!
        mediaProducts: [MediaProduct!]
`;

export { product} ;