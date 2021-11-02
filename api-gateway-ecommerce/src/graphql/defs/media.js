const media = `
        media_id: String!
        media_name: String!
        media_desc: String!
        media_slug: String!
        media_picture: String!
        media_status: String!
        media_created: DateTime!
        category_id: String!
        category: Category!
        mediaProducts: [MediaProduct!]
`;

export { media} ;