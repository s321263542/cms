-- 灌库：前台现有内容 → MySQL（由 tools/generate-seed.mjs 生成）
SET NAMES utf8mb4;

INSERT INTO cms_country (id,code,name,en_name,icon_url,sort_order,status) VALUES
(1,'HK','中国香港','Hong Kong','',1,1),
(2,'SG','新加坡','Singapore','',2,1),
(3,'US','美国','United States','',3,1),
(4,'CN','中国内地','Mainland China','',4,1);

INSERT INTO cms_site_config (config_key,config_name,config_value,value_type,group_name,lang,is_public,remark,sort_order,status,publish_status,live_flag) VALUES
('site_name','站点名称','永鸿国际','string','base','zh',1,'导航 Logo 旁文字',0,1,2,1),
('site_name','站点名称','YONGHONG','string','base','en',1,'导航 Logo 旁文字',0,1,2,1),
('brand_en','品牌英文副标题','YONGHONG INTERNATIONAL CONSULTING','string','base','zh',1,'导航中文名下方的英文小字',1,1,2,1),
('brand_en','品牌英文副标题','YONGHONG INTERNATIONAL CONSULTING','string','base','en',1,'导航中文名下方的英文小字',1,1,2,1),
('company_full','公司全称','永鸿国际咨询（深圳）有限公司','string','base','zh',1,'页脚展示',2,1,2,1),
('company_full','公司全称','Yonghong International Consulting (Shenzhen) Co., Ltd.','string','base','en',1,'页脚展示',2,1,2,1),
('company_addr','公司地址','深圳市罗湖区南湖街道嘉北社区迎春路3号海燕大厦20层2010','string','base','zh',1,NULL,3,1,2,1),
('company_addr','公司地址','20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District, Shenzhen, China','string','base','en',1,NULL,3,1,2,1),
('company_phone','客服电话','18123763835','string','base','zh',1,NULL,4,1,2,1),
('company_phone','客服电话','+86 18123763835','string','base','en',1,NULL,4,1,2,1),
('company_email','联系邮箱','805856285@qq.com','string','base','zh',1,NULL,5,1,2,1),
('company_email','联系邮箱','805856285@qq.com','string','base','en',1,NULL,5,1,2,1),
('company_credit','统一社会信用代码','91440300MA5FEMF959','string','base','zh',1,NULL,6,1,2,1),
('company_credit','统一社会信用代码','91440300MA5FEMF959','string','base','en',1,NULL,6,1,2,1),
('company_regdate','成立日期','2018-12-20','string','base','zh',1,NULL,7,1,2,1),
('company_regdate','成立日期','2018-12-20','string','base','en',1,NULL,7,1,2,1),
('privacy_version','隐私政策版本号','v1.0','string','base','zh',1,'★留资同意时写入 consent_version',8,1,2,1),
('privacy_version','隐私政策版本号','v1.0','string','base','en',1,'★留资同意时写入 consent_version',8,1,2,1),
('cdn_base','CDN/静态资源域名','','string','base','zh',1,'★切OSS/换域名只改这一条（开发期留空 = 不加前缀）',9,1,2,1),
('cdn_base','CDN/静态资源域名','','string','base','en',1,'★切OSS/换域名只改这一条（开发期留空 = 不加前缀）',9,1,2,1),
('turnstile_site_key','人机验证 SiteKey','','string','base','zh',0,NULL,10,1,2,1),
('turnstile_site_key','人机验证 SiteKey','','string','base','en',0,NULL,10,1,2,1),
('seo_site_title','首页标题 TDK','永鸿国际|香港新加坡美国公司注册|银行开户年审','string','seo','zh',1,NULL,11,1,2,1),
('seo_site_title','首页标题 TDK','YONGHONG|Hong Kong & Singapore Company Registration|Bank Account Opening','string','seo','en',1,NULL,11,1,2,1),
('seo_site_desc','首页描述 TDK','永鸿国际专注海外企服：香港公司注册、新加坡开户、美国公司设立、年审报税、商标专利，20000+ 客户选择','string','seo','zh',1,NULL,12,1,2,1),
('seo_site_desc','首页描述 TDK','YONGHONG focuses on overseas corporate services: Hong Kong company registration, Singapore bank accounts, US incorporation, audit & trademark. Chosen by 20,000+ clients.','string','seo','en',1,NULL,12,1,2,1),
('seo_site_kw','首页关键词 TDK','香港公司注册,新加坡公司开户,美国公司设立,海外年审','string','seo','zh',1,NULL,13,1,2,1),
('seo_site_kw','首页关键词 TDK','hong kong company registration,singapore bank account,us incorporation,offshore audit','string','seo','en',1,NULL,13,1,2,1),
('icp_number','ICP 备案号','粤ICP备2022121434号-1','string','seo','zh',1,NULL,14,1,2,1),
('icp_number','ICP 备案号','粤ICP备2022121434号-1','string','seo','en',1,NULL,14,1,2,1),
('home_rec','今日推荐','{"title":"今日推荐","num":"12,304位","sub":"本月已为企业家成功出海办结"}','json','home','zh',1,NULL,15,1,2,1),
('home_rec','今日推荐','{"title":"Today''s Pick","num":"12,304","sub":"Businesses successfully landed overseas this month"}','json','home','en',1,NULL,15,1,2,1),
('home_stats','业务动态','[{"name":"香港公司注册","sub":"一对一专业","num":"22,102家"},{"name":"香港银行开户","sub":"100%包开户","num":"1,710件"},{"name":"香港做账审计","sub":"办理过程全透明","num":"51,042件"},{"name":"香港公司注销","sub":"15天快速下证","num":"1,911件"}]','json','home','zh',1,NULL,16,1,2,1),
('home_stats','业务动态','[{"name":"HK Company Setup","sub":"1-on-1 specialists","num":"22,102"},{"name":"HK Bank Account","sub":"100% guaranteed","num":"1,710"},{"name":"HK Audit & Tax","sub":"Fully transparent","num":"51,042"},{"name":"HK Deregistration","num":"1,911","sub":"Certificate in 15 days"}]','json','home','en',1,NULL,16,1,2,1),
('home_service','核心服务矩阵专区标题','{"title":"核心出海业务矩阵","subtitle":"全牌照合规服务 · 助力中国企业无缝拓展全球蓝海市场"}','json','home','zh',1,'★新增键：首页「核心出海业务矩阵」标题/副标题',17,1,2,1),
('home_service','核心服务矩阵专区标题','{"title":"Global Expansion Matrix","subtitle":"Fully licensed compliance services · Helping Chinese enterprises open up new global markets"}','json','home','en',1,'★新增键：首页「核心出海业务矩阵」标题/副标题',17,1,2,1),
('home_process','办理流程专区','{"title":"香港公司注册服务落地页 (2026年最新政策流程)","sub":"全程一对一持牌秘书代办，最快 1 个工作日下发注册证书及商业登记证","steps":[{"name":"免费名称核查","desc":"查册香港公司注册署数据库，30分钟内快速出具查册报告","time":"30分钟"},{"name":"签署法定协议","desc":"提供董事股东有效身份证件，签署委托协议及法定申请表","time":"1小时"},{"name":"递交香港注册署","desc":"永鸿专属政府通道在线直呈CR电子系统，合规加速审批","time":"1个工作日"},{"name":"制作全套绿盒印章","desc":"下发注册证书(CR)与商业登记证(BR)，精雕法定印章与章程","time":"1个工作日"},{"name":"安排直联银行开户","desc":"对接汇丰/渣打/华侨等合作银行客户经理，视频见证下户","time":"3-5工作日"},{"name":"顺丰保价包邮送达","desc":"全套原版绿盒、印章及开户结算卡顺丰保价安全速递到手","time":"次日达"}]}','json','home','zh',1,NULL,18,1,2,1),
('home_process','办理流程专区','{"title":"Hong Kong Company Registration — 2026 Latest Process","sub":"Handled 1-on-1 by licensed company secretaries; certificate of incorporation issued in as fast as 1 working day","steps":[{"name":"Free name search","desc":"Search the Companies Registry database and receive a search report within 30 minutes","time":"30 min"},{"name":"Sign the engagement letter","desc":"Provide valid ID of directors and shareholders; sign the mandate and statutory forms","time":"1 hour"},{"name":"File with the Companies Registry","desc":"Our dedicated government channel submits electronically to the CR system","time":"1 working day"},{"name":"Produce the full green box","desc":"CR certificate and business registration issued; statutory chops and articles engraved","time":"1 working day"},{"name":"Arrange the bank account","desc":"Introduced to relationship managers at HSBC / SCB / OCBC with video witnessing","time":"3–5 days"},{"name":"Insured courier delivery","desc":"The original green box, chops and settlement card delivered by insured express","time":"Next day"}]}','json','home','en',1,NULL,18,1,2,1),
('home_section_switch','首页区块显隐','{"banner":true,"stats":true,"service":true,"process":true,"bank":true,"case":true,"article":true,"footer":true}','json','home','zh',1,NULL,19,1,2,1),
('home_section_switch','首页区块显隐','{"banner":true,"stats":true,"service":true,"process":true,"bank":true,"case":true,"article":true,"footer":true}','json','home','en',1,NULL,19,1,2,1),
('footer_links','页脚快捷链接','[{"name":"隐私政策","url":"/privacy-policy"},{"name":"服务条款","url":"/terms-of-service"},{"name":"公司简介","url":"/about-profile"},{"name":"联系我们","url":"/about-contact"}]','json','footer','zh',1,NULL,20,1,2,1),
('footer_links','页脚快捷链接','[{"name":"Privacy Policy","url":"/privacy-policy"},{"name":"Terms of Service","url":"/terms-of-service"},{"name":"Company Profile","url":"/about-profile"},{"name":"Contact Us","url":"/about-contact"}]','json','footer','en',1,NULL,20,1,2,1),
('friend_links','友情链接','[{"name":"高新技术企业认定","url":""},{"name":"实验室认可","url":""},{"name":"B2B","url":""},{"name":"中小企业管理软件","url":""},{"name":"昆山个体户注册","url":""},{"name":"网站建设公司","url":""}]','json','footer','zh',1,'SEO 友链；url 留空则前台渲染为纯文字，填了才是可点链接',21,1,2,1),
('friend_links','友情链接','[{"name":"Hi-tech Enterprise Accreditation","url":""},{"name":"Laboratory Accreditation","url":""},{"name":"B2B","url":""},{"name":"SME Management Software","url":""},{"name":"Kunshan Sole Trader Registration","url":""},{"name":"Website Building","url":""}]','json','footer','en',1,'SEO 友链；url 留空则前台渲染为纯文字，填了才是可点链接',21,1,2,1),
('cs_quick_tags','客服快捷标签','[{"emoji":"🇭🇰","label":"香港公司设立与费用","question":"香港公司设立条件与周期"},{"emoji":"🏦","label":"汇丰/渣打免赴港开户","question":"香港离岸银行远程开户"},{"emoji":"📑","label":"做账审计与合规申报","question":"香港做账审计与合规申报"},{"emoji":"🇸🇬","label":"新加坡设立及商标","question":"新加坡设立与海外商标"}]','json','cs','zh',1,'★由字符串数组改为对象数组：emoji / 按钮文字 / 点击后发送的问句',22,1,2,1),
('cs_quick_tags','客服快捷标签','[{"emoji":"🇭🇰","label":"HK setup & fees","question":"Requirements and timeline for setting up a Hong Kong company"},{"emoji":"🏦","label":"HSBC / SCB remote account","question":"Remote offshore bank account opening in Hong Kong"},{"emoji":"📑","label":"Audit & compliance filing","question":"Hong Kong bookkeeping, audit and compliance filing"},{"emoji":"🇸🇬","label":"Singapore setup & TM","question":"Singapore incorporation and overseas trademarks"}]','json','cs','en',1,'★由字符串数组改为对象数组：emoji / 按钮文字 / 点击后发送的问句',22,1,2,1),
('cs_auto_reply','客服自动回复','您好，我是永鸿国际顾问，正在为您查询相关业务，请稍等片刻。','string','cs','zh',1,NULL,23,1,2,1),
('cs_auto_reply','客服自动回复','Hello, this is your YONGHONG consultant. I am checking the details for you — one moment please.','string','cs','en',1,NULL,23,1,2,1);

