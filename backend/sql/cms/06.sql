
DROP TABLE IF EXISTS cms_banner;
CREATE TABLE cms_banner (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  position      VARCHAR(20)  NOT NULL DEFAULT 'home' COMMENT '位置(字典 cms_banner_position)',
  poster_type   VARCHAR(20)  NOT NULL DEFAULT 'cr'   COMMENT '画卷主题(字典 cms_poster_type): cr/bank/cpa/image',
  image_url     VARCHAR(255)          DEFAULT NULL   COMMENT '上传图片 object key;poster_type=image 时必填,其余留空',
  tag           VARCHAR(80)           DEFAULT NULL   COMMENT '角标文案 如:🇭🇰 香港公司设立 · 2026合规新规',
  title         VARCHAR(150) NOT NULL                COMMENT '主标题 如:香港·公司设立',
  `desc`          VARCHAR(500)          DEFAULT NULL   COMMENT '详细业务描述',
  price_text    VARCHAR(80)           DEFAULT NULL   COMMENT '价格角标 如:特惠 ¥4580起',
  button_text   VARCHAR(50)           DEFAULT '获取官方办理方案' COMMENT '按钮文案',
  button_link   VARCHAR(255)          DEFAULT NULL   COMMENT '按钮链接(站内路径或外链)',
  sort_order    INT          NOT NULL DEFAULT 0      COMMENT '轮播顺序',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{"tag":"","title":"","desc":"","price_text":"","button_text":""}}',
  ext_json      JSON                             NULL   COMMENT '扩展(如画卷配色/动画参数)',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1展示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pos_status (position, status, is_deleted, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='轮播海报(文字+3D画卷)';

-- 必要时兜底：确需纯图时可用
-- UPDATE cms_banner SET poster_type='image', image_url='banners/2026/xxx.png' WHERE id=?;
