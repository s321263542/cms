/**
 * cms_article 的 mock：
 *   · 3 篇政策文章 (news / guide)
 *   · 4 篇关于我们 (about)  —— 对应原型 #about-pages 四个整页
 *   · 2 篇独立页面 (page)    —— 隐私政策 / 服务条款（留资 consent 必须可跳转）
 *
 * 正文 HTML 使用 main.css 里的 `cb-*` 内容组件词汇（不是 Tailwind 类），
 * 这样内容进库后换任何主题都不会散架。
 */
import type { Article } from '../../../app/types'

export const articles: Article[] = [
  /* ======================================================================= */
  /* 1. 政策文章 ×3（首页「出海合规与海外财税政策专栏」）                        */
  /* ======================================================================= */
  {
    id: 1, category_type: 'news', country_id: 1,
    title: '香港特区公司注册处2026年最新全面电子查册及穿透监管要点',
    summary: '香港公司注册处最新合规指引正式生效，针对重要控制人登记册(SCR)及挂牌地址核查提出更高标准...',
    cover_url: null,
    content: `
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
    `,
    slug: 'hk-registry-2026-electronic-search',
    author: '永鸿国际合规研究中心',
    views: 1420, is_top: 1, is_recommend: 1, related_ids: [2, 3],
    published_at: '2026-03-15T09:00:00',
    seo_title: '香港公司注册处2026电子查册与SCR监管要点解读',
    seo_description: '香港公司注册处 2026 年电子查册、重要控制人登记册 SCR 与挂牌地址核查新要求，及企业应对清单。',
    seo_keywords: '香港电子查册,SCR,重要控制人登记册,香港合规',
    i18n_json: {
      en: {
        title: 'Hong Kong Companies Registry 2026: e-Search and look-through regulation explained',
        summary: 'The latest compliance guidance takes effect, raising the bar for the Significant Controllers Register and registered office checks...',
        content: `
      <p>From 2026 the Companies Registry tightens electronic search records and beneficial-ownership transparency. For companies already established in Hong Kong this is both a compliance burden and a chance to clear historical issues.</p>
      <h2>Three changes that matter most</h2>
      <ul>
        <li><strong>Search records are logged</strong> — searcher identity and purpose are registered, and bulk export of sensitive data is restricted.</li>
        <li><strong>SRC spot checks become routine</strong> — a current Significant Controllers Register must be kept at the registered office.</li>
        <li><strong>Registered office look-through</strong> — virtual addresses that cannot reach the company may face a rectification order.</li></ul>
      <h2>Four things to do now</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Verify director data</strong><p>IDs and passports valid, proof of address under three months old.</p></div>
        <div class="cb-card"><strong>Update the SRC</strong><p>Update within seven working days of any share transfer or director change.</p></div>
        <div class="cb-card"><strong>Confirm the office is reachable</strong><p>Make sure post is collected so the Registry does not flag the entity.</p></div>
        <div class="cb-card"><strong>Compile evidence</strong><p>Contracts, invoices, website and statements that corroborate each other.</p></div>
      </div>
      <blockquote>Compliance is not a cost — it is the passport to financing, listing and cross-border settlement. YONGHONG offers an annual SRC and registered-office health check.</blockquote>
    `,
        seo_title: 'Hong Kong Companies Registry 2026 e-Search and SRC update',
        seo_description: 'What the 2026 Hong Kong e-Search, Significant Controllers Register and registered office changes mean, plus a checklist.',
        seo_keywords: 'hong kong electronic search,SRC,significant controllers register',
        ext_json: { tag: '2026 Compliance Update' }
      }
    },
    ext_json: { tag: '2026新规解读' }, status: 1
  },
  {
    id: 2, category_type: 'guide', country_id: 0,
    title: '2026年全球离岸银行开户风控白皮书：如何100%避开KYC审查雷区？',
    summary: '各大外资银行对合规流水穿透审核加剧，本文由前外资银行合规经理为您揭秘视频见证必问的5大核心问题...',
    cover_url: null,
    content: `
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
    `,
    slug: 'offshore-bank-kyc-whitepaper-2026',
    author: '永鸿国际银行渠道部',
    views: 2890, is_top: 0, is_recommend: 1, related_ids: [1, 3],
    published_at: '2026-03-10T10:30:00',
    seo_title: '2026离岸银行开户KYC风控白皮书|避免被拒的5个要点',
    seo_description: '前外资银行合规经理解析 2026 离岸开户 KYC 审查：5 大必问问题、3 类高拒率情形与预审方法。',
    seo_keywords: '离岸银行开户,KYC,香港开户,银行面签',
    i18n_json: {
      en: {
        title: '2026 Global Offshore Banking KYC Whitepaper: how to clear screening',
        summary: 'Banks now audit cross-border flows far more aggressively. A former compliance manager reveals the five questions asked in every video interview...',
        content: `
      <p>In 2026 the major foreign banks tightened look-through review of cross-border funds. Rejections now stem less from missing paperwork and more from an unconvincing source of wealth.</p>
      <h2>The five questions asked in every interview</h2>
      <ol>
        <li>Which countries are your customers in, and what is the typical transaction size?</li>
        <li>Is the money from goods, services or investment? Can you show contracts and invoices?</li>
        <li>What monthly volume do you expect? Any large one-off transactions?</li>
        <li>Is there real substance — office, staff, website?</li>
        <li>Who are the ultimate beneficial owners? Any nominee holdings?</li>
      </ol>
      <h2>Three situations with the highest rejection rate</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Sensitive industries</strong><p>Crypto, gambling, precious metals and dual-use goods need a pre-written explanation.</p></div>
        <div class="cb-card"><strong>Abnormal flows</strong><p>Mixing personal and corporate accounts, frequent round-number transfers.</p></div>
        <div class="cb-card"><strong>Contradictory files</strong><p>Website, contracts, invoices and statements that do not line up.</p></div>
        <div class="cb-card"><strong>The fix</strong><p>Pre-audit plus a mock interview — the reason our approval rate is 98.6%.</p></div>
      </div>
      <blockquote>A warning: ignore anyone promising a guaranteed account. Proper coaching tells your real business story — it does not invent one.</blockquote>
    `,
        seo_title: '2026 Offshore Bank KYC Whitepaper | Clear every interview',
        seo_description: 'The five KYC questions, three highest-risk situations and how to pre-audit an offshore account application.',
        seo_keywords: 'offshore bank account,kyc,hong kong account opening',
        ext_json: { tag: 'Banking Brief' }
      }
    },
    ext_json: { tag: '离岸银行专报' }, status: 1
  },
  {
    id: 3, category_type: 'news', country_id: 1,
    title: '香港公司离岸免税申请(Offshore Claim)实操案例与合规风险防范',
    summary: '离岸所得免税并非“零申报”！税务局对无保留意见审计报告的抽查率大幅上升，企业应如何建立合规证据链...',
    cover_url: null,
    content: `
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
    `,
    slug: 'hong-kong-offshore-claim-guide',
    author: '永鸿国际财税部',
    views: 3150, is_top: 0, is_recommend: 1, related_ids: [1, 2],
    published_at: '2026-02-28T14:00:00',
    seo_title: '香港离岸免税申请实操案例|Offshore Claim合规风险防范',
    seo_description: '香港离岸所得免税并非零申报：税务局审查要点、实操案例与合规证据链建设方法。',
    seo_keywords: '香港离岸免税,offshore claim,香港审计,香港报税',
    i18n_json: {
      en: {
        title: 'Hong Kong offshore claim: worked example and compliance risks',
        summary: 'An offshore claim is not a nil filing. With audit sampling rising sharply, how should a company build its evidence chain?',
        content: `
      <p>Many firms assume that having no office in Hong Kong means a nil filing. In fact an offshore claim must be substantiated inside the audit report and is approved case by case by the IRD.</p>
      <h2>What the IRD examines</h2>
      <ul>
        <li>Where the contract was signed and performed</li>
        <li>The actual routing of goods and customs records</li>
        <li>Whether decision-making and management happened in Hong Kong</li>
        <li>Where the receiving account sits and how funds moved</li>
      </ul>
      <h2>A worked example</h2>
      <p>A cross-border e-commerce company claimed offshore status for 2024 but could not produce complete logistics documents; the claim was settled at 80%. After we supplied contracts, bills of lading and decision emails, the 2025 claim was approved in full.</p>
      <div class="cb-cards2">
        <div class="cb-card"><strong>The four pillars</strong><p>Contract, logistics documents, decision emails, payment records.</p></div>
        <div class="cb-card"><strong>Close the timeline</strong><p>Contract, shipment and payment dates must form a plausible sequence.</p></div>
        <div class="cb-card"><strong>No shadow accounts</strong><p>Once two sets of books are found, three years become a target.</p></div>
        <div class="cb-card"><strong>Annual review</strong><p>A pre-filing self-check is ten times cheaper than correcting it afterwards.</p></div>
      </div>
      <blockquote>An offshore claim is a right, not a default outcome. Build the evidence throughout the year — that is the safest planning.</blockquote>
    `,
        seo_title: 'Hong Kong Offshore Claim guide | Compliance risks',
        seo_description: 'What the IRD checks in an offshore claim, a worked example and how to build a complete evidence chain.',
        seo_keywords: 'hong kong offshore claim,hong kong audit,hong kong tax',
        ext_json: { tag: 'Tax & Audit' }
      }
    },
    ext_json: { tag: '财税审计筹划' }, status: 1
  },

  /* ======================================================================= */
  /* 2. 关于我们 ×4（原型 #about-pages 四个独立整页）                           */
  /* ======================================================================= */
  {
    id: 11, category_type: 'about', country_id: 0,
    title: '公司简介',
    summary: '永鸿国际咨询（深圳）有限公司 · 官方认证权威出海机构，一站式、全合规的跨境企业综合服务',
    cover_url: null,
    content: `
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
    `,
    slug: 'about-profile',
    author: '永鸿国际',
    views: 0, is_top: 0, is_recommend: 0, related_ids: [12, 13, 14],
    published_at: '2026-01-01T00:00:00',
    seo_title: '公司简介|永鸿国际咨询（深圳）有限公司',
    seo_description: '永鸿国际咨询（深圳）有限公司成立于2018年，TCSP持牌，提供香港公司注册、银行开户、做账审计与海外商标一站式服务。',
    seo_keywords: '永鸿国际,公司简介,出海企服',
    i18n_json: {
      en: {
        title: 'Company Profile',
        summary: 'YONGHONG International Consulting (Shenzhen) — an accredited one-stop, fully compliant cross-border corporate services firm.',
        content: `
      <div class="cb-lead">YONGHONG International Consulting (Shenzhen) Co., Ltd. was incorporated on 20 December 2018. Unified Social Credit Code: 91440300MA5FEMF959.</div>

      <h2>Anchored in the Greater Bay Area</h2>
      <p>Based in Shenzhen at the heart of the Greater Bay Area (20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District) and reaching the world's offshore financial centres, we serve Chinese exporters, cross-border e-commerce sellers and multinational investors with a one-stop, fully compliant service.</p>
      <p>Our core practices cover Hong Kong company registration and maintenance, Hong Kong and Singapore bank accounts, offshore structures with bookkeeping and audit, and overseas trademark and patent filing. We put compliance first and prove results: every plan comes with a written risk note and an itemised fee list.</p>

      <div class="cb-cards2">
        <div class="cb-card"><span class="cb-card__icon">◆</span><strong>Licensed Trust or Company Service Provider (TCSP)</strong></div>
        <div class="cb-card"><span class="cb-card__icon">⚖</span><strong>Senior compliance and audit specialists on site</strong></div>
      </div>

      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">2018</div><div class="cb-card__label">Founded</div></div>
        <div class="cb-card"><div class="cb-card__value">10,000+</div><div class="cb-card__label">Organisations served</div></div>
        <div class="cb-card"><div class="cb-card__value">8 yrs+</div><div class="cb-card__label">Average consultant experience</div></div>
        <div class="cb-card"><div class="cb-card__value">HK / SG</div><div class="cb-card__label">Hong Kong & Singapore hubs</div></div>
      </div>
    `,
        seo_title: 'Company Profile | YONGHONG International Consulting',
        seo_description: 'Founded in 2018, TCSP licensed — one-stop Hong Kong company registration, bank accounts, audit and trademarks.',
        seo_keywords: 'yonghong,company profile,corporate services'
      }
    },
    ext_json: { badge: 'About Us · Company Profile' }, status: 1
  },
  {
    id: 12, category_type: 'about', country_id: 0,
    title: '团队展示',
    summary: '离岸商务架构师、香港执业注册会计师与涉外合规法务组成的专业班底',
    cover_url: null,
    content: `
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
    `,
    slug: 'about-team',
    author: '永鸿国际',
    views: 0, is_top: 0, is_recommend: 0, related_ids: [11, 13, 14],
    published_at: '2026-01-01T00:00:00',
    seo_title: '团队展示|离岸架构师与香港执业会计师',
    seo_description: '永鸿国际核心团队由离岸商务架构师、香港执业注册会计师 HKICPA 与涉外合规法务组成，平均从业8年以上。',
    seo_keywords: '团队展示,离岸架构师,香港会计师',
    i18n_json: {
      en: {
        title: 'Our Team',
        summary: 'A professional bench of offshore structuring consultants, Hong Kong certified practising accountants and cross-border compliance lawyers.',
        content: `
      <p>YONGHONG brings together leading offshore structuring consultants, Hong Kong certified practising accountants (HKICPA) and cross-border compliance lawyers with an average of more than eight years' experience. Our core advisers come from Greater Bay Area banks, accounting firms and law firms, and turn real operating conditions into workable compliance paths.</p>

      <div class="cb-persons">
        <div class="cb-person">
          <span class="cb-person__avatar">C</span>
          <div class="cb-person__body">
            <div class="cb-person__name">Mr. Chan · Senior Overseas Compliance Consultant</div>
            <div class="cb-person__meta">Staff No. 8016 · 10 years in GBA offshore structuring and bank VIP channels</div>
          </div>
          <span class="cb-person__badge">Gold adviser</span>
        </div>
        <div class="cb-person cb-person--teal">
          <span class="cb-person__avatar">W</span>
          <div class="cb-person__body">
            <div class="cb-person__name">Ms. Wong · HK Certified Practising Auditor</div>
            <div class="cb-person__meta">Fellow of the HKICPA · offshore exemption filing and BEPS 2.0</div>
          </div>
          <span class="cb-person__badge">Audit lead</span>
        </div>
      </div>

      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">HKICPA</div><div class="cb-card__label">Practising accountants</div></div>
        <div class="cb-card"><div class="cb-card__value">TCSP</div><div class="cb-card__label">Licensed company secretaries</div></div>
        <div class="cb-card"><div class="cb-card__value">Legal</div><div class="cb-card__label">Cross-border compliance counsel</div></div>
        <div class="cb-card"><div class="cb-card__value">CS</div><div class="cb-card__label">Dedicated customer follow-up</div></div>
      </div>
    `,
        seo_title: 'Our Team | Offshore consultants & HK practising accountants',
        seo_description: 'Our core team of offshore structuring consultants, HKICPA practising accountants and cross-border compliance lawyers.',
        seo_keywords: 'our team,offshore consultant,hkicpa'
      }
    },
    ext_json: { badge: 'About Us · Our Team' }, status: 1
  },
  {
    id: 13, category_type: 'about', country_id: 0,
    title: '企业招聘',
    summary: '永鸿国际业务高速发展，诚邀热爱跨境出海行业的优秀人才加入我们',
    cover_url: null,
    content: `
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
    `,
    slug: 'about-careers',
    author: '永鸿国际',
    views: 0, is_top: 0, is_recommend: 0, related_ids: [11, 12, 14],
    published_at: '2026-01-01T00:00:00',
    seo_title: '企业招聘|永鸿国际加入我们',
    seo_description: '永鸿国际招聘出海企服商务顾问与离岸做账审计合规专员，五险一金带薪年假，简历直投 805856285@qq.com。',
    seo_keywords: '企业招聘,出海企服,跨境商务顾问',
    i18n_json: {
      en: {
        title: 'Careers',
        summary: 'YONGHONG is growing fast — we would love to meet talented people who are passionate about cross-border business.',
        content: `
      <div class="cb-jobs">
        <div class="cb-job cb-job--amber">
          <div class="cb-job__head">
            <span class="cb-job__title">Business Consultant, Global Services (Full-time)</span>
            <span class="cb-job__pay">¥8K–18K + commission</span>
          </div>
          <p class="cb-job__desc">Associate degree or above; 1+ year in cross-border services or foreign trade; strong communicator. Social insurance, housing fund and paid annual leave included.</p>
        </div>
        <div class="cb-job cb-job--emerald">
          <div class="cb-job__head">
            <span class="cb-job__title">Offshore Audit & Compliance Officer (5 days)</span>
            <span class="cb-job__pay">¥7K–13K</span>
          </div>
          <p class="cb-job__desc">Accounting background; familiar with Hong Kong / Singapore tax and audit procedures; high sense of confidentiality.</p>
        </div>
      </div>

      <div class="cb-resume">
        <div class="cb-resume__body">
          <div class="cb-resume__label">Send your CV directly to</div>
          <div class="cb-resume__mail">805856285@qq.com (please state the position)</div>
        </div>
        <span class="cb-resume__tip">Hotline +86 18123763835</span>
      </div>
    `,
        seo_title: 'Careers | Join YONGHONG',
        seo_description: 'We are hiring business consultants and offshore audit compliance officers — apply at 805856285@qq.com.',
        seo_keywords: 'careers,corporate services jobs'
      }
    },
    ext_json: { badge: 'About Us · Careers' }, status: 1
  },
  {
    id: 14, category_type: 'about', country_id: 0,
    title: '联系我们',
    summary: '深圳总部 · 香港/新加坡双中心，欢迎来电或到访咨询',
    cover_url: null,
    /* 联系方式卡片由前台从 cms_site_config 渲染（配置改了这里自动变），此处只存 CTA 横幅 */
    content: `
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
    `,
    slug: 'about-contact',
    author: '永鸿国际',
    views: 0, is_top: 0, is_recommend: 0, related_ids: [11, 12, 13],
    published_at: '2026-01-01T00:00:00',
    seo_title: '联系我们|永鸿国际深圳总部地址电话',
    seo_description: '永鸿国际深圳总部地址、官方咨询专线 18123763835 与邮箱，在线留言 10 分钟内响应。',
    seo_keywords: '联系我们,深圳出海企服,咨询电话',
    i18n_json: {
      en: {
        title: 'Contact Us',
        summary: 'Shenzhen headquarters · Hong Kong and Singapore hubs — call or visit us.',
        content: `
      <div class="cb-cta">
        <div class="cb-cta__body">
          <div class="cb-cta__title">Leave your contact details</div>
          <div class="cb-cta__sub">A senior consultant will send a written plan and fee list — consultation is free</div>
        </div>
        <button type="button" class="cb-cta__btn" data-inquiry="Company profile & partnership enquiry">Send an online enquiry</button>
      </div>

      <h2>Opening hours</h2>
      <p>Monday to Saturday, 09:00 – 18:30 (GMT+8). Messages left outside these hours are answered within 10 minutes of the next working day.</p>

      <div class="cb-cards2">
        <div class="cb-card"><strong>Shenzhen HQ</strong><p>20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District, Shenzhen</p></div>
        <div class="cb-card"><strong>Hong Kong office</strong><p>Tsim Sha Tsui, Kowloon (interviews and government filings by appointment)</p></div>
      </div>
    `,
        seo_title: 'Contact Us | YONGHONG Shenzhen HQ',
        seo_description: 'Address, hotline +86 18123763835 and email of YONGHONG — online enquiries answered within 10 minutes.',
        seo_keywords: 'contact us,corporate services shenzhen'
      }
    },
    ext_json: { badge: 'About Us · Contact' }, status: 1
  },

  /* ======================================================================= */
  /* 3. 独立页面 —— 隐私政策 / 服务条款（PIPL 留证必须可跳转）                    */
  /* ======================================================================= */
  {
    id: 21, category_type: 'page', country_id: 0,
    title: '隐私政策',
    summary: '我们如何收集、使用、存储与保护您的个人信息，以及您享有的权利。',
    cover_url: null,
    content: `
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
    `,
    slug: 'privacy-policy',
    author: '永鸿国际',
    views: 0, is_top: 0, is_recommend: 0, related_ids: [22],
    published_at: '2026-01-01T00:00:00',
    seo_title: '隐私政策|永鸿国际个人信息保护',
    seo_description: '永鸿国际隐私政策 v1.0：收集范围、使用目的、存储期限、脱敏措施与您享有的查阅/更正/删除/撤回同意权利。',
    seo_keywords: '隐私政策,个人信息保护,PIPL',
    i18n_json: {
      en: {
        title: 'Privacy Policy',
        summary: 'How we collect, use, store and protect your personal information, and the rights available to you.',
        content: `
      <p><strong>Version v1.0 · Effective 1 January 2026</strong></p>
      <p>This policy applies to the website and online consultation services of YONGHONG International Consulting (Shenzhen) Co., Ltd. Before submitting an enquiry you must tick "I have read and accepted the Privacy Policy"; we record the acceptance time and this policy version on our server as evidence of consent.</p>

      <h2>1. What we collect</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>You provide</strong><p>Name, phone number, WeChat / email, company name and your requirements.</p></div>
        <div class="cb-card"><strong>Collected automatically</strong><p>IP address, browser and device identifiers, referrer and UTM parameters, access logs.</p></div>
      </div>

      <h2>2. How we use it</h2>
      <ul>
        <li>To contact you and provide the plan and quotation you asked for;</li>
        <li>To perform customer due diligence (KYC) required by law;</li>
        <li>To improve the website through aggregated, de-identified statistics;</li>
        <li><strong>We never sell your personal information to third parties.</strong></li>
      </ul>

      <h2>3. Storage and protection</h2>
      <p>Data is stored on servers within the People's Republic of China for the shortest period necessary — normally three years after your last contact. We use encrypted transport, tiered back-office permissions and masked listing (phone shown as 138****8000 by default).</p>

      <h2>4. Your rights</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Access & copy</strong><p>Request a copy of the data we hold.</p></div>
        <div class="cb-card"><strong>Correction</strong><p>Ask us to correct inaccurate data.</p></div>
        <div class="cb-card"><strong>Deletion</strong><p>Request deletion where the law allows.</p></div>
        <div class="cb-card"><strong>Withdraw consent</strong><p>Withdraw at any time without affecting prior processing.</p></div>
      </div>

      <h2>5. Contact</h2>
      <p>Questions or rights requests: <strong>805856285@qq.com</strong> or <strong>+86 18123763835</strong>. We reply within 15 working days.</p>

      <h2>6. Updates</h2>
      <p>Material changes raise the version number and are published on this page. New consent records reference the new version; historical evidence still points to the version accepted at the time.</p>
    `,
        seo_title: 'Privacy Policy | YONGHONG',
        seo_description: 'YONGHONG Privacy Policy v1.0 — what we collect, why, how long we keep it and the rights you can exercise.',
        seo_keywords: 'privacy policy,personal information,PIPL'
      }
    },
    ext_json: {}, status: 1
  },
  {
    id: 22, category_type: 'page', country_id: 0,
    title: '服务条款',
    summary: '使用本网站与在线咨询服务的法律条款与双方权利义务。',
    cover_url: null,
    content: `
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
    `,
    slug: 'terms-of-service',
    author: '永鸿国际',
    views: 0, is_top: 0, is_recommend: 0, related_ids: [21],
    published_at: '2026-01-01T00:00:00',
    seo_title: '服务条款|永鸿国际网站使用条款',
    seo_description: '永鸿国际服务条款 v1.0：网站使用规范、知识产权、免责限制、费用退款与争议解决。',
    seo_keywords: '服务条款,网站条款,使用协议',
    i18n_json: {
      en: {
        title: 'Terms of Service',
        summary: 'Legal terms governing the use of this website and our online consultation services.',
        content: `
      <p><strong>Version v1.0 · Effective 1 January 2026</strong></p>

      <h2>1. Nature of the service</h2>
      <p>Content on this website is for general reference only and does not constitute legal, tax or investment advice. Specific services are governed by a separate written engagement letter.</p>

      <h2>2. Acceptable use</h2>
      <ul>
        <li>No unlawful activity through this website;</li>
        <li>No scraping or scripts that disrupt normal operation;</li>
        <li>No impersonation when submitting enquiries.</li>
      </ul>

      <h2>3. Intellectual property</h2>
      <p>Text, images, layout and marks on this site belong to YONGHONG or its licensors. No reproduction or commercial use without written permission.</p>

      <h2>4. Disclaimers</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Approvals</strong><p>Government and bank decisions are made independently; we do not guarantee approval.</p></div>
        <div class="cb-card"><strong>Third-party sites</strong><p>Linked sites are the responsibility of their operators, including their privacy practices.</p></div>
      </div>

      <h2>5. Fees and refunds</h2>
      <p>All fees follow the written quotation. If we fail to complete an engagement for reasons attributable to us, service fees are refunded as set out in the engagement letter.</p>

      <h2>6. Governing law</h2>
      <p>These terms are governed by the laws of the People's Republic of China. Disputes are settled amicably first, failing which the competent people's court where we are located has jurisdiction.</p>

      <h2>7. Contact</h2>
      <p>Email <strong>805856285@qq.com</strong>　Phone <strong>+86 18123763835</strong></p>
    `,
        seo_title: 'Terms of Service | YONGHONG',
        seo_description: 'YONGHONG Terms of Service v1.0 — acceptable use, IP, disclaimers, fees and governing law.',
        seo_keywords: 'terms of service,terms of use'
      }
    },
    ext_json: {}, status: 1
  }
]

/** 首页「政策专栏」展示的 3 篇 */
export const featuredArticles = articles.filter(a => a.category_type === 'news' || a.category_type === 'guide')
