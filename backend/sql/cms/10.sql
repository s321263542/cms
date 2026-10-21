
DROP TABLE IF EXISTS cms_case;
CREATE TABLE cms_case (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  country_id    BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=通用',
  service_id    BIGINT                DEFAULT NULL   COMMENT '关联服务ID(应用层校验)',
  company_name  VARCHAR(120) NOT NULL                COMMENT '客户公司名',
  service_title VARCHAR(150) NOT NULL                COMMENT '服务名称',
  cost_text     VARCHAR(80)           DEFAULT NULL   COMMENT '费用 如:总费用 ¥12,800',
  time_text     VARCHAR(80)           DEFAULT NULL   COMMENT '周期 如:用时 3个工作日',
  quote_text    VARCHAR(500)          DEFAULT NULL   COMMENT '客户评价',
  portrait_url  VARCHAR(255)          DEFAULT NULL   COMMENT '客户头像 object key(可空)',
  content       MEDIUMTEXT                     NULL   COMMENT '正文(Jsoup 过滤)',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '排序',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{...同名字段}}',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1展示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_list (status, is_deleted, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='成功案例';
