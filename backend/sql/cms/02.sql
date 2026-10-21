
DROP TABLE IF EXISTS cms_country;
CREATE TABLE cms_country (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  code          VARCHAR(8)   NOT NULL                COMMENT '国家/地区代码 HK/SG/US',
  name          VARCHAR(50)  NOT NULL                COMMENT '中文名称',
  en_name       VARCHAR(50)  NOT NULL                COMMENT '英文名称',
  icon_url      VARCHAR(255)          DEFAULT NULL   COMMENT '图标 object key',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '排序(小在前)',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1启用 0停用(字典 cms_common_status)',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除 0否 1是',
  created_by    VARCHAR(64)           DEFAULT 'admin' COMMENT '创建人',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_by    VARCHAR(64)           DEFAULT NULL   COMMENT '更新人',
  updated_at    DATETIME              DEFAULT NULL   ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='国家地区(中英双语)';
