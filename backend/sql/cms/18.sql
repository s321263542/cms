-- 补齐：bank / case 缺 ext_json（前台用它存 badge / cert 等扩展，不新增表）
ALTER TABLE cms_partner_bank ADD COLUMN ext_json JSON NULL COMMENT '扩展字段(如 badge/period)' AFTER i18n_json;
ALTER TABLE cms_case         ADD COLUMN ext_json JSON NULL COMMENT '扩展字段(如 cert 凭证编号)' AFTER i18n_json;