INSERT INTO cms_banner (id,position,poster_type,image_url,tag,title,`desc`,price_text,button_text,button_link,sort_order,i18n_json,ext_json,status,publish_status,live_flag) VALUES
(1,'home','cr',NULL,'🇭🇰 香港公司设立 · 2026合规新规','香港公司设立·极速下证','持牌秘书合规托管，一站式解决注册、年审、开户及做账审计痛点，特设包开户绿色通道。','特惠 ¥4580起','立即获取底价方案',NULL,1,'{"en":{"tag":"🇭🇰 Hong Kong Company Setup · 2026 Compliance Update","title":"Hong Kong Company Setup · Fast Track","desc":"Licensed company-secretary handling — one stop for registration, annual return, bank account and audit, with a guaranteed account-opening channel.","price_text":"From ¥4,580","button_text":"Get the best quote now"}}',NULL,1,2,1),
(2,'home','bank',NULL,'🏦 环球离岸银行 · 视频远程开户','环球离岸银行·包下户通道','香港/新加坡/美国顶尖银行直联，无需亲自过港，专业资深银行开户经理 1对1 辅导包过。','绿色包开通道','免费评估开户资格',NULL,2,'{"en":{"tag":"🏦 Global Offshore Banking · Remote Video Onboarding","title":"Global Offshore Accounts · Guaranteed Opening","desc":"Direct access to top banks in Hong Kong, Singapore and the US — no travel required, with senior relationship managers coaching you 1-on-1.","price_text":"Guaranteed channel","button_text":"Check my eligibility free"}}',NULL,1,2,1),
(3,'home','cpa',NULL,'™️ 国际品牌布局 · 香港持牌审计','国际品牌出海·合规审计筹划','马德里国际商标快速注册，香港执业会计师(CPA)正规做账审计出具报告，合规无忧。','1对1资深方案','预约资深财税顾问',NULL,3,'{"en":{"tag":"™️ Global Branding · Hong Kong Licensed Audit","title":"Go Global · Compliant Audit & Trademark","desc":"Fast Madrid trademark registration and proper bookkeeping/audit reports issued by Hong Kong certified practising accountants.","price_text":"1-on-1 senior plan","button_text":"Book a senior tax advisor"}}',NULL,1,2,1);

