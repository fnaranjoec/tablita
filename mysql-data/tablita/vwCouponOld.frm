TYPE=VIEW
query=select `c`.`coupon_id` AS `coupon_id`,`c`.`coupon_codebar` AS `coupon_codebar`,`c`.`coupon_created` AS `coupon_created`,`c`.`coupon_status` AS `coupon_status`,`c`.`coupon_redimed` AS `coupon_redimed`,`c`.`coupon_redimed_file` AS `coupon_redimed_file`,`c`.`coupon_expire` AS `coupon_expire`,`c`.`coupon_device` AS `coupon_device`,`c`.`coupon_host` AS `coupon_host`,`c`.`coupon_ip` AS `coupon_ip`,`c`.`coupon_latitude` AS `coupon_latitude`,`c`.`coupon_longitude` AS `coupon_longitude`,`c`.`coupon_source` AS `coupon_source`,(case when isnull(`c`.`media_product_id`) then NULL else `mp`.`media_product_id` end) AS `media_product_id`,(case when isnull(`c`.`media_product_id`) then NULL else `mp`.`media_product_code` end) AS `media_product_code`,(case when isnull(`c`.`media_product_id`) then `b2`.`brand_id` else `b`.`brand_id` end) AS `brand_id`,(case when isnull(`c`.`media_product_id`) then `b2`.`brand_name` else `b`.`brand_name` end) AS `brand_name`,(case when isnull(`c`.`media_product_id`) then `p2`.`product_id` else `p`.`product_id` end) AS `product_id`,(case when isnull(`c`.`media_product_id`) then `p2`.`product_name` else `p`.`product_name` end) AS `product_name`,(case when isnull(`c`.`media_product_id`) then \'9ff59558-287b-11eb-96a7-0242c0a8a004\' else `m`.`media_id` end) AS `media_id`,(case when isnull(`c`.`media_product_id`) then \'Doctores\' else `m`.`media_name` end) AS `media_name`,(case when isnull(`c`.`media_product_id`) then \'14673bb6-ad40-4bac-aada-5a3dea2058b8\' else `ct`.`code_type_id` end) AS `code_type_id`,(case when isnull(`c`.`media_product_id`) then \'Fidelizaci�n\' else `ct`.`code_type_name` end) AS `code_type_name`,`cmmt`.`commerce_type_id` AS `commerce_type_id`,`cmmt`.`commerce_type_name` AS `commerce_type_name`,`cs`.`consummer_id` AS `consummer_id`,`cs`.`consummer_name` AS `consummer_name`,(case when isnull(`c`.`media_product_id`) then \'b832d29a-287b-11eb-96a7-0242c0a8a004\' else `cat`.`category_id` end) AS `category_id`,(case when isnull(`c`.`media_product_id`) then \'Doctores\' else `cat`.`category_name` end) AS `category_name`,(case when isnull(`c`.`media_product_id`) then `c`.`campaign_product_id` else NULL end) AS `campaign_product_id`,(case when isnull(`c`.`media_product_id`) then `camp`.`campaign_id` else NULL end) AS `campaign_id`,(case when isnull(`c`.`media_product_id`) then `camp`.`campaign_name` else NULL end) AS `campaign_name`,(case when isnull(`c`.`media_product_id`) then `SPLIT_STR`(`c`.`coupon_source`,\',\',1) else NULL end) AS `campaign_doctor_id`,(case when isnull(`c`.`media_product_id`) then `SPLIT_STR`(`c`.`coupon_source`,\',\',3) else NULL end) AS `doctor_id`,`d`.`doctor_name` AS `doctor_name` from ((((((((((((((`tablita`.`coupon` `c` left join `tablita`.`media_product` `mp` on((`c`.`media_product_id` = `mp`.`media_product_id`))) left join `tablita`.`product` `p` on((`mp`.`product_id` = `p`.`product_id`))) left join `tablita`.`brand` `b` on((`p`.`brand_id` = `b`.`brand_id`))) left join `tablita`.`media` `m` on((`mp`.`media_id` = `m`.`media_id`))) left join `tablita`.`category` `cat` on((`m`.`category_id` = `cat`.`category_id`))) left join `tablita`.`code_type` `ct` on((`mp`.`code_type_id` = `ct`.`code_type_id`))) left join `tablita`.`commerce_type` `cmmt` on((`c`.`commerce_type_id` = `cmmt`.`commerce_type_id`))) left join `tablita`.`consummer` `cs` on((`c`.`consummer_id` = `cs`.`consummer_id`))) left join `tablita`.`campaign_product` `cp` on((`c`.`campaign_product_id` = `cp`.`campaign_product_id`))) left join `tablita`.`product` `p2` on((`cp`.`product_id` = `p2`.`product_id`))) left join `tablita`.`brand` `b2` on((`p2`.`brand_id` = `b2`.`brand_id`))) left join `tablita`.`campaign` `camp` on((`cp`.`campaign_id` = `camp`.`campaign_id`))) left join `tablita`.`campaign_doctor` `cd` on((`cd`.`campaign_doctor_id` = (case when isnull(`c`.`media_product_id`) then `SPLIT_STR`(`c`.`coupon_source`,\',\',1) else NULL end)))) left join `tablita`.`doctor` `d` on((`cd`.`doctor_id` = `d`.`doctor_id`))) order by `c`.`coupon_created`
md5=55535aba31adfd445c79faefe6a7d358
updatable=0
algorithm=0
definer_user=root
definer_host=%
suid=1
with_check_option=0
timestamp=2021-06-04 23:21:29
create-version=1
source=select 
client_cs_name=latin1
connection_cl_name=latin1_swedish_ci
view_body_utf8=select `c`.`coupon_id` AS `coupon_id`,`c`.`coupon_codebar` AS `coupon_codebar`,`c`.`coupon_created` AS `coupon_created`,`c`.`coupon_status` AS `coupon_status`,`c`.`coupon_redimed` AS `coupon_redimed`,`c`.`coupon_redimed_file` AS `coupon_redimed_file`,`c`.`coupon_expire` AS `coupon_expire`,`c`.`coupon_device` AS `coupon_device`,`c`.`coupon_host` AS `coupon_host`,`c`.`coupon_ip` AS `coupon_ip`,`c`.`coupon_latitude` AS `coupon_latitude`,`c`.`coupon_longitude` AS `coupon_longitude`,`c`.`coupon_source` AS `coupon_source`,(case when isnull(`c`.`media_product_id`) then NULL else `mp`.`media_product_id` end) AS `media_product_id`,(case when isnull(`c`.`media_product_id`) then NULL else `mp`.`media_product_code` end) AS `media_product_code`,(case when isnull(`c`.`media_product_id`) then `b2`.`brand_id` else `b`.`brand_id` end) AS `brand_id`,(case when isnull(`c`.`media_product_id`) then `b2`.`brand_name` else `b`.`brand_name` end) AS `brand_name`,(case when isnull(`c`.`media_product_id`) then `p2`.`product_id` else `p`.`product_id` end) AS `product_id`,(case when isnull(`c`.`media_product_id`) then `p2`.`product_name` else `p`.`product_name` end) AS `product_name`,(case when isnull(`c`.`media_product_id`) then \'9ff59558-287b-11eb-96a7-0242c0a8a004\' else `m`.`media_id` end) AS `media_id`,(case when isnull(`c`.`media_product_id`) then \'Doctores\' else `m`.`media_name` end) AS `media_name`,(case when isnull(`c`.`media_product_id`) then \'14673bb6-ad40-4bac-aada-5a3dea2058b8\' else `ct`.`code_type_id` end) AS `code_type_id`,(case when isnull(`c`.`media_product_id`) then \'Fidelización\' else `ct`.`code_type_name` end) AS `code_type_name`,`cmmt`.`commerce_type_id` AS `commerce_type_id`,`cmmt`.`commerce_type_name` AS `commerce_type_name`,`cs`.`consummer_id` AS `consummer_id`,`cs`.`consummer_name` AS `consummer_name`,(case when isnull(`c`.`media_product_id`) then \'b832d29a-287b-11eb-96a7-0242c0a8a004\' else `cat`.`category_id` end) AS `category_id`,(case when isnull(`c`.`media_product_id`) then \'Doctores\' else `cat`.`category_name` end) AS `category_name`,(case when isnull(`c`.`media_product_id`) then `c`.`campaign_product_id` else NULL end) AS `campaign_product_id`,(case when isnull(`c`.`media_product_id`) then `camp`.`campaign_id` else NULL end) AS `campaign_id`,(case when isnull(`c`.`media_product_id`) then `camp`.`campaign_name` else NULL end) AS `campaign_name`,(case when isnull(`c`.`media_product_id`) then `SPLIT_STR`(`c`.`coupon_source`,\',\',1) else NULL end) AS `campaign_doctor_id`,(case when isnull(`c`.`media_product_id`) then `SPLIT_STR`(`c`.`coupon_source`,\',\',3) else NULL end) AS `doctor_id`,`d`.`doctor_name` AS `doctor_name` from ((((((((((((((`tablita`.`coupon` `c` left join `tablita`.`media_product` `mp` on((`c`.`media_product_id` = `mp`.`media_product_id`))) left join `tablita`.`product` `p` on((`mp`.`product_id` = `p`.`product_id`))) left join `tablita`.`brand` `b` on((`p`.`brand_id` = `b`.`brand_id`))) left join `tablita`.`media` `m` on((`mp`.`media_id` = `m`.`media_id`))) left join `tablita`.`category` `cat` on((`m`.`category_id` = `cat`.`category_id`))) left join `tablita`.`code_type` `ct` on((`mp`.`code_type_id` = `ct`.`code_type_id`))) left join `tablita`.`commerce_type` `cmmt` on((`c`.`commerce_type_id` = `cmmt`.`commerce_type_id`))) left join `tablita`.`consummer` `cs` on((`c`.`consummer_id` = `cs`.`consummer_id`))) left join `tablita`.`campaign_product` `cp` on((`c`.`campaign_product_id` = `cp`.`campaign_product_id`))) left join `tablita`.`product` `p2` on((`cp`.`product_id` = `p2`.`product_id`))) left join `tablita`.`brand` `b2` on((`p2`.`brand_id` = `b2`.`brand_id`))) left join `tablita`.`campaign` `camp` on((`cp`.`campaign_id` = `camp`.`campaign_id`))) left join `tablita`.`campaign_doctor` `cd` on((`cd`.`campaign_doctor_id` = (case when isnull(`c`.`media_product_id`) then `SPLIT_STR`(`c`.`coupon_source`,\',\',1) else NULL end)))) left join `tablita`.`doctor` `d` on((`cd`.`doctor_id` = `d`.`doctor_id`))) order by `c`.`coupon_created`