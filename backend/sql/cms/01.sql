
-- 1) 字典类型
INSERT INTO sys_dict_type (dict_name, dict_type, create_by, create_time, remark) VALUES
('通用状态',       'cms_common_status',   'admin', NOW(), 'CMS 上下架/启用停用'),
('服务大类',       'cms_service_category','admin', NOW(), '公司注册/开户/年审/商标'),
('文章类型',       'cms_article_type',    'admin', NOW(), '政策/指南/百科/关于我们'),
('线索状态',       'cms_lead_status',     'admin', NOW(), 'CRM 线索流转,与原型统一'),
('轮播位置',       'cms_banner_position', 'admin', NOW(), '首页及各专区轮播位'),
('海报画卷主题',   'cms_poster_type',     'admin', NOW(), '文字+3D画卷 的主题类型'),
('服务国家',       'cms_country_code',    'admin', NOW(), 'hk/sg/us,与 cms_country 对齐'),
('发布状态',       'cms_publish_status',  'admin', NOW(), '草稿/待审核/已发布/已下线,内容发布工作流'),
('审计动作',       'cms_audit_action',    'admin', NOW(), 'CMS 内容操作审计动作,留痕用');

-- 2) 通用状态
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '启用', '1', 'cms_common_status', 'primary', 'Y', '0', 'admin', NOW()),
(2, '停用', '0', 'cms_common_status', 'info',    'N', '0', 'admin', NOW());

-- 3) 服务大类（对齐原型：注册/开户/年审/商标）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '公司注册', 'company_reg', 'cms_service_category', 'primary', 'Y', '0', 'admin', NOW()),
(2, '银行开户', 'bank_acct',   'cms_service_category', 'success', 'N', '0', 'admin', NOW()),
(3, '年审报税', 'annual_audit','cms_service_category', 'warning', 'N', '0', 'admin', NOW()),
(4, '商标专利', 'trademark',   'cms_service_category', 'danger',  'N', '0', 'admin', NOW());

-- 4) 文章类型
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '政策解读', 'news',  'cms_article_type', 'primary', 'Y', '0', 'admin', NOW()),
(2, '办理指南', 'guide', 'cms_article_type', 'success', 'N', '0', 'admin', NOW()),
(3, '常见百科', 'faq',   'cms_article_type', 'warning', 'N', '0', 'admin', NOW()),
(4, '关于我们', 'about', 'cms_article_type', 'info',    'N', '0', 'admin', NOW()),
(5, '独立页面', 'page',  'cms_article_type', 'info',    'N', '0', 'admin', NOW());  -- 隐私政策等

-- 5) 线索状态（★ 与原型统一：待跟进/跟进中/已签约/已流失）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '待跟进', '0', 'cms_lead_status', 'warning', 'Y', '0', 'admin', NOW()),
(2, '跟进中', '1', 'cms_lead_status', 'primary', 'N', '0', 'admin', NOW()),
(3, '已签约', '2', 'cms_lead_status', 'success', 'N', '0', 'admin', NOW()),
(4, '已流失', '3', 'cms_lead_status', 'danger',  'N', '0', 'admin', NOW());

-- 6) 轮播位置
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '首页',   'home',    'cms_banner_position', 'primary', 'Y', '0', 'admin', NOW()),
(2, '公司专区','company', 'cms_banner_position', 'primary', 'N', '0', 'admin', NOW()),
(3, '银行专区','bank',    'cms_banner_position', 'primary', 'N', '0', 'admin', NOW()),
(4, '审计专区','audit',   'cms_banner_position', 'primary', 'N', '0', 'admin', NOW()),
(5, '商标专区','trademark','cms_banner_position', 'primary', 'N', '0', 'admin', NOW());

-- 7) 海报画卷主题（对齐原型：文字+3D画卷，非纯图片）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '证书画卷',   'cr',   'cms_poster_type', 'primary', 'Y', '0', 'admin', NOW()),
(2, '银行卡画卷', 'bank', 'cms_poster_type', 'success', 'N', '0', 'admin', NOW()),
(3, '审计报告画卷','cpa',  'cms_poster_type', 'warning', 'N', '0', 'admin', NOW()),
(4, '上传图片',   'image','cms_poster_type', 'info',    'N', '0', 'admin', NOW());

-- 8) 服务国家（与 cms_country 对齐）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '全球/多国', '0',  'cms_country_code', 'info',    'N', '0', 'admin', NOW()),
(2, '中国香港',  'HK', 'cms_country_code', 'primary', 'Y', '0', 'admin', NOW()),
(3, '新加坡',    'SG', 'cms_country_code', 'success', 'N', '0', 'admin', NOW()),
(4, '美国',      'US', 'cms_country_code', 'danger',  'N', '0', 'admin', NOW());

-- 9) 发布状态（★ 内容发布工作流：草稿 → 待审核 → 已发布，外加 已下线）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1, '草稿',   '0', 'cms_publish_status', 'warning', 'Y', '0', 'admin', NOW()),
(2, '待审核', '1', 'cms_publish_status', 'primary', 'N', '0', 'admin', NOW()),
(3, '已发布', '2', 'cms_publish_status', 'success', 'N', '0', 'admin', NOW()),
(4, '已下线', '3', 'cms_publish_status', 'info',    'N', '0', 'admin', NOW());

-- 10) 审计动作（cms_audit_log.action 取值，字段级留痕用）
INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, create_by, create_time) VALUES
(1,  '新建',        'create',     'cms_audit_action', 'primary', 'N', '0', 'admin', NOW()),
(2,  '保存草稿',    'save_draft', 'cms_audit_action', 'primary', 'N', '0', 'admin', NOW()),
(3,  '提交审核',    'submit',     'cms_audit_action', 'primary', 'N', '0', 'admin', NOW()),
(4,  '审核通过',    'approve',    'cms_audit_action', 'success', 'N', '0', 'admin', NOW()),
(5,  '退回草稿',    'reject',     'cms_audit_action', 'warning', 'N', '0', 'admin', NOW()),
(6,  '发布',        'publish',    'cms_audit_action', 'success', 'N', '0', 'admin', NOW()),
(7,  '下线',        'offline',    'cms_audit_action', 'warning', 'N', '0', 'admin', NOW()),
(8,  '重新上线',    'online',     'cms_audit_action', 'success', 'N', '0', 'admin', NOW()),
(9,  '回滚',        'rollback',   'cms_audit_action', 'danger',  'N', '0', 'admin', NOW()),
(10, '删除',        'delete',     'cms_audit_action', 'danger',  'N', '0', 'admin', NOW()),
(11, '重置演示数据','reset',      'cms_audit_action', 'info',    'N', '0', 'admin', NOW());
