const brand = `
        brand_id: String!
        brand_name: String!
        brand_slug: String!
        brand_desc: String!
        brand_prefix: String!
        brand_picture: String!
        brand_status: String!
        brand_created: DateTime!
        customer_id: String!
        customer: Customer!
        products: [Product!]
`;

export { brand} ;