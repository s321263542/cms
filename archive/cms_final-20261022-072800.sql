/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.5.29-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: cms
-- ------------------------------------------------------
-- Server version	5.7.40-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `cms`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cms` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `cms`;

--
-- Table structure for table `cms_article`
--

DROP TABLE IF EXISTS `cms_article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_article` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `category_type` varchar(30) NOT NULL DEFAULT 'news' COMMENT '类型(字典 cms_article_type): news/guide/faq/about/page',
  `country_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '国家ID,0=通用/全部',
  `title` varchar(200) NOT NULL COMMENT '标题(中文=默认)',
  `summary` varchar(500) DEFAULT NULL COMMENT '摘要(列表页展示)',
  `cover_url` varchar(255) DEFAULT NULL COMMENT '封面 object key',
  `content` mediumtext COMMENT '正文 HTML(Jsoup 白名单已过滤)',
  `slug` varchar(100) NOT NULL COMMENT 'SEO URL(英文一套,如 privacy-policy)',
  `author` varchar(64) DEFAULT '永鸿国际' COMMENT '作者/来源',
  `views` int(11) NOT NULL DEFAULT '0' COMMENT '浏览量(Redis 计数,定时回写)',
  `is_top` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否置顶 1是',
  `is_recommend` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否推荐 1是',
  `related_ids` json DEFAULT NULL COMMENT '相关文章ID(应用层维护)',
  `published_at` datetime DEFAULT NULL COMMENT '发布时间(置空=未发布)',
  `seo_title` varchar(200) DEFAULT NULL COMMENT 'SEO 标题',
  `seo_description` varchar(300) DEFAULT NULL COMMENT 'SEO 描述',
  `seo_keywords` varchar(200) DEFAULT NULL COMMENT 'SEO 关键词',
  `i18n_json` json DEFAULT NULL COMMENT '英文增量 {"en":{"title":"","summary":"","content":"","seo_title":"","seo_description":""}}',
  `ext_json` json DEFAULT NULL COMMENT '扩展字段',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1显示 0隐藏',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除',
  `created_by` varchar(64) DEFAULT 'admin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `publish_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  `live_flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  `draft_json` json DEFAULT NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  `live_version_id` bigint(20) unsigned DEFAULT NULL COMMENT '当前生效版本 cms_content_version.version_id',
  `submitted_by` varchar(64) DEFAULT NULL COMMENT '提交审核人',
  `submitted_at` datetime DEFAULT NULL COMMENT '提交审核时间',
  `published_by` varchar(64) DEFAULT NULL COMMENT '发布人（责任落点）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COMMENT='文章(政策/指南/百科/关于/页面)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_article`
--

LOCK TABLES `cms_article` WRITE;
/*!40000 ALTER TABLE `cms_article` DISABLE KEYS */;
INSERT INTO `cms_article` VALUES (1,'news',1,'香港特区公司注册处2026年最新全面电子查册及穿透监管要点','香港公司注册处最新合规指引正式生效，针对重要控制人登记册(SCR)及挂牌地址核查提出更高标准...',NULL,'\n      <p>香港公司注册处于 2026 年起进一步收紧电子查册与重要控制人透明度要求。对已有香港公司的企业而言，这既是合规压力，也是一次把历史遗留问题清理干净的机会。</p>\n      <h2>三个最需要关注的变化</h2>\n      <ul>\n        <li><strong>电子查册记录留痕</strong>——查册人身份与用途需登记，敏感资料的批量导出受到限制。</li>\n        <li><strong>重要控制人登记册（SCR）抽查常态化</strong>——注册办事处须备存最新 SCR，秘书公司会不定期核对。</li>\n        <li><strong>挂牌地址穿透核查</strong>——虚拟地址若无法联系到公司，可能被要求限期整改。</li>\n      </ul>\n      <h2>企业现在应该做的四件事</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>核对董事股东资料</strong><p>确保护照/身份证件在有效期内，住址证明不超过 3 个月。</p></div>\n        <div class=\"cb-card\"><strong>更新 SCR</strong><p>股权转让、董事变更后 7 个工作日内更新重要控制人资料。</p></div>\n        <div class=\"cb-card\"><strong>确认挂牌地址可达</strong><p>确保信件有人签收，避免被注册处标记为失联。</p></div>\n        <div class=\"cb-card\"><strong>整理业务佐证</strong><p>合同、发票、网站与流水相互印证，应对银行年度复核。</p></div>\n      </div>\n      <blockquote>合规不是成本，而是融资、上市与跨境结汇的通行证。永鸿国际可为存量香港公司提供 SCR 与挂牌地址的年度体检服务。</blockquote>\n    ','hk-registry-2026-electronic-search','永鸿国际合规研究中心',1420,1,1,'[2, 3]','2026-03-15 09:00:00','香港公司注册处2026电子查册与SCR监管要点解读','香港公司注册处 2026 年电子查册、重要控制人登记册 SCR 与挂牌地址核查新要求，及企业应对清单。','香港电子查册,SCR,重要控制人登记册,香港合规','{\"en\": {\"title\": \"Hong Kong Companies Registry 2026: e-Search and look-through regulation explained\", \"content\": \"\\n      <p>From 2026 the Companies Registry tightens electronic search records and beneficial-ownership transparency. For companies already established in Hong Kong this is both a compliance burden and a chance to clear historical issues.</p>\\n      <h2>Three changes that matter most</h2>\\n      <ul>\\n        <li><strong>Search records are logged</strong> — searcher identity and purpose are registered, and bulk export of sensitive data is restricted.</li>\\n        <li><strong>SRC spot checks become routine</strong> — a current Significant Controllers Register must be kept at the registered office.</li>\\n        <li><strong>Registered office look-through</strong> — virtual addresses that cannot reach the company may face a rectification order.</li></ul>\\n      <h2>Four things to do now</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Verify director data</strong><p>IDs and passports valid, proof of address under three months old.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Update the SRC</strong><p>Update within seven working days of any share transfer or director change.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Confirm the office is reachable</strong><p>Make sure post is collected so the Registry does not flag the entity.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Compile evidence</strong><p>Contracts, invoices, website and statements that corroborate each other.</p></div>\\n      </div>\\n      <blockquote>Compliance is not a cost — it is the passport to financing, listing and cross-border settlement. YONGHONG offers an annual SRC and registered-office health check.</blockquote>\\n    \", \"summary\": \"The latest compliance guidance takes effect, raising the bar for the Significant Controllers Register and registered office checks...\", \"ext_json\": {\"tag\": \"2026 Compliance Update\"}, \"seo_title\": \"Hong Kong Companies Registry 2026 e-Search and SRC update\", \"seo_keywords\": \"hong kong electronic search,SRC,significant controllers register\", \"seo_description\": \"What the 2026 Hong Kong e-Search, Significant Controllers Register and registered office changes mean, plus a checklist.\"}}','{\"tag\": \"2026新规解读\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL),(2,'guide',0,'2026年全球离岸银行开户风控白皮书：如何100%避开KYC审查雷区？','各大外资银行对合规流水穿透审核加剧，本文由前外资银行合规经理为您揭秘视频见证必问的5大核心问题...',NULL,'\n      <p>2026 年主要外资银行对跨境资金的穿透式审核明显收紧，开户被拒的主要原因已经从\"资料不全\"转向\"资金来源解释不清\"。</p>\n      <h2>视频见证必问的 5 个问题</h2>\n      <ol>\n        <li>您的公司主要客户在哪些国家？单笔交易金额区间是多少？</li>\n        <li>资金来源是货款、服务费还是投资款？能否提供合同与发票？</li>\n        <li>预计每月收支笔数与金额？是否有大额一次性交易？</li>\n        <li>是否有实质经营活动（办公室、员工、网站）？</li>\n        <li>最终受益人是谁？股权结构是否有代持？</li>\n      </ol>\n      <h2>被拒率最高的三类情形</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>行业敏感</strong><p>加密货币、博彩、贵金属、军民两用等需提前准备专项说明。</p></div>\n        <div class=\"cb-card\"><strong>流水异常</strong><p>个人账户与公司账户混用、频繁大额整数进出。</p></div>\n        <div class=\"cb-card\"><strong>资料矛盾</strong><p>网站、合同、发票与流水对不上，是面签最容易翻车的点。</p></div>\n        <div class=\"cb-card\"><strong>应对方案</strong><p>提前做 KYC 预审 + 面签模拟，是我们通过率 98.6% 的关键。</p></div>\n      </div>\n      <blockquote>提示：切勿听信\"包过\"话术。合规的开户辅导是把您的真实经营讲清楚，而不是编造故事。</blockquote>\n    ','offshore-bank-kyc-whitepaper-2026','永鸿国际银行渠道部',2890,0,1,'[1, 3]','2026-03-10 10:30:00','2026离岸银行开户KYC风控白皮书|避免被拒的5个要点','前外资银行合规经理解析 2026 离岸开户 KYC 审查：5 大必问问题、3 类高拒率情形与预审方法。','离岸银行开户,KYC,香港开户,银行面签','{\"en\": {\"title\": \"2026 Global Offshore Banking KYC Whitepaper: how to clear screening\", \"content\": \"\\n      <p>In 2026 the major foreign banks tightened look-through review of cross-border funds. Rejections now stem less from missing paperwork and more from an unconvincing source of wealth.</p>\\n      <h2>The five questions asked in every interview</h2>\\n      <ol>\\n        <li>Which countries are your customers in, and what is the typical transaction size?</li>\\n        <li>Is the money from goods, services or investment? Can you show contracts and invoices?</li>\\n        <li>What monthly volume do you expect? Any large one-off transactions?</li>\\n        <li>Is there real substance — office, staff, website?</li>\\n        <li>Who are the ultimate beneficial owners? Any nominee holdings?</li>\\n      </ol>\\n      <h2>Three situations with the highest rejection rate</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Sensitive industries</strong><p>Crypto, gambling, precious metals and dual-use goods need a pre-written explanation.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Abnormal flows</strong><p>Mixing personal and corporate accounts, frequent round-number transfers.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Contradictory files</strong><p>Website, contracts, invoices and statements that do not line up.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>The fix</strong><p>Pre-audit plus a mock interview — the reason our approval rate is 98.6%.</p></div>\\n      </div>\\n      <blockquote>A warning: ignore anyone promising a guaranteed account. Proper coaching tells your real business story — it does not invent one.</blockquote>\\n    \", \"summary\": \"Banks now audit cross-border flows far more aggressively. A former compliance manager reveals the five questions asked in every video interview...\", \"ext_json\": {\"tag\": \"Banking Brief\"}, \"seo_title\": \"2026 Offshore Bank KYC Whitepaper | Clear every interview\", \"seo_keywords\": \"offshore bank account,kyc,hong kong account opening\", \"seo_description\": \"The five KYC questions, three highest-risk situations and how to pre-audit an offshore account application.\"}}','{\"tag\": \"离岸银行专报\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL),(3,'news',1,'香港公司离岸免税申请(Offshore Claim)实操案例与合规风险防范','离岸所得免税并非“零申报”！税务局对无保留意见审计报告的抽查率大幅上升，企业应如何建立合规证据链...',NULL,'\n      <p>很多企业误以为\"公司在香港没有办公室 = 可以零申报\"。实际上，离岸所得免税（Offshore Claim）需要在审计报告中给出充分依据，由税务局个案审批。</p>\n      <h2>税务局重点看什么</h2>\n      <ul>\n        <li>合同签署地与履约地在哪里</li>\n        <li>货物的实际运输路径与报关记录</li>\n        <li>决策与管理是否在香港境内发生</li>\n        <li>收款账户所在地与资金流向</li>\n      </ul>\n      <h2>实操案例</h2>\n      <p>某跨境电商企业 2024 年申请离岸免税，因无法提供与境外供应商的完整物流单证，被要求补充资料并最终按 80% 核定。整改后我们协助补齐了合同、提单与邮件决策记录，2025 年获批全额离岸豁免。</p>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>证据链四件套</strong><p>合同 + 物流单证 + 决策邮件 + 收付款凭证，缺一不可。</p></div>\n        <div class=\"cb-card\"><strong>时间线要闭合</strong><p>合同日期、发货日期、收款日期必须能串成合理顺序。</p></div>\n        <div class=\"cb-card\"><strong>切忌账外账</strong><p>两套账一旦被穿透，后续三年都会成为重点抽查对象。</p></div>\n        <div class=\"cb-card\"><strong>年度复盘</strong><p>每年报税前做一次离岸证据链自查，比事后补救省十倍。</p></div>\n      </div>\n      <blockquote>离岸免税是合法权利，但不是默认结果。把证据做在平时，才是最稳的筹划。</blockquote>\n    ','hong-kong-offshore-claim-guide','永鸿国际财税部',3150,0,1,'[1, 2]','2026-02-28 14:00:00','香港离岸免税申请实操案例|Offshore Claim合规风险防范','香港离岸所得免税并非零申报：税务局审查要点、实操案例与合规证据链建设方法。','香港离岸免税,offshore claim,香港审计,香港报税','{\"en\": {\"title\": \"Hong Kong offshore claim: worked example and compliance risks\", \"content\": \"\\n      <p>Many firms assume that having no office in Hong Kong means a nil filing. In fact an offshore claim must be substantiated inside the audit report and is approved case by case by the IRD.</p>\\n      <h2>What the IRD examines</h2>\\n      <ul>\\n        <li>Where the contract was signed and performed</li>\\n        <li>The actual routing of goods and customs records</li>\\n        <li>Whether decision-making and management happened in Hong Kong</li>\\n        <li>Where the receiving account sits and how funds moved</li>\\n      </ul>\\n      <h2>A worked example</h2>\\n      <p>A cross-border e-commerce company claimed offshore status for 2024 but could not produce complete logistics documents; the claim was settled at 80%. After we supplied contracts, bills of lading and decision emails, the 2025 claim was approved in full.</p>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>The four pillars</strong><p>Contract, logistics documents, decision emails, payment records.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Close the timeline</strong><p>Contract, shipment and payment dates must form a plausible sequence.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>No shadow accounts</strong><p>Once two sets of books are found, three years become a target.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Annual review</strong><p>A pre-filing self-check is ten times cheaper than correcting it afterwards.</p></div>\\n      </div>\\n      <blockquote>An offshore claim is a right, not a default outcome. Build the evidence throughout the year — that is the safest planning.</blockquote>\\n    \", \"summary\": \"An offshore claim is not a nil filing. With audit sampling rising sharply, how should a company build its evidence chain?\", \"ext_json\": {\"tag\": \"Tax & Audit\"}, \"seo_title\": \"Hong Kong Offshore Claim guide | Compliance risks\", \"seo_keywords\": \"hong kong offshore claim,hong kong audit,hong kong tax\", \"seo_description\": \"What the IRD checks in an offshore claim, a worked example and how to build a complete evidence chain.\"}}','{\"tag\": \"财税审计筹划\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL),(11,'about',0,'公司简介','永鸿国际咨询（深圳）有限公司 · 官方认证权威出海机构，一站式、全合规的跨境企业综合服务',NULL,'\n      <div class=\"cb-lead\">永鸿国际咨询（深圳）有限公司，成立于 2018 年 12 月 20 日，统一社会信用代码：91440300MA5FEMF959。</div>\n\n      <h2>立足大湾区，服务中资企业出海</h2>\n      <p>公司立足深圳大湾区枢纽（深圳市罗湖区迎春路3号海燕大厦20层），辐射全球离岸金融中心。致力于为中国优质出海企业、跨境电商卖家、跨国投资机构提供一站式、全合规的跨境企业综合服务。</p>\n      <p>业务覆盖香港公司注册与维护、香港/新加坡银行开户、离岸公司架构与做账审计、海外商标专利注册等核心板块。我们坚持\"合规先行、结果可验\"，每一份方案均出具书面风险提示与费用清单，帮助客户在陌生法域里走得稳、走得远。</p>\n\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><span class=\"cb-card__icon\">◆</span><strong>持牌信托及公司服务提供商 (TCSP)</strong></div>\n        <div class=\"cb-card\"><span class=\"cb-card__icon\">⚖</span><strong>资深合规财税审计师驻场保障</strong></div>\n      </div>\n\n      <div class=\"cb-cards4\">\n        <div class=\"cb-card\"><div class=\"cb-card__value\">2018</div><div class=\"cb-card__label\">成立年份</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">10,000+</div><div class=\"cb-card__label\">累计服务企事业单位</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">8 年+</div><div class=\"cb-card__label\">团队平均从业年限</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">HK / SG</div><div class=\"cb-card__label\">香港·新加坡双中心</div></div>\n      </div>\n    ','about-profile','永鸿国际',0,0,0,'[12, 13, 14]','2026-01-01 00:00:00','公司简介|永鸿国际咨询（深圳）有限公司','永鸿国际咨询（深圳）有限公司成立于2018年，TCSP持牌，提供香港公司注册、银行开户、做账审计与海外商标一站式服务。','永鸿国际,公司简介,出海企服','{\"en\": {\"title\": \"Company Profile\", \"content\": \"\\n      <div class=\\\"cb-lead\\\">YONGHONG International Consulting (Shenzhen) Co., Ltd. was incorporated on 20 December 2018. Unified Social Credit Code: 91440300MA5FEMF959.</div>\\n\\n      <h2>Anchored in the Greater Bay Area</h2>\\n      <p>Based in Shenzhen at the heart of the Greater Bay Area (20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District) and reaching the world\'s offshore financial centres, we serve Chinese exporters, cross-border e-commerce sellers and multinational investors with a one-stop, fully compliant service.</p>\\n      <p>Our core practices cover Hong Kong company registration and maintenance, Hong Kong and Singapore bank accounts, offshore structures with bookkeeping and audit, and overseas trademark and patent filing. We put compliance first and prove results: every plan comes with a written risk note and an itemised fee list.</p>\\n\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><span class=\\\"cb-card__icon\\\">◆</span><strong>Licensed Trust or Company Service Provider (TCSP)</strong></div>\\n        <div class=\\\"cb-card\\\"><span class=\\\"cb-card__icon\\\">⚖</span><strong>Senior compliance and audit specialists on site</strong></div>\\n      </div>\\n\\n      <div class=\\\"cb-cards4\\\">\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">2018</div><div class=\\\"cb-card__label\\\">Founded</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">10,000+</div><div class=\\\"cb-card__label\\\">Organisations served</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">8 yrs+</div><div class=\\\"cb-card__label\\\">Average consultant experience</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">HK / SG</div><div class=\\\"cb-card__label\\\">Hong Kong & Singapore hubs</div></div>\\n      </div>\\n    \", \"summary\": \"YONGHONG International Consulting (Shenzhen) — an accredited one-stop, fully compliant cross-border corporate services firm.\", \"seo_title\": \"Company Profile | YONGHONG International Consulting\", \"seo_keywords\": \"yonghong,company profile,corporate services\", \"seo_description\": \"Founded in 2018, TCSP licensed — one-stop Hong Kong company registration, bank accounts, audit and trademarks.\"}}','{\"badge\": \"About Us · Company Profile\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL),(12,'about',0,'团队展示','离岸商务架构师、香港执业注册会计师与涉外合规法务组成的专业班底',NULL,'\n      <p>永鸿国际汇聚业内顶尖离岸商务架构师、香港执业注册会计师 (HKICPA) 及涉外合规法务团队，平均从业年限 8 年以上。核心顾问均具备大湾区银行、会计师事务所或律所背景，能够针对客户实际经营场景给出可落地的合规路径。</p>\n\n      <div class=\"cb-persons\">\n        <div class=\"cb-person\">\n          <span class=\"cb-person__avatar\">陈</span>\n          <div class=\"cb-person__body\">\n            <div class=\"cb-person__name\">陈经理 · 高级出海合规顾问</div>\n            <div class=\"cb-person__meta\">工号 8016 · 10年大湾区离岸架构与银行VIP通道经验</div>\n          </div>\n          <span class=\"cb-person__badge\">金牌顾问</span>\n        </div>\n        <div class=\"cb-person cb-person--teal\">\n          <span class=\"cb-person__avatar\">黄</span>\n          <div class=\"cb-person__body\">\n            <div class=\"cb-person__name\">黄会计师 · 香港执业注册审计师</div>\n            <div class=\"cb-person__meta\">香港会计师公会资深会员 · 精通离岸免税申报与BEPS 2.0</div>\n          </div>\n          <span class=\"cb-person__badge\">审计主管</span>\n        </div>\n      </div>\n\n      <div class=\"cb-cards4\">\n        <div class=\"cb-card\"><div class=\"cb-card__value\">HKICPA</div><div class=\"cb-card__label\">香港执业注册会计师</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">TCSP</div><div class=\"cb-card__label\">持牌公司服务顾问</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">Legal</div><div class=\"cb-card__label\">涉外合规法务</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">CS</div><div class=\"cb-card__label\">专属客服跟进</div></div>\n      </div>\n    ','about-team','永鸿国际',0,0,0,'[11, 13, 14]','2026-01-01 00:00:00','团队展示|离岸架构师与香港执业会计师','永鸿国际核心团队由离岸商务架构师、香港执业注册会计师 HKICPA 与涉外合规法务组成，平均从业8年以上。','团队展示,离岸架构师,香港会计师','{\"en\": {\"title\": \"Our Team\", \"content\": \"\\n      <p>YONGHONG brings together leading offshore structuring consultants, Hong Kong certified practising accountants (HKICPA) and cross-border compliance lawyers with an average of more than eight years\' experience. Our core advisers come from Greater Bay Area banks, accounting firms and law firms, and turn real operating conditions into workable compliance paths.</p>\\n\\n      <div class=\\\"cb-persons\\\">\\n        <div class=\\\"cb-person\\\">\\n          <span class=\\\"cb-person__avatar\\\">C</span>\\n          <div class=\\\"cb-person__body\\\">\\n            <div class=\\\"cb-person__name\\\">Mr. Chan · Senior Overseas Compliance Consultant</div>\\n            <div class=\\\"cb-person__meta\\\">Staff No. 8016 · 10 years in GBA offshore structuring and bank VIP channels</div>\\n          </div>\\n          <span class=\\\"cb-person__badge\\\">Gold adviser</span>\\n        </div>\\n        <div class=\\\"cb-person cb-person--teal\\\">\\n          <span class=\\\"cb-person__avatar\\\">W</span>\\n          <div class=\\\"cb-person__body\\\">\\n            <div class=\\\"cb-person__name\\\">Ms. Wong · HK Certified Practising Auditor</div>\\n            <div class=\\\"cb-person__meta\\\">Fellow of the HKICPA · offshore exemption filing and BEPS 2.0</div>\\n          </div>\\n          <span class=\\\"cb-person__badge\\\">Audit lead</span>\\n        </div>\\n      </div>\\n\\n      <div class=\\\"cb-cards4\\\">\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">HKICPA</div><div class=\\\"cb-card__label\\\">Practising accountants</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">TCSP</div><div class=\\\"cb-card__label\\\">Licensed company secretaries</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">Legal</div><div class=\\\"cb-card__label\\\">Cross-border compliance counsel</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">CS</div><div class=\\\"cb-card__label\\\">Dedicated customer follow-up</div></div>\\n      </div>\\n    \", \"summary\": \"A professional bench of offshore structuring consultants, Hong Kong certified practising accountants and cross-border compliance lawyers.\", \"seo_title\": \"Our Team | Offshore consultants & HK practising accountants\", \"seo_keywords\": \"our team,offshore consultant,hkicpa\", \"seo_description\": \"Our core team of offshore structuring consultants, HKICPA practising accountants and cross-border compliance lawyers.\"}}','{\"badge\": \"About Us · Our Team\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL),(13,'about',0,'企业招聘','永鸿国际业务高速发展，诚邀热爱跨境出海行业的优秀人才加入我们',NULL,'\n      <div class=\"cb-jobs\">\n        <div class=\"cb-job cb-job--amber\">\n          <div class=\"cb-job__head\">\n            <span class=\"cb-job__title\">出海企服商务顾问 (全职)</span>\n            <span class=\"cb-job__pay\">8K-18K + 提成</span>\n          </div>\n          <p class=\"cb-job__desc\">要求：大专及以上，1年以上跨境企服/外贸商务经验，沟通能力强。享有五险一金、带薪年假。</p>\n        </div>\n        <div class=\"cb-job cb-job--emerald\">\n          <div class=\"cb-job__head\">\n            <span class=\"cb-job__title\">离岸做账审计合规专员 (双休)</span>\n            <span class=\"cb-job__pay\">7K-13K</span>\n          </div>\n          <p class=\"cb-job__desc\">要求：财会专业，熟悉香港/新加坡税法审计流程，具备高度保密意识。</p>\n        </div>\n      </div>\n\n      <div class=\"cb-resume\">\n        <div class=\"cb-resume__body\">\n          <div class=\"cb-resume__label\">简历直投邮箱</div>\n          <div class=\"cb-resume__mail\">805856285@qq.com（注明应聘岗位）</div>\n        </div>\n        <span class=\"cb-resume__tip\">官方咨询专线 18123763835</span>\n      </div>\n    ','about-careers','永鸿国际',0,0,0,'[11, 12, 14]','2026-01-01 00:00:00','企业招聘|永鸿国际加入我们','永鸿国际招聘出海企服商务顾问与离岸做账审计合规专员，五险一金带薪年假，简历直投 805856285@qq.com。','企业招聘,出海企服,跨境商务顾问','{\"en\": {\"title\": \"Careers\", \"content\": \"\\n      <div class=\\\"cb-jobs\\\">\\n        <div class=\\\"cb-job cb-job--amber\\\">\\n          <div class=\\\"cb-job__head\\\">\\n            <span class=\\\"cb-job__title\\\">Business Consultant, Global Services (Full-time)</span>\\n            <span class=\\\"cb-job__pay\\\">¥8K–18K + commission</span>\\n          </div>\\n          <p class=\\\"cb-job__desc\\\">Associate degree or above; 1+ year in cross-border services or foreign trade; strong communicator. Social insurance, housing fund and paid annual leave included.</p>\\n        </div>\\n        <div class=\\\"cb-job cb-job--emerald\\\">\\n          <div class=\\\"cb-job__head\\\">\\n            <span class=\\\"cb-job__title\\\">Offshore Audit & Compliance Officer (5 days)</span>\\n            <span class=\\\"cb-job__pay\\\">¥7K–13K</span>\\n          </div>\\n          <p class=\\\"cb-job__desc\\\">Accounting background; familiar with Hong Kong / Singapore tax and audit procedures; high sense of confidentiality.</p>\\n        </div>\\n      </div>\\n\\n      <div class=\\\"cb-resume\\\">\\n        <div class=\\\"cb-resume__body\\\">\\n          <div class=\\\"cb-resume__label\\\">Send your CV directly to</div>\\n          <div class=\\\"cb-resume__mail\\\">805856285@qq.com (please state the position)</div>\\n        </div>\\n        <span class=\\\"cb-resume__tip\\\">Hotline +86 18123763835</span>\\n      </div>\\n    \", \"summary\": \"YONGHONG is growing fast — we would love to meet talented people who are passionate about cross-border business.\", \"seo_title\": \"Careers | Join YONGHONG\", \"seo_keywords\": \"careers,corporate services jobs\", \"seo_description\": \"We are hiring business consultants and offshore audit compliance officers — apply at 805856285@qq.com.\"}}','{\"badge\": \"About Us · Careers\"}',1,0,'admin','2026-09-29 21:26:36',NULL,'2026-10-19 21:02:30',2,1,NULL,NULL,NULL,NULL,NULL),(14,'about',0,'联系我们','深圳总部 · 香港/新加坡双中心，欢迎来电或到访咨询',NULL,'\n      <div class=\"cb-cta\">\n        <div class=\"cb-cta__body\">\n          <div class=\"cb-cta__title\">留下您的联系方式</div>\n          <div class=\"cb-cta__sub\">资深顾问将为您出具书面方案与费用清单，咨询全程免费</div>\n        </div>\n        <button type=\"button\" class=\"cb-cta__btn\" data-inquiry=\"公司简介与合作咨询\">在线留言获取方案</button>\n      </div>\n\n      <h2>服务时间</h2>\n      <p>周一至周六 09:00 – 18:30（GMT+8）；非工作时间留言，顾问将于下一个工作日 10 分钟内响应。</p>\n\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>深圳总部</strong><p>深圳市罗湖区南湖街道嘉北社区迎春路3号海燕大厦20层2010</p></div>\n        <div class=\"cb-card\"><strong>香港中心</strong><p>香港九龙尖沙咀（面签与政府递交，需提前预约）</p></div>\n      </div>\n    ','about-contact','永鸿国际',0,0,0,'[11, 12, 13]','2026-01-01 00:00:00','联系我们|永鸿国际深圳总部地址电话','永鸿国际深圳总部地址、官方咨询专线 18123763835 与邮箱，在线留言 10 分钟内响应。','联系我们,深圳出海企服,咨询电话','{\"en\": {\"title\": \"Contact Us\", \"content\": \"\\n      <div class=\\\"cb-cta\\\">\\n        <div class=\\\"cb-cta__body\\\">\\n          <div class=\\\"cb-cta__title\\\">Leave your contact details</div>\\n          <div class=\\\"cb-cta__sub\\\">A senior consultant will send a written plan and fee list — consultation is free</div>\\n        </div>\\n        <button type=\\\"button\\\" class=\\\"cb-cta__btn\\\" data-inquiry=\\\"Company profile & partnership enquiry\\\">Send an online enquiry</button>\\n      </div>\\n\\n      <h2>Opening hours</h2>\\n      <p>Monday to Saturday, 09:00 – 18:30 (GMT+8). Messages left outside these hours are answered within 10 minutes of the next working day.</p>\\n\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Shenzhen HQ</strong><p>20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District, Shenzhen</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Hong Kong office</strong><p>Tsim Sha Tsui, Kowloon (interviews and government filings by appointment)</p></div>\\n      </div>\\n    \", \"summary\": \"Shenzhen headquarters · Hong Kong and Singapore hubs — call or visit us.\", \"seo_title\": \"Contact Us | YONGHONG Shenzhen HQ\", \"seo_keywords\": \"contact us,corporate services shenzhen\", \"seo_description\": \"Address, hotline +86 18123763835 and email of YONGHONG — online enquiries answered within 10 minutes.\"}}','{\"badge\": \"About Us · Contact\"}',1,0,'admin','2026-09-29 21:26:36',NULL,'2026-10-19 21:02:30',2,1,NULL,NULL,NULL,NULL,NULL),(21,'page',0,'隐私政策','我们如何收集、使用、存储与保护您的个人信息，以及您享有的权利。',NULL,'\n      <p><strong>版本号：v1.0　·　生效日期：2026-01-01</strong></p>\n      <p>本政策适用于永鸿国际咨询（深圳）有限公司（以下简称\"我们\"）官方网站及在线咨询服务。您在提交咨询表单前，必须勾选\"我已阅读并同意《隐私政策》\"，我们将在服务器记录您的同意时间与本政策版本号作为同意凭证。</p>\n\n      <h2>一、我们收集哪些信息</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>您主动提供的</strong><p>称呼、联系电话、微信/邮箱、公司名称、需求描述。</p></div>\n        <div class=\"cb-card\"><strong>自动采集的</strong><p>IP 地址、浏览器与设备标识、来路页面、UTM 营销参数、访问日志。</p></div>\n      </div>\n\n      <h2>二、我们如何使用这些信息</h2>\n      <ul>\n        <li>用于与您取得联系并提供您所咨询的业务方案与报价；</li>\n        <li>用于履行法律法规要求的客户尽职调查（KYC）义务；</li>\n        <li>用于改进网站内容与服务体验（去标识化统计）；</li>\n        <li><strong>我们不会向任何第三方出售您的个人信息。</strong></li>\n      </ul>\n\n      <h2>三、存储与保护</h2>\n      <p>个人信息存储于中华人民共和国境内的服务器，保存期限为实现处理目的所必要的最短时间，一般为自最后一次联系起 3 年。我们采取传输加密、后台权限分级、列表脱敏（手机号默认显示为 138****8000）等措施。</p>\n\n      <h2>四、您享有的权利</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>查阅与复制</strong><p>您有权查阅、复制我们持有的您的个人信息。</p></div>\n        <div class=\"cb-card\"><strong>更正与补充</strong><p>信息有误时可要求更正。</p></div>\n        <div class=\"cb-card\"><strong>删除</strong><p>在法定情形下可要求删除。</p></div>\n        <div class=\"cb-card\"><strong>撤回同意</strong><p>您可随时撤回同意，撤回不影响此前处理的效力。</p></div>\n      </div>\n\n      <h2>五、联系我们</h2>\n      <p>如对本政策有任何疑问，或行使上述权利，请发送邮件至 <strong>805856285@qq.com</strong>，或致电 <strong>18123763835</strong>。我们将在 15 个工作日内答复。</p>\n\n      <h2>六、政策更新</h2>\n      <p>本政策发生实质变更时，我们将提升版本号并在本页公示。新的版本号将用于后续新的同意记录，历史同意凭证仍对应当时的版本。</p>\n    ','privacy-policy','永鸿国际',0,0,0,'[22]','2026-01-01 00:00:00','隐私政策|永鸿国际个人信息保护','永鸿国际隐私政策 v1.0：收集范围、使用目的、存储期限、脱敏措施与您享有的查阅/更正/删除/撤回同意权利。','隐私政策,个人信息保护,PIPL','{\"en\": {\"title\": \"Privacy Policy\", \"content\": \"\\n      <p><strong>Version v1.0 · Effective 1 January 2026</strong></p>\\n      <p>This policy applies to the website and online consultation services of YONGHONG International Consulting (Shenzhen) Co., Ltd. Before submitting an enquiry you must tick \\\"I have read and accepted the Privacy Policy\\\"; we record the acceptance time and this policy version on our server as evidence of consent.</p>\\n\\n      <h2>1. What we collect</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>You provide</strong><p>Name, phone number, WeChat / email, company name and your requirements.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Collected automatically</strong><p>IP address, browser and device identifiers, referrer and UTM parameters, access logs.</p></div>\\n      </div>\\n\\n      <h2>2. How we use it</h2>\\n      <ul>\\n        <li>To contact you and provide the plan and quotation you asked for;</li>\\n        <li>To perform customer due diligence (KYC) required by law;</li>\\n        <li>To improve the website through aggregated, de-identified statistics;</li>\\n        <li><strong>We never sell your personal information to third parties.</strong></li>\\n      </ul>\\n\\n      <h2>3. Storage and protection</h2>\\n      <p>Data is stored on servers within the People\'s Republic of China for the shortest period necessary — normally three years after your last contact. We use encrypted transport, tiered back-office permissions and masked listing (phone shown as 138****8000 by default).</p>\\n\\n      <h2>4. Your rights</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Access & copy</strong><p>Request a copy of the data we hold.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Correction</strong><p>Ask us to correct inaccurate data.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Deletion</strong><p>Request deletion where the law allows.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Withdraw consent</strong><p>Withdraw at any time without affecting prior processing.</p></div>\\n      </div>\\n\\n      <h2>5. Contact</h2>\\n      <p>Questions or rights requests: <strong>805856285@qq.com</strong> or <strong>+86 18123763835</strong>. We reply within 15 working days.</p>\\n\\n      <h2>6. Updates</h2>\\n      <p>Material changes raise the version number and are published on this page. New consent records reference the new version; historical evidence still points to the version accepted at the time.</p>\\n    \", \"summary\": \"How we collect, use, store and protect your personal information, and the rights available to you.\", \"seo_title\": \"Privacy Policy | YONGHONG\", \"seo_keywords\": \"privacy policy,personal information,PIPL\", \"seo_description\": \"YONGHONG Privacy Policy v1.0 — what we collect, why, how long we keep it and the rights you can exercise.\"}}','{}',1,0,'admin','2026-09-29 21:26:36',NULL,'2026-10-19 21:02:30',2,1,NULL,NULL,NULL,NULL,NULL),(22,'page',0,'服务条款','使用本网站与在线咨询服务的法律条款与双方权利义务。',NULL,'\n      <p><strong>版本号：v1.0　·　生效日期：2026-01-01</strong></p>\n\n      <h2>一、服务性质</h2>\n      <p>本网站提供的内容仅供参考，不构成法律、税务或投资意见。具体服务以双方另行签署的书面委托协议为准。</p>\n\n      <h2>二、网站使用规范</h2>\n      <ul>\n        <li>不得利用本站从事任何违法违规活动；</li>\n        <li>不得以爬虫、脚本等方式干扰网站正常运行；</li>\n        <li>不得冒用他人身份提交咨询信息。</li>\n      </ul>\n\n      <h2>三、知识产权</h2>\n      <p>本站的文字、图片、版式与标识归永鸿国际或其权利人所有。未经书面许可，不得复制、转载或用于商业用途。</p>\n\n      <h2>四、免责与限制</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>审批结果</strong><p>政府与银行的审批结果由主管机关独立决定，我方不承诺必然通过。</p></div>\n        <div class=\"cb-card\"><strong>第三方网站</strong><p>友情链接指向的第三方网站，其内容与隐私 practices 由该方负责。</p></div>\n      </div>\n\n      <h2>五、费用与退款</h2>\n      <p>所有费用以书面报价单为准；因我方原因未能完成委托事项的，按委托协议约定退还相应服务费。</p>\n\n      <h2>六、适用法律与争议解决</h2>\n      <p>本条款适用中华人民共和国法律。争议双方应先友好协商；协商不成的，提交我方所在地有管辖权的人民法院诉讼解决。</p>\n\n      <h2>七、联系我们</h2>\n      <p>邮箱 <strong>805856285@qq.com</strong>　电话 <strong>18123763835</strong></p>\n    ','terms-of-service','永鸿国际',0,0,0,'[21]','2026-01-01 00:00:00','服务条款|永鸿国际网站使用条款','永鸿国际服务条款 v1.0：网站使用规范、知识产权、免责限制、费用退款与争议解决。','服务条款,网站条款,使用协议','{\"en\": {\"title\": \"Terms of Service\", \"content\": \"\\n      <p><strong>Version v1.0 · Effective 1 January 2026</strong></p>\\n\\n      <h2>1. Nature of the service</h2>\\n      <p>Content on this website is for general reference only and does not constitute legal, tax or investment advice. Specific services are governed by a separate written engagement letter.</p>\\n\\n      <h2>2. Acceptable use</h2>\\n      <ul>\\n        <li>No unlawful activity through this website;</li>\\n        <li>No scraping or scripts that disrupt normal operation;</li>\\n        <li>No impersonation when submitting enquiries.</li>\\n      </ul>\\n\\n      <h2>3. Intellectual property</h2>\\n      <p>Text, images, layout and marks on this site belong to YONGHONG or its licensors. No reproduction or commercial use without written permission.</p>\\n\\n      <h2>4. Disclaimers</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Approvals</strong><p>Government and bank decisions are made independently; we do not guarantee approval.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Third-party sites</strong><p>Linked sites are the responsibility of their operators, including their privacy practices.</p></div>\\n      </div>\\n\\n      <h2>5. Fees and refunds</h2>\\n      <p>All fees follow the written quotation. If we fail to complete an engagement for reasons attributable to us, service fees are refunded as set out in the engagement letter.</p>\\n\\n      <h2>6. Governing law</h2>\\n      <p>These terms are governed by the laws of the People\'s Republic of China. Disputes are settled amicably first, failing which the competent people\'s court where we are located has jurisdiction.</p>\\n\\n      <h2>7. Contact</h2>\\n      <p>Email <strong>805856285@qq.com</strong>　Phone <strong>+86 18123763835</strong></p>\\n    \", \"summary\": \"Legal terms governing the use of this website and our online consultation services.\", \"seo_title\": \"Terms of Service | YONGHONG\", \"seo_keywords\": \"terms of service,terms of use\", \"seo_description\": \"YONGHONG Terms of Service v1.0 — acceptable use, IP, disclaimers, fees and governing law.\"}}','{}',1,0,'admin','2026-09-29 21:26:36',NULL,'2026-10-19 21:02:30',2,1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cms_article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_audit_log`
--

