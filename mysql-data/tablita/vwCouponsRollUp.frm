TYPE=VIEW
query=select `c`.`category_name` AS `category_name`,`c`.`media_name` AS `media_name`,`c`.`brand_name` AS `brand_name`,`c`.`product_name` AS `product_name`,count((case when (`c`.`coupon_status` <> \'X\') then `c`.`coupon_id` else NULL end)) AS `coupons_generated`,count((case when (`c`.`coupon_status` = \'R\') then `c`.`coupon_id` else NULL end)) AS `coupons_redimed`,count((case when ((`c`.`coupon_expire` < now()) and (`c`.`coupon_status` not in (\'X\',\'R\'))) then `c`.`coupon_id` else NULL end)) AS `coupons_expired`,count(`c`.`coupon_id`) AS `coupons_total` from `tablita`.`vwCoupon` `c` where (`c`.`media_product_id` is not null) group by `c`.`category_name`,`c`.`media_name`,`c`.`brand_name`,`c`.`product_name` with rollup
md5=fccf06db0f13c163f6f6eeea1f867ed1
updatable=0
algorithm=0
definer_user=root
definer_host=%
suid=1
with_check_option=0
timestamp=2021-06-04 23:21:30
create-version=1
source=select \n `c`.`category_name` AS `category_name`,\n `c`.`media_name` AS `media_name`,\n `c`.`brand_name` AS `brand_name`,\n `c`.`product_name` AS `product_name`,\n count((case when (`c`.`coupon_status` <> \'X\') then `c`.`coupon_id` else NULL end)) AS `coupons_generated`,\n count((case when (`c`.`coupon_status` = \'R\') then `c`.`coupon_id` else NULL end)) AS `coupons_redimed`,\n count((case when ((`c`.`coupon_expire` < now()) and (`c`.`coupon_status` not in (\'X\',\'R\'))) then `c`.`coupon_id` else NULL end)) AS `coupons_expired`,\n count(`c`.`coupon_id`) AS `coupons_total` \n from \n `vwCoupon` `c` \n where \n (`c`.`media_product_id` is not null) \n group by \n `c`.`category_name`,`c`.`media_name`,`c`.`brand_name`,`c`.`product_name` with rollup
client_cs_name=latin1
connection_cl_name=latin1_swedish_ci
view_body_utf8=select `c`.`category_name` AS `category_name`,`c`.`media_name` AS `media_name`,`c`.`brand_name` AS `brand_name`,`c`.`product_name` AS `product_name`,count((case when (`c`.`coupon_status` <> \'X\') then `c`.`coupon_id` else NULL end)) AS `coupons_generated`,count((case when (`c`.`coupon_status` = \'R\') then `c`.`coupon_id` else NULL end)) AS `coupons_redimed`,count((case when ((`c`.`coupon_expire` < now()) and (`c`.`coupon_status` not in (\'X\',\'R\'))) then `c`.`coupon_id` else NULL end)) AS `coupons_expired`,count(`c`.`coupon_id`) AS `coupons_total` from `tablita`.`vwCoupon` `c` where (`c`.`media_product_id` is not null) group by `c`.`category_name`,`c`.`media_name`,`c`.`brand_name`,`c`.`product_name` with rollup
