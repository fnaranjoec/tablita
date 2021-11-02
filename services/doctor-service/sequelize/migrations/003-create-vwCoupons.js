// const viewName = 'vwCoupons';
const query = "CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `vwCoupons` AS \n" +
    "  select \n" +
    "    `c`.`coupon_id` AS `coupon_id`,\n" +
    "    `c`.`coupon_codebar` AS `coupon_codebar`,\n" +
    "    `c`.`coupon_created` AS `coupon_created`,\n" +
    "    `c`.`coupon_status` AS `coupon_status`,\n" +
    "    `c`.`coupon_redimed` AS `coupon_redimed`,\n" +
    "    `c`.`coupon_redimed_file` AS `coupon_redimed_file`,\n" +
    "    `mp`.`media_product_id` AS `media_product_id`,\n" +
    "    `mp`.`media_product_code` AS `media_product_code`,\n" +
    "    `b`.`brand_id` AS `brand_id`,\n" +
    "    `b`.`brand_name` AS `brand_name`,\n" +
    "    `p`.`product_id` AS `product_id`,\n" +
    "    `p`.`product_name` AS `product_name`,\n" +
    "    `m`.`media_id` AS `media_id`,\n" +
    "    `m`.`media_name` AS `media_name`,\n" +
    "    `ct`.`code_type_id` AS `code_type_id`,\n" +
    "    `ct`.`code_type_name` AS `code_type_name`,\n" +
    "    `cmmt`.`commerce_type_id` AS `commerce_type_id`,\n" +
    "    `cmmt`.`commerce_type_name` AS `commerce_type_name`,\n" +
    "    `cs`.`consummer_id` AS `consummer_id`,\n" +
    "    `cs`.`consummer_name` AS `consummer_name` \n" +
    "  from \n" +
    "    (((((((`coupon` `c` left join `media_product` `mp` on((`c`.`media_product_id` = `mp`.`media_product_id`))) left join `product` `p` on((`mp`.`product_id` = `p`.`product_id`))) left join `brand` `b` on((`p`.`brand_id` = `b`.`brand_id`))) left join `media` `m` on((`mp`.`media_id` = `m`.`media_id`))) left join `code_type` `ct` on((`mp`.`code_type_id` = `ct`.`code_type_id`))) left join `commerce_type` `cmmt` on((`c`.`commerce_type_id` = `cmmt`.`commerce_type_id`))) left join `consummer` `cs` on((`c`.`consummer_id` = `cs`.`consummer_id`))) \n" +
    "  order by \n" +
    "    `c`.`coupon_created`;" ;

module.exports.up = (queryInterface, DataTypes) => {
    const sequelize = require("sequelize");
    return queryInterface.query(`${query}`).then(()=>{});
    // return queryInterface.createTable("coupon",
    //     {
    //         coupon_id: {
    //             allowNull: false,
    //             primaryKey: true,
    //             type: DataTypes.STRING(36)
    //         },
    //         media_product_id: {
    //             allowNull: false,
    //             type: DataTypes.STRING(36),
    //             onUpdate: "CASCADE",
    //             references: {
    //                 key:"media_product_id",
    //                 model: "media_product",
    //                 as: "media_product_id",
    //             }
    //         },
    //         commerce_type_id: {
    //             allowNull: true,
    //             type: DataTypes.STRING(36),
    //             onUpdate: "CASCADE",
    //             references: {
    //                 key:"commerce_type_id",
    //                 model: "commerce_type",
    //                 as: "commerce_type_id",
    //             }
    //         },
    //         consummer_id: {
    //             allowNull: false,
    //             type: DataTypes.STRING(36),
    //             onUpdate: "CASCADE",
    //             references: {
    //                 key:"consummer_id",
    //                 model: "consummer",
    //                 as: "consummer_id",
    //             }
    //         },
    //         coupon_source: {
    //             allowNull: false,
    //             type: DataTypes.STRING(255),
    //         },
    //         coupon_codebar: {
    //             allowNull: false,
    //             type: DataTypes.STRING(20)
    //         },
    //         coupon_status: {
    //             allowNull: false,
    //             type: DataTypes.CHAR(1),
    //             defaultValue: "A"
    //         },
    //         coupon_created: {
    //             allowNull: false,
    //             type: "TIMESTAMP",
    //             defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
    //         },
    //         coupon_expire: {
    //             allowNull: false,
    //             type: DataTypes.DATE,
    //         },
    //         coupon_redimed: {
    //             allowNull: true,
    //             type: DataTypes.DATE,
    //         },
    //         coupon_host: {
    //             allowNull: true,
    //             type: DataTypes.CHAR(20),
    //         },
    //         coupon_ip: {
    //             allowNull: true,
    //             type: DataTypes.CHAR(20),
    //         },
    //         coupon_latitude: {
    //             allowNull: true,
    //             type: DataTypes.FLOAT,
    //             defaultValue: 0.000000
    //         },
    //         coupon_longitude: {
    //             allowNull: true,
    //             type: DataTypes.FLOAT,
    //             defaultValue: 0.000000
    //         },
    //         coupon_device: {
    //             allowNull: true,
    //             type: DataTypes.CHAR(20),
    //         },
    //         coupon_redimed_file: {
    //             allowNull: true,
    //             type: DataTypes.STRING(500),
    //         },
    //
    //     },
    //     {
    //         charset: "utf8"
    //     }
    // ).then(() => {
    //     return queryInterface.sequelize.query(`ALTER TABLE coupon ADD UNIQUE INDEX coupon_codebar (coupon_codebar)`);
    // })

};