INSERT INTO cms_service (id,category,country_id,title,sub_title,summary,badge_text,price_text,slug,cover_url,content,process_steps,related_ids,views,sort_order,is_recommended,is_home_show,seo_title,seo_description,seo_keywords,i18n_json,ext_json,status,publish_status,live_flag) VALUES
(1,'company_reg',1,'香港公司注册','极速下证 · 持牌秘书合规托管','世界金融中心，自由的商贸港口，香港公司注册便于提升公司国际品牌形象及开拓海外业务。','企业级合规','¥4580 元起','hk-company-registration',NULL,'
      <p>香港是全球最自由的经济体之一，实行简单低税制、无外汇管制，是中资企业设立海外总部与资金中转的首选地。</p>
      <h2>办理香港公司注册，您将获得</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">1 天</div><div class="cb-card__label">电子注册最快下证</div></div>
        <div class="cb-card"><div class="cb-card__value">0 外汇</div><div class="cb-card__label">无外汇管制自由收付</div></div>
        <div class="cb-card"><div class="cb-card__value">8.25%</div><div class="cb-card__label">利得税两级制税率</div></div>
        <div class="cb-card"><div class="cb-card__value">全球</div><div class="cb-card__label">国际品牌形象背书</div></div>
      </div>
      <h2>注册所需资料</h2>
      <ul>
        <li>拟用公司名称（中英文各一个，需先查册）</li>
        <li>董事及股东的有效身份证件 / 护照</li>
        <li>董事及股东的住址证明（近 3 个月）</li>
        <li>注册资本（标准 10,000 股，无需验资）</li>
      </ul>
      <h2>费用包含</h2>
      <p>政府规费、法定注册地址、公司秘书服务、精美绿盒（含钢印、小圆章、章程、股票本）、顺丰保价包邮。</p>
      <blockquote>所有方案均出具书面风险提示与费用清单；如查册不通过，注册费全额退还。</blockquote>
    ','[{"name":"免费名称核查","desc":"查册香港公司注册署数据库，30分钟内快速出具查册报告","time":"30分钟"},{"name":"签署法定协议","desc":"提供董事股东有效身份证件，签署委托协议及法定申请表","time":"1小时"},{"name":"递交香港注册署","desc":"永鸿专属政府通道在线直呈CR电子系统，合规加速审批","time":"1个工作日"},{"name":"制作全套绿盒印章","desc":"下发注册证书(CR)与商业登记证(BR)，精雕法定印章与章程","time":"1个工作日"},{"name":"安排直联银行开户","desc":"对接汇丰/渣打/华侨等合作银行客户经理，视频见证下户","time":"3-5工作日"},{"name":"顺丰保价包邮送达","desc":"全套原版绿盒、印章及开户结算卡顺丰保价安全速递到手","time":"次日达"}]','[1]',0,1,1,1,'香港公司注册|1天下证|永鸿国际','香港公司注册加急最快1天下证，含政府规费、法定地址、公司秘书与绿盒，持牌顾问全程代办。','香港公司注册,香港注册公司,香港公司设立','{"en":{"title":"Hong Kong Company Registration","sub_title":"Fast track · Licensed company secretary","summary":"A free port and world-class financial centre — a Hong Kong company strengthens your international brand and opens up overseas business.","content":"\\n      <p>Hong Kong is one of the world''s freest economies, with a simple low-tax regime and no exchange controls — the top choice for Chinese enterprises setting up a regional headquarters.</p>\\n      <h2>What you get</h2>\\n      <div class=\\"cb-cards4\\">\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">1 day</div><div class=\\"cb-card__label\\">Fastest e-filing</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">No FX</div><div class=\\"cb-card__label\\">Free cross-border transfers</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">8.25%</div><div class=\\"cb-card__label\\">Two-tier profits tax</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">Global</div><div class=\\"cb-card__label\\">International brand credibility</div></div>\\n      </div>\\n      <h2>Documents required</h2>\\n      <ul>\\n        <li>Proposed company name (one Chinese and one English)</li>\\n        <li>Valid ID / passport of directors and shareholders</li>\\n        <li>Proof of address (within the last 3 months)</li>\\n        <li>Share capital (standard 10,000 shares, no verification required)</li>\\n      </ul>\\n      <h2>What is included</h2>\\n      <p>Government fees, statutory registered address, company secretary, a full green box (common seal, chop, articles, share book) and insured express delivery.</p>\\n      <blockquote>A written risk note and itemised fee list is issued for every plan; full refund if the name search fails.</blockquote>\\n    ","seo_title":"Hong Kong Company Registration | 1-day Certificate | YONGHONG","seo_description":"Hong Kong company registration in as fast as 1 day — government fees, statutory address, secretary and green box included.","seo_keywords":"hong kong company registration,hong kong incorporate","badge_text":"Fully compliant","price_text":"From ¥4,580","ext_json":{"btn_text":"Apply now →","price":"4,580","unit":""}}}','{"gradient":"from-emerald-500 to-teal-600","icon":"fa-building-columns","price":"4580","unit":"元起","btn_text":"我要办理 →"}',1,2,1),
(2,'annual_audit',1,'香港公司年审','周年申报 · 专人智能预警','在香港注册公司后嫌年审繁琐？交给永鸿国际专业秘书团队，专人智能预警，让您彻底省心放心。','企业级合规','¥2980 元起','hk-company-annual-return',NULL,'
      <p>香港公司成立满 12 个月后须办理周年申报（NAR1）并换领商业登记证（BR），逾期将产生高额罚款甚至被法院传票。</p>
      <h2>年审服务内容</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>周年申报表 NAR1</strong><p>向公司注册处递交上年度公司资料变更申报。</p></div>
        <div class="cb-card"><strong>换领商业登记证 BR</strong><p>向税务局续期商业登记，避免罚款与经营受限。</p></div>
        <div class="cb-card"><strong>法定地址与秘书续期</strong><p>维持注册地址与公司秘书，保障合规存续。</p></div>
        <div class="cb-card"><strong>智能到期预警</strong><p>到期前 30/15/7 天三重提醒，绝不遗漏。</p></div>
      </div>
      <blockquote>逾期 42 天以内罚款 HK$870；超过 42 天罚款将逐级递增，最高可达 HK$5,000 并可能收到法院传票。</blockquote>
    ','[{"name":"提交办理资料","desc":"在线填写业务需求，专属顾问 10 分钟内与您对接","time":"10分钟"},{"name":"持牌顾问审核","desc":"核对证件与方案条款，出具书面风险提示与费用清单","time":"1小时"},{"name":"递交官方受理","desc":"通过专属政府/银行通道直呈系统，合规加速审批","time":"1-3个工作日"},{"name":"交付成果凭证","desc":"证书、印章、账户或报告顺丰保价包邮到手","time":"1个工作日"}]','[]',0,2,1,1,'香港公司年审|周年申报|永鸿国际','香港公司年审周年申报与商业登记证续期一站式代办，到期前三重提醒，逾期补办亦可处理。','香港公司年审,香港周年申报,香港商业登记证','{"en":{"title":"Hong Kong Annual Return","sub_title":"Annual filing · Proactive deadline alerts","summary":"Tired of the annual return? Our professional secretaries track every deadline so you never have to.","content":"\\n      <p>Twelve months after incorporation a Hong Kong company must file its annual return (NAR1) and renew its business registration certificate (BR). Late filing triggers escalating penalties and a possible court summons.</p>\\n      <h2>What is included</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Annual return NAR1</strong><p>Filing of the previous year''s company particulars with the Companies Registry.</p></div>\\n        <div class=\\"cb-card\\"><strong>Business registration renewal</strong><p>Renewal with the Inland Revenue Department to keep trading legally.</p></div>\\n        <div class=\\"cb-card\\"><strong>Address & secretary renewal</strong><p>Statutory registered address and company secretary maintained.</p></div>\\n        <div class=\\"cb-card\\"><strong>Smart deadline alerts</strong><p>Reminders at 30, 15 and 7 days before the due date.</p></div>\\n      </div>\\n      <blockquote>Late by up to 42 days: HK$870. Beyond that the penalty escalates to HK$5,000 and a court summons may be issued.</blockquote>\\n    ","seo_title":"Hong Kong Annual Return | YONGHONG","seo_description":"One-stop Hong Kong annual return and business registration renewal with triple deadline reminders.","seo_keywords":"hong kong annual return,hong kong business registration","badge_text":"Fully compliant","price_text":"From ¥2,980","ext_json":{"btn_text":"Apply now →","price":"2,980","unit":""}}}','{"gradient":"from-amber-500 to-amber-600","icon":"fa-user-check","price":"2980","unit":"元起","btn_text":"我要办理 →"}',1,2,1),
(3,'bank_acct',1,'香港银行开户','视频远程见证 · 包下户通道','个人开立香港公司账户难？永鸿国际特殊银行包开绿色渠道，视频远程见证，助力高效开户。','企业级合规','¥2000 元起','hk-bank-account-opening',NULL,'
      <p>我们与汇丰、渣打、华侨、东亚等银行建立总行直联渠道，客户经理远程视频见证即可完成面签，无需亲自赴港。</p>
      <h2>开户前我们会做的准备</h2>
      <ul>
        <li>按您的行业与资金流向匹配最合适的银行</li>
        <li>预审 KYC 材料，提前规避被拒风险</li>
        <li>模拟银行面签问答，逐条辅导通关要点</li>
        <li>整理业务合同、发票、网站等佐证资料</li>
      </ul>
      <h2>开户周期</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">2 周</div><div class="cb-card__label">汇丰/渣打典型下户</div></div>
        <div class="cb-card"><div class="cb-card__value">1-2 周</div><div class="cb-card__label">华侨银行</div></div>
        <div class="cb-card"><div class="cb-card__value">10 天</div><div class="cb-card__label">东亚银行</div></div>
        <div class="cb-card"><div class="cb-card__value">98.6%</div><div class="cb-card__label">我们的通过率</div></div>
      </div>
    ','[{"name":"提交办理资料","desc":"在线填写业务需求，专属顾问 10 分钟内与您对接","time":"10分钟"},{"name":"持牌顾问审核","desc":"核对证件与方案条款，出具书面风险提示与费用清单","time":"1小时"},{"name":"递交官方受理","desc":"通过专属政府/银行通道直呈系统，合规加速审批","time":"1-3个工作日"},{"name":"交付成果凭证","desc":"证书、印章、账户或报告顺丰保价包邮到手","time":"1个工作日"}]','[]',0,3,1,1,'香港银行开户|视频远程见证|永鸿国际','香港公司银行开户免赴港视频见证，汇丰渣打华侨东亚总行直联，KYC 辅导通关，通过率 98.6%。','香港银行开户,离岸账户,汇丰开户,渣打开户','{"en":{"title":"Hong Kong Bank Account Opening","sub_title":"Remote video witnessing · Guaranteed channel","summary":"Hard to open a Hong Kong corporate account? Our green channel offers remote video witnessing for a smooth opening.","content":"\\n      <p>We work directly with HSBC, Standard Chartered, OCBC and BEA so that a relationship manager can witness your interview by video — no travel to Hong Kong.</p>\\n      <h2>How we prepare you</h2>\\n      <ul>\\n        <li>Match you to the right bank for your industry and fund flows</li>\\n        <li>Pre-audit KYC documents to remove rejection risks</li>\\n        <li>Rehearse the bank interview question by question</li>\\n        <li>Compile contracts, invoices and website evidence</li>\\n      </ul>\\n      <h2>Timelines</h2>\\n      <div class=\\"cb-cards4\\">\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">2 weeks</div><div class=\\"cb-card__label\\">HSBC / SCB typical</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">1–2 weeks</div><div class=\\"cb-card__label\\">OCBC</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">10 days</div><div class=\\"cb-card__label\\">BEA</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">98.6%</div><div class=\\"cb-card__label\\">Our approval rate</div></div>\\n      </div>\\n    ","seo_title":"Hong Kong Bank Account | Remote Video Witnessing | YONGHONG","seo_description":"Open a Hong Kong corporate account without travelling — video witnessing, KYC coaching, 98.6% approval.","seo_keywords":"hong kong bank account,offshore account,hsbc account","badge_text":"Fully compliant","price_text":"From ¥2,000","ext_json":{"btn_text":"Apply now →","price":"2,000","unit":""}}}','{"gradient":"from-teal-600 to-emerald-700","icon":"fa-vault","price":"2000","unit":"元起","btn_text":"我要办理 →"}',1,2,1),
(4,'annual_audit',1,'香港审计报税','持牌 CPA · 无保留意见','代理香港公司财税审计怎么做最省心？香港持牌执业会计师(CPA)，让永鸿来为您“金”打细算。','企业级合规','¥2980 元起','hk-audit-tax-filing',NULL,'
      <p>香港利得税报税分两个阶段：收到报税表后需在 1 个月内提交；首年可申请延期至 3 个月。所有香港公司每年均须由执业会计师出具审计报告。</p>
      <h2>服务范围</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>做账</strong><p>整理银行流水、单据与合同，按香港准则编制财务报表。</p></div>
        <div class="cb-card"><strong>审计</strong><p>由执业会计师出具无保留意见 / 保留意见审计报告。</p></div>
        <div class="cb-card"><strong>报税</strong><p>填报利得税报税表，申请两级制与离岸豁免。</p></div>
        <div class="cb-card"><strong>税务筹划</strong><p>结合 BEPS 2.0 与离岸所得免税，制定合规节税路径。</p></div>
      </div>
      <blockquote>离岸所得免税并非“零申报”——税务局对无保留意见报告的抽查率正在上升，务必保留完整证据链。</blockquote>
    ','[{"name":"提交办理资料","desc":"在线填写业务需求，专属顾问 10 分钟内与您对接","time":"10分钟"},{"name":"持牌顾问审核","desc":"核对证件与方案条款，出具书面风险提示与费用清单","time":"1小时"},{"name":"递交官方受理","desc":"通过专属政府/银行通道直呈系统，合规加速审批","time":"1-3个工作日"},{"name":"交付成果凭证","desc":"证书、印章、账户或报告顺丰保价包邮到手","time":"1个工作日"}]','[]',0,4,1,1,'香港审计报税|持牌CPA|永鸿国际','香港公司做账审计报税一站式，执业会计师出具报告，两级制与离岸免税申请，合规节税。','香港审计,香港报税,香港做账,离岸免税','{"en":{"title":"Hong Kong Audit & Tax Filing","sub_title":"Licensed CPA · Unqualified opinion","summary":"Let licensed practising accountants (CPA) handle your Hong Kong bookkeeping and audit down to the last penny.","content":"\\n      <p>Hong Kong profits tax runs in two stages: the return must be filed within one month of receipt (extendable to three for the first year), and every company needs an audit report from a practising accountant each year.</p>\\n      <h2>Scope</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Bookkeeping</strong><p>Bank statements, vouchers and contracts compiled under HK standards.</p></div>\\n        <div class=\\"cb-card\\"><strong>Audit</strong><p>Unqualified or qualified opinion issued by a practising accountant.</p></div>\\n        <div class=\\"cb-card\\"><strong>Filing</strong><p>Profits tax return prepared; two-tier and offshore claims applied.</p></div>\\n        <div class=\\"cb-card\\"><strong>Tax planning</strong><p>Compliant structuring around BEPS 2.0 and offshore exemption.</p></div>\\n      </div>\\n      <blockquote>An offshore claim is not a nil filing — the IRD audits far more frequently, so keep a complete evidence chain.</blockquote>\\n    ","seo_title":"Hong Kong Audit & Tax | Licensed CPA | YONGHONG","seo_description":"One-stop Hong Kong bookkeeping, audit and tax filing by licensed CPAs with two-tier and offshore claims.","seo_keywords":"hong kong audit,hong kong tax filing,hong kong bookkeeping","badge_text":"Fully compliant","price_text":"From ¥2,980","ext_json":{"btn_text":"Apply now →","price":"2,980","unit":""}}}','{"gradient":"from-rose-500 to-rose-600","icon":"fa-calculator","price":"2980","unit":"元起","btn_text":"我要办理 →"}',1,2,1),
(5,'company_reg',1,'香港公司注销','清盘清税 · 15天下证','合规安全注销避免政府高额罚款，简单轻松，清账清税快速注销或转让，免除后顾之忧。','企业级合规','¥1500 元起','hk-company-deregistration',NULL,'
      <p>不再使用的香港公司若不注销，仍须逐年年审并缴纳商业登记费，逾期将累积罚款并影响董事信用记录。</p>
      <h2>两种退出方式</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>撤销注册（自愿注销）</strong><p>适合无未清偿债务的公司，由税务局与注册处联合批准，约 5-6 个月完成。</p></div>
        <div class="cb-card"><strong>清盘（强制/自愿）</strong><p>适合有债务或资产的公司，需委任清盘人，流程更严谨。</p></div>
      </div>
      <h2>办理前提</h2>
      <ul>
        <li>公司从未开始营业，或已停止营业超过 3 个月</li>
        <li>所有税务申报已完成，无未缴税款</li>
        <li>无未决的法律程序与债务</li>
      </ul>
    ','[{"name":"提交办理资料","desc":"在线填写业务需求，专属顾问 10 分钟内与您对接","time":"10分钟"},{"name":"持牌顾问审核","desc":"核对证件与方案条款，出具书面风险提示与费用清单","time":"1小时"},{"name":"递交官方受理","desc":"通过专属政府/银行通道直呈系统，合规加速审批","time":"1-3个工作日"},{"name":"交付成果凭证","desc":"证书、印章、账户或报告顺丰保价包邮到手","time":"1个工作日"}]','[]',0,5,0,1,'香港公司注销|撤销注册|永鸿国际','香港公司注销与撤销注册一站式办理，清盘清税、避免罚款，15 天启动、免除后顾之忧。','香港公司注销,香港撤销注册,香港清盘','{"en":{"title":"Hong Kong Company Deregistration","sub_title":"Winding up · Certificate in 15 days","summary":"Compliant deregistration avoids heavy government penalties — settle accounts and tax, then strike off or transfer.","content":"\\n      <p>An idle Hong Kong company still owes annual returns and business registration fees; penalties accumulate and the director''s credit record suffers.</p>\\n      <h2>Two ways out</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Deregistration</strong><p>For companies with no outstanding liabilities — approved jointly by the IRD and the CR in about 5–6 months.</p></div>\\n        <div class=\\"cb-card\\"><strong>Winding up</strong><p>For companies with debts or assets; requires a liquidator and a stricter process.</p></div>\\n      </div>\\n      <h2>Prerequisites</h2>\\n      <ul>\\n        <li>The company never traded, or ceased trading more than 3 months ago</li>\\n        <li>All tax returns are filed and no tax remains unpaid</li>\\n        <li>No pending legal proceedings or liabilities</li>\\n      </ul>\\n    ","seo_title":"Hong Kong Company Deregistration | YONGHONG","seo_description":"One-stop Hong Kong deregistration and winding up — avoid penalties and close cleanly.","seo_keywords":"hong kong company deregistration,hong kong winding up","badge_text":"Fully compliant","price_text":"From ¥1,500","ext_json":{"btn_text":"Apply now →","price":"1,500","unit":""}}}','{"gradient":"from-sky-500 to-sky-600","icon":"fa-lightbulb","price":"1500","unit":"元起","btn_text":"我要办理 →"}',1,2,1),
(6,'trademark',0,'全球商标注册','马德里体系 · 1对1 检索','全球两百多个国家地区在线一站式商标布局，1对1涉外知识产权专家免费近似检索，防抢注侵权。','企业级合规','¥800 元起','global-trademark-registration',NULL,'
      <p>跨境电商被抢注、被投诉下架，往往损失远超注册成本。提前布局商标是品牌出海最划算的投入。</p>
      <h2>可办理区域</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">中国</div><div class="cb-card__label">国内注册与续展</div></div>
        <div class="cb-card"><div class="cb-card__value">香港</div><div class="cb-card__label">商标注册条例</div></div>
        <div class="cb-card"><div class="cb-card__value">马德里</div><div class="cb-card__label">120+ 成员国一标多国</div></div>
        <div class="cb-card"><div class="cb-card__value">US/EU</div><div class="cb-card__label">单一国家与欧盟</div></div>
      </div>
      <h2>服务流程</h2>
      <ul>
        <li>免费近似检索与可注册性评估</li>
        <li>确定类别与商品/服务项目（尼斯分类）</li>
        <li>递交申请并跟进官方审查意见</li>
        <li>领取证书并提供 10 年续展提醒</li>
      </ul>
    ','[{"name":"提交办理资料","desc":"在线填写业务需求，专属顾问 10 分钟内与您对接","time":"10分钟"},{"name":"持牌顾问审核","desc":"核对证件与方案条款，出具书面风险提示与费用清单","time":"1小时"},{"name":"递交官方受理","desc":"通过专属政府/银行通道直呈系统，合规加速审批","time":"1-3个工作日"},{"name":"交付成果凭证","desc":"证书、印章、账户或报告顺丰保价包邮到手","time":"1个工作日"}]','[]',0,6,1,1,'全球商标注册|马德里国际商标|永鸿国际','全球商标注册一站式，覆盖中国、香港、马德里 120+ 成员国、美国与欧盟，免费近似检索防抢注。','商标注册,马德里商标,美国商标,香港商标','{"en":{"title":"Global Trademark Registration","sub_title":"Madrid System · 1-on-1 clearance search","summary":"Register your trademark across 200+ jurisdictions with a free similarity search by overseas IP specialists.","content":"\\n      <p>Being squatted or taken down on a marketplace costs far more than filing. Securing your mark early is the best-value investment in going global.</p>\\n      <h2>Where we file</h2>\\n      <div class=\\"cb-cards4\\">\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">China</div><div class=\\"cb-card__label\\">Domestic filing & renewal</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">HK</div><div class=\\"cb-card__label\\">Trade Marks Ordinance</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">Madrid</div><div class=\\"cb-card__label\\">120+ members, one application</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">US/EU</div><div class=\\"cb-card__label\\">Single country & EUIPO</div></div>\\n      </div>\\n      <h2>Process</h2>\\n      <ul>\\n        <li>Free similarity search and registrability assessment</li>\\n        <li>Class and goods/services selection (Nice Classification)</li>\\n        <li>Filing and follow-up on office actions</li>\\n        <li>Certificate issued with a 10-year renewal reminder</li>\\n      </ul>\\n    ","seo_title":"Global Trademark Registration | Madrid | YONGHONG","seo_description":"Register trademarks in China, Hong Kong, 120+ Madrid members, the US and the EU with a free clearance search.","seo_keywords":"trademark registration,madrid trademark,us trademark","badge_text":"Fully compliant","price_text":"From ¥800","ext_json":{"btn_text":"Apply now →","price":"800","unit":""}}}','{"gradient":"from-indigo-500 to-indigo-600","icon":"fa-trademark","price":"800","unit":"元起","btn_text":"我要办理 →"}',1,2,1);

INSERT INTO cms_partner_bank (id,country_id,name,en_name,logo_url,features,success_rate,sort_order,i18n_json,ext_json,status,publish_status,live_flag) VALUES
(1,1,'汇丰银行 (HSBC)','HSBC','','全球公认第一外资银行，支持多币种即时结算及全球提现。','98.6%',1,'{"en":{"name":"HSBC","features":"Widely regarded as the leading foreign bank, with instant multi-currency settlement and global cash withdrawal.","ext_json":{"badge":"Fast interview","period":"2–3 weeks"}}}','{"badge":"极速面签","period":"2-3周下户"}',1,2,1),
(2,1,'渣打银行 (SCB)','Standard Chartered','','支持内地远程视频面签见证，免亲自跑港，网银操作简捷。','97.2%',2,'{"en":{"name":"Standard Chartered","features":"Remote video witnessing from the mainland — no trip to Hong Kong, simple online banking.","ext_json":{"badge":"Video witnessing","period":"2 weeks"}}}','{"badge":"视频见证","period":"2周稳下户"}',1,2,1),
(3,2,'华侨银行 (OCBC)','OCBC','','新加坡顶尖资管银行，资金流转无外汇管制，东南亚首选。','96.4%',3,'{"en":{"name":"OCBC","features":"A top Singapore wealth-management bank with no exchange controls — first choice in Southeast Asia.","ext_json":{"badge":"Singapore direct","period":"1–2 weeks"}}}','{"badge":"新加坡直联","period":"1-2周下户"}',1,2,1),
(4,1,'东亚银行 (BEA)','BEA','','专注中资出海企业信贷与外汇服务，下户准签率业内领先。','95.1%',4,'{"en":{"name":"BEA","features":"Focused on lending and FX for Chinese businesses going overseas, with an industry-leading approval rate.","ext_json":{"badge":"Low threshold","period":"10 working days"}}}','{"badge":"门槛亲民","period":"10工作日"}',1,2,1);

INSERT INTO cms_case (id,country_id,service_id,company_name,service_title,cost_text,time_text,quote_text,portrait_url,content,sort_order,i18n_json,ext_json,status,publish_status,live_flag) VALUES
(1,1,1,'深圳某头部跨境电商科技公司','注册+银行账户+商标','总费用 ¥12,800','历时 4 个工作日办结','“永鸿团队非常专业，2天拿到BR商业登记证，汇丰包下户更是帮我们解决了结汇大难题！”',NULL,NULL,1,'{"en":{"company_name":"A leading cross-border e-commerce tech company in Shenzhen","service_title":"Registration + Bank Account + Trademark","cost_text":"Total fee ¥12,800","time_text":"Completed in 4 working days","quote_text":"“Very professional — the BR arrived in 2 days and the guaranteed HSBC account solved our FX settlement problem.”","ext_json":{"cert":"HK CR Certificate No. 3419082"}}}','{"cert":"香港CR证书第3419082号"}',1,2,1),
(2,2,6,'杭州某AI软硬件出海独角兽','新加坡设立+ODI备案','总费用 ¥26,500','历时 7 个工作日办结','“持牌顾问全程跟进，合规架构搭建非常严谨，让资方在ODI备案审核中一次性通过。”',NULL,NULL,2,'{"en":{"company_name":"An AI hardware & software unicorn in Hangzhou","service_title":"Singapore setup + ODI filing","cost_text":"Total fee ¥26,500","time_text":"Completed in 7 working days","quote_text":"“The licensed consultant ran the whole thing — the compliance structure passed ODI review at the first attempt.”","ext_json":{"cert":"Singapore ACRA UEN 2024098X"}}}','{"cert":"新加坡ACRA注册编号UEN2024098X"}',1,2,1),
(3,1,4,'东莞某精密智能制造出口企业','香港逾期年审补办+审计','总费用 ¥6,800','历时 3 个工作日办结','“之前代理不专业导致逾期被法院传票，永鸿持牌会计师出面快速化解并豁免罚金！”',NULL,NULL,3,'{"en":{"company_name":"A precision smart-manufacturing exporter in Dongguan","service_title":"Overdue HK annual return + audit","cost_text":"Total fee ¥6,800","time_text":"Completed in 3 working days","quote_text":"“A previous agent botched it and we were summoned to court. Our CPA resolved it fast and the penalty was waived.”","ext_json":{"cert":"Tax bureau penalty-waiver approval"}}}','{"cert":"税局免罚申请成功批复函"}',1,2,1);

INSERT INTO cms_article (id,category_type,country_id,title,summary,cover_url,content,slug,author,views,is_top,is_recommend,related_ids,published_at,seo_title,seo_description,seo_keywords,i18n_json,ext_json,status,publish_status,live_flag) VALUES
(1,'news',1,'香港特区公司注册处2026年最新全面电子查册及穿透监管要点','香港公司注册处最新合规指引正式生效，针对重要控制人登记册(SCR)及挂牌地址核查提出更高标准...',NULL,'
      <p>香港公司注册处于 2026 年起进一步收紧电子查册与重要控制人透明度要求。对已有香港公司的企业而言，这既是合规压力，也是一次把历史遗留问题清理干净的机会。</p>
      <h2>三个最需要关注的变化</h2>
      <ul>
        <li><strong>电子查册记录留痕</strong>——查册人身份与用途需登记，敏感资料的批量导出受到限制。</li>
        <li><strong>重要控制人登记册（SCR）抽查常态化</strong>——注册办事处须备存最新 SCR，秘书公司会不定期核对。</li>
        <li><strong>挂牌地址穿透核查</strong>——虚拟地址若无法联系到公司，可能被要求限期整改。</li>
      </ul>
      <h2>企业现在应该做的四件事</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>核对董事股东资料</strong><p>确保护照/身份证件在有效期内，住址证明不超过 3 个月。</p></div>
        <div class="cb-card"><strong>更新 SCR</strong><p>股权转让、董事变更后 7 个工作日内更新重要控制人资料。</p></div>
        <div class="cb-card"><strong>确认挂牌地址可达</strong><p>确保信件有人签收，避免被注册处标记为失联。</p></div>
        <div class="cb-card"><strong>整理业务佐证</strong><p>合同、发票、网站与流水相互印证，应对银行年度复核。</p></div>
      </div>
      <blockquote>合规不是成本，而是融资、上市与跨境结汇的通行证。永鸿国际可为存量香港公司提供 SCR 与挂牌地址的年度体检服务。</blockquote>
    ','hk-registry-2026-electronic-search','永鸿国际合规研究中心',1420,1,1,'[2,3]','2026-03-15 09:00:00','香港公司注册处2026电子查册与SCR监管要点解读','香港公司注册处 2026 年电子查册、重要控制人登记册 SCR 与挂牌地址核查新要求，及企业应对清单。','香港电子查册,SCR,重要控制人登记册,香港合规','{"en":{"title":"Hong Kong Companies Registry 2026: e-Search and look-through regulation explained","summary":"The latest compliance guidance takes effect, raising the bar for the Significant Controllers Register and registered office checks...","content":"\\n      <p>From 2026 the Companies Registry tightens electronic search records and beneficial-ownership transparency. For companies already established in Hong Kong this is both a compliance burden and a chance to clear historical issues.</p>\\n      <h2>Three changes that matter most</h2>\\n      <ul>\\n        <li><strong>Search records are logged</strong> — searcher identity and purpose are registered, and bulk export of sensitive data is restricted.</li>\\n        <li><strong>SRC spot checks become routine</strong> — a current Significant Controllers Register must be kept at the registered office.</li>\\n        <li><strong>Registered office look-through</strong> — virtual addresses that cannot reach the company may face a rectification order.</li></ul>\\n      <h2>Four things to do now</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Verify director data</strong><p>IDs and passports valid, proof of address under three months old.</p></div>\\n        <div class=\\"cb-card\\"><strong>Update the SRC</strong><p>Update within seven working days of any share transfer or director change.</p></div>\\n        <div class=\\"cb-card\\"><strong>Confirm the office is reachable</strong><p>Make sure post is collected so the Registry does not flag the entity.</p></div>\\n        <div class=\\"cb-card\\"><strong>Compile evidence</strong><p>Contracts, invoices, website and statements that corroborate each other.</p></div>\\n      </div>\\n      <blockquote>Compliance is not a cost — it is the passport to financing, listing and cross-border settlement. YONGHONG offers an annual SRC and registered-office health check.</blockquote>\\n    ","seo_title":"Hong Kong Companies Registry 2026 e-Search and SRC update","seo_description":"What the 2026 Hong Kong e-Search, Significant Controllers Register and registered office changes mean, plus a checklist.","seo_keywords":"hong kong electronic search,SRC,significant controllers register","ext_json":{"tag":"2026 Compliance Update"}}}','{"tag":"2026新规解读"}',1,2,1),
(2,'guide',0,'2026年全球离岸银行开户风控白皮书：如何100%避开KYC审查雷区？','各大外资银行对合规流水穿透审核加剧，本文由前外资银行合规经理为您揭秘视频见证必问的5大核心问题...',NULL,'
      <p>2026 年主要外资银行对跨境资金的穿透式审核明显收紧，开户被拒的主要原因已经从"资料不全"转向"资金来源解释不清"。</p>
      <h2>视频见证必问的 5 个问题</h2>
      <ol>
        <li>您的公司主要客户在哪些国家？单笔交易金额区间是多少？</li>
        <li>资金来源是货款、服务费还是投资款？能否提供合同与发票？</li>
        <li>预计每月收支笔数与金额？是否有大额一次性交易？</li>
        <li>是否有实质经营活动（办公室、员工、网站）？</li>
        <li>最终受益人是谁？股权结构是否有代持？</li>
      </ol>
      <h2>被拒率最高的三类情形</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>行业敏感</strong><p>加密货币、博彩、贵金属、军民两用等需提前准备专项说明。</p></div>
        <div class="cb-card"><strong>流水异常</strong><p>个人账户与公司账户混用、频繁大额整数进出。</p></div>
        <div class="cb-card"><strong>资料矛盾</strong><p>网站、合同、发票与流水对不上，是面签最容易翻车的点。</p></div>
        <div class="cb-card"><strong>应对方案</strong><p>提前做 KYC 预审 + 面签模拟，是我们通过率 98.6% 的关键。</p></div>
      </div>
      <blockquote>提示：切勿听信"包过"话术。合规的开户辅导是把您的真实经营讲清楚，而不是编造故事。</blockquote>
    ','offshore-bank-kyc-whitepaper-2026','永鸿国际银行渠道部',2890,0,1,'[1,3]','2026-03-10 10:30:00','2026离岸银行开户KYC风控白皮书|避免被拒的5个要点','前外资银行合规经理解析 2026 离岸开户 KYC 审查：5 大必问问题、3 类高拒率情形与预审方法。','离岸银行开户,KYC,香港开户,银行面签','{"en":{"title":"2026 Global Offshore Banking KYC Whitepaper: how to clear screening","summary":"Banks now audit cross-border flows far more aggressively. A former compliance manager reveals the five questions asked in every video interview...","content":"\\n      <p>In 2026 the major foreign banks tightened look-through review of cross-border funds. Rejections now stem less from missing paperwork and more from an unconvincing source of wealth.</p>\\n      <h2>The five questions asked in every interview</h2>\\n      <ol>\\n        <li>Which countries are your customers in, and what is the typical transaction size?</li>\\n        <li>Is the money from goods, services or investment? Can you show contracts and invoices?</li>\\n        <li>What monthly volume do you expect? Any large one-off transactions?</li>\\n        <li>Is there real substance — office, staff, website?</li>\\n        <li>Who are the ultimate beneficial owners? Any nominee holdings?</li>\\n      </ol>\\n      <h2>Three situations with the highest rejection rate</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Sensitive industries</strong><p>Crypto, gambling, precious metals and dual-use goods need a pre-written explanation.</p></div>\\n        <div class=\\"cb-card\\"><strong>Abnormal flows</strong><p>Mixing personal and corporate accounts, frequent round-number transfers.</p></div>\\n        <div class=\\"cb-card\\"><strong>Contradictory files</strong><p>Website, contracts, invoices and statements that do not line up.</p></div>\\n        <div class=\\"cb-card\\"><strong>The fix</strong><p>Pre-audit plus a mock interview — the reason our approval rate is 98.6%.</p></div>\\n      </div>\\n      <blockquote>A warning: ignore anyone promising a guaranteed account. Proper coaching tells your real business story — it does not invent one.</blockquote>\\n    ","seo_title":"2026 Offshore Bank KYC Whitepaper | Clear every interview","seo_description":"The five KYC questions, three highest-risk situations and how to pre-audit an offshore account application.","seo_keywords":"offshore bank account,kyc,hong kong account opening","ext_json":{"tag":"Banking Brief"}}}','{"tag":"离岸银行专报"}',1,2,1),
(3,'news',1,'香港公司离岸免税申请(Offshore Claim)实操案例与合规风险防范','离岸所得免税并非“零申报”！税务局对无保留意见审计报告的抽查率大幅上升，企业应如何建立合规证据链...',NULL,'
      <p>很多企业误以为"公司在香港没有办公室 = 可以零申报"。实际上，离岸所得免税（Offshore Claim）需要在审计报告中给出充分依据，由税务局个案审批。</p>
      <h2>税务局重点看什么</h2>
      <ul>
        <li>合同签署地与履约地在哪里</li>
        <li>货物的实际运输路径与报关记录</li>
        <li>决策与管理是否在香港境内发生</li>
        <li>收款账户所在地与资金流向</li>
      </ul>
      <h2>实操案例</h2>
      <p>某跨境电商企业 2024 年申请离岸免税，因无法提供与境外供应商的完整物流单证，被要求补充资料并最终按 80% 核定。整改后我们协助补齐了合同、提单与邮件决策记录，2025 年获批全额离岸豁免。</p>
      <div class="cb-cards2">
        <div class="cb-card"><strong>证据链四件套</strong><p>合同 + 物流单证 + 决策邮件 + 收付款凭证，缺一不可。</p></div>
        <div class="cb-card"><strong>时间线要闭合</strong><p>合同日期、发货日期、收款日期必须能串成合理顺序。</p></div>
        <div class="cb-card"><strong>切忌账外账</strong><p>两套账一旦被穿透，后续三年都会成为重点抽查对象。</p></div>
        <div class="cb-card"><strong>年度复盘</strong><p>每年报税前做一次离岸证据链自查，比事后补救省十倍。</p></div>
      </div>
      <blockquote>离岸免税是合法权利，但不是默认结果。把证据做在平时，才是最稳的筹划。</blockquote>
    ','hong-kong-offshore-claim-guide','永鸿国际财税部',3150,0,1,'[1,2]','2026-02-28 14:00:00','香港离岸免税申请实操案例|Offshore Claim合规风险防范','香港离岸所得免税并非零申报：税务局审查要点、实操案例与合规证据链建设方法。','香港离岸免税,offshore claim,香港审计,香港报税','{"en":{"title":"Hong Kong offshore claim: worked example and compliance risks","summary":"An offshore claim is not a nil filing. With audit sampling rising sharply, how should a company build its evidence chain?","content":"\\n      <p>Many firms assume that having no office in Hong Kong means a nil filing. In fact an offshore claim must be substantiated inside the audit report and is approved case by case by the IRD.</p>\\n      <h2>What the IRD examines</h2>\\n      <ul>\\n        <li>Where the contract was signed and performed</li>\\n        <li>The actual routing of goods and customs records</li>\\n        <li>Whether decision-making and management happened in Hong Kong</li>\\n        <li>Where the receiving account sits and how funds moved</li>\\n      </ul>\\n      <h2>A worked example</h2>\\n      <p>A cross-border e-commerce company claimed offshore status for 2024 but could not produce complete logistics documents; the claim was settled at 80%. After we supplied contracts, bills of lading and decision emails, the 2025 claim was approved in full.</p>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>The four pillars</strong><p>Contract, logistics documents, decision emails, payment records.</p></div>\\n        <div class=\\"cb-card\\"><strong>Close the timeline</strong><p>Contract, shipment and payment dates must form a plausible sequence.</p></div>\\n        <div class=\\"cb-card\\"><strong>No shadow accounts</strong><p>Once two sets of books are found, three years become a target.</p></div>\\n        <div class=\\"cb-card\\"><strong>Annual review</strong><p>A pre-filing self-check is ten times cheaper than correcting it afterwards.</p></div>\\n      </div>\\n      <blockquote>An offshore claim is a right, not a default outcome. Build the evidence throughout the year — that is the safest planning.</blockquote>\\n    ","seo_title":"Hong Kong Offshore Claim guide | Compliance risks","seo_description":"What the IRD checks in an offshore claim, a worked example and how to build a complete evidence chain.","seo_keywords":"hong kong offshore claim,hong kong audit,hong kong tax","ext_json":{"tag":"Tax & Audit"}}}','{"tag":"财税审计筹划"}',1,2,1),
(11,'about',0,'公司简介','永鸿国际咨询（深圳）有限公司 · 官方认证权威出海机构，一站式、全合规的跨境企业综合服务',NULL,'
      <div class="cb-lead">永鸿国际咨询（深圳）有限公司，成立于 2018 年 12 月 20 日，统一社会信用代码：91440300MA5FEMF959。</div>

      <h2>立足大湾区，服务中资企业出海</h2>
      <p>公司立足深圳大湾区枢纽（深圳市罗湖区迎春路3号海燕大厦20层），辐射全球离岸金融中心。致力于为中国优质出海企业、跨境电商卖家、跨国投资机构提供一站式、全合规的跨境企业综合服务。</p>
      <p>业务覆盖香港公司注册与维护、香港/新加坡银行开户、离岸公司架构与做账审计、海外商标专利注册等核心板块。我们坚持"合规先行、结果可验"，每一份方案均出具书面风险提示与费用清单，帮助客户在陌生法域里走得稳、走得远。</p>

      <div class="cb-cards2">
        <div class="cb-card"><span class="cb-card__icon">◆</span><strong>持牌信托及公司服务提供商 (TCSP)</strong></div>
        <div class="cb-card"><span class="cb-card__icon">⚖</span><strong>资深合规财税审计师驻场保障</strong></div>
      </div>

      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">2018</div><div class="cb-card__label">成立年份</div></div>
        <div class="cb-card"><div class="cb-card__value">10,000+</div><div class="cb-card__label">累计服务企事业单位</div></div>
        <div class="cb-card"><div class="cb-card__value">8 年+</div><div class="cb-card__label">团队平均从业年限</div></div>
        <div class="cb-card"><div class="cb-card__value">HK / SG</div><div class="cb-card__label">香港·新加坡双中心</div></div>
      </div>
    ','about-profile','永鸿国际',0,0,0,'[12,13,14]','2026-01-01 00:00:00','公司简介|永鸿国际咨询（深圳）有限公司','永鸿国际咨询（深圳）有限公司成立于2018年，TCSP持牌，提供香港公司注册、银行开户、做账审计与海外商标一站式服务。','永鸿国际,公司简介,出海企服','{"en":{"title":"Company Profile","summary":"YONGHONG International Consulting (Shenzhen) — an accredited one-stop, fully compliant cross-border corporate services firm.","content":"\\n      <div class=\\"cb-lead\\">YONGHONG International Consulting (Shenzhen) Co., Ltd. was incorporated on 20 December 2018. Unified Social Credit Code: 91440300MA5FEMF959.</div>\\n\\n      <h2>Anchored in the Greater Bay Area</h2>\\n      <p>Based in Shenzhen at the heart of the Greater Bay Area (20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District) and reaching the world''s offshore financial centres, we serve Chinese exporters, cross-border e-commerce sellers and multinational investors with a one-stop, fully compliant service.</p>\\n      <p>Our core practices cover Hong Kong company registration and maintenance, Hong Kong and Singapore bank accounts, offshore structures with bookkeeping and audit, and overseas trademark and patent filing. We put compliance first and prove results: every plan comes with a written risk note and an itemised fee list.</p>\\n\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><span class=\\"cb-card__icon\\">◆</span><strong>Licensed Trust or Company Service Provider (TCSP)</strong></div>\\n        <div class=\\"cb-card\\"><span class=\\"cb-card__icon\\">⚖</span><strong>Senior compliance and audit specialists on site</strong></div>\\n      </div>\\n\\n      <div class=\\"cb-cards4\\">\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">2018</div><div class=\\"cb-card__label\\">Founded</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">10,000+</div><div class=\\"cb-card__label\\">Organisations served</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">8 yrs+</div><div class=\\"cb-card__label\\">Average consultant experience</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">HK / SG</div><div class=\\"cb-card__label\\">Hong Kong & Singapore hubs</div></div>\\n      </div>\\n    ","seo_title":"Company Profile | YONGHONG International Consulting","seo_description":"Founded in 2018, TCSP licensed — one-stop Hong Kong company registration, bank accounts, audit and trademarks.","seo_keywords":"yonghong,company profile,corporate services"}}','{"badge":"About Us · Company Profile"}',1,2,1),
(12,'about',0,'团队展示','离岸商务架构师、香港执业注册会计师与涉外合规法务组成的专业班底',NULL,'
      <p>永鸿国际汇聚业内顶尖离岸商务架构师、香港执业注册会计师 (HKICPA) 及涉外合规法务团队，平均从业年限 8 年以上。核心顾问均具备大湾区银行、会计师事务所或律所背景，能够针对客户实际经营场景给出可落地的合规路径。</p>

      <div class="cb-persons">
        <div class="cb-person">
          <span class="cb-person__avatar">陈</span>
          <div class="cb-person__body">
            <div class="cb-person__name">陈经理 · 高级出海合规顾问</div>
            <div class="cb-person__meta">工号 8016 · 10年大湾区离岸架构与银行VIP通道经验</div>
          </div>
          <span class="cb-person__badge">金牌顾问</span>
        </div>
        <div class="cb-person cb-person--teal">
          <span class="cb-person__avatar">黄</span>
          <div class="cb-person__body">
            <div class="cb-person__name">黄会计师 · 香港执业注册审计师</div>
            <div class="cb-person__meta">香港会计师公会资深会员 · 精通离岸免税申报与BEPS 2.0</div>
          </div>
          <span class="cb-person__badge">审计主管</span>
        </div>
      </div>

      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">HKICPA</div><div class="cb-card__label">香港执业注册会计师</div></div>
        <div class="cb-card"><div class="cb-card__value">TCSP</div><div class="cb-card__label">持牌公司服务顾问</div></div>
        <div class="cb-card"><div class="cb-card__value">Legal</div><div class="cb-card__label">涉外合规法务</div></div>
        <div class="cb-card"><div class="cb-card__value">CS</div><div class="cb-card__label">专属客服跟进</div></div>
      </div>
    ','about-team','永鸿国际',0,0,0,'[11,13,14]','2026-01-01 00:00:00','团队展示|离岸架构师与香港执业会计师','永鸿国际核心团队由离岸商务架构师、香港执业注册会计师 HKICPA 与涉外合规法务组成，平均从业8年以上。','团队展示,离岸架构师,香港会计师','{"en":{"title":"Our Team","summary":"A professional bench of offshore structuring consultants, Hong Kong certified practising accountants and cross-border compliance lawyers.","content":"\\n      <p>YONGHONG brings together leading offshore structuring consultants, Hong Kong certified practising accountants (HKICPA) and cross-border compliance lawyers with an average of more than eight years'' experience. Our core advisers come from Greater Bay Area banks, accounting firms and law firms, and turn real operating conditions into workable compliance paths.</p>\\n\\n      <div class=\\"cb-persons\\">\\n        <div class=\\"cb-person\\">\\n          <span class=\\"cb-person__avatar\\">C</span>\\n          <div class=\\"cb-person__body\\">\\n            <div class=\\"cb-person__name\\">Mr. Chan · Senior Overseas Compliance Consultant</div>\\n            <div class=\\"cb-person__meta\\">Staff No. 8016 · 10 years in GBA offshore structuring and bank VIP channels</div>\\n          </div>\\n          <span class=\\"cb-person__badge\\">Gold adviser</span>\\n        </div>\\n        <div class=\\"cb-person cb-person--teal\\">\\n          <span class=\\"cb-person__avatar\\">W</span>\\n          <div class=\\"cb-person__body\\">\\n            <div class=\\"cb-person__name\\">Ms. Wong · HK Certified Practising Auditor</div>\\n            <div class=\\"cb-person__meta\\">Fellow of the HKICPA · offshore exemption filing and BEPS 2.0</div>\\n          </div>\\n          <span class=\\"cb-person__badge\\">Audit lead</span>\\n        </div>\\n      </div>\\n\\n      <div class=\\"cb-cards4\\">\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">HKICPA</div><div class=\\"cb-card__label\\">Practising accountants</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">TCSP</div><div class=\\"cb-card__label\\">Licensed company secretaries</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">Legal</div><div class=\\"cb-card__label\\">Cross-border compliance counsel</div></div>\\n        <div class=\\"cb-card\\"><div class=\\"cb-card__value\\">CS</div><div class=\\"cb-card__label\\">Dedicated customer follow-up</div></div>\\n      </div>\\n    ","seo_title":"Our Team | Offshore consultants & HK practising accountants","seo_description":"Our core team of offshore structuring consultants, HKICPA practising accountants and cross-border compliance lawyers.","seo_keywords":"our team,offshore consultant,hkicpa"}}','{"badge":"About Us · Our Team"}',1,2,1),
(13,'about',0,'企业招聘','永鸿国际业务高速发展，诚邀热爱跨境出海行业的优秀人才加入我们',NULL,'
      <div class="cb-jobs">
        <div class="cb-job cb-job--amber">
          <div class="cb-job__head">
            <span class="cb-job__title">出海企服商务顾问 (全职)</span>
            <span class="cb-job__pay">8K-18K + 提成</span>
          </div>
          <p class="cb-job__desc">要求：大专及以上，1年以上跨境企服/外贸商务经验，沟通能力强。享有五险一金、带薪年假。</p>
        </div>
        <div class="cb-job cb-job--emerald">
          <div class="cb-job__head">
            <span class="cb-job__title">离岸做账审计合规专员 (双休)</span>
            <span class="cb-job__pay">7K-13K</span>
          </div>
          <p class="cb-job__desc">要求：财会专业，熟悉香港/新加坡税法审计流程，具备高度保密意识。</p>
        </div>
      </div>

      <div class="cb-resume">
        <div class="cb-resume__body">
          <div class="cb-resume__label">简历直投邮箱</div>
          <div class="cb-resume__mail">805856285@qq.com（注明应聘岗位）</div>
        </div>
        <span class="cb-resume__tip">官方咨询专线 18123763835</span>
      </div>
    ','about-careers','永鸿国际',0,0,0,'[11,12,14]','2026-01-01 00:00:00','企业招聘|永鸿国际加入我们','永鸿国际招聘出海企服商务顾问与离岸做账审计合规专员，五险一金带薪年假，简历直投 805856285@qq.com。','企业招聘,出海企服,跨境商务顾问','{"en":{"title":"Careers","summary":"YONGHONG is growing fast — we would love to meet talented people who are passionate about cross-border business.","content":"\\n      <div class=\\"cb-jobs\\">\\n        <div class=\\"cb-job cb-job--amber\\">\\n          <div class=\\"cb-job__head\\">\\n            <span class=\\"cb-job__title\\">Business Consultant, Global Services (Full-time)</span>\\n            <span class=\\"cb-job__pay\\">¥8K–18K + commission</span>\\n          </div>\\n          <p class=\\"cb-job__desc\\">Associate degree or above; 1+ year in cross-border services or foreign trade; strong communicator. Social insurance, housing fund and paid annual leave included.</p>\\n        </div>\\n        <div class=\\"cb-job cb-job--emerald\\">\\n          <div class=\\"cb-job__head\\">\\n            <span class=\\"cb-job__title\\">Offshore Audit & Compliance Officer (5 days)</span>\\n            <span class=\\"cb-job__pay\\">¥7K–13K</span>\\n          </div>\\n          <p class=\\"cb-job__desc\\">Accounting background; familiar with Hong Kong / Singapore tax and audit procedures; high sense of confidentiality.</p>\\n        </div>\\n      </div>\\n\\n      <div class=\\"cb-resume\\">\\n        <div class=\\"cb-resume__body\\">\\n          <div class=\\"cb-resume__label\\">Send your CV directly to</div>\\n          <div class=\\"cb-resume__mail\\">805856285@qq.com (please state the position)</div>\\n        </div>\\n        <span class=\\"cb-resume__tip\\">Hotline +86 18123763835</span>\\n      </div>\\n    ","seo_title":"Careers | Join YONGHONG","seo_description":"We are hiring business consultants and offshore audit compliance officers — apply at 805856285@qq.com.","seo_keywords":"careers,corporate services jobs"}}','{"badge":"About Us · Careers"}',1,2,1),
(14,'about',0,'联系我们','深圳总部 · 香港/新加坡双中心，欢迎来电或到访咨询',NULL,'
      <div class="cb-cta">
        <div class="cb-cta__body">
          <div class="cb-cta__title">留下您的联系方式</div>
          <div class="cb-cta__sub">资深顾问将为您出具书面方案与费用清单，咨询全程免费</div>
        </div>
        <button type="button" class="cb-cta__btn" data-inquiry="公司简介与合作咨询">在线留言获取方案</button>
      </div>

      <h2>服务时间</h2>
      <p>周一至周六 09:00 – 18:30（GMT+8）；非工作时间留言，顾问将于下一个工作日 10 分钟内响应。</p>

      <div class="cb-cards2">
        <div class="cb-card"><strong>深圳总部</strong><p>深圳市罗湖区南湖街道嘉北社区迎春路3号海燕大厦20层2010</p></div>
        <div class="cb-card"><strong>香港中心</strong><p>香港九龙尖沙咀（面签与政府递交，需提前预约）</p></div>
      </div>
    ','about-contact','永鸿国际',0,0,0,'[11,12,13]','2026-01-01 00:00:00','联系我们|永鸿国际深圳总部地址电话','永鸿国际深圳总部地址、官方咨询专线 18123763835 与邮箱，在线留言 10 分钟内响应。','联系我们,深圳出海企服,咨询电话','{"en":{"title":"Contact Us","summary":"Shenzhen headquarters · Hong Kong and Singapore hubs — call or visit us.","content":"\\n      <div class=\\"cb-cta\\">\\n        <div class=\\"cb-cta__body\\">\\n          <div class=\\"cb-cta__title\\">Leave your contact details</div>\\n          <div class=\\"cb-cta__sub\\">A senior consultant will send a written plan and fee list — consultation is free</div>\\n        </div>\\n        <button type=\\"button\\" class=\\"cb-cta__btn\\" data-inquiry=\\"Company profile & partnership enquiry\\">Send an online enquiry</button>\\n      </div>\\n\\n      <h2>Opening hours</h2>\\n      <p>Monday to Saturday, 09:00 – 18:30 (GMT+8). Messages left outside these hours are answered within 10 minutes of the next working day.</p>\\n\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Shenzhen HQ</strong><p>20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District, Shenzhen</p></div>\\n        <div class=\\"cb-card\\"><strong>Hong Kong office</strong><p>Tsim Sha Tsui, Kowloon (interviews and government filings by appointment)</p></div>\\n      </div>\\n    ","seo_title":"Contact Us | YONGHONG Shenzhen HQ","seo_description":"Address, hotline +86 18123763835 and email of YONGHONG — online enquiries answered within 10 minutes.","seo_keywords":"contact us,corporate services shenzhen"}}','{"badge":"About Us · Contact"}',1,2,1),
(21,'page',0,'隐私政策','我们如何收集、使用、存储与保护您的个人信息，以及您享有的权利。',NULL,'
      <p><strong>版本号：v1.0　·　生效日期：2026-01-01</strong></p>
      <p>本政策适用于永鸿国际咨询（深圳）有限公司（以下简称"我们"）官方网站及在线咨询服务。您在提交咨询表单前，必须勾选"我已阅读并同意《隐私政策》"，我们将在服务器记录您的同意时间与本政策版本号作为同意凭证。</p>

      <h2>一、我们收集哪些信息</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>您主动提供的</strong><p>称呼、联系电话、微信/邮箱、公司名称、需求描述。</p></div>
        <div class="cb-card"><strong>自动采集的</strong><p>IP 地址、浏览器与设备标识、来路页面、UTM 营销参数、访问日志。</p></div>
      </div>

      <h2>二、我们如何使用这些信息</h2>
      <ul>
        <li>用于与您取得联系并提供您所咨询的业务方案与报价；</li>
        <li>用于履行法律法规要求的客户尽职调查（KYC）义务；</li>
        <li>用于改进网站内容与服务体验（去标识化统计）；</li>
        <li><strong>我们不会向任何第三方出售您的个人信息。</strong></li>
      </ul>

      <h2>三、存储与保护</h2>
      <p>个人信息存储于中华人民共和国境内的服务器，保存期限为实现处理目的所必要的最短时间，一般为自最后一次联系起 3 年。我们采取传输加密、后台权限分级、列表脱敏（手机号默认显示为 138****8000）等措施。</p>

      <h2>四、您享有的权利</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>查阅与复制</strong><p>您有权查阅、复制我们持有的您的个人信息。</p></div>
        <div class="cb-card"><strong>更正与补充</strong><p>信息有误时可要求更正。</p></div>
        <div class="cb-card"><strong>删除</strong><p>在法定情形下可要求删除。</p></div>
        <div class="cb-card"><strong>撤回同意</strong><p>您可随时撤回同意，撤回不影响此前处理的效力。</p></div>
      </div>

      <h2>五、联系我们</h2>
      <p>如对本政策有任何疑问，或行使上述权利，请发送邮件至 <strong>805856285@qq.com</strong>，或致电 <strong>18123763835</strong>。我们将在 15 个工作日内答复。</p>

      <h2>六、政策更新</h2>
      <p>本政策发生实质变更时，我们将提升版本号并在本页公示。新的版本号将用于后续新的同意记录，历史同意凭证仍对应当时的版本。</p>
    ','privacy-policy','永鸿国际',0,0,0,'[22]','2026-01-01 00:00:00','隐私政策|永鸿国际个人信息保护','永鸿国际隐私政策 v1.0：收集范围、使用目的、存储期限、脱敏措施与您享有的查阅/更正/删除/撤回同意权利。','隐私政策,个人信息保护,PIPL','{"en":{"title":"Privacy Policy","summary":"How we collect, use, store and protect your personal information, and the rights available to you.","content":"\\n      <p><strong>Version v1.0 · Effective 1 January 2026</strong></p>\\n      <p>This policy applies to the website and online consultation services of YONGHONG International Consulting (Shenzhen) Co., Ltd. Before submitting an enquiry you must tick \\"I have read and accepted the Privacy Policy\\"; we record the acceptance time and this policy version on our server as evidence of consent.</p>\\n\\n      <h2>1. What we collect</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>You provide</strong><p>Name, phone number, WeChat / email, company name and your requirements.</p></div>\\n        <div class=\\"cb-card\\"><strong>Collected automatically</strong><p>IP address, browser and device identifiers, referrer and UTM parameters, access logs.</p></div>\\n      </div>\\n\\n      <h2>2. How we use it</h2>\\n      <ul>\\n        <li>To contact you and provide the plan and quotation you asked for;</li>\\n        <li>To perform customer due diligence (KYC) required by law;</li>\\n        <li>To improve the website through aggregated, de-identified statistics;</li>\\n        <li><strong>We never sell your personal information to third parties.</strong></li>\\n      </ul>\\n\\n      <h2>3. Storage and protection</h2>\\n      <p>Data is stored on servers within the People''s Republic of China for the shortest period necessary — normally three years after your last contact. We use encrypted transport, tiered back-office permissions and masked listing (phone shown as 138****8000 by default).</p>\\n\\n      <h2>4. Your rights</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Access & copy</strong><p>Request a copy of the data we hold.</p></div>\\n        <div class=\\"cb-card\\"><strong>Correction</strong><p>Ask us to correct inaccurate data.</p></div>\\n        <div class=\\"cb-card\\"><strong>Deletion</strong><p>Request deletion where the law allows.</p></div>\\n        <div class=\\"cb-card\\"><strong>Withdraw consent</strong><p>Withdraw at any time without affecting prior processing.</p></div>\\n      </div>\\n\\n      <h2>5. Contact</h2>\\n      <p>Questions or rights requests: <strong>805856285@qq.com</strong> or <strong>+86 18123763835</strong>. We reply within 15 working days.</p>\\n\\n      <h2>6. Updates</h2>\\n      <p>Material changes raise the version number and are published on this page. New consent records reference the new version; historical evidence still points to the version accepted at the time.</p>\\n    ","seo_title":"Privacy Policy | YONGHONG","seo_description":"YONGHONG Privacy Policy v1.0 — what we collect, why, how long we keep it and the rights you can exercise.","seo_keywords":"privacy policy,personal information,PIPL"}}','{}',1,2,1),
(22,'page',0,'服务条款','使用本网站与在线咨询服务的法律条款与双方权利义务。',NULL,'
      <p><strong>版本号：v1.0　·　生效日期：2026-01-01</strong></p>

      <h2>一、服务性质</h2>
      <p>本网站提供的内容仅供参考，不构成法律、税务或投资意见。具体服务以双方另行签署的书面委托协议为准。</p>

      <h2>二、网站使用规范</h2>
      <ul>
        <li>不得利用本站从事任何违法违规活动；</li>
        <li>不得以爬虫、脚本等方式干扰网站正常运行；</li>
        <li>不得冒用他人身份提交咨询信息。</li>
      </ul>

      <h2>三、知识产权</h2>
      <p>本站的文字、图片、版式与标识归永鸿国际或其权利人所有。未经书面许可，不得复制、转载或用于商业用途。</p>

      <h2>四、免责与限制</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>审批结果</strong><p>政府与银行的审批结果由主管机关独立决定，我方不承诺必然通过。</p></div>
        <div class="cb-card"><strong>第三方网站</strong><p>友情链接指向的第三方网站，其内容与隐私 practices 由该方负责。</p></div>
      </div>

      <h2>五、费用与退款</h2>
      <p>所有费用以书面报价单为准；因我方原因未能完成委托事项的，按委托协议约定退还相应服务费。</p>

      <h2>六、适用法律与争议解决</h2>
      <p>本条款适用中华人民共和国法律。争议双方应先友好协商；协商不成的，提交我方所在地有管辖权的人民法院诉讼解决。</p>

      <h2>七、联系我们</h2>
      <p>邮箱 <strong>805856285@qq.com</strong>　电话 <strong>18123763835</strong></p>
    ','terms-of-service','永鸿国际',0,0,0,'[21]','2026-01-01 00:00:00','服务条款|永鸿国际网站使用条款','永鸿国际服务条款 v1.0：网站使用规范、知识产权、免责限制、费用退款与争议解决。','服务条款,网站条款,使用协议','{"en":{"title":"Terms of Service","summary":"Legal terms governing the use of this website and our online consultation services.","content":"\\n      <p><strong>Version v1.0 · Effective 1 January 2026</strong></p>\\n\\n      <h2>1. Nature of the service</h2>\\n      <p>Content on this website is for general reference only and does not constitute legal, tax or investment advice. Specific services are governed by a separate written engagement letter.</p>\\n\\n      <h2>2. Acceptable use</h2>\\n      <ul>\\n        <li>No unlawful activity through this website;</li>\\n        <li>No scraping or scripts that disrupt normal operation;</li>\\n        <li>No impersonation when submitting enquiries.</li>\\n      </ul>\\n\\n      <h2>3. Intellectual property</h2>\\n      <p>Text, images, layout and marks on this site belong to YONGHONG or its licensors. No reproduction or commercial use without written permission.</p>\\n\\n      <h2>4. Disclaimers</h2>\\n      <div class=\\"cb-cards2\\">\\n        <div class=\\"cb-card\\"><strong>Approvals</strong><p>Government and bank decisions are made independently; we do not guarantee approval.</p></div>\\n        <div class=\\"cb-card\\"><strong>Third-party sites</strong><p>Linked sites are the responsibility of their operators, including their privacy practices.</p></div>\\n      </div>\\n\\n      <h2>5. Fees and refunds</h2>\\n      <p>All fees follow the written quotation. If we fail to complete an engagement for reasons attributable to us, service fees are refunded as set out in the engagement letter.</p>\\n\\n      <h2>6. Governing law</h2>\\n      <p>These terms are governed by the laws of the People''s Republic of China. Disputes are settled amicably first, failing which the competent people''s court where we are located has jurisdiction.</p>\\n\\n      <h2>7. Contact</h2>\\n      <p>Email <strong>805856285@qq.com</strong>　Phone <strong>+86 18123763835</strong></p>\\n    ","seo_title":"Terms of Service | YONGHONG","seo_description":"YONGHONG Terms of Service v1.0 — acceptable use, IP, disclaimers, fees and governing law.","seo_keywords":"terms of service,terms of use"}}','{}',1,2,1);
