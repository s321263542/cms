
DROP TABLE IF EXISTS cms_site_config;
CREATE TABLE cms_site_config (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  config_key    VARCHAR(64)  NOT NULL                COMMENT '配置键',
  config_name   VARCHAR(100) NOT NULL                COMMENT '配置名称(后台显示)',
  config_value  TEXT                                          COMMENT '配置值(支持 JSON 串)',
  value_type    VARCHAR(20)  NOT NULL DEFAULT 'string' COMMENT '值类型 string/number/boolean/json/image/color',
  group_name    VARCHAR(50)  NOT NULL DEFAULT 'base'  COMMENT '分组 base/seo/home/footer/cs',
  lang          VARCHAR(8)   NOT NULL DEFAULT 'zh'    COMMENT '语言 zh/en(双语配置各存一条)',
  is_public     TINYINT      NOT NULL DEFAULT 1      COMMENT '是否对公网 API 可见 1是 0仅后台',
  remark        VARCHAR(255)          DEFAULT NULL   COMMENT '备注(给运营的说明)',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '分组内排序',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1启用 0停用',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_config_key_lang (config_key, lang),
  KEY idx_group_public (group_name, is_public, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='全站配置(中英双语+JSON)';
