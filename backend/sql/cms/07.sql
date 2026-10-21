
DROP TABLE IF EXISTS cms_article;
CREATE TABLE cms_article (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  category_type VARCHAR(30)  NOT NULL DEFAULT 'news' COMMENT '类型(字典 cms_article_type): news/guide/faq/about/page',
  country_id    BIGINT       NOT NULL DEFAULT 0      COMMENT '国家ID,0=通用/全部',
  title         VARCHAR(200) NOT NULL                COMMENT '标题(中文=默认)',
  summary       VARCHAR(500)          DEFAULT NULL   COMMENT '摘要(列表页展示)',
  cover_url     VARCHAR(255)          DEFAULT NULL   COMMENT '封面 object key',
  content       MEDIUMTEXT                     NULL   COMMENT '正文 HTML(Jsoup 白名单已过滤)',
  slug          VARCHAR(100) NOT NULL                COMMENT 'SEO URL(英文一套,如 privacy-policy)',
  author        VARCHAR(64)           DEFAULT '永鸿国际' COMMENT '作者/来源',
  views         INT          NOT NULL DEFAULT 0      COMMENT '浏览量(Redis 计数,定时回写)',
  is_top        TINYINT      NOT NULL DEFAULT 0      COMMENT '是否置顶 1是',
  is_recommend  TINYINT      NOT NULL DEFAULT 0      COMMENT '是否推荐 1是',
  related_ids   JSON                             NULL   COMMENT '相关文章ID(应用层维护)',
  published_at  DATETIME              DEFAULT NULL   COMMENT '发布时间(置空=未发布)',
  seo_title     VARCHAR(200)          DEFAULT NULL   COMMENT 'SEO 标题',
  seo_description VARCHAR(300)        DEFAULT NULL   COMMENT 'SEO 描述',
  seo_keywords  VARCHAR(200)          DEFAULT NULL   COMMENT 'SEO 关键词',
  i18n_json     JSON                             NULL   COMMENT '英文增量 {"en":{"title":"","summary":"","content":"","seo_title":"","seo_description":""}}',
  ext_json      JSON                             NULL   COMMENT '扩展字段',
  status        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态 1显示 0隐藏',
  is_deleted    TINYINT      NOT NULL DEFAULT 0      COMMENT '逻辑删除',
  created_by    VARCHAR(64)           DEFAULT 'admin',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by    VARCHAR(64)           DEFAULT NULL,
  updated_at    DATETIME              DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_slug (slug)
  -- 索引见 §6
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='文章(政策/指南/百科/关于/页面)';
