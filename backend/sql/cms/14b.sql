ALTER TABLE cms_banner
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';

-- ④ cms_article — 文章（★ §4.5 已有 published_at 列，复用该列，不重复添加）

ALTER TABLE cms_article
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）';

-- ⑤ cms_partner_bank — 合作银行

ALTER TABLE cms_partner_bank
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';

-- ⑥ cms_case — 成功案例

ALTER TABLE cms_case
  ADD COLUMN publish_status  TINYINT      NOT NULL DEFAULT 0 COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  ADD COLUMN live_flag       TINYINT      NOT NULL DEFAULT 0 COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  ADD COLUMN draft_json      JSON              NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  ADD COLUMN live_version_id BIGINT UNSIGNED   NULL COMMENT '当前生效版本 cms_content_version.version_id',
  ADD COLUMN submitted_by    VARCHAR(64)       NULL COMMENT '提交审核人',
  ADD COLUMN submitted_at    DATETIME          NULL COMMENT '提交审核时间',
  ADD COLUMN published_by    VARCHAR(64)       NULL COMMENT '发布人（责任落点）',
  ADD COLUMN published_at    DATETIME          NULL COMMENT '发布时间';
