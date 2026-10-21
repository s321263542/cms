
CREATE TABLE cms_content_version (
  version_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  ref_table     VARCHAR(64)     NOT NULL COMMENT '内容表名，如 cms_banner',
  ref_id        BIGINT UNSIGNED NOT NULL COMMENT '内容行ID',
  version_no    INT             NOT NULL COMMENT '该内容行的版本序号，从1递增',
  snapshot_json JSON            NOT NULL COMMENT '发布时的完整内容快照（回滚数据源）',
  op_type       VARCHAR(16)     NOT NULL COMMENT 'publish 发布 / rollback 回滚',
  op_note       VARCHAR(255)    NULL COMMENT '发布/回滚说明',
  operator      VARCHAR(64)     NOT NULL COMMENT '操作人 sys_user.user_name',
  operated_at   DATETIME        NOT NULL COMMENT '操作时间',
  PRIMARY KEY (version_id),
  UNIQUE KEY uk_ref_ver (ref_table, ref_id, version_no),
  KEY idx_ref (ref_table, ref_id, operated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='内容版本快照（发布/回滚留痕）';
