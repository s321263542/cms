
CREATE TABLE cms_audit_log (
  audit_id      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '审计ID',
  ref_table     VARCHAR(64)     NULL COMMENT '目标内容表，系统级操作可空',
  ref_id        BIGINT UNSIGNED NULL COMMENT '目标内容行ID',
  ref_title     VARCHAR(255)    NULL COMMENT '目标标题快照（内容删除后仍可读）',
  action        VARCHAR(32)     NOT NULL COMMENT '动作，字典 cms_audit_action',
  status_from   VARCHAR(32)     NULL COMMENT '变更前状态标签',
  status_to     VARCHAR(32)     NULL COMMENT '变更后状态标签',
  field_changes JSON            NULL COMMENT '字段级改动 [{"field":"公司全称","before":"..","after":".."}]',
  operator      VARCHAR(64)     NOT NULL COMMENT '操作人 sys_user.user_name',
  operator_ip   VARCHAR(64)     NULL COMMENT '操作IP',
  operated_at   DATETIME        NOT NULL COMMENT '操作时间',
  PRIMARY KEY (audit_id),
  KEY idx_ref (ref_table, ref_id, operated_at),
  KEY idx_op (operator, operated_at),
  KEY idx_action (action, operated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='CMS 内容操作审计（字段级留痕）';
