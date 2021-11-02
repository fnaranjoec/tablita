TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`%` TRIGGER `coupon_before_ins_tr1` BEFORE INSERT ON `coupon`\n FOR EACH ROW\nBEGIN\nIF (ISNULL(new.media_product_id)) THEN\nSET new.campaign_doctor_id = SPLIT_STR(new.coupon_source, \',\',1);\n END IF;\nEND'
sql_modes=1436549152
definers='root@%'
client_cs_names='latin1'
connection_cl_names='latin1_swedish_ci'
db_cl_names='utf8mb4_unicode_ci'
created=162284905890
