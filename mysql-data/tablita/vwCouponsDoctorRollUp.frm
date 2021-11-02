TYPE=VIEW
query=select `c`.`campaign_name` AS `campaign_name`,`c`.`doctor_name` AS `doctor_name`,`c`.`product_name` AS `product_name`,count((case when (`c`.`coupon_status` <> \'X\') then `c`.`coupon_id` else NULL end)) AS `coupons_generated`,count((case when (`c`.`coupon_status` = \'R\') then `c`.`coupon_id` else NULL end)) AS `coupons_redimed`,count((case when ((`c`.`coupon_expire` < now()) and (`c`.`coupon_status` not in (\'X\',\'R\'))) then `c`.`coupon_id` else NULL end)) AS `coupons_expired`,count(`c`.`coupon_id`) AS `coupons_total` from `tablita`.`vwCoupon` `c` where (`c`.`campaign_product_id` is not null) group by `c`.`campaign_name`,`c`.`doctor_name`,`c`.`product_name` with rollup
md5=673186b2994cf2067db6c6b8559fc25c
updatable=0
algorithm=0
definer_user=root
definer_host=%
suid=1
with_check_option=0
timestamp=2021-06-04 23:21:30
create-version=1
source=select \n `c`.`campaign_name` AS `campaign_name`,\n `c`.`doctor_name` AS `doctor_name`,\n `c`.`product_name` AS `product_name`,\n count((case when (`c`.`coupon_status` <> \'X\') then `c`.`coupon_id` else NULL end)) AS `coupons_generated`,\n count((case when (`c`.`coupon_status` = \'R\') then `c`.`coupon_id` else NULL end)) AS `coupons_redimed`,\n count((case when ((`c`.`coupon_expire` < now()) and (`c`.`coupon_status` not in (\'X\',\'R\'))) then `c`.`coupon_id` else NULL end)) AS `coupons_expired`,\n count(`c`.`coupon_id`) AS `coupons_total` \n from \n `vwCoupon` `c` \n where \n (`c`.`campaign_product_id` is not null) \n group by \n `c`.`campaign_name`,`c`.`doctor_name`,`c`.`product_name` with rollup
client_cs_name=latin1
connection_cl_name=latin1_swedish_ci
view_body_utf8=select `c`.`campaign_name` AS `campaign_name`,`c`.`doctor_name` AS `doctor_name`,`c`.`product_name` AS `product_name`,count((case when (`c`.`coupon_status` <> \'X\') then `c`.`coupon_id` else NULL end)) AS `coupons_generated`,count((case when (`c`.`coupon_status` = \'R\') then `c`.`coupon_id` else NULL end)) AS `coupons_redimed`,count((case when ((`c`.`coupon_expire` < now()) and (`c`.`coupon_status` not in (\'X\',\'R\'))) then `c`.`coupon_id` else NULL end)) AS `coupons_expired`,count(`c`.`coupon_id`) AS `coupons_total` from `tablita`.`vwCoupon` `c` where (`c`.`campaign_product_id` is not null) group by `c`.`campaign_name`,`c`.`doctor_name`,`c`.`product_name` with rollup
