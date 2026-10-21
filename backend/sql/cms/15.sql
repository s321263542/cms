
UPDATE cms_site_config  SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_service      SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_banner       SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_article      SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_partner_bank SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
UPDATE cms_case         SET publish_status = 2, live_flag = 1 WHERE is_deleted = 0 AND status = 1;