DROP TABLE IF EXISTS `cms_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_audit_log` (
  `audit_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '审计ID',
  `ref_table` varchar(64) DEFAULT NULL COMMENT '目标内容表，系统级操作可空',
  `ref_id` bigint(20) unsigned DEFAULT NULL COMMENT '目标内容行ID',
  `ref_title` varchar(255) DEFAULT NULL COMMENT '目标标题快照（内容删除后仍可读）',
  `action` varchar(32) NOT NULL COMMENT '动作，字典 cms_audit_action',
  `status_from` varchar(32) DEFAULT NULL COMMENT '变更前状态标签',
  `status_to` varchar(32) DEFAULT NULL COMMENT '变更后状态标签',
  `field_changes` json DEFAULT NULL COMMENT '字段级改动 [{"field":"公司全称","before":"..","after":".."}]',
  `operator` varchar(64) NOT NULL COMMENT '操作人 sys_user.user_name',
  `operator_ip` varchar(64) DEFAULT NULL COMMENT '操作IP',
  `operated_at` datetime NOT NULL COMMENT '操作时间',
  PRIMARY KEY (`audit_id`),
  KEY `idx_ref` (`ref_table`,`ref_id`,`operated_at`),
  KEY `idx_op` (`operator`,`operated_at`),
  KEY `idx_action` (`action`,`operated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CMS 内容操作审计（字段级留痕）';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_audit_log`
--

LOCK TABLES `cms_audit_log` WRITE;
/*!40000 ALTER TABLE `cms_audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `cms_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_banner`
--

DROP TABLE IF EXISTS `cms_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_banner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `position` varchar(20) NOT NULL DEFAULT 'home' COMMENT '位置(字典 cms_banner_position)',
  `poster_type` varchar(20) NOT NULL DEFAULT 'cr' COMMENT '画卷主题(字典 cms_poster_type): cr/bank/cpa/image',
  `image_url` varchar(255) DEFAULT NULL COMMENT '上传图片 object key;poster_type=image 时必填,其余留空',
  `tag` varchar(80) DEFAULT NULL COMMENT '角标文案 如:?? 香港公司设立 · 2026合规新规',
  `title` varchar(150) NOT NULL COMMENT '主标题 如:香港·公司设立',
  `desc` varchar(500) DEFAULT NULL COMMENT '详细业务描述',
  `price_text` varchar(80) DEFAULT NULL COMMENT '价格角标 如:特惠 ¥4580起',
  `button_text` varchar(50) DEFAULT '获取官方办理方案' COMMENT '按钮文案',
  `button_link` varchar(255) DEFAULT NULL COMMENT '按钮链接(站内路径或外链)',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '轮播顺序',
  `i18n_json` json DEFAULT NULL COMMENT '英文增量 {"en":{"tag":"","title":"","desc":"","price_text":"","button_text":""}}',
  `ext_json` json DEFAULT NULL COMMENT '扩展(如画卷配色/动画参数)',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1展示 0隐藏',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除',
  `created_by` varchar(64) DEFAULT 'admin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `publish_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  `live_flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  `draft_json` json DEFAULT NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  `live_version_id` bigint(20) unsigned DEFAULT NULL COMMENT '当前生效版本 cms_content_version.version_id',
  `submitted_by` varchar(64) DEFAULT NULL COMMENT '提交审核人',
  `submitted_at` datetime DEFAULT NULL COMMENT '提交审核时间',
  `published_by` varchar(64) DEFAULT NULL COMMENT '发布人（责任落点）',
  `published_at` datetime DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  KEY `idx_pos_status` (`position`,`status`,`is_deleted`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='轮播海报(文字+3D画卷)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_banner`
--

LOCK TABLES `cms_banner` WRITE;
/*!40000 ALTER TABLE `cms_banner` DISABLE KEYS */;
INSERT INTO `cms_banner` VALUES (1,'home','cr',NULL,'🇭🇰 香港公司设立 · 2026合规新规','香港公司设立·极速下证','持牌秘书合规托管，一站式解决注册、年审、开户及做账审计痛点，特设包开户绿色通道。','特惠 ¥4580起','立即获取底价方案',NULL,1,'{\"en\": {\"tag\": \"🇭🇰 Hong Kong Company Setup · 2026 Compliance Update\", \"desc\": \"Licensed company-secretary handling — one stop for registration, annual return, bank account and audit, with a guaranteed account-opening channel.\", \"title\": \"Hong Kong Company Setup · Fast Track\", \"price_text\": \"From ¥4,580\", \"button_text\": \"Get the best quote now\"}}',NULL,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(2,'home','bank',NULL,'🏦 环球离岸银行 · 视频远程开户','环球离岸银行·包下户通道','香港/新加坡/美国顶尖银行直联，无需亲自过港，专业资深银行开户经理 1对1 辅导包过。','绿色包开通道','免费评估开户资格',NULL,2,'{\"en\": {\"tag\": \"🏦 Global Offshore Banking · Remote Video Onboarding\", \"desc\": \"Direct access to top banks in Hong Kong, Singapore and the US — no travel required, with senior relationship managers coaching you 1-on-1.\", \"title\": \"Global Offshore Accounts · Guaranteed Opening\", \"price_text\": \"Guaranteed channel\", \"button_text\": \"Check my eligibility free\"}}',NULL,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(3,'home','cpa',NULL,'™️ 国际品牌布局 · 香港持牌审计','国际品牌出海·合规审计筹划','马德里国际商标快速注册，香港执业会计师(CPA)正规做账审计出具报告，合规无忧。','1对1资深方案','预约资深财税顾问',NULL,3,'{\"en\": {\"tag\": \"™️ Global Branding · Hong Kong Licensed Audit\", \"desc\": \"Fast Madrid trademark registration and proper bookkeeping/audit reports issued by Hong Kong certified practising accountants.\", \"title\": \"Go Global · Compliant Audit & Trademark\", \"price_text\": \"1-on-1 senior plan\", \"button_text\": \"Book a senior tax advisor\"}}',NULL,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cms_banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_case`
--

DROP TABLE IF EXISTS `cms_case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_case` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `country_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '国家ID,0=通用',
  `service_id` bigint(20) DEFAULT NULL COMMENT '关联服务ID(应用层校验)',
  `company_name` varchar(120) NOT NULL COMMENT '客户公司名',
  `service_title` varchar(150) NOT NULL COMMENT '服务名称',
  `cost_text` varchar(80) DEFAULT NULL COMMENT '费用 如:总费用 ¥12,800',
  `time_text` varchar(80) DEFAULT NULL COMMENT '周期 如:用时 3个工作日',
  `quote_text` varchar(500) DEFAULT NULL COMMENT '客户评价',
  `portrait_url` varchar(255) DEFAULT NULL COMMENT '客户头像 object key(可空)',
  `content` mediumtext COMMENT '正文(Jsoup 过滤)',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `i18n_json` json DEFAULT NULL COMMENT '英文增量 {"en":{...同名字段}}',
  `ext_json` json DEFAULT NULL COMMENT '扩展字段(如 cert 凭证编号)',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1展示 0隐藏',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除',
  `created_by` varchar(64) DEFAULT 'admin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `publish_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  `live_flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  `draft_json` json DEFAULT NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  `live_version_id` bigint(20) unsigned DEFAULT NULL COMMENT '当前生效版本 cms_content_version.version_id',
  `submitted_by` varchar(64) DEFAULT NULL COMMENT '提交审核人',
  `submitted_at` datetime DEFAULT NULL COMMENT '提交审核时间',
  `published_by` varchar(64) DEFAULT NULL COMMENT '发布人（责任落点）',
  `published_at` datetime DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  KEY `idx_list` (`status`,`is_deleted`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='成功案例';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_case`
--

LOCK TABLES `cms_case` WRITE;
/*!40000 ALTER TABLE `cms_case` DISABLE KEYS */;
INSERT INTO `cms_case` VALUES (1,1,1,'深圳某头部跨境电商科技公司','注册+银行账户+商标','总费用 ¥12,800','历时 4 个工作日办结','“永鸿团队非常专业，2天拿到BR商业登记证，汇丰包下户更是帮我们解决了结汇大难题！”',NULL,NULL,1,'{\"en\": {\"ext_json\": {\"cert\": \"HK CR Certificate No. 3419082\"}, \"cost_text\": \"Total fee ¥12,800\", \"time_text\": \"Completed in 4 working days\", \"quote_text\": \"“Very professional — the BR arrived in 2 days and the guaranteed HSBC account solved our FX settlement problem.”\", \"company_name\": \"A leading cross-border e-commerce tech company in Shenzhen\", \"service_title\": \"Registration + Bank Account + Trademark\"}}','{\"cert\": \"香港CR证书第3419082号\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(2,2,6,'杭州某AI软硬件出海独角兽','新加坡设立+ODI备案','总费用 ¥26,500','历时 7 个工作日办结','“持牌顾问全程跟进，合规架构搭建非常严谨，让资方在ODI备案审核中一次性通过。”',NULL,NULL,2,'{\"en\": {\"ext_json\": {\"cert\": \"Singapore ACRA UEN 2024098X\"}, \"cost_text\": \"Total fee ¥26,500\", \"time_text\": \"Completed in 7 working days\", \"quote_text\": \"“The licensed consultant ran the whole thing — the compliance structure passed ODI review at the first attempt.”\", \"company_name\": \"An AI hardware & software unicorn in Hangzhou\", \"service_title\": \"Singapore setup + ODI filing\"}}','{\"cert\": \"新加坡ACRA注册编号UEN2024098X\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(3,1,4,'东莞某精密智能制造出口企业','香港逾期年审补办+审计','总费用 ¥6,800','历时 3 个工作日办结','“之前代理不专业导致逾期被法院传票，永鸿持牌会计师出面快速化解并豁免罚金！”',NULL,NULL,3,'{\"en\": {\"ext_json\": {\"cert\": \"Tax bureau penalty-waiver approval\"}, \"cost_text\": \"Total fee ¥6,800\", \"time_text\": \"Completed in 3 working days\", \"quote_text\": \"“A previous agent botched it and we were summoned to court. Our CPA resolved it fast and the penalty was waived.”\", \"company_name\": \"A precision smart-manufacturing exporter in Dongguan\", \"service_title\": \"Overdue HK annual return + audit\"}}','{\"cert\": \"税局免罚申请成功批复函\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cms_case` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_content_version`
--

DROP TABLE IF EXISTS `cms_content_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_content_version` (
  `version_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `ref_table` varchar(64) NOT NULL COMMENT '内容表名，如 cms_banner',
  `ref_id` bigint(20) unsigned NOT NULL COMMENT '内容行ID',
  `version_no` int(11) NOT NULL COMMENT '该内容行的版本序号，从1递增',
  `snapshot_json` json NOT NULL COMMENT '发布时的完整内容快照（回滚数据源）',
  `op_type` varchar(16) NOT NULL COMMENT 'publish 发布 / rollback 回滚',
  `op_note` varchar(255) DEFAULT NULL COMMENT '发布/回滚说明',
  `operator` varchar(64) NOT NULL COMMENT '操作人 sys_user.user_name',
  `operated_at` datetime NOT NULL COMMENT '操作时间',
  PRIMARY KEY (`version_id`),
  UNIQUE KEY `uk_ref_ver` (`ref_table`,`ref_id`,`version_no`),
  KEY `idx_ref` (`ref_table`,`ref_id`,`operated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='内容版本快照（发布/回滚留痕）';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_content_version`
--

LOCK TABLES `cms_content_version` WRITE;
/*!40000 ALTER TABLE `cms_content_version` DISABLE KEYS */;
/*!40000 ALTER TABLE `cms_content_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_country`
--

DROP TABLE IF EXISTS `cms_country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_country` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `code` varchar(8) NOT NULL COMMENT '国家/地区代码 HK/SG/US',
  `name` varchar(50) NOT NULL COMMENT '中文名称',
  `en_name` varchar(50) NOT NULL COMMENT '英文名称',
  `icon_url` varchar(255) DEFAULT NULL COMMENT '图标 object key',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序(小在前)',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1启用 0停用(字典 cms_common_status)',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除 0否 1是',
  `created_by` varchar(64) DEFAULT 'admin' COMMENT '创建人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` varchar(64) DEFAULT NULL COMMENT '更新人',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='国家地区(中英双语)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_country`
--

LOCK TABLES `cms_country` WRITE;
/*!40000 ALTER TABLE `cms_country` DISABLE KEYS */;
INSERT INTO `cms_country` VALUES (1,'HK','中国香港','Hong Kong','',1,1,0,'admin','2026-09-29 21:26:36',NULL,NULL),(2,'SG','新加坡','Singapore','',2,1,0,'admin','2026-09-29 21:26:36',NULL,NULL),(3,'US','美国','United States','',3,1,0,'admin','2026-09-29 21:26:36',NULL,NULL),(4,'CN','中国内地','Mainland China','',4,1,0,'admin','2026-09-29 21:26:36',NULL,NULL);
/*!40000 ALTER TABLE `cms_country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_lead`
--

DROP TABLE IF EXISTS `cms_lead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_lead` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号(明文,后台列表脱敏展示)',
  `phone_masked` varchar(20) DEFAULT NULL COMMENT '脱敏手机号 138****8000(入库即生成)',
  `wechat` varchar(64) DEFAULT NULL COMMENT '微信号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `company` varchar(120) DEFAULT NULL COMMENT '公司名',
  `service_id` bigint(20) DEFAULT NULL COMMENT '意向服务ID',
  `service_title` varchar(150) DEFAULT NULL COMMENT '★服务标题快照(服务删了线索仍完整)',
  `country_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '国家ID,0=未选',
  `quoted_price` varchar(50) DEFAULT NULL COMMENT '★报价快照',
  `source` varchar(50) DEFAULT NULL COMMENT '来源 2B表单/微信/400/线下',
  `channel` varchar(50) DEFAULT NULL COMMENT '渠道标识',
  `dedup_hash` varchar(64) DEFAULT NULL COMMENT '★防重 md5(phone+service_id)',
  `ip` varchar(45) DEFAULT NULL COMMENT 'IP(v6 45位)',
  `user_agent` varchar(300) DEFAULT NULL COMMENT 'UA',
  `utm_source` varchar(64) DEFAULT NULL COMMENT 'UTM 来源',
  `utm_medium` varchar(64) DEFAULT NULL COMMENT '★UTM 媒介',
  `utm_campaign` varchar(64) DEFAULT NULL COMMENT 'UTM 活动',
  `utm_term` varchar(64) DEFAULT NULL COMMENT '★UTM 关键词',
  `referrer` varchar(300) DEFAULT NULL COMMENT '来路页面',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态(字典 cms_lead_status):0待跟进 1跟进中 2已签约 3已流失',
  `follower_name` varchar(64) DEFAULT NULL COMMENT '跟进人',
  `last_contacted_at` datetime DEFAULT NULL COMMENT '最后联系时间',
  `follow_note` varchar(1000) DEFAULT NULL COMMENT '跟进备注',
  `consent_flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '★是否勾选同意隐私政策 1是',
  `consent_time` datetime DEFAULT NULL COMMENT '★同意时间(PIPL 留证)',
  `consent_version` varchar(20) DEFAULT NULL COMMENT '★同意的隐私政策版本号',
  `remark` varchar(500) DEFAULT NULL COMMENT '内部备注',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除',
  `created_by` varchar(64) DEFAULT 'front' COMMENT '创建来源账号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_dedup` (`dedup_hash`),
  KEY `idx_list` (`status`,`is_deleted`,`created_at`),
  KEY `idx_follower` (`follower_name`,`last_contacted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COMMENT='线索/CRM';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_lead`
--

LOCK TABLES `cms_lead` WRITE;
/*!40000 ALTER TABLE `cms_lead` DISABLE KEYS */;
/*!40000 ALTER TABLE `cms_lead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_partner_bank`
--

DROP TABLE IF EXISTS `cms_partner_bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_partner_bank` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `country_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '国家ID,0=多国',
  `name` varchar(100) NOT NULL COMMENT '银行名称',
  `en_name` varchar(100) DEFAULT NULL COMMENT '英文名',
  `logo_url` varchar(255) NOT NULL COMMENT 'Logo object key',
  `features` varchar(500) DEFAULT NULL COMMENT '卖点(逗号分隔)',
  `success_rate` varchar(20) DEFAULT NULL COMMENT '开户成功率 如:98.6%',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `i18n_json` json DEFAULT NULL COMMENT '英文增量 {"en":{"name":"","en_name":"","features":"","success_rate":""}}',
  `ext_json` json DEFAULT NULL COMMENT '扩展字段(如 badge/period)',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1展示 0隐藏',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除',
  `created_by` varchar(64) DEFAULT 'admin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `publish_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  `live_flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  `draft_json` json DEFAULT NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  `live_version_id` bigint(20) unsigned DEFAULT NULL COMMENT '当前生效版本 cms_content_version.version_id',
  `submitted_by` varchar(64) DEFAULT NULL COMMENT '提交审核人',
  `submitted_at` datetime DEFAULT NULL COMMENT '提交审核时间',
  `published_by` varchar(64) DEFAULT NULL COMMENT '发布人（责任落点）',
  `published_at` datetime DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  KEY `idx_list` (`status`,`is_deleted`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='合作银行';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_partner_bank`
--

LOCK TABLES `cms_partner_bank` WRITE;
/*!40000 ALTER TABLE `cms_partner_bank` DISABLE KEYS */;
INSERT INTO `cms_partner_bank` VALUES (1,1,'汇丰银行 (HSBC)','HSBC','','全球公认第一外资银行，支持多币种即时结算及全球提现。','98.6%',1,'{\"en\": {\"name\": \"HSBC\", \"ext_json\": {\"badge\": \"Fast interview\", \"period\": \"2–3 weeks\"}, \"features\": \"Widely regarded as the leading foreign bank, with instant multi-currency settlement and global cash withdrawal.\"}}','{\"badge\": \"极速面签\", \"period\": \"2-3周下户\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(2,1,'渣打银行 (SCB)','Standard Chartered','','支持内地远程视频面签见证，免亲自跑港，网银操作简捷。','97.2%',2,'{\"en\": {\"name\": \"Standard Chartered\", \"ext_json\": {\"badge\": \"Video witnessing\", \"period\": \"2 weeks\"}, \"features\": \"Remote video witnessing from the mainland — no trip to Hong Kong, simple online banking.\"}}','{\"badge\": \"视频见证\", \"period\": \"2周稳下户\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(3,2,'华侨银行 (OCBC)','OCBC','','新加坡顶尖资管银行，资金流转无外汇管制，东南亚首选。','96.4%',3,'{\"en\": {\"name\": \"OCBC\", \"ext_json\": {\"badge\": \"Singapore direct\", \"period\": \"1–2 weeks\"}, \"features\": \"A top Singapore wealth-management bank with no exchange controls — first choice in Southeast Asia.\"}}','{\"badge\": \"新加坡直联\", \"period\": \"1-2周下户\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(4,1,'东亚银行 (BEA)','BEA','','专注中资出海企业信贷与外汇服务，下户准签率业内领先。','95.1%',4,'{\"en\": {\"name\": \"BEA\", \"ext_json\": {\"badge\": \"Low threshold\", \"period\": \"10 working days\"}, \"features\": \"Focused on lending and FX for Chinese businesses going overseas, with an industry-leading approval rate.\"}}','{\"badge\": \"门槛亲民\", \"period\": \"10工作日\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cms_partner_bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_service`
--

DROP TABLE IF EXISTS `cms_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_service` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `category` varchar(30) NOT NULL COMMENT '大类(字典 cms_service_category)',
  `country_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '国家ID,0=全球/多国通用',
  `title` varchar(150) NOT NULL COMMENT '服务标题(中文=默认)',
  `sub_title` varchar(150) DEFAULT NULL COMMENT '副标题',
  `summary` varchar(500) DEFAULT NULL COMMENT '摘要',
  `badge_text` varchar(50) DEFAULT NULL COMMENT '角标文案 如:2026新动态',
  `price_text` varchar(80) DEFAULT NULL COMMENT '价格文案 如:4个工作日·加急1天',
  `slug` varchar(100) NOT NULL COMMENT 'SEO URL(全站英文一套,如 hk-company-registration)',
  `cover_url` varchar(255) DEFAULT NULL COMMENT '封面 object key',
  `content` mediumtext COMMENT '正文 HTML(已过 Jsoup 白名单)',
  `process_steps` json DEFAULT NULL COMMENT '办理流程步骤 [{icon,name,desc}]',
  `related_ids` json DEFAULT NULL COMMENT '关联文章ID数组(应用层维护)',
  `views` int(11) NOT NULL DEFAULT '0' COMMENT '浏览量(Redis 计数,定时回写)',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `is_recommended` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否首页推荐 1是',
  `is_home_show` tinyint(4) NOT NULL DEFAULT '1' COMMENT '是否首页展示 1是',
  `seo_title` varchar(200) DEFAULT NULL COMMENT 'SEO 标题',
  `seo_description` varchar(300) DEFAULT NULL COMMENT 'SEO 描述',
  `seo_keywords` varchar(200) DEFAULT NULL COMMENT 'SEO 关键词',
  `i18n_json` json DEFAULT NULL COMMENT '英文增量 {"en":{"title":"","sub_title":"","summary":"","seo_title":"","seo_description":""}}',
  `ext_json` json DEFAULT NULL COMMENT '扩展字段(预留)',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1上架 0下架',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除',
  `created_by` varchar(64) DEFAULT 'admin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `publish_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  `live_flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  `draft_json` json DEFAULT NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  `live_version_id` bigint(20) unsigned DEFAULT NULL COMMENT '当前生效版本 cms_content_version.version_id',
  `submitted_by` varchar(64) DEFAULT NULL COMMENT '提交审核人',
  `submitted_at` datetime DEFAULT NULL COMMENT '提交审核时间',
  `published_by` varchar(64) DEFAULT NULL COMMENT '发布人（责任落点）',
  `published_at` datetime DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='服务矩阵/办理流程';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_service`
--

LOCK TABLES `cms_service` WRITE;
/*!40000 ALTER TABLE `cms_service` DISABLE KEYS */;
INSERT INTO `cms_service` VALUES (1,'company_reg',1,'香港公司注册','极速下证 · 持牌秘书合规托管','世界金融中心，自由的商贸港口，香港公司注册便于提升公司国际品牌形象及开拓海外业务。','企业级合规','¥4580 元起','hk-company-registration',NULL,'\n      <p>香港是全球最自由的经济体之一，实行简单低税制、无外汇管制，是中资企业设立海外总部与资金中转的首选地。</p>\n      <h2>办理香港公司注册，您将获得</h2>\n      <div class=\"cb-cards4\">\n        <div class=\"cb-card\"><div class=\"cb-card__value\">1 天</div><div class=\"cb-card__label\">电子注册最快下证</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">0 外汇</div><div class=\"cb-card__label\">无外汇管制自由收付</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">8.25%</div><div class=\"cb-card__label\">利得税两级制税率</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">全球</div><div class=\"cb-card__label\">国际品牌形象背书</div></div>\n      </div>\n      <h2>注册所需资料</h2>\n      <ul>\n        <li>拟用公司名称（中英文各一个，需先查册）</li>\n        <li>董事及股东的有效身份证件 / 护照</li>\n        <li>董事及股东的住址证明（近 3 个月）</li>\n        <li>注册资本（标准 10,000 股，无需验资）</li>\n      </ul>\n      <h2>费用包含</h2>\n      <p>政府规费、法定注册地址、公司秘书服务、精美绿盒（含钢印、小圆章、章程、股票本）、顺丰保价包邮。</p>\n      <blockquote>所有方案均出具书面风险提示与费用清单；如查册不通过，注册费全额退还。</blockquote>\n    ','[{\"desc\": \"查册香港公司注册署数据库，30分钟内快速出具查册报告\", \"name\": \"免费名称核查\", \"time\": \"30分钟\"}, {\"desc\": \"提供董事股东有效身份证件，签署委托协议及法定申请表\", \"name\": \"签署法定协议\", \"time\": \"1小时\"}, {\"desc\": \"永鸿专属政府通道在线直呈CR电子系统，合规加速审批\", \"name\": \"递交香港注册署\", \"time\": \"1个工作日\"}, {\"desc\": \"下发注册证书(CR)与商业登记证(BR)，精雕法定印章与章程\", \"name\": \"制作全套绿盒印章\", \"time\": \"1个工作日\"}, {\"desc\": \"对接汇丰/渣打/华侨等合作银行客户经理，视频见证下户\", \"name\": \"安排直联银行开户\", \"time\": \"3-5工作日\"}, {\"desc\": \"全套原版绿盒、印章及开户结算卡顺丰保价安全速递到手\", \"name\": \"顺丰保价包邮送达\", \"time\": \"次日达\"}]','[1]',0,1,1,1,'香港公司注册|1天下证|永鸿国际','香港公司注册加急最快1天下证，含政府规费、法定地址、公司秘书与绿盒，持牌顾问全程代办。','香港公司注册,香港注册公司,香港公司设立','{\"en\": {\"title\": \"Hong Kong Company Registration\", \"content\": \"\\n      <p>Hong Kong is one of the world\'s freest economies, with a simple low-tax regime and no exchange controls — the top choice for Chinese enterprises setting up a regional headquarters.</p>\\n      <h2>What you get</h2>\\n      <div class=\\\"cb-cards4\\\">\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">1 day</div><div class=\\\"cb-card__label\\\">Fastest e-filing</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">No FX</div><div class=\\\"cb-card__label\\\">Free cross-border transfers</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">8.25%</div><div class=\\\"cb-card__label\\\">Two-tier profits tax</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">Global</div><div class=\\\"cb-card__label\\\">International brand credibility</div></div>\\n      </div>\\n      <h2>Documents required</h2>\\n      <ul>\\n        <li>Proposed company name (one Chinese and one English)</li>\\n        <li>Valid ID / passport of directors and shareholders</li>\\n        <li>Proof of address (within the last 3 months)</li>\\n        <li>Share capital (standard 10,000 shares, no verification required)</li>\\n      </ul>\\n      <h2>What is included</h2>\\n      <p>Government fees, statutory registered address, company secretary, a full green box (common seal, chop, articles, share book) and insured express delivery.</p>\\n      <blockquote>A written risk note and itemised fee list is issued for every plan; full refund if the name search fails.</blockquote>\\n    \", \"summary\": \"A free port and world-class financial centre — a Hong Kong company strengthens your international brand and opens up overseas business.\", \"ext_json\": {\"unit\": \"\", \"price\": \"4,580\", \"btn_text\": \"Apply now →\"}, \"seo_title\": \"Hong Kong Company Registration | 1-day Certificate | YONGHONG\", \"sub_title\": \"Fast track · Licensed company secretary\", \"badge_text\": \"Fully compliant\", \"price_text\": \"From ¥4,580\", \"seo_keywords\": \"hong kong company registration,hong kong incorporate\", \"seo_description\": \"Hong Kong company registration in as fast as 1 day — government fees, statutory address, secretary and green box included.\"}}','{\"icon\": \"fa-building-columns\", \"unit\": \"元起\", \"price\": \"4580\", \"btn_text\": \"我要办理 →\", \"gradient\": \"from-emerald-500 to-teal-600\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(2,'annual_audit',1,'香港公司年审','周年申报 · 专人智能预警','在香港注册公司后嫌年审繁琐？交给永鸿国际专业秘书团队，专人智能预警，让您彻底省心放心。','企业级合规','¥2980 元起','hk-company-annual-return',NULL,'\n      <p>香港公司成立满 12 个月后须办理周年申报（NAR1）并换领商业登记证（BR），逾期将产生高额罚款甚至被法院传票。</p>\n      <h2>年审服务内容</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>周年申报表 NAR1</strong><p>向公司注册处递交上年度公司资料变更申报。</p></div>\n        <div class=\"cb-card\"><strong>换领商业登记证 BR</strong><p>向税务局续期商业登记，避免罚款与经营受限。</p></div>\n        <div class=\"cb-card\"><strong>法定地址与秘书续期</strong><p>维持注册地址与公司秘书，保障合规存续。</p></div>\n        <div class=\"cb-card\"><strong>智能到期预警</strong><p>到期前 30/15/7 天三重提醒，绝不遗漏。</p></div>\n      </div>\n      <blockquote>逾期 42 天以内罚款 HK$870；超过 42 天罚款将逐级递增，最高可达 HK$5,000 并可能收到法院传票。</blockquote>\n    ','[{\"desc\": \"在线填写业务需求，专属顾问 10 分钟内与您对接\", \"name\": \"提交办理资料\", \"time\": \"10分钟\"}, {\"desc\": \"核对证件与方案条款，出具书面风险提示与费用清单\", \"name\": \"持牌顾问审核\", \"time\": \"1小时\"}, {\"desc\": \"通过专属政府/银行通道直呈系统，合规加速审批\", \"name\": \"递交官方受理\", \"time\": \"1-3个工作日\"}, {\"desc\": \"证书、印章、账户或报告顺丰保价包邮到手\", \"name\": \"交付成果凭证\", \"time\": \"1个工作日\"}]','[]',0,2,1,1,'香港公司年审|周年申报|永鸿国际','香港公司年审周年申报与商业登记证续期一站式代办，到期前三重提醒，逾期补办亦可处理。','香港公司年审,香港周年申报,香港商业登记证','{\"en\": {\"title\": \"Hong Kong Annual Return\", \"content\": \"\\n      <p>Twelve months after incorporation a Hong Kong company must file its annual return (NAR1) and renew its business registration certificate (BR). Late filing triggers escalating penalties and a possible court summons.</p>\\n      <h2>What is included</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Annual return NAR1</strong><p>Filing of the previous year\'s company particulars with the Companies Registry.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Business registration renewal</strong><p>Renewal with the Inland Revenue Department to keep trading legally.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Address & secretary renewal</strong><p>Statutory registered address and company secretary maintained.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Smart deadline alerts</strong><p>Reminders at 30, 15 and 7 days before the due date.</p></div>\\n      </div>\\n      <blockquote>Late by up to 42 days: HK$870. Beyond that the penalty escalates to HK$5,000 and a court summons may be issued.</blockquote>\\n    \", \"summary\": \"Tired of the annual return? Our professional secretaries track every deadline so you never have to.\", \"ext_json\": {\"unit\": \"\", \"price\": \"2,980\", \"btn_text\": \"Apply now →\"}, \"seo_title\": \"Hong Kong Annual Return | YONGHONG\", \"sub_title\": \"Annual filing · Proactive deadline alerts\", \"badge_text\": \"Fully compliant\", \"price_text\": \"From ¥2,980\", \"seo_keywords\": \"hong kong annual return,hong kong business registration\", \"seo_description\": \"One-stop Hong Kong annual return and business registration renewal with triple deadline reminders.\"}}','{\"icon\": \"fa-user-check\", \"unit\": \"元起\", \"price\": \"2980\", \"btn_text\": \"我要办理 →\", \"gradient\": \"from-amber-500 to-amber-600\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(3,'bank_acct',1,'香港银行开户','视频远程见证 · 包下户通道','个人开立香港公司账户难？永鸿国际特殊银行包开绿色渠道，视频远程见证，助力高效开户。','企业级合规','¥2000 元起','hk-bank-account-opening',NULL,'\n      <p>我们与汇丰、渣打、华侨、东亚等银行建立总行直联渠道，客户经理远程视频见证即可完成面签，无需亲自赴港。</p>\n      <h2>开户前我们会做的准备</h2>\n      <ul>\n        <li>按您的行业与资金流向匹配最合适的银行</li>\n        <li>预审 KYC 材料，提前规避被拒风险</li>\n        <li>模拟银行面签问答，逐条辅导通关要点</li>\n        <li>整理业务合同、发票、网站等佐证资料</li>\n      </ul>\n      <h2>开户周期</h2>\n      <div class=\"cb-cards4\">\n        <div class=\"cb-card\"><div class=\"cb-card__value\">2 周</div><div class=\"cb-card__label\">汇丰/渣打典型下户</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">1-2 周</div><div class=\"cb-card__label\">华侨银行</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">10 天</div><div class=\"cb-card__label\">东亚银行</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">98.6%</div><div class=\"cb-card__label\">我们的通过率</div></div>\n      </div>\n    ','[{\"desc\": \"在线填写业务需求，专属顾问 10 分钟内与您对接\", \"name\": \"提交办理资料\", \"time\": \"10分钟\"}, {\"desc\": \"核对证件与方案条款，出具书面风险提示与费用清单\", \"name\": \"持牌顾问审核\", \"time\": \"1小时\"}, {\"desc\": \"通过专属政府/银行通道直呈系统，合规加速审批\", \"name\": \"递交官方受理\", \"time\": \"1-3个工作日\"}, {\"desc\": \"证书、印章、账户或报告顺丰保价包邮到手\", \"name\": \"交付成果凭证\", \"time\": \"1个工作日\"}]','[]',0,3,1,1,'香港银行开户|视频远程见证|永鸿国际','香港公司银行开户免赴港视频见证，汇丰渣打华侨东亚总行直联，KYC 辅导通关，通过率 98.6%。','香港银行开户,离岸账户,汇丰开户,渣打开户','{\"en\": {\"title\": \"Hong Kong Bank Account Opening\", \"content\": \"\\n      <p>We work directly with HSBC, Standard Chartered, OCBC and BEA so that a relationship manager can witness your interview by video — no travel to Hong Kong.</p>\\n      <h2>How we prepare you</h2>\\n      <ul>\\n        <li>Match you to the right bank for your industry and fund flows</li>\\n        <li>Pre-audit KYC documents to remove rejection risks</li>\\n        <li>Rehearse the bank interview question by question</li>\\n        <li>Compile contracts, invoices and website evidence</li>\\n      </ul>\\n      <h2>Timelines</h2>\\n      <div class=\\\"cb-cards4\\\">\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">2 weeks</div><div class=\\\"cb-card__label\\\">HSBC / SCB typical</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">1–2 weeks</div><div class=\\\"cb-card__label\\\">OCBC</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">10 days</div><div class=\\\"cb-card__label\\\">BEA</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">98.6%</div><div class=\\\"cb-card__label\\\">Our approval rate</div></div>\\n      </div>\\n    \", \"summary\": \"Hard to open a Hong Kong corporate account? Our green channel offers remote video witnessing for a smooth opening.\", \"ext_json\": {\"unit\": \"\", \"price\": \"2,000\", \"btn_text\": \"Apply now →\"}, \"seo_title\": \"Hong Kong Bank Account | Remote Video Witnessing | YONGHONG\", \"sub_title\": \"Remote video witnessing · Guaranteed channel\", \"badge_text\": \"Fully compliant\", \"price_text\": \"From ¥2,000\", \"seo_keywords\": \"hong kong bank account,offshore account,hsbc account\", \"seo_description\": \"Open a Hong Kong corporate account without travelling — video witnessing, KYC coaching, 98.6% approval.\"}}','{\"icon\": \"fa-vault\", \"unit\": \"元起\", \"price\": \"2000\", \"btn_text\": \"我要办理 →\", \"gradient\": \"from-teal-600 to-emerald-700\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(4,'annual_audit',1,'香港审计报税','持牌 CPA · 无保留意见','代理香港公司财税审计怎么做最省心？香港持牌执业会计师(CPA)，让永鸿来为您“金”打细算。','企业级合规','¥2980 元起','hk-audit-tax-filing',NULL,'\n      <p>香港利得税报税分两个阶段：收到报税表后需在 1 个月内提交；首年可申请延期至 3 个月。所有香港公司每年均须由执业会计师出具审计报告。</p>\n      <h2>服务范围</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>做账</strong><p>整理银行流水、单据与合同，按香港准则编制财务报表。</p></div>\n        <div class=\"cb-card\"><strong>审计</strong><p>由执业会计师出具无保留意见 / 保留意见审计报告。</p></div>\n        <div class=\"cb-card\"><strong>报税</strong><p>填报利得税报税表，申请两级制与离岸豁免。</p></div>\n        <div class=\"cb-card\"><strong>税务筹划</strong><p>结合 BEPS 2.0 与离岸所得免税，制定合规节税路径。</p></div>\n      </div>\n      <blockquote>离岸所得免税并非“零申报”——税务局对无保留意见报告的抽查率正在上升，务必保留完整证据链。</blockquote>\n    ','[{\"desc\": \"在线填写业务需求，专属顾问 10 分钟内与您对接\", \"name\": \"提交办理资料\", \"time\": \"10分钟\"}, {\"desc\": \"核对证件与方案条款，出具书面风险提示与费用清单\", \"name\": \"持牌顾问审核\", \"time\": \"1小时\"}, {\"desc\": \"通过专属政府/银行通道直呈系统，合规加速审批\", \"name\": \"递交官方受理\", \"time\": \"1-3个工作日\"}, {\"desc\": \"证书、印章、账户或报告顺丰保价包邮到手\", \"name\": \"交付成果凭证\", \"time\": \"1个工作日\"}]','[]',0,4,1,1,'香港审计报税|持牌CPA|永鸿国际','香港公司做账审计报税一站式，执业会计师出具报告，两级制与离岸免税申请，合规节税。','香港审计,香港报税,香港做账,离岸免税','{\"en\": {\"title\": \"Hong Kong Audit & Tax Filing\", \"content\": \"\\n      <p>Hong Kong profits tax runs in two stages: the return must be filed within one month of receipt (extendable to three for the first year), and every company needs an audit report from a practising accountant each year.</p>\\n      <h2>Scope</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Bookkeeping</strong><p>Bank statements, vouchers and contracts compiled under HK standards.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Audit</strong><p>Unqualified or qualified opinion issued by a practising accountant.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Filing</strong><p>Profits tax return prepared; two-tier and offshore claims applied.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Tax planning</strong><p>Compliant structuring around BEPS 2.0 and offshore exemption.</p></div>\\n      </div>\\n      <blockquote>An offshore claim is not a nil filing — the IRD audits far more frequently, so keep a complete evidence chain.</blockquote>\\n    \", \"summary\": \"Let licensed practising accountants (CPA) handle your Hong Kong bookkeeping and audit down to the last penny.\", \"ext_json\": {\"unit\": \"\", \"price\": \"2,980\", \"btn_text\": \"Apply now →\"}, \"seo_title\": \"Hong Kong Audit & Tax | Licensed CPA | YONGHONG\", \"sub_title\": \"Licensed CPA · Unqualified opinion\", \"badge_text\": \"Fully compliant\", \"price_text\": \"From ¥2,980\", \"seo_keywords\": \"hong kong audit,hong kong tax filing,hong kong bookkeeping\", \"seo_description\": \"One-stop Hong Kong bookkeeping, audit and tax filing by licensed CPAs with two-tier and offshore claims.\"}}','{\"icon\": \"fa-calculator\", \"unit\": \"元起\", \"price\": \"2980\", \"btn_text\": \"我要办理 →\", \"gradient\": \"from-rose-500 to-rose-600\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(5,'company_reg',1,'香港公司注销','清盘清税 · 15天下证','合规安全注销避免政府高额罚款，简单轻松，清账清税快速注销或转让，免除后顾之忧。','企业级合规','¥1500 元起','hk-company-deregistration',NULL,'\n      <p>不再使用的香港公司若不注销，仍须逐年年审并缴纳商业登记费，逾期将累积罚款并影响董事信用记录。</p>\n      <h2>两种退出方式</h2>\n      <div class=\"cb-cards2\">\n        <div class=\"cb-card\"><strong>撤销注册（自愿注销）</strong><p>适合无未清偿债务的公司，由税务局与注册处联合批准，约 5-6 个月完成。</p></div>\n        <div class=\"cb-card\"><strong>清盘（强制/自愿）</strong><p>适合有债务或资产的公司，需委任清盘人，流程更严谨。</p></div>\n      </div>\n      <h2>办理前提</h2>\n      <ul>\n        <li>公司从未开始营业，或已停止营业超过 3 个月</li>\n        <li>所有税务申报已完成，无未缴税款</li>\n        <li>无未决的法律程序与债务</li>\n      </ul>\n    ','[{\"desc\": \"在线填写业务需求，专属顾问 10 分钟内与您对接\", \"name\": \"提交办理资料\", \"time\": \"10分钟\"}, {\"desc\": \"核对证件与方案条款，出具书面风险提示与费用清单\", \"name\": \"持牌顾问审核\", \"time\": \"1小时\"}, {\"desc\": \"通过专属政府/银行通道直呈系统，合规加速审批\", \"name\": \"递交官方受理\", \"time\": \"1-3个工作日\"}, {\"desc\": \"证书、印章、账户或报告顺丰保价包邮到手\", \"name\": \"交付成果凭证\", \"time\": \"1个工作日\"}]','[]',0,5,0,1,'香港公司注销|撤销注册|永鸿国际','香港公司注销与撤销注册一站式办理，清盘清税、避免罚款，15 天启动、免除后顾之忧。','香港公司注销,香港撤销注册,香港清盘','{\"en\": {\"title\": \"Hong Kong Company Deregistration\", \"content\": \"\\n      <p>An idle Hong Kong company still owes annual returns and business registration fees; penalties accumulate and the director\'s credit record suffers.</p>\\n      <h2>Two ways out</h2>\\n      <div class=\\\"cb-cards2\\\">\\n        <div class=\\\"cb-card\\\"><strong>Deregistration</strong><p>For companies with no outstanding liabilities — approved jointly by the IRD and the CR in about 5–6 months.</p></div>\\n        <div class=\\\"cb-card\\\"><strong>Winding up</strong><p>For companies with debts or assets; requires a liquidator and a stricter process.</p></div>\\n      </div>\\n      <h2>Prerequisites</h2>\\n      <ul>\\n        <li>The company never traded, or ceased trading more than 3 months ago</li>\\n        <li>All tax returns are filed and no tax remains unpaid</li>\\n        <li>No pending legal proceedings or liabilities</li>\\n      </ul>\\n    \", \"summary\": \"Compliant deregistration avoids heavy government penalties — settle accounts and tax, then strike off or transfer.\", \"ext_json\": {\"unit\": \"\", \"price\": \"1,500\", \"btn_text\": \"Apply now →\"}, \"seo_title\": \"Hong Kong Company Deregistration | YONGHONG\", \"sub_title\": \"Winding up · Certificate in 15 days\", \"badge_text\": \"Fully compliant\", \"price_text\": \"From ¥1,500\", \"seo_keywords\": \"hong kong company deregistration,hong kong winding up\", \"seo_description\": \"One-stop Hong Kong deregistration and winding up — avoid penalties and close cleanly.\"}}','{\"icon\": \"fa-lightbulb\", \"unit\": \"元起\", \"price\": \"1500\", \"btn_text\": \"我要办理 →\", \"gradient\": \"from-sky-500 to-sky-600\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(6,'trademark',0,'全球商标注册','马德里体系 · 1对1 检索','全球两百多个国家地区在线一站式商标布局，1对1涉外知识产权专家免费近似检索，防抢注侵权。','企业级合规','¥800 元起','global-trademark-registration',NULL,'\n      <p>跨境电商被抢注、被投诉下架，往往损失远超注册成本。提前布局商标是品牌出海最划算的投入。</p>\n      <h2>可办理区域</h2>\n      <div class=\"cb-cards4\">\n        <div class=\"cb-card\"><div class=\"cb-card__value\">中国</div><div class=\"cb-card__label\">国内注册与续展</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">香港</div><div class=\"cb-card__label\">商标注册条例</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">马德里</div><div class=\"cb-card__label\">120+ 成员国一标多国</div></div>\n        <div class=\"cb-card\"><div class=\"cb-card__value\">US/EU</div><div class=\"cb-card__label\">单一国家与欧盟</div></div>\n      </div>\n      <h2>服务流程</h2>\n      <ul>\n        <li>免费近似检索与可注册性评估</li>\n        <li>确定类别与商品/服务项目（尼斯分类）</li>\n        <li>递交申请并跟进官方审查意见</li>\n        <li>领取证书并提供 10 年续展提醒</li>\n      </ul>\n    ','[{\"desc\": \"在线填写业务需求，专属顾问 10 分钟内与您对接\", \"name\": \"提交办理资料\", \"time\": \"10分钟\"}, {\"desc\": \"核对证件与方案条款，出具书面风险提示与费用清单\", \"name\": \"持牌顾问审核\", \"time\": \"1小时\"}, {\"desc\": \"通过专属政府/银行通道直呈系统，合规加速审批\", \"name\": \"递交官方受理\", \"time\": \"1-3个工作日\"}, {\"desc\": \"证书、印章、账户或报告顺丰保价包邮到手\", \"name\": \"交付成果凭证\", \"time\": \"1个工作日\"}]','[]',0,6,1,1,'全球商标注册|马德里国际商标|永鸿国际','全球商标注册一站式，覆盖中国、香港、马德里 120+ 成员国、美国与欧盟，免费近似检索防抢注。','商标注册,马德里商标,美国商标,香港商标','{\"en\": {\"title\": \"Global Trademark Registration\", \"content\": \"\\n      <p>Being squatted or taken down on a marketplace costs far more than filing. Securing your mark early is the best-value investment in going global.</p>\\n      <h2>Where we file</h2>\\n      <div class=\\\"cb-cards4\\\">\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">China</div><div class=\\\"cb-card__label\\\">Domestic filing & renewal</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">HK</div><div class=\\\"cb-card__label\\\">Trade Marks Ordinance</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">Madrid</div><div class=\\\"cb-card__label\\\">120+ members, one application</div></div>\\n        <div class=\\\"cb-card\\\"><div class=\\\"cb-card__value\\\">US/EU</div><div class=\\\"cb-card__label\\\">Single country & EUIPO</div></div>\\n      </div>\\n      <h2>Process</h2>\\n      <ul>\\n        <li>Free similarity search and registrability assessment</li>\\n        <li>Class and goods/services selection (Nice Classification)</li>\\n        <li>Filing and follow-up on office actions</li>\\n        <li>Certificate issued with a 10-year renewal reminder</li>\\n      </ul>\\n    \", \"summary\": \"Register your trademark across 200+ jurisdictions with a free similarity search by overseas IP specialists.\", \"ext_json\": {\"unit\": \"\", \"price\": \"800\", \"btn_text\": \"Apply now →\"}, \"seo_title\": \"Global Trademark Registration | Madrid | YONGHONG\", \"sub_title\": \"Madrid System · 1-on-1 clearance search\", \"badge_text\": \"Fully compliant\", \"price_text\": \"From ¥800\", \"seo_keywords\": \"trademark registration,madrid trademark,us trademark\", \"seo_description\": \"Register trademarks in China, Hong Kong, 120+ Madrid members, the US and the EU with a free clearance search.\"}}','{\"icon\": \"fa-trademark\", \"unit\": \"元起\", \"price\": \"800\", \"btn_text\": \"我要办理 →\", \"gradient\": \"from-indigo-500 to-indigo-600\"}',1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cms_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_site_config`
--

DROP TABLE IF EXISTS `cms_site_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_site_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `config_key` varchar(64) NOT NULL COMMENT '配置键',
  `config_name` varchar(100) NOT NULL COMMENT '配置名称(后台显示)',
  `config_value` text COMMENT '配置值(支持 JSON 串)',
  `value_type` varchar(20) NOT NULL DEFAULT 'string' COMMENT '值类型 string/number/boolean/json/image/color',
  `group_name` varchar(50) NOT NULL DEFAULT 'base' COMMENT '分组 base/seo/home/footer/cs',
  `lang` varchar(8) NOT NULL DEFAULT 'zh' COMMENT '语言 zh/en(双语配置各存一条)',
  `is_public` tinyint(4) NOT NULL DEFAULT '1' COMMENT '是否对公网 API 可见 1是 0仅后台',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注(给运营的说明)',
  `sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '分组内排序',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 1启用 0停用',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '逻辑删除',
  `created_by` varchar(64) DEFAULT 'admin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(64) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `publish_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '发布状态 0草稿 1待审核 2已发布 3已下线 (字典 cms_publish_status)，描述工作区/最新一次编辑的阶段',
  `live_flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '前台生效标记 1=正在展示 0=不展示；只有发布成功置1、下线置0，编辑内容不改变它',
  `draft_json` json DEFAULT NULL COMMENT '待发布的工作区内容（相对已生效内容的完整新版本）；NULL 表示与生效内容一致',
  `live_version_id` bigint(20) unsigned DEFAULT NULL COMMENT '当前生效版本 cms_content_version.version_id',
  `submitted_by` varchar(64) DEFAULT NULL COMMENT '提交审核人',
  `submitted_at` datetime DEFAULT NULL COMMENT '提交审核时间',
  `published_by` varchar(64) DEFAULT NULL COMMENT '发布人（责任落点）',
  `published_at` datetime DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key_lang` (`config_key`,`lang`),
  KEY `idx_group_public` (`group_name`,`is_public`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COMMENT='全站配置(中英双语+JSON)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_site_config`
--

LOCK TABLES `cms_site_config` WRITE;
/*!40000 ALTER TABLE `cms_site_config` DISABLE KEYS */;
INSERT INTO `cms_site_config` VALUES (1,'site_name','站点名称','永鸿国际','string','base','zh',1,'导航 Logo 旁文字',0,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(2,'site_name','站点名称','YONGHONG','string','base','en',1,'导航 Logo 旁文字',0,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(3,'brand_en','品牌英文副标题','YONGHONG INTERNATIONAL CONSULTING','string','base','zh',1,'导航中文名下方的英文小字',1,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(4,'brand_en','品牌英文副标题','YONGHONG INTERNATIONAL CONSULTING','string','base','en',1,'导航中文名下方的英文小字',1,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(5,'company_full','公司全称','永鸿国际咨询（深圳）有限公司','string','base','zh',1,'页脚展示',2,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(6,'company_full','公司全称','Yonghong International Consulting (Shenzhen) Co., Ltd.','string','base','en',1,'页脚展示',2,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(7,'company_addr','公司地址','深圳市罗湖区南湖街道嘉北社区迎春路3号海燕大厦20层2010','string','base','zh',1,NULL,3,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(8,'company_addr','公司地址','20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District, Shenzhen, China','string','base','en',1,NULL,3,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(9,'company_phone','客服电话','18123763835','string','base','zh',1,NULL,4,1,0,'admin','2026-09-29 21:26:36',NULL,'2026-10-19 21:02:30',2,1,NULL,NULL,NULL,NULL,NULL,NULL),(10,'company_phone','客服电话','+86 18123763835','string','base','en',1,NULL,4,1,0,'admin','2026-09-29 21:26:36',NULL,'2026-10-19 21:02:30',2,1,NULL,NULL,NULL,NULL,NULL,NULL),(11,'company_email','联系邮箱','805856285@qq.com','string','base','zh',1,NULL,5,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(12,'company_email','联系邮箱','805856285@qq.com','string','base','en',1,NULL,5,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(13,'company_credit','统一社会信用代码','91440300MA5FEMF959','string','base','zh',1,NULL,6,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(14,'company_credit','统一社会信用代码','91440300MA5FEMF959','string','base','en',1,NULL,6,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(15,'company_regdate','成立日期','2018-12-20','string','base','zh',1,NULL,7,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(16,'company_regdate','成立日期','2018-12-20','string','base','en',1,NULL,7,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(17,'privacy_version','隐私政策版本号','v1.0','string','base','zh',1,'★留资同意时写入 consent_version',8,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(18,'privacy_version','隐私政策版本号','v1.0','string','base','en',1,'★留资同意时写入 consent_version',8,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(19,'cdn_base','CDN/静态资源域名','','string','base','zh',1,'★切OSS/换域名只改这一条（开发期留空 = 不加前缀）',9,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(20,'cdn_base','CDN/静态资源域名','','string','base','en',1,'★切OSS/换域名只改这一条（开发期留空 = 不加前缀）',9,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(21,'turnstile_site_key','人机验证 SiteKey','','string','base','zh',0,NULL,10,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(22,'turnstile_site_key','人机验证 SiteKey','','string','base','en',0,NULL,10,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(23,'seo_site_title','首页标题 TDK','永鸿国际|香港新加坡美国公司注册|银行开户年审','string','seo','zh',1,NULL,11,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(24,'seo_site_title','首页标题 TDK','YONGHONG|Hong Kong & Singapore Company Registration|Bank Account Opening','string','seo','en',1,NULL,11,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(25,'seo_site_desc','首页描述 TDK','永鸿国际专注海外企服：香港公司注册、新加坡开户、美国公司设立、年审报税、商标专利，20000+ 客户选择','string','seo','zh',1,NULL,12,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(26,'seo_site_desc','首页描述 TDK','YONGHONG focuses on overseas corporate services: Hong Kong company registration, Singapore bank accounts, US incorporation, audit & trademark. Chosen by 20,000+ clients.','string','seo','en',1,NULL,12,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(27,'seo_site_kw','首页关键词 TDK','香港公司注册,新加坡公司开户,美国公司设立,海外年审','string','seo','zh',1,NULL,13,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(28,'seo_site_kw','首页关键词 TDK','hong kong company registration,singapore bank account,us incorporation,offshore audit','string','seo','en',1,NULL,13,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(29,'icp_number','ICP 备案号','粤ICP备2022121434号-1','string','seo','zh',1,NULL,14,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(30,'icp_number','ICP 备案号','粤ICP备2022121434号-1','string','seo','en',1,NULL,14,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(31,'home_rec','今日推荐','{\"title\":\"今日推荐\",\"num\":\"12,304位\",\"sub\":\"本月已为企业家成功出海办结\"}','json','home','zh',1,NULL,15,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(32,'home_rec','今日推荐','{\"title\":\"Today\'s Pick\",\"num\":\"12,304\",\"sub\":\"Businesses successfully landed overseas this month\"}','json','home','en',1,NULL,15,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(33,'home_stats','业务动态','[{\"name\":\"香港公司注册\",\"sub\":\"一对一专业\",\"num\":\"22,102家\"},{\"name\":\"香港银行开户\",\"sub\":\"100%包开户\",\"num\":\"1,710件\"},{\"name\":\"香港做账审计\",\"sub\":\"办理过程全透明\",\"num\":\"51,042件\"},{\"name\":\"香港公司注销\",\"sub\":\"15天快速下证\",\"num\":\"1,911件\"}]','json','home','zh',1,NULL,16,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(34,'home_stats','业务动态','[{\"name\":\"HK Company Setup\",\"sub\":\"1-on-1 specialists\",\"num\":\"22,102\"},{\"name\":\"HK Bank Account\",\"sub\":\"100% guaranteed\",\"num\":\"1,710\"},{\"name\":\"HK Audit & Tax\",\"sub\":\"Fully transparent\",\"num\":\"51,042\"},{\"name\":\"HK Deregistration\",\"num\":\"1,911\",\"sub\":\"Certificate in 15 days\"}]','json','home','en',1,NULL,16,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(35,'home_service','核心服务矩阵专区标题','{\"title\":\"核心出海业务矩阵\",\"subtitle\":\"全牌照合规服务 · 助力中国企业无缝拓展全球蓝海市场\"}','json','home','zh',1,'★新增键：首页「核心出海业务矩阵」标题/副标题',17,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(36,'home_service','核心服务矩阵专区标题','{\"title\":\"Global Expansion Matrix\",\"subtitle\":\"Fully licensed compliance services · Helping Chinese enterprises open up new global markets\"}','json','home','en',1,'★新增键：首页「核心出海业务矩阵」标题/副标题',17,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(37,'home_process','办理流程专区','{\"title\":\"香港公司注册服务落地页 (2026年最新政策流程)\",\"sub\":\"全程一对一持牌秘书代办，最快 1 个工作日下发注册证书及商业登记证\",\"steps\":[{\"name\":\"免费名称核查\",\"desc\":\"查册香港公司注册署数据库，30分钟内快速出具查册报告\",\"time\":\"30分钟\"},{\"name\":\"签署法定协议\",\"desc\":\"提供董事股东有效身份证件，签署委托协议及法定申请表\",\"time\":\"1小时\"},{\"name\":\"递交香港注册署\",\"desc\":\"永鸿专属政府通道在线直呈CR电子系统，合规加速审批\",\"time\":\"1个工作日\"},{\"name\":\"制作全套绿盒印章\",\"desc\":\"下发注册证书(CR)与商业登记证(BR)，精雕法定印章与章程\",\"time\":\"1个工作日\"},{\"name\":\"安排直联银行开户\",\"desc\":\"对接汇丰/渣打/华侨等合作银行客户经理，视频见证下户\",\"time\":\"3-5工作日\"},{\"name\":\"顺丰保价包邮送达\",\"desc\":\"全套原版绿盒、印章及开户结算卡顺丰保价安全速递到手\",\"time\":\"次日达\"}]}','json','home','zh',1,NULL,18,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(38,'home_process','办理流程专区','{\"title\":\"Hong Kong Company Registration — 2026 Latest Process\",\"sub\":\"Handled 1-on-1 by licensed company secretaries; certificate of incorporation issued in as fast as 1 working day\",\"steps\":[{\"name\":\"Free name search\",\"desc\":\"Search the Companies Registry database and receive a search report within 30 minutes\",\"time\":\"30 min\"},{\"name\":\"Sign the engagement letter\",\"desc\":\"Provide valid ID of directors and shareholders; sign the mandate and statutory forms\",\"time\":\"1 hour\"},{\"name\":\"File with the Companies Registry\",\"desc\":\"Our dedicated government channel submits electronically to the CR system\",\"time\":\"1 working day\"},{\"name\":\"Produce the full green box\",\"desc\":\"CR certificate and business registration issued; statutory chops and articles engraved\",\"time\":\"1 working day\"},{\"name\":\"Arrange the bank account\",\"desc\":\"Introduced to relationship managers at HSBC / SCB / OCBC with video witnessing\",\"time\":\"3–5 days\"},{\"name\":\"Insured courier delivery\",\"desc\":\"The original green box, chops and settlement card delivered by insured express\",\"time\":\"Next day\"}]}','json','home','en',1,NULL,18,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(39,'home_section_switch','首页区块显隐','{\"banner\":true,\"stats\":true,\"service\":true,\"process\":true,\"bank\":true,\"case\":true,\"article\":true,\"footer\":true}','json','home','zh',1,NULL,19,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(40,'home_section_switch','首页区块显隐','{\"banner\":true,\"stats\":true,\"service\":true,\"process\":true,\"bank\":true,\"case\":true,\"article\":true,\"footer\":true}','json','home','en',1,NULL,19,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(41,'footer_links','页脚快捷链接','[{\"name\":\"隐私政策\",\"url\":\"/privacy-policy\"},{\"name\":\"服务条款\",\"url\":\"/terms-of-service\"},{\"name\":\"公司简介\",\"url\":\"/about-profile\"},{\"name\":\"联系我们\",\"url\":\"/about-contact\"}]','json','footer','zh',1,NULL,20,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(42,'footer_links','页脚快捷链接','[{\"name\":\"Privacy Policy\",\"url\":\"/privacy-policy\"},{\"name\":\"Terms of Service\",\"url\":\"/terms-of-service\"},{\"name\":\"Company Profile\",\"url\":\"/about-profile\"},{\"name\":\"Contact Us\",\"url\":\"/about-contact\"}]','json','footer','en',1,NULL,20,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(43,'friend_links','友情链接','[{\"name\":\"高新技术企业认定\",\"url\":\"\"},{\"name\":\"实验室认可\",\"url\":\"\"},{\"name\":\"B2B\",\"url\":\"\"},{\"name\":\"中小企业管理软件\",\"url\":\"\"},{\"name\":\"昆山个体户注册\",\"url\":\"\"},{\"name\":\"网站建设公司\",\"url\":\"\"}]','json','footer','zh',1,'SEO 友链；url 留空则前台渲染为纯文字，填了才是可点链接',21,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(44,'friend_links','友情链接','[{\"name\":\"Hi-tech Enterprise Accreditation\",\"url\":\"\"},{\"name\":\"Laboratory Accreditation\",\"url\":\"\"},{\"name\":\"B2B\",\"url\":\"\"},{\"name\":\"SME Management Software\",\"url\":\"\"},{\"name\":\"Kunshan Sole Trader Registration\",\"url\":\"\"},{\"name\":\"Website Building\",\"url\":\"\"}]','json','footer','en',1,'SEO 友链；url 留空则前台渲染为纯文字，填了才是可点链接',21,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(45,'cs_quick_tags','客服快捷标签','[{\"emoji\":\"🇭🇰\",\"label\":\"香港公司设立与费用\",\"question\":\"香港公司设立条件与周期\"},{\"emoji\":\"🏦\",\"label\":\"汇丰/渣打免赴港开户\",\"question\":\"香港离岸银行远程开户\"},{\"emoji\":\"📑\",\"label\":\"做账审计与合规申报\",\"question\":\"香港做账审计与合规申报\"},{\"emoji\":\"🇸🇬\",\"label\":\"新加坡设立及商标\",\"question\":\"新加坡设立与海外商标\"}]','json','cs','zh',1,'★由字符串数组改为对象数组：emoji / 按钮文字 / 点击后发送的问句',22,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(46,'cs_quick_tags','客服快捷标签','[{\"emoji\":\"🇭🇰\",\"label\":\"HK setup & fees\",\"question\":\"Requirements and timeline for setting up a Hong Kong company\"},{\"emoji\":\"🏦\",\"label\":\"HSBC / SCB remote account\",\"question\":\"Remote offshore bank account opening in Hong Kong\"},{\"emoji\":\"📑\",\"label\":\"Audit & compliance filing\",\"question\":\"Hong Kong bookkeeping, audit and compliance filing\"},{\"emoji\":\"🇸🇬\",\"label\":\"Singapore setup & TM\",\"question\":\"Singapore incorporation and overseas trademarks\"}]','json','cs','en',1,'★由字符串数组改为对象数组：emoji / 按钮文字 / 点击后发送的问句',22,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(47,'cs_auto_reply','客服自动回复','您好，我是永鸿国际顾问，正在为您查询相关业务，请稍等片刻。','string','cs','zh',1,NULL,23,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL),(48,'cs_auto_reply','客服自动回复','Hello, this is your YONGHONG consultant. I am checking the details for you — one moment please.','string','cs','en',1,NULL,23,1,0,'admin','2026-09-29 21:26:36',NULL,NULL,2,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cms_site_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gen_table`
--

DROP TABLE IF EXISTS `gen_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gen_table` (
  `table_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `table_name` varchar(200) DEFAULT '' COMMENT '表名称',
  `table_comment` varchar(500) DEFAULT '' COMMENT '表描述',
  `sub_table_name` varchar(64) DEFAULT NULL COMMENT '关联子表的表名',
  `sub_table_fk_name` varchar(64) DEFAULT NULL COMMENT '子表关联的外键名',
  `class_name` varchar(100) DEFAULT '' COMMENT '实体类名称',
  `tpl_category` varchar(200) DEFAULT 'crud' COMMENT '使用的模板（crud单表操作 tree树表操作）',
  `tpl_web_type` varchar(30) DEFAULT '' COMMENT '前端模板类型（element-ui模版 element-plus模版）',
  `package_name` varchar(100) DEFAULT NULL COMMENT '生成包路径',
  `module_name` varchar(30) DEFAULT NULL COMMENT '生成模块名',
  `business_name` varchar(30) DEFAULT NULL COMMENT '生成业务名',
  `function_name` varchar(50) DEFAULT NULL COMMENT '生成功能名',
  `function_author` varchar(50) DEFAULT NULL COMMENT '生成功能作者',
  `form_col_num` int(11) DEFAULT '1' COMMENT '表单布局（单列 双列 三列）',
  `gen_type` char(1) DEFAULT '0' COMMENT '生成代码方式（0zip压缩包 1自定义路径）',
  `gen_path` varchar(200) DEFAULT '/' COMMENT '生成路径（不填默认项目路径）',
  `options` varchar(1000) DEFAULT NULL COMMENT '其它生成选项',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`table_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代码生成业务表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gen_table`
--

LOCK TABLES `gen_table` WRITE;
/*!40000 ALTER TABLE `gen_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `gen_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gen_table_column`
--

DROP TABLE IF EXISTS `gen_table_column`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gen_table_column` (
  `column_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `table_id` bigint(20) DEFAULT NULL COMMENT '归属表编号',
  `column_name` varchar(200) DEFAULT NULL COMMENT '列名称',
  `column_comment` varchar(500) DEFAULT NULL COMMENT '列描述',
  `column_type` varchar(100) DEFAULT NULL COMMENT '列类型',
  `java_type` varchar(500) DEFAULT NULL COMMENT 'JAVA类型',
  `java_field` varchar(200) DEFAULT NULL COMMENT 'JAVA字段名',
  `is_pk` char(1) DEFAULT NULL COMMENT '是否主键（1是）',
  `is_increment` char(1) DEFAULT NULL COMMENT '是否自增（1是）',
  `is_required` char(1) DEFAULT NULL COMMENT '是否必填（1是）',
  `is_insert` char(1) DEFAULT NULL COMMENT '是否为插入字段（1是）',
  `is_edit` char(1) DEFAULT NULL COMMENT '是否编辑字段（1是）',
  `is_list` char(1) DEFAULT NULL COMMENT '是否列表字段（1是）',
  `is_query` char(1) DEFAULT NULL COMMENT '是否查询字段（1是）',
  `query_type` varchar(200) DEFAULT 'EQ' COMMENT '查询方式（等于、不等于、大于、小于、范围）',
  `html_type` varchar(200) DEFAULT NULL COMMENT '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）',
  `dict_type` varchar(200) DEFAULT '' COMMENT '字典类型',
  `sort` int(11) DEFAULT NULL COMMENT '排序',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`column_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代码生成业务表字段';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gen_table_column`
--

LOCK TABLES `gen_table_column` WRITE;
/*!40000 ALTER TABLE `gen_table_column` DISABLE KEYS */;
/*!40000 ALTER TABLE `gen_table_column` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_config`
--

DROP TABLE IF EXISTS `sys_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_config` (
  `config_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '参数主键',
  `config_name` varchar(100) DEFAULT '' COMMENT '参数名称',
  `config_key` varchar(100) DEFAULT '' COMMENT '参数键名',
  `config_value` varchar(500) DEFAULT '' COMMENT '参数键值',
  `config_type` char(1) DEFAULT 'N' COMMENT '系统内置（Y是 N否）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`config_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COMMENT='参数配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_config`
--

LOCK TABLES `sys_config` WRITE;
/*!40000 ALTER TABLE `sys_config` DISABLE KEYS */;
INSERT INTO `sys_config` VALUES (1,'主框架页-默认皮肤样式名称','sys.index.skinName','skin-blue','Y','admin','2026-09-28 15:50:19','',NULL,'蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow'),(2,'用户管理-账号初始密码','sys.user.initPassword','123456','Y','admin','2026-09-28 15:50:19','',NULL,'初始化密码 123456'),(3,'主框架页-侧边栏主题','sys.index.sideTheme','theme-dark','Y','admin','2026-09-28 15:50:19','',NULL,'深色主题theme-dark，浅色主题theme-light'),(4,'账号自助-验证码开关','sys.account.captchaEnabled','false','Y','admin','2026-09-28 15:50:19','',NULL,'是否开启验证码功能（true开启，false关闭）'),(5,'账号自助-是否开启用户注册功能','sys.account.registerUser','false','Y','admin','2026-09-28 15:50:19','',NULL,'是否开启注册用户功能（true开启，false关闭）'),(6,'用户登录-黑名单列表','sys.login.blackIPList','','Y','admin','2026-09-28 15:50:19','',NULL,'设置登录IP黑名单限制，多个匹配项以;分隔，支持匹配（*通配、网段）'),(7,'用户管理-初始密码修改策略','sys.account.initPasswordModify','1','Y','admin','2026-09-28 15:50:19','',NULL,'0：初始密码修改策略关闭，没有任何提示，1：提醒用户，如果未修改初始密码，则在登录时就会提醒修改密码对话框'),(8,'用户管理-账号密码更新周期','sys.account.passwordValidateDays','0','Y','admin','2026-09-28 15:50:19','',NULL,'密码更新周期（填写数字，数据初始化值为0不限制，若修改必须为大于0小于365的正整数），如果超过这个周期登录系统时，则在登录时就会提醒修改密码对话框'),(9,'用户管理-密码字符范围','sys.account.chrtype','0','Y','admin','2026-09-28 15:50:19','',NULL,'默认任意字符范围，0任意（密码可以输入任意字符），1数字（密码只能为0-9数字），2英文字母（密码只能为a-z和A-Z字母），3字母和数字（密码必须包含字母，数字）,4字母数字和特殊字符（目前支持的特殊字符包括：~!@#$%^&*()-=_+）');
/*!40000 ALTER TABLE `sys_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dept`
--

DROP TABLE IF EXISTS `sys_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dept` (
  `dept_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父部门id',
  `ancestors` varchar(50) DEFAULT '' COMMENT '祖级列表',
  `dept_name` varchar(30) DEFAULT '' COMMENT '部门名称',
  `order_num` int(11) DEFAULT '0' COMMENT '显示顺序',
  `leader` varchar(20) DEFAULT NULL COMMENT '负责人',
  `phone` varchar(11) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `status` char(1) DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=utf8mb4 COMMENT='部门表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dept`
--

LOCK TABLES `sys_dept` WRITE;
/*!40000 ALTER TABLE `sys_dept` DISABLE KEYS */;
INSERT INTO `sys_dept` VALUES (100,0,'0','若依科技',0,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(101,100,'0,100','深圳总公司',1,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(102,100,'0,100','长沙分公司',2,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(103,101,'0,100,101','研发部门',1,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(104,101,'0,100,101','市场部门',2,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(105,101,'0,100,101','测试部门',3,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(106,101,'0,100,101','财务部门',4,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(107,101,'0,100,101','运维部门',5,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(108,102,'0,100,102','市场部门',1,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL),(109,102,'0,100,102','财务部门',2,'若依','15888888888','ry@qq.com','0','0','admin','2026-09-28 15:50:17','',NULL);
/*!40000 ALTER TABLE `sys_dept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dict_data`
--

DROP TABLE IF EXISTS `sys_dict_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dict_data` (
  `dict_code` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '字典编码',
  `dict_sort` int(11) DEFAULT '0' COMMENT '字典排序',
  `dict_label` varchar(100) DEFAULT '' COMMENT '字典标签',
  `dict_value` varchar(100) DEFAULT '' COMMENT '字典键值',
  `dict_type` varchar(100) DEFAULT '' COMMENT '字典类型',
  `css_class` varchar(100) DEFAULT NULL COMMENT '样式属性（其他样式扩展）',
  `list_class` varchar(100) DEFAULT NULL COMMENT '表格回显样式',
  `is_default` char(1) DEFAULT 'N' COMMENT '是否默认（Y是 N否）',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_code`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COMMENT='字典数据表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dict_data`
--

LOCK TABLES `sys_dict_data` WRITE;
/*!40000 ALTER TABLE `sys_dict_data` DISABLE KEYS */;
INSERT INTO `sys_dict_data` VALUES (1,1,'男','0','sys_user_sex','','','Y','0','admin','2026-09-28 15:50:19','',NULL,'性别男'),(2,2,'女','1','sys_user_sex','','','N','0','admin','2026-09-28 15:50:19','',NULL,'性别女'),(3,3,'未知','2','sys_user_sex','','','N','0','admin','2026-09-28 15:50:19','',NULL,'性别未知'),(4,1,'显示','0','sys_show_hide','','primary','Y','0','admin','2026-09-28 15:50:19','',NULL,'显示菜单'),(5,2,'隐藏','1','sys_show_hide','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'隐藏菜单'),(6,1,'正常','0','sys_normal_disable','','primary','Y','0','admin','2026-09-28 15:50:19','',NULL,'正常状态'),(7,2,'停用','1','sys_normal_disable','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'停用状态'),(8,1,'正常','0','sys_job_status','','primary','Y','0','admin','2026-09-28 15:50:19','',NULL,'正常状态'),(9,2,'暂停','1','sys_job_status','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'停用状态'),(10,1,'默认','DEFAULT','sys_job_group','','','Y','0','admin','2026-09-28 15:50:19','',NULL,'默认分组'),(11,2,'系统','SYSTEM','sys_job_group','','','N','0','admin','2026-09-28 15:50:19','',NULL,'系统分组'),(12,1,'是','Y','sys_yes_no','','primary','Y','0','admin','2026-09-28 15:50:19','',NULL,'系统默认是'),(13,2,'否','N','sys_yes_no','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'系统默认否'),(14,1,'通知','1','sys_notice_type','','warning','Y','0','admin','2026-09-28 15:50:19','',NULL,'通知'),(15,2,'公告','2','sys_notice_type','','success','N','0','admin','2026-09-28 15:50:19','',NULL,'公告'),(16,1,'正常','0','sys_notice_status','','primary','Y','0','admin','2026-09-28 15:50:19','',NULL,'正常状态'),(17,2,'关闭','1','sys_notice_status','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'关闭状态'),(18,99,'其他','0','sys_oper_type','','info','N','0','admin','2026-09-28 15:50:19','',NULL,'其他操作'),(19,1,'新增','1','sys_oper_type','','info','N','0','admin','2026-09-28 15:50:19','',NULL,'新增操作'),(20,2,'修改','2','sys_oper_type','','info','N','0','admin','2026-09-28 15:50:19','',NULL,'修改操作'),(21,3,'删除','3','sys_oper_type','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'删除操作'),(22,4,'授权','4','sys_oper_type','','primary','N','0','admin','2026-09-28 15:50:19','',NULL,'授权操作'),(23,5,'导出','5','sys_oper_type','','warning','N','0','admin','2026-09-28 15:50:19','',NULL,'导出操作'),(24,6,'导入','6','sys_oper_type','','warning','N','0','admin','2026-09-28 15:50:19','',NULL,'导入操作'),(25,7,'强退','7','sys_oper_type','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'强退操作'),(26,8,'生成代码','8','sys_oper_type','','warning','N','0','admin','2026-09-28 15:50:19','',NULL,'生成操作'),(27,9,'清空数据','9','sys_oper_type','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'清空操作'),(28,1,'成功','0','sys_common_status','','primary','N','0','admin','2026-09-28 15:50:19','',NULL,'正常状态'),(29,2,'失败','1','sys_common_status','','danger','N','0','admin','2026-09-28 15:50:19','',NULL,'停用状态'),(100,1,'启用','1','cms_common_status',NULL,'primary','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(101,2,'停用','0','cms_common_status',NULL,'info','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(102,1,'公司注册','company_reg','cms_service_category',NULL,'primary','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(103,2,'银行开户','bank_acct','cms_service_category',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(104,3,'年审报税','annual_audit','cms_service_category',NULL,'warning','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(105,4,'商标专利','trademark','cms_service_category',NULL,'danger','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(106,1,'政策解读','news','cms_article_type',NULL,'primary','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(107,2,'办理指南','guide','cms_article_type',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(108,3,'常见百科','faq','cms_article_type',NULL,'warning','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(109,4,'关于我们','about','cms_article_type',NULL,'info','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(110,5,'独立页面','page','cms_article_type',NULL,'info','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(111,1,'待跟进','0','cms_lead_status',NULL,'warning','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(112,2,'跟进中','1','cms_lead_status',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(113,3,'已签约','2','cms_lead_status',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(114,4,'已流失','3','cms_lead_status',NULL,'danger','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(115,1,'首页','home','cms_banner_position',NULL,'primary','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(116,2,'公司专区','company','cms_banner_position',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(117,3,'银行专区','bank','cms_banner_position',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(118,4,'审计专区','audit','cms_banner_position',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(119,5,'商标专区','trademark','cms_banner_position',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(120,1,'证书画卷','cr','cms_poster_type',NULL,'primary','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(121,2,'银行卡画卷','bank','cms_poster_type',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(122,3,'审计报告画卷','cpa','cms_poster_type',NULL,'warning','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(123,4,'上传图片','image','cms_poster_type',NULL,'info','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(124,1,'全球/多国','0','cms_country_code',NULL,'info','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(125,2,'中国香港','HK','cms_country_code',NULL,'primary','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(126,3,'新加坡','SG','cms_country_code',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(127,4,'美国','US','cms_country_code',NULL,'danger','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(128,1,'草稿','0','cms_publish_status',NULL,'warning','Y','0','admin','2026-09-28 15:55:40','',NULL,NULL),(129,2,'待审核','1','cms_publish_status',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(130,3,'已发布','2','cms_publish_status',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(131,4,'已下线','3','cms_publish_status',NULL,'info','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(132,1,'新建','create','cms_audit_action',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(133,2,'保存草稿','save_draft','cms_audit_action',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(134,3,'提交审核','submit','cms_audit_action',NULL,'primary','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(135,4,'审核通过','approve','cms_audit_action',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(136,5,'退回草稿','reject','cms_audit_action',NULL,'warning','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(137,6,'发布','publish','cms_audit_action',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(138,7,'下线','offline','cms_audit_action',NULL,'warning','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(139,8,'重新上线','online','cms_audit_action',NULL,'success','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(140,9,'回滚','rollback','cms_audit_action',NULL,'danger','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(141,10,'删除','delete','cms_audit_action',NULL,'danger','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(142,11,'重置演示数据','reset','cms_audit_action',NULL,'info','N','0','admin','2026-09-28 15:55:40','',NULL,NULL),(143,12,'鎾ら攢鏀瑰姩','discard','cms_audit_action',NULL,'info','N','0','admin','2026-09-29 11:17:29','',NULL,NULL);
/*!40000 ALTER TABLE `sys_dict_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dict_type`
--

DROP TABLE IF EXISTS `sys_dict_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dict_type` (
  `dict_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '字典主键',
  `dict_name` varchar(100) DEFAULT '' COMMENT '字典名称',
  `dict_type` varchar(100) DEFAULT '' COMMENT '字典类型',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_id`),
  UNIQUE KEY `dict_type` (`dict_type`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COMMENT='字典类型表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dict_type`
--

LOCK TABLES `sys_dict_type` WRITE;
/*!40000 ALTER TABLE `sys_dict_type` DISABLE KEYS */;
INSERT INTO `sys_dict_type` VALUES (1,'用户性别','sys_user_sex','0','admin','2026-09-28 15:50:19','',NULL,'用户性别列表'),(2,'菜单状态','sys_show_hide','0','admin','2026-09-28 15:50:19','',NULL,'菜单状态列表'),(3,'系统开关','sys_normal_disable','0','admin','2026-09-28 15:50:19','',NULL,'系统开关列表'),(4,'任务状态','sys_job_status','0','admin','2026-09-28 15:50:19','',NULL,'任务状态列表'),(5,'任务分组','sys_job_group','0','admin','2026-09-28 15:50:19','',NULL,'任务分组列表'),(6,'系统是否','sys_yes_no','0','admin','2026-09-28 15:50:19','',NULL,'系统是否列表'),(7,'通知类型','sys_notice_type','0','admin','2026-09-28 15:50:19','',NULL,'通知类型列表'),(8,'通知状态','sys_notice_status','0','admin','2026-09-28 15:50:19','',NULL,'通知状态列表'),(9,'操作类型','sys_oper_type','0','admin','2026-09-28 15:50:19','',NULL,'操作类型列表'),(10,'系统状态','sys_common_status','0','admin','2026-09-28 15:50:19','',NULL,'登录状态列表'),(100,'通用状态','cms_common_status','0','admin','2026-09-28 15:55:40','',NULL,'CMS 上下架/启用停用'),(101,'服务大类','cms_service_category','0','admin','2026-09-28 15:55:40','',NULL,'公司注册/开户/年审/商标'),(102,'文章类型','cms_article_type','0','admin','2026-09-28 15:55:40','',NULL,'政策/指南/百科/关于我们'),(103,'线索状态','cms_lead_status','0','admin','2026-09-28 15:55:40','',NULL,'CRM 线索流转,与原型统一'),(104,'轮播位置','cms_banner_position','0','admin','2026-09-28 15:55:40','',NULL,'首页及各专区轮播位'),(105,'海报画卷主题','cms_poster_type','0','admin','2026-09-28 15:55:40','',NULL,'文字+3D画卷 的主题类型'),(106,'服务国家','cms_country_code','0','admin','2026-09-28 15:55:40','',NULL,'hk/sg/us,与 cms_country 对齐'),(107,'发布状态','cms_publish_status','0','admin','2026-09-28 15:55:40','',NULL,'草稿/待审核/已发布/已下线,内容发布工作流'),(108,'审计动作','cms_audit_action','0','admin','2026-09-28 15:55:40','',NULL,'CMS 内容操作审计动作,留痕用');
/*!40000 ALTER TABLE `sys_dict_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_job`
--

DROP TABLE IF EXISTS `sys_job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_job` (
  `job_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `job_name` varchar(64) NOT NULL DEFAULT '' COMMENT '任务名称',
  `job_group` varchar(64) NOT NULL DEFAULT 'DEFAULT' COMMENT '任务组名',
  `invoke_target` varchar(500) NOT NULL COMMENT '调用目标字符串',
  `cron_expression` varchar(255) DEFAULT '' COMMENT 'cron执行表达式',
  `misfire_policy` varchar(20) DEFAULT '3' COMMENT '计划执行错误策略（1立即执行 2执行一次 3放弃执行）',
  `concurrent` char(1) DEFAULT '1' COMMENT '是否并发执行（0允许 1禁止）',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1暂停）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT '' COMMENT '备注信息',
  PRIMARY KEY (`job_id`,`job_name`,`job_group`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COMMENT='定时任务调度表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_job`
--

LOCK TABLES `sys_job` WRITE;
/*!40000 ALTER TABLE `sys_job` DISABLE KEYS */;
INSERT INTO `sys_job` VALUES (1,'系统默认（无参）','DEFAULT','ryTask.ryNoParams','0/10 * * * * ?','3','1','1','admin','2026-09-28 15:50:19','',NULL,''),(2,'系统默认（有参）','DEFAULT','ryTask.ryParams(\'ry\')','0/15 * * * * ?','3','1','1','admin','2026-09-28 15:50:19','',NULL,''),(3,'系统默认（多参）','DEFAULT','ryTask.ryMultipleParams(\'ry\', true, 2000L, 316.50D, 100)','0/20 * * * * ?','3','1','1','admin','2026-09-28 15:50:19','',NULL,'');
/*!40000 ALTER TABLE `sys_job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_job_log`
--

DROP TABLE IF EXISTS `sys_job_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_job_log` (
  `job_log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务日志ID',
  `job_name` varchar(64) NOT NULL COMMENT '任务名称',
  `job_group` varchar(64) NOT NULL COMMENT '任务组名',
  `invoke_target` varchar(500) NOT NULL COMMENT '调用目标字符串',
  `job_message` varchar(500) DEFAULT NULL COMMENT '日志信息',
  `status` char(1) DEFAULT '0' COMMENT '执行状态（0正常 1失败）',
  `exception_info` varchar(2000) DEFAULT '' COMMENT '异常信息',
  `start_time` datetime DEFAULT NULL COMMENT '执行开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '执行结束时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`job_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='定时任务调度日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_job_log`
--

LOCK TABLES `sys_job_log` WRITE;
/*!40000 ALTER TABLE `sys_job_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_job_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_logininfor`
--

DROP TABLE IF EXISTS `sys_logininfor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_logininfor` (
  `info_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '访问ID',
  `user_name` varchar(50) DEFAULT '' COMMENT '用户账号',
  `ipaddr` varchar(128) DEFAULT '' COMMENT '登录IP地址',
  `login_location` varchar(255) DEFAULT '' COMMENT '登录地点',
  `browser` varchar(50) DEFAULT '' COMMENT '浏览器类型',
  `os` varchar(50) DEFAULT '' COMMENT '操作系统',
  `status` char(1) DEFAULT '0' COMMENT '登录状态（0成功 1失败）',
  `msg` varchar(255) DEFAULT '' COMMENT '提示消息',
  `login_time` datetime DEFAULT NULL COMMENT '访问时间',
  PRIMARY KEY (`info_id`),
  KEY `idx_sys_logininfor_s` (`status`),
  KEY `idx_sys_logininfor_lt` (`login_time`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COMMENT='系统访问记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_logininfor`
--

LOCK TABLES `sys_logininfor` WRITE;
/*!40000 ALTER TABLE `sys_logininfor` DISABLE KEYS */;
INSERT INTO `sys_logininfor` VALUES (100,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-28 15:53:07'),(101,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 10:19:10'),(102,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 11:26:40'),(103,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 11:36:19'),(104,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 11:52:02'),(105,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 13:09:58'),(106,'admin','127.0.0.1','内网IP','Hacker','Hacker','1','用户不存在/密码错误','2026-09-29 13:09:58'),(107,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 13:10:30'),(108,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 13:11:05'),(109,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 13:13:21'),(110,'admin','127.0.0.1','内网IP','Hacker','Hacker','1','用户不存在/密码错误','2026-09-29 13:13:21'),(111,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 14:01:58'),(112,'admin','127.0.0.1','内网IP','Hacker','Hacker','0','登录成功','2026-09-29 15:21:30'),(113,'admin','127.0.0.1','内网IP','Hacker','Hacker','1','用户不存在/密码错误','2026-09-29 15:21:30'),(114,'admin','127.0.0.1','内网IP','Opencode latest','','0','登录成功','2026-09-29 15:24:17'),(115,'admin','127.0.0.1','内网IP','Chrome 147','Windows10','0','登录成功','2026-09-29 17:27:25'),(116,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 17:51:31'),(117,'admin','39.105.80.9','XX XX','Curl 7.61.1','','0','登录成功','2026-09-29 18:46:32'),(118,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 18:52:39'),(119,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 18:53:53'),(120,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 18:54:57'),(121,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:23'),(122,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:31'),(123,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:40'),(124,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:48'),(125,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:49'),(126,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:49'),(127,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:49'),(128,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:49'),(129,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:07:50'),(130,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:10:18'),(131,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:10:18'),(132,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:10:19'),(133,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:10:19'),(134,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:10:19'),(135,'admin','127.0.0.1','内网IP','Curl 7.61.1','','0','登录成功','2026-09-29 19:10:19'),(136,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 19:11:24'),(137,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 19:12:54'),(138,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 19:15:01'),(139,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 19:16:33'),(140,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 19:17:05'),(141,'admin','58.20.120.100','XX XX','Edge 153','Windows >=10','0','登录成功','2026-09-29 19:37:40'),(142,'admin','58.20.120.100','XX XX','Chrome 147','Windows10','0','登录成功','2026-09-29 19:39:12'),(143,'admin','58.20.120.100','XX XX','Chrome 147','Windows10','0','登录成功','2026-09-29 19:39:27'),(144,'admin','39.144.194.128','XX XX','WeChat 8.0.74.3120','Android 17','0','登录成功','2026-09-29 19:40:32'),(145,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 20:23:53'),(146,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 20:30:53'),(147,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 21:26:05'),(148,'admin','58.20.120.100','XX XX','Hacker','Hacker','0','登录成功','2026-09-29 21:26:32'),(149,'admin','223.104.134.214','XX XX','XiaoMi MiuiBrowser','Android 17','0','登录成功','2026-10-12 16:13:31'),(150,'admin','58.20.13.103','XX XX','Edge 153','Windows >=10','0','登录成功','2026-10-19 20:14:36'),(151,'admin','58.20.13.103','XX XX','Curl 8.18.0','','0','登录成功','2026-10-19 20:54:28'),(152,'admin','58.20.13.103','XX XX','Curl 8.18.0','','0','登录成功','2026-10-19 20:54:35');
/*!40000 ALTER TABLE `sys_logininfor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_menu`
--

DROP TABLE IF EXISTS `sys_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_menu` (
  `menu_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父菜单ID',
  `order_num` int(11) DEFAULT '0' COMMENT '显示顺序',
  `path` varchar(200) DEFAULT '' COMMENT '路由地址',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `query` varchar(255) DEFAULT NULL COMMENT '路由参数',
  `route_name` varchar(50) DEFAULT '' COMMENT '路由名称',
  `is_frame` int(11) DEFAULT '1' COMMENT '是否为外链（0是 1否）',
  `is_cache` int(11) DEFAULT '0' COMMENT '是否缓存（0缓存 1不缓存）',
  `menu_type` char(1) DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `visible` char(1) DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) DEFAULT '#' COMMENT '菜单图标',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2000 DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_menu`
--

LOCK TABLES `sys_menu` WRITE;
/*!40000 ALTER TABLE `sys_menu` DISABLE KEYS */;
INSERT INTO `sys_menu` VALUES (1,'系统管理',0,1,'system',NULL,'','',1,0,'M','0','0','','system','admin','2026-09-28 15:50:17','',NULL,'系统管理目录'),(2,'系统监控',0,2,'monitor',NULL,'','',1,0,'M','0','0','','monitor','admin','2026-09-28 15:50:17','',NULL,'系统监控目录'),(3,'系统工具',0,3,'tool',NULL,'','',1,0,'M','0','0','','tool','admin','2026-09-28 15:50:17','',NULL,'系统工具目录'),(4,'若依官网',0,4,'http://ruoyi.vip',NULL,'','',0,0,'M','0','0','','guide','admin','2026-09-28 15:50:17','',NULL,'若依官网地址'),(100,'用户管理',1,1,'user','system/user/index','','',1,0,'C','0','0','system:user:list','user','admin','2026-09-28 15:50:17','',NULL,'用户管理菜单'),(101,'角色管理',1,2,'role','system/role/index','','',1,0,'C','0','0','system:role:list','peoples','admin','2026-09-28 15:50:17','',NULL,'角色管理菜单'),(102,'菜单管理',1,3,'menu','system/menu/index','','',1,0,'C','0','0','system:menu:list','tree-table','admin','2026-09-28 15:50:17','',NULL,'菜单管理菜单'),(103,'部门管理',1,4,'dept','system/dept/index','','',1,0,'C','0','0','system:dept:list','tree','admin','2026-09-28 15:50:17','',NULL,'部门管理菜单'),(104,'岗位管理',1,5,'post','system/post/index','','',1,0,'C','0','0','system:post:list','post','admin','2026-09-28 15:50:17','',NULL,'岗位管理菜单'),(105,'字典管理',1,6,'dict','system/dict/index','','',1,0,'C','0','0','system:dict:list','dict','admin','2026-09-28 15:50:17','',NULL,'字典管理菜单'),(106,'参数设置',1,7,'config','system/config/index','','',1,0,'C','0','0','system:config:list','edit','admin','2026-09-28 15:50:17','',NULL,'参数设置菜单'),(107,'通知公告',1,8,'notice','system/notice/index','','',1,0,'C','0','0','system:notice:list','message','admin','2026-09-28 15:50:17','',NULL,'通知公告菜单'),(108,'日志管理',1,9,'log','','','',1,0,'M','0','0','','log','admin','2026-09-28 15:50:17','',NULL,'日志管理菜单'),(109,'在线用户',2,1,'online','monitor/online/index','','',1,0,'C','0','0','monitor:online:list','online','admin','2026-09-28 15:50:17','',NULL,'在线用户菜单'),(110,'定时任务',2,2,'job','monitor/job/index','','',1,0,'C','0','0','monitor:job:list','job','admin','2026-09-28 15:50:17','',NULL,'定时任务菜单'),(111,'数据监控',2,3,'druid','monitor/druid/index','','',1,0,'C','0','0','monitor:druid:list','druid','admin','2026-09-28 15:50:17','',NULL,'数据监控菜单'),(112,'服务监控',2,4,'server','monitor/server/index','','',1,0,'C','0','0','monitor:server:list','server','admin','2026-09-28 15:50:17','',NULL,'服务监控菜单'),(113,'缓存监控',2,5,'cache','monitor/cache/index','','',1,0,'C','0','0','monitor:cache:list','redis','admin','2026-09-28 15:50:17','',NULL,'缓存监控菜单'),(114,'缓存列表',2,6,'cacheList','monitor/cache/list','','',1,0,'C','0','0','monitor:cache:list','redis-list','admin','2026-09-28 15:50:17','',NULL,'缓存列表菜单'),(115,'表单构建',3,1,'build','tool/build/index','','',1,0,'C','0','0','tool:build:list','build','admin','2026-09-28 15:50:17','',NULL,'表单构建菜单'),(116,'代码生成',3,2,'gen','tool/gen/index','','',1,0,'C','0','0','tool:gen:list','code','admin','2026-09-28 15:50:17','',NULL,'代码生成菜单'),(117,'系统接口',3,3,'swagger','tool/swagger/index','','',1,0,'C','0','0','tool:swagger:list','swagger','admin','2026-09-28 15:50:17','',NULL,'系统接口菜单'),(500,'操作日志',108,1,'operlog','monitor/operlog/index','','',1,0,'C','0','0','monitor:operlog:list','form','admin','2026-09-28 15:50:17','',NULL,'操作日志菜单'),(501,'登录日志',108,2,'logininfor','monitor/logininfor/index','','',1,0,'C','0','0','monitor:logininfor:list','logininfor','admin','2026-09-28 15:50:17','',NULL,'登录日志菜单'),(1000,'用户查询',100,1,'','','','',1,0,'F','0','0','system:user:query','#','admin','2026-09-28 15:50:17','',NULL,''),(1001,'用户新增',100,2,'','','','',1,0,'F','0','0','system:user:add','#','admin','2026-09-28 15:50:17','',NULL,''),(1002,'用户修改',100,3,'','','','',1,0,'F','0','0','system:user:edit','#','admin','2026-09-28 15:50:17','',NULL,''),(1003,'用户删除',100,4,'','','','',1,0,'F','0','0','system:user:remove','#','admin','2026-09-28 15:50:17','',NULL,''),(1004,'用户导出',100,5,'','','','',1,0,'F','0','0','system:user:export','#','admin','2026-09-28 15:50:17','',NULL,''),(1005,'用户导入',100,6,'','','','',1,0,'F','0','0','system:user:import','#','admin','2026-09-28 15:50:17','',NULL,''),(1006,'重置密码',100,7,'','','','',1,0,'F','0','0','system:user:resetPwd','#','admin','2026-09-28 15:50:17','',NULL,''),(1007,'角色查询',101,1,'','','','',1,0,'F','0','0','system:role:query','#','admin','2026-09-28 15:50:17','',NULL,''),(1008,'角色新增',101,2,'','','','',1,0,'F','0','0','system:role:add','#','admin','2026-09-28 15:50:17','',NULL,''),(1009,'角色修改',101,3,'','','','',1,0,'F','0','0','system:role:edit','#','admin','2026-09-28 15:50:17','',NULL,''),(1010,'角色删除',101,4,'','','','',1,0,'F','0','0','system:role:remove','#','admin','2026-09-28 15:50:17','',NULL,''),(1011,'角色导出',101,5,'','','','',1,0,'F','0','0','system:role:export','#','admin','2026-09-28 15:50:17','',NULL,''),(1012,'菜单查询',102,1,'','','','',1,0,'F','0','0','system:menu:query','#','admin','2026-09-28 15:50:17','',NULL,''),(1013,'菜单新增',102,2,'','','','',1,0,'F','0','0','system:menu:add','#','admin','2026-09-28 15:50:17','',NULL,''),(1014,'菜单修改',102,3,'','','','',1,0,'F','0','0','system:menu:edit','#','admin','2026-09-28 15:50:17','',NULL,''),(1015,'菜单删除',102,4,'','','','',1,0,'F','0','0','system:menu:remove','#','admin','2026-09-28 15:50:17','',NULL,''),(1016,'部门查询',103,1,'','','','',1,0,'F','0','0','system:dept:query','#','admin','2026-09-28 15:50:17','',NULL,''),(1017,'部门新增',103,2,'','','','',1,0,'F','0','0','system:dept:add','#','admin','2026-09-28 15:50:17','',NULL,''),(1018,'部门修改',103,3,'','','','',1,0,'F','0','0','system:dept:edit','#','admin','2026-09-28 15:50:17','',NULL,''),(1019,'部门删除',103,4,'','','','',1,0,'F','0','0','system:dept:remove','#','admin','2026-09-28 15:50:17','',NULL,''),(1020,'岗位查询',104,1,'','','','',1,0,'F','0','0','system:post:query','#','admin','2026-09-28 15:50:17','',NULL,''),(1021,'岗位新增',104,2,'','','','',1,0,'F','0','0','system:post:add','#','admin','2026-09-28 15:50:17','',NULL,''),(1022,'岗位修改',104,3,'','','','',1,0,'F','0','0','system:post:edit','#','admin','2026-09-28 15:50:17','',NULL,''),(1023,'岗位删除',104,4,'','','','',1,0,'F','0','0','system:post:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1024,'岗位导出',104,5,'','','','',1,0,'F','0','0','system:post:export','#','admin','2026-09-28 15:50:18','',NULL,''),(1025,'字典查询',105,1,'#','','','',1,0,'F','0','0','system:dict:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1026,'字典新增',105,2,'#','','','',1,0,'F','0','0','system:dict:add','#','admin','2026-09-28 15:50:18','',NULL,''),(1027,'字典修改',105,3,'#','','','',1,0,'F','0','0','system:dict:edit','#','admin','2026-09-28 15:50:18','',NULL,''),(1028,'字典删除',105,4,'#','','','',1,0,'F','0','0','system:dict:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1029,'字典导出',105,5,'#','','','',1,0,'F','0','0','system:dict:export','#','admin','2026-09-28 15:50:18','',NULL,''),(1030,'参数查询',106,1,'#','','','',1,0,'F','0','0','system:config:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1031,'参数新增',106,2,'#','','','',1,0,'F','0','0','system:config:add','#','admin','2026-09-28 15:50:18','',NULL,''),(1032,'参数修改',106,3,'#','','','',1,0,'F','0','0','system:config:edit','#','admin','2026-09-28 15:50:18','',NULL,''),(1033,'参数删除',106,4,'#','','','',1,0,'F','0','0','system:config:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1034,'参数导出',106,5,'#','','','',1,0,'F','0','0','system:config:export','#','admin','2026-09-28 15:50:18','',NULL,''),(1035,'公告查询',107,1,'#','','','',1,0,'F','0','0','system:notice:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1036,'公告新增',107,2,'#','','','',1,0,'F','0','0','system:notice:add','#','admin','2026-09-28 15:50:18','',NULL,''),(1037,'公告修改',107,3,'#','','','',1,0,'F','0','0','system:notice:edit','#','admin','2026-09-28 15:50:18','',NULL,''),(1038,'公告删除',107,4,'#','','','',1,0,'F','0','0','system:notice:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1039,'操作查询',500,1,'#','','','',1,0,'F','0','0','monitor:operlog:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1040,'操作删除',500,2,'#','','','',1,0,'F','0','0','monitor:operlog:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1041,'日志导出',500,3,'#','','','',1,0,'F','0','0','monitor:operlog:export','#','admin','2026-09-28 15:50:18','',NULL,''),(1042,'登录查询',501,1,'#','','','',1,0,'F','0','0','monitor:logininfor:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1043,'登录删除',501,2,'#','','','',1,0,'F','0','0','monitor:logininfor:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1044,'日志导出',501,3,'#','','','',1,0,'F','0','0','monitor:logininfor:export','#','admin','2026-09-28 15:50:18','',NULL,''),(1045,'账户解锁',501,4,'#','','','',1,0,'F','0','0','monitor:logininfor:unlock','#','admin','2026-09-28 15:50:18','',NULL,''),(1046,'在线查询',109,1,'#','','','',1,0,'F','0','0','monitor:online:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1047,'批量强退',109,2,'#','','','',1,0,'F','0','0','monitor:online:batchLogout','#','admin','2026-09-28 15:50:18','',NULL,''),(1048,'单条强退',109,3,'#','','','',1,0,'F','0','0','monitor:online:forceLogout','#','admin','2026-09-28 15:50:18','',NULL,''),(1049,'任务查询',110,1,'#','','','',1,0,'F','0','0','monitor:job:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1050,'任务新增',110,2,'#','','','',1,0,'F','0','0','monitor:job:add','#','admin','2026-09-28 15:50:18','',NULL,''),(1051,'任务修改',110,3,'#','','','',1,0,'F','0','0','monitor:job:edit','#','admin','2026-09-28 15:50:18','',NULL,''),(1052,'任务删除',110,4,'#','','','',1,0,'F','0','0','monitor:job:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1053,'状态修改',110,5,'#','','','',1,0,'F','0','0','monitor:job:changeStatus','#','admin','2026-09-28 15:50:18','',NULL,''),(1054,'任务导出',110,6,'#','','','',1,0,'F','0','0','monitor:job:export','#','admin','2026-09-28 15:50:18','',NULL,''),(1055,'生成查询',116,1,'#','','','',1,0,'F','0','0','tool:gen:query','#','admin','2026-09-28 15:50:18','',NULL,''),(1056,'生成修改',116,2,'#','','','',1,0,'F','0','0','tool:gen:edit','#','admin','2026-09-28 15:50:18','',NULL,''),(1057,'生成删除',116,3,'#','','','',1,0,'F','0','0','tool:gen:remove','#','admin','2026-09-28 15:50:18','',NULL,''),(1058,'导入代码',116,4,'#','','','',1,0,'F','0','0','tool:gen:import','#','admin','2026-09-28 15:50:18','',NULL,''),(1059,'预览代码',116,5,'#','','','',1,0,'F','0','0','tool:gen:preview','#','admin','2026-09-28 15:50:18','',NULL,''),(1060,'生成代码',116,6,'#','','','',1,0,'F','0','0','tool:gen:code','#','admin','2026-09-28 15:50:18','',NULL,'');
/*!40000 ALTER TABLE `sys_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notice`
--

DROP TABLE IF EXISTS `sys_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notice` (
  `notice_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `notice_title` varchar(50) NOT NULL COMMENT '公告标题',
  `notice_type` char(1) NOT NULL COMMENT '公告类型（1通知 2公告）',
  `notice_content` longblob COMMENT '公告内容',
  `status` char(1) DEFAULT '0' COMMENT '公告状态（0正常 1关闭）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COMMENT='通知公告表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notice`
--

LOCK TABLES `sys_notice` WRITE;
/*!40000 ALTER TABLE `sys_notice` DISABLE KEYS */;
INSERT INTO `sys_notice` VALUES (1,'温馨提醒：2018-07-01 若依新版本发布啦','2','新版本内容','0','admin','2026-09-28 15:50:19','',NULL,'管理员'),(2,'维护通知：2018-07-01 若依系统凌晨维护','1','维护内容','0','admin','2026-09-28 15:50:19','',NULL,'管理员'),(3,'若依开源框架介绍','1','<p><span style=\"color: rgb(230, 0, 0);\">项目介绍</span></p><p><font color=\"#333333\">RuoYi开源项目是为企业用户定制的后台脚手架框架，为企业打造的一站式解决方案，降低企业开发成本，提升开发效率。主要包括用户管理、角色管理、部门管理、菜单管理、参数管理、字典管理、</font><span style=\"color: rgb(51, 51, 51);\">岗位管理</span><span style=\"color: rgb(51, 51, 51);\">、定时任务</span><span style=\"color: rgb(51, 51, 51);\">、</span><span style=\"color: rgb(51, 51, 51);\">服务监控、登录日志、操作日志、代码生成等功能。其中，还支持多数据源、数据权限、国际化、Redis缓存、Docker部署、滑动验证码、第三方认证登录、分布式事务、</span><font color=\"#333333\">分布式文件存储</font><span style=\"color: rgb(51, 51, 51);\">、分库分表处理等技术特点。</span></p><p><img src=\"https://foruda.gitee.com/images/1773931848342439032/a4d22313_1815095.png\" style=\"width: 64px;\"><br></p><p><span style=\"color: rgb(230, 0, 0);\">官网及演示</span></p><p><span style=\"color: rgb(51, 51, 51);\">若依官网地址：&nbsp;</span><a href=\"http://ruoyi.vip\" target=\"_blank\">http://ruoyi.vip</a><a href=\"http://ruoyi.vip\" target=\"_blank\"></a></p><p><span style=\"color: rgb(51, 51, 51);\">若依文档地址：&nbsp;</span><a href=\"http://doc.ruoyi.vip\" target=\"_blank\">http://doc.ruoyi.vip</a><br></p><p><span style=\"color: rgb(51, 51, 51);\">演示地址【不分离版】：&nbsp;</span><a href=\"http://demo.ruoyi.vip\" target=\"_blank\">http://demo.ruoyi.vip</a></p><p><span style=\"color: rgb(51, 51, 51);\">演示地址【分离版本】：&nbsp;</span><a href=\"http://vue.ruoyi.vip\" target=\"_blank\">http://vue.ruoyi.vip</a></p><p><span style=\"color: rgb(51, 51, 51);\">演示地址【微服务版】：&nbsp;</span><a href=\"http://cloud.ruoyi.vip\" target=\"_blank\">http://cloud.ruoyi.vip</a></p><p><span style=\"color: rgb(51, 51, 51);\">演示地址【移动端版】：&nbsp;</span><a href=\"http://h5.ruoyi.vip\" target=\"_blank\">http://h5.ruoyi.vip</a></p><p><br style=\"color: rgb(48, 49, 51); font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 12px;\"></p>','0','admin','2026-09-28 15:50:19','',NULL,'管理员');
/*!40000 ALTER TABLE `sys_notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notice_read`
--

DROP TABLE IF EXISTS `sys_notice_read`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notice_read` (
  `read_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '已读主键',
  `notice_id` int(11) NOT NULL COMMENT '公告id',
  `user_id` bigint(20) NOT NULL COMMENT '用户id',
  `read_time` datetime NOT NULL COMMENT '阅读时间',
  PRIMARY KEY (`read_id`),
  UNIQUE KEY `uk_user_notice` (`user_id`,`notice_id`) COMMENT '同一用户同一公告只记录一次'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告已读记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notice_read`
--

LOCK TABLES `sys_notice_read` WRITE;
/*!40000 ALTER TABLE `sys_notice_read` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_notice_read` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_oper_log`
--

DROP TABLE IF EXISTS `sys_oper_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_oper_log` (
  `oper_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志主键',
  `title` varchar(50) DEFAULT '' COMMENT '模块标题',
  `business_type` int(11) DEFAULT '0' COMMENT '业务类型（0其它 1新增 2修改 3删除）',
  `method` varchar(200) DEFAULT '' COMMENT '方法名称',
  `request_method` varchar(10) DEFAULT '' COMMENT '请求方式',
  `operator_type` int(11) DEFAULT '0' COMMENT '操作类别（0其它 1后台用户 2手机端用户）',
  `oper_name` varchar(50) DEFAULT '' COMMENT '操作人员',
  `dept_name` varchar(50) DEFAULT '' COMMENT '部门名称',
  `oper_url` varchar(255) DEFAULT '' COMMENT '请求URL',
  `oper_ip` varchar(128) DEFAULT '' COMMENT '主机地址',
  `oper_location` varchar(255) DEFAULT '' COMMENT '操作地点',
  `oper_param` varchar(2000) DEFAULT '' COMMENT '请求参数',
  `json_result` varchar(2000) DEFAULT '' COMMENT '返回参数',
  `status` int(11) DEFAULT '0' COMMENT '操作状态（0正常 1异常）',
  `error_msg` varchar(2000) DEFAULT '' COMMENT '错误消息',
  `oper_time` datetime DEFAULT NULL COMMENT '操作时间',
  `cost_time` bigint(20) DEFAULT '0' COMMENT '消耗时间',
  PRIMARY KEY (`oper_id`),
  KEY `idx_sys_oper_log_bt` (`business_type`),
  KEY `idx_sys_oper_log_s` (`status`),
  KEY `idx_sys_oper_log_ot` (`oper_time`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COMMENT='操作日志记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_oper_log`
--

LOCK TABLES `sys_oper_log` WRITE;
/*!40000 ALTER TABLE `sys_oper_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_oper_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_post`
--

DROP TABLE IF EXISTS `sys_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_post` (
  `post_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `post_code` varchar(64) NOT NULL COMMENT '岗位编码',
  `post_name` varchar(50) NOT NULL COMMENT '岗位名称',
  `post_sort` int(11) NOT NULL COMMENT '显示顺序',
  `status` char(1) NOT NULL COMMENT '状态（0正常 1停用）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='岗位信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_post`
--

LOCK TABLES `sys_post` WRITE;
/*!40000 ALTER TABLE `sys_post` DISABLE KEYS */;
INSERT INTO `sys_post` VALUES (1,'ceo','董事长',1,'0','admin','2026-09-28 15:50:17','',NULL,''),(2,'se','项目经理',2,'0','admin','2026-09-28 15:50:17','',NULL,''),(3,'hr','人力资源',3,'0','admin','2026-09-28 15:50:17','',NULL,''),(4,'user','普通员工',4,'0','admin','2026-09-28 15:50:17','',NULL,'');
/*!40000 ALTER TABLE `sys_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role`
--

DROP TABLE IF EXISTS `sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role` (
  `role_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(30) NOT NULL COMMENT '角色名称',
  `role_key` varchar(100) NOT NULL COMMENT '角色权限字符串',
  `role_sort` int(11) NOT NULL COMMENT '显示顺序',
  `data_scope` char(1) DEFAULT '1' COMMENT '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  `menu_check_strictly` tinyint(1) DEFAULT '1' COMMENT '菜单树选择项是否关联显示',
  `dept_check_strictly` tinyint(1) DEFAULT '1' COMMENT '部门树选择项是否关联显示',
  `status` char(1) NOT NULL COMMENT '角色状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COMMENT='角色信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role`
--

LOCK TABLES `sys_role` WRITE;
/*!40000 ALTER TABLE `sys_role` DISABLE KEYS */;
INSERT INTO `sys_role` VALUES (1,'超级管理员','admin',1,'1',1,1,'0','0','admin','2026-09-28 15:50:17','',NULL,'超级管理员'),(2,'普通角色','common',2,'2',1,1,'0','0','admin','2026-09-28 15:50:17','',NULL,'普通角色');
/*!40000 ALTER TABLE `sys_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role_dept`
--

DROP TABLE IF EXISTS `sys_role_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role_dept` (
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `dept_id` bigint(20) NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`role_id`,`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色和部门关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role_dept`
--

LOCK TABLES `sys_role_dept` WRITE;
/*!40000 ALTER TABLE `sys_role_dept` DISABLE KEYS */;
INSERT INTO `sys_role_dept` VALUES (2,100),(2,101),(2,105);
/*!40000 ALTER TABLE `sys_role_dept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role_menu`
--

DROP TABLE IF EXISTS `sys_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role_menu` (
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `menu_id` bigint(20) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色和菜单关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role_menu`
--

LOCK TABLES `sys_role_menu` WRITE;
/*!40000 ALTER TABLE `sys_role_menu` DISABLE KEYS */;
INSERT INTO `sys_role_menu` VALUES (2,1),(2,2),(2,3),(2,4),(2,100),(2,101),(2,102),(2,103),(2,104),(2,105),(2,106),(2,107),(2,108),(2,109),(2,110),(2,111),(2,112),(2,113),(2,114),(2,115),(2,116),(2,117),(2,500),(2,501),(2,1000),(2,1001),(2,1002),(2,1003),(2,1004),(2,1005),(2,1006),(2,1007),(2,1008),(2,1009),(2,1010),(2,1011),(2,1012),(2,1013),(2,1014),(2,1015),(2,1016),(2,1017),(2,1018),(2,1019),(2,1020),(2,1021),(2,1022),(2,1023),(2,1024),(2,1025),(2,1026),(2,1027),(2,1028),(2,1029),(2,1030),(2,1031),(2,1032),(2,1033),(2,1034),(2,1035),(2,1036),(2,1037),(2,1038),(2,1039),(2,1040),(2,1041),(2,1042),(2,1043),(2,1044),(2,1045),(2,1046),(2,1047),(2,1048),(2,1049),(2,1050),(2,1051),(2,1052),(2,1053),(2,1054),(2,1055),(2,1056),(2,1057),(2,1058),(2,1059),(2,1060);
/*!40000 ALTER TABLE `sys_role_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user`
--

DROP TABLE IF EXISTS `sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `dept_id` bigint(20) DEFAULT NULL COMMENT '部门ID',
  `user_name` varchar(30) NOT NULL COMMENT '用户账号',
  `nick_name` varchar(30) NOT NULL COMMENT '用户昵称',
  `user_type` varchar(2) DEFAULT '00' COMMENT '用户类型（00系统用户）',
  `email` varchar(50) DEFAULT '' COMMENT '用户邮箱',
  `phonenumber` varchar(11) DEFAULT '' COMMENT '手机号码',
  `sex` char(1) DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `avatar` varchar(100) DEFAULT '' COMMENT '头像地址',
  `password` varchar(100) DEFAULT '' COMMENT '密码',
  `status` char(1) DEFAULT '0' COMMENT '账号状态（0正常 1停用）',
  `del_flag` char(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `login_ip` varchar(128) DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime DEFAULT NULL COMMENT '最后登录时间',
  `pwd_update_date` datetime DEFAULT NULL COMMENT '密码最后更新时间',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user`
--

LOCK TABLES `sys_user` WRITE;
/*!40000 ALTER TABLE `sys_user` DISABLE KEYS */;
INSERT INTO `sys_user` VALUES (1,103,'admin','若依','00','ry@163.com','15888888888','1','','$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2','0','0','58.20.13.103','2026-10-19 20:54:35','2026-09-28 15:50:17','admin','2026-09-28 15:50:17','',NULL,'管理员'),(2,105,'ry','若依','00','ry@qq.com','15666666666','1','','$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2','0','0','127.0.0.1','2026-09-28 15:50:17','2026-09-28 15:50:17','admin','2026-09-28 15:50:17','',NULL,'测试员');
/*!40000 ALTER TABLE `sys_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user_post`
--

DROP TABLE IF EXISTS `sys_user_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_post` (
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `post_id` bigint(20) NOT NULL COMMENT '岗位ID',
  PRIMARY KEY (`user_id`,`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户与岗位关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user_post`
--

LOCK TABLES `sys_user_post` WRITE;
/*!40000 ALTER TABLE `sys_user_post` DISABLE KEYS */;
INSERT INTO `sys_user_post` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `sys_user_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user_role`
--

DROP TABLE IF EXISTS `sys_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_role` (
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户和角色关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user_role`
--

LOCK TABLES `sys_user_role` WRITE;
/*!40000 ALTER TABLE `sys_user_role` DISABLE KEYS */;
INSERT INTO `sys_user_role` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `sys_user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'cms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-22  7:28:00
