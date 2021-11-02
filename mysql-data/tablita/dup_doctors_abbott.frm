TYPE=VIEW
query=select `cd`.`doctor_id` AS `doctor_id` from (`tablita`.`campaign_doctor` `cd` join `tablita`.`doctor` `d` on((`cd`.`doctor_id` = `d`.`doctor_id`))) where (`cd`.`campaign_doctor_code` in (select `tablita`.`campaign_doctor`.`campaign_doctor_code` from `tablita`.`campaign_doctor` where (`tablita`.`campaign_doctor`.`campaign_id` = \'5e564bab-c472-4290-abff-4740f405d8e7\') group by `tablita`.`campaign_doctor`.`campaign_doctor_code` having (count(`tablita`.`campaign_doctor`.`campaign_doctor_code`) > 1)) and (`d`.`doctor_email` like \'%@abbott.com%\'))
md5=861c4e7aedb731783ec1d60142ea6863
updatable=1
algorithm=0
definer_user=root
definer_host=%
suid=1
with_check_option=0
timestamp=2021-06-04 23:21:29
create-version=1
source=select \n `cd`.`doctor_id` AS `doctor_id` \n from \n (`campaign_doctor` `cd` join `doctor` `d` on((`cd`.`doctor_id` = `d`.`doctor_id`))) \n where \n (`cd`.`campaign_doctor_code` in (\n select \n `campaign_doctor`.`campaign_doctor_code` \n from \n `campaign_doctor` \n where \n (`campaign_doctor`.`campaign_id` = \'5e564bab-c472-4290-abff-4740f405d8e7\') \n group by \n `campaign_doctor`.`campaign_doctor_code` \n having \n (count(`campaign_doctor`.`campaign_doctor_code`) > 1)) and (`d`.`doctor_email` like \'%@abbott.com%\'))
client_cs_name=latin1
connection_cl_name=latin1_swedish_ci
view_body_utf8=select `cd`.`doctor_id` AS `doctor_id` from (`tablita`.`campaign_doctor` `cd` join `tablita`.`doctor` `d` on((`cd`.`doctor_id` = `d`.`doctor_id`))) where (`cd`.`campaign_doctor_code` in (select `tablita`.`campaign_doctor`.`campaign_doctor_code` from `tablita`.`campaign_doctor` where (`tablita`.`campaign_doctor`.`campaign_id` = \'5e564bab-c472-4290-abff-4740f405d8e7\') group by `tablita`.`campaign_doctor`.`campaign_doctor_code` having (count(`tablita`.`campaign_doctor`.`campaign_doctor_code`) > 1)) and (`d`.`doctor_email` like \'%@abbott.com%\'))
