
-- 关于我们 4 个 Tab = 4 篇 about 类型文章
INSERT INTO cms_article (category_type, title, slug, content, status) VALUES
('about','公司简介','about-profile','<p>...</p>',1),
('about','我们的团队','about-team','<p>...</p>',1),
('about','加入我们','about-careers','<p>...</p>',1),
('about','联系我们','about-contact','<p>...</p>',1);

-- 隐私政策 / 服务条款 = page 类型
INSERT INTO cms_article (category_type, title, slug, content, status) VALUES
('page','隐私政策','privacy-policy','<p>...</p>',1),
('page','服务条款','terms-of-service','<p>...</p>',1);
