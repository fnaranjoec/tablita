const usersession = `
        session_id: String!
        user_id: String!
        session_token: String!
        session_status: String!
        session_created: DateTime!
        session_expire: DateTime!
        user: User!
`;

export { usersession };