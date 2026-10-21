-- 出厂重置脚本 · 第一步：清空内容与痕迹
-- 对应后台「重置数据」按钮 —— 用户的答复是：重灌出厂内容，日志与版本一起清，
-- 首场演示从干净状态开始；客户留资线索（cms_lead）不清。
-- 与 tools/truncate.sql 同源，这里多清两张工作流痕迹表。
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE cms_country;
TRUNCATE TABLE cms_site_config;
TRUNCATE TABLE cms_banner;
TRUNCATE TABLE cms_service;
TRUNCATE TABLE cms_partner_bank;
TRUNCATE TABLE cms_case;
TRUNCATE TABLE cms_article;
TRUNCATE TABLE cms_content_version;
TRUNCATE TABLE cms_audit_log;
SET FOREIGN_KEY_CHECKS=1;
