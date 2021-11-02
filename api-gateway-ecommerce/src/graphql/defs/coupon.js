const coupon = `
        coupon_id: String!
        media_product_id: String!
        commerce_type_id: String
        consummer_id: String!
        coupon_codebar: String!
        coupon_status: String!
        coupon_created: DateTime!
        coupon_expire: DateTime!
        coupon_redimed: DateTime
        coupon_host: String
        coupon_ip: String
        coupon_latitude: Float
        coupon_longitude: Float
        coupon_device: String
        coupon_redimed_store: String!
        commerceType: CommerceType!
        consummer: Consummer!
        mediaProduct: MediaProduct!
`;

export { coupon} ;