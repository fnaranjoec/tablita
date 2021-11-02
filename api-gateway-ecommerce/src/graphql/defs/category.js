const category = `
        category_id: String!
        category_name: String!
        category_slug: String!
        category_desc: String!
        category_status: String!
        category_created: DateTime!
        medias(filter: _MediaFilter): [Media!]
`;

export { category} ;