-- 19) 审计动作字典补「撤销改动」(discard)
--     前台 useContentFlow 的 FLOW_ACTION 里有 discard（撤销改动）这个动作，
--     01.sql 的初始字典漏了它 —— 日志列表按字典翻译时会露出裸码，这里补上。
--     用 SELECT ... WHERE NOT EXISTS 幂等，重复执行不会产生第二条。
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time)
SELECT 12, '撤销改动', 'discard', 'cms_audit_action', 'info', 'N', '0', 'admin', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM sys_dict_data WHERE dict_type = 'cms_audit_action' AND dict_value = 'discard'
);
