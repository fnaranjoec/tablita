TYPE=VIEW
query=select `metrics`.`category_id` AS `category_id`,`metrics`.`category_name` AS `category_name`,`metrics`.`brand_id` AS `brand_id`,`metrics`.`brand_name` AS `brand_name`,`metrics`.`product_id` AS `product_id`,`metrics`.`product_name` AS `product_name`,`metrics`.`media_id` AS `media_id`,`metrics`.`media_name` AS `media_name`,sum(`metrics`.`coupons_generated`) AS `coupons_generated`,sum(`metrics`.`coupons_redimed`) AS `coupons_redimed`,sum(`metrics`.`coupons_expired`) AS `coupons_expired` from (select `c`.`category_id` AS `category_id`,`c`.`category_name` AS `category_name`,`c`.`brand_id` AS `brand_id`,`c`.`brand_name` AS `brand_name`,`c`.`product_id` AS `product_id`,`c`.`product_name` AS `product_name`,`c`.`media_id` AS `media_id`,`c`.`media_name` AS `media_name`,count(`c`.`coupon_id`) AS `coupons_generated`,0 AS `coupons_redimed`,0 AS `coupons_expired` from `tablita`.`vwCoupon` `c` where (`c`.`coupon_status` <> \'X\') group by `c`.`category_id`,`c`.`category_name`,`c`.`brand_id`,`c`.`brand_name`,`c`.`product_id`,`c`.`product_name`,`c`.`media_id`,`c`.`media_name` union all select `c`.`category_id` AS `category_id`,`c`.`category_name` AS `category_name`,`c`.`brand_id` AS `brand_id`,`c`.`brand_name` AS `brand_name`,`c`.`product_id` AS `product_id`,`c`.`product_name` AS `product_name`,`c`.`media_id` AS `media_id`,`c`.`media_name` AS `media_name`,0 AS `coupons_generated`,count(`c`.`coupon_id`) AS `coupons_redimed`,0 AS `coupons_expired` from `tablita`.`vwCoupon` `c` where (`c`.`coupon_status` = \'R\') group by `c`.`category_id`,`c`.`category_name`,`c`.`brand_id`,`c`.`brand_name`,`c`.`product_id`,`c`.`product_name`,`c`.`media_id`,`c`.`media_name` union all select `c`.`category_id` AS `category_id`,`c`.`category_name` AS `category_name`,`c`.`brand_id` AS `brand_id`,`c`.`brand_name` AS `brand_name`,`c`.`product_id` AS `product_id`,`c`.`product_name` AS `product_name`,`c`.`media_id` AS `media_id`,`c`.`media_name` AS `media_name`,0 AS `coupons_generated`,0 AS `coupons_redimed`,count(`c`.`coupon_id`) AS `coupons_expired` from `tablita`.`vwCoupon` `c` where (`c`.`coupon_expire` < now()) group by `c`.`category_id`,`c`.`category_name`,`c`.`brand_id`,`c`.`brand_name`,`c`.`product_id`,`c`.`product_name`,`c`.`media_id`,`c`.`media_name`) `metrics` group by `metrics`.`category_id`,`metrics`.`category_name`,`metrics`.`brand_id`,`metrics`.`brand_name`,`metrics`.`product_id`,`metrics`.`product_name`,`metrics`.`media_id`,`metrics`.`media_name`
md5=fc7be36ca95e55a570890faf1a237730
updatable=0
algorithm=0
definer_user=root
definer_host=%
suid=1
with_check_option=0
timestamp=2021-06-04 23:21:31
create-version=1
source=select 
client_cs_name=latin1
connection_cl_name=latin1_swedish_ci
view_body_utf8=select `metrics`.`category_id` AS `category_id`,`metrics`.`category_name` AS `category_name`,`metrics`.`brand_id` AS `brand_id`,`metrics`.`brand_name` AS `brand_name`,`metrics`.`product_id` AS `product_id`,`metrics`.`product_name` AS `product_name`,`metrics`.`media_id` AS `media_id`,`metrics`.`media_name` AS `media_name`,sum(`metrics`.`coupons_generated`) AS `coupons_generated`,sum(`metrics`.`coupons_redimed`) AS `coupons_redimed`,sum(`metrics`.`coupons_expired`) AS `coupons_expired` from (select `c`.`category_id` AS `category_id`,`c`.`category_name` AS `category_name`,`c`.`brand_id` AS `brand_id`,`c`.`brand_name` AS `brand_name`,`c`.`product_id` AS `product_id`,`c`.`product_name` AS `product_name`,`c`.`media_id` AS `media_id`,`c`.`media_name` AS `media_name`,count(`c`.`coupon_id`) AS `coupons_generated`,0 AS `coupons_redimed`,0 AS `coupons_expired` from `tablita`.`vwCoupon` `c` where (`c`.`coupon_status` <> \'X\') group by `c`.`category_id`,`c`.`category_name`,`c`.`brand_id`,`c`.`brand_name`,`c`.`product_id`,`c`.`product_name`,`c`.`media_id`,`c`.`media_name` union all select `c`.`category_id` AS `category_id`,`c`.`category_name` AS `category_name`,`c`.`brand_id` AS `brand_id`,`c`.`brand_name` AS `brand_name`,`c`.`product_id` AS `product_id`,`c`.`product_name` AS `product_name`,`c`.`media_id` AS `media_id`,`c`.`media_name` AS `media_name`,0 AS `coupons_generated`,count(`c`.`coupon_id`) AS `coupons_redimed`,0 AS `coupons_expired` from `tablita`.`vwCoupon` `c` where (`c`.`coupon_status` = \'R\') group by `c`.`category_id`,`c`.`category_name`,`c`.`brand_id`,`c`.`brand_name`,`c`.`product_id`,`c`.`product_name`,`c`.`media_id`,`c`.`media_name` union all select `c`.`category_id` AS `category_id`,`c`.`category_name` AS `category_name`,`c`.`brand_id` AS `brand_id`,`c`.`brand_name` AS `brand_name`,`c`.`product_id` AS `product_id`,`c`.`product_name` AS `product_name`,`c`.`media_id` AS `media_id`,`c`.`media_name` AS `media_name`,0 AS `coupons_generated`,0 AS `coupons_redimed`,count(`c`.`coupon_id`) AS `coupons_expired` from `tablita`.`vwCoupon` `c` where (`c`.`coupon_expire` < now()) group by `c`.`category_id`,`c`.`category_name`,`c`.`brand_id`,`c`.`brand_name`,`c`.`product_id`,`c`.`product_name`,`c`.`media_id`,`c`.`media_name`) `metrics` group by `metrics`.`category_id`,`metrics`.`category_name`,`metrics`.`brand_id`,`metrics`.`brand_name`,`metrics`.`product_id`,`metrics`.`product_name`,`metrics`.`media_id`,`metrics`.`media_name`