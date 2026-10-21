
DROP TABLE IF EXISTS cms_partner_bank;
CREATE TABLE cms_partner_bank (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  country_id    BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=多国',
  name          VARCHAR(100) NOT NULL                COMMENT '银行名称',
  en_name       VARCHAR(100)          DEFAULT NULL   COMMENT '英文名',
  logo_url      VARCHAR(255) NOT NULL                COMMENT 'Logo object key',
  features      VARCHAR(500)          DEFAULT NULL   COMMENT '卖点(逗号分隔)',
  success_rate  VARCHAR(20)           DEFAULT NULL   COMMENT '开户成功率 如:98.6%',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '排序',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{"name":"","en_name":"","features":"","success_rate":""}}',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1展示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_list (status, is_deleted, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='合作银行';
