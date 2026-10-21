/**
 * cms_country / cms_banner / cms_service / cms_partner_bank / cms_case 的 mock 数据。
 * 每条记录带 i18n_json.en，语义与后端 t() 回退一致。
 */
import type { Banner, CmsCase, Country, PartnerBank, Service } from '../../../app/types'
import { configSeeds } from './config'

/* -------------------------------------------------------------------------- */
/* cms_country                                                                 */
/* -------------------------------------------------------------------------- */
export const countries: Country[] = [
  { id: 1, code: 'HK', name: '中国香港', en_name: 'Hong Kong', icon_url: '', sort_order: 1, status: 1 },
  { id: 2, code: 'SG', name: '新加坡', en_name: 'Singapore', icon_url: '', sort_order: 2, status: 1 },
  { id: 3, code: 'US', name: '美国', en_name: 'United States', icon_url: '', sort_order: 3, status: 1 },
  { id: 4, code: 'CN', name: '中国内地', en_name: 'Mainland China', icon_url: '', sort_order: 4, status: 1 }
]

/* -------------------------------------------------------------------------- */
/* cms_banner —— 文字 + 3D 画卷                                                 */
/* -------------------------------------------------------------------------- */
export const banners: Banner[] = [
  {
    id: 1, position: 'home', poster_type: 'cr', image_url: null,
    tag: '🇭🇰 香港公司设立 · 2026合规新规',
    title: '香港公司设立·极速下证',
    desc: '持牌秘书合规托管，一站式解决注册、年审、开户及做账审计痛点，特设包开户绿色通道。',
    price_text: '特惠 ¥4580起',
    button_text: '立即获取底价方案',
    button_link: null, sort_order: 1, status: 1,
    i18n_json: {
      en: {
        tag: '🇭🇰 Hong Kong Company Setup · 2026 Compliance Update',
        title: 'Hong Kong Company Setup · Fast Track',
        desc: 'Licensed company-secretary handling — one stop for registration, annual return, bank account and audit, with a guaranteed account-opening channel.',
        price_text: 'From ¥4,580',
        button_text: 'Get the best quote now'
      }
    }
  },
  {
    id: 2, position: 'home', poster_type: 'bank', image_url: null,
    tag: '🏦 环球离岸银行 · 视频远程开户',
    title: '环球离岸银行·包下户通道',
    desc: '香港/新加坡/美国顶尖银行直联，无需亲自过港，专业资深银行开户经理 1对1 辅导包过。',
    price_text: '绿色包开通道',
    button_text: '免费评估开户资格',
    button_link: null, sort_order: 2, status: 1,
    i18n_json: {
      en: {
        tag: '🏦 Global Offshore Banking · Remote Video Onboarding',
        title: 'Global Offshore Accounts · Guaranteed Opening',
        desc: 'Direct access to top banks in Hong Kong, Singapore and the US — no travel required, with senior relationship managers coaching you 1-on-1.',
        price_text: 'Guaranteed channel',
        button_text: 'Check my eligibility free'
      }
    }
  },
  {
    id: 3, position: 'home', poster_type: 'cpa', image_url: null,
    tag: '™️ 国际品牌布局 · 香港持牌审计',
    title: '国际品牌出海·合规审计筹划',
    desc: '马德里国际商标快速注册，香港执业会计师(CPA)正规做账审计出具报告，合规无忧。',
    price_text: '1对1资深方案',
    button_text: '预约资深财税顾问',
    button_link: null, sort_order: 3, status: 1,
    i18n_json: {
      en: {
        tag: '™️ Global Branding · Hong Kong Licensed Audit',
        title: 'Go Global · Compliant Audit & Trademark',
        desc: 'Fast Madrid trademark registration and proper bookkeeping/audit reports issued by Hong Kong certified practising accountants.',
        price_text: '1-on-1 senior plan',
        button_text: 'Book a senior tax advisor'
      }
    }
  }
]

/* -------------------------------------------------------------------------- */
/* cms_service —— 核心出海业务矩阵                                               */
/* -------------------------------------------------------------------------- */
const homeProcess = configSeeds.find(s => s.config_key === 'home_process')!

const genericStepsZh = [
  { name: '提交办理资料', desc: '在线填写业务需求，专属顾问 10 分钟内与您对接', time: '10分钟' },
  { name: '持牌顾问审核', desc: '核对证件与方案条款，出具书面风险提示与费用清单', time: '1小时' },
  { name: '递交官方受理', desc: '通过专属政府/银行通道直呈系统，合规加速审批', time: '1-3个工作日' },
  { name: '交付成果凭证', desc: '证书、印章、账户或报告顺丰保价包邮到手', time: '1个工作日' }
]
const genericStepsEn = [
  { name: 'Submit your documents', desc: 'Tell us what you need online — your consultant replies within 10 minutes', time: '10 min' },
  { name: 'Licensed review', desc: 'We verify documents and issue a written risk note with an itemised fee list', time: '1 hour' },
  { name: 'Official filing', desc: 'Submitted through our dedicated government / banking channel', time: '1–3 days' },
  { name: 'Delivery of results', desc: 'Certificates, chops, account or reports shipped by insured express', time: '1 day' }
]

export const services: Service[] = [
  {
    id: 1, category: 'company_reg', country_id: 1,
    title: '香港公司注册',
    sub_title: '极速下证 · 持牌秘书合规托管',
    summary: '世界金融中心，自由的商贸港口，香港公司注册便于提升公司国际品牌形象及开拓海外业务。',
    badge_text: '企业级合规', price_text: '¥4580 元起',
    slug: 'hk-company-registration', cover_url: null,
    content: `
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
    `,
    process_steps: homeProcess.zh.steps,
    related_ids: [1], views: 0, sort_order: 1,
    is_recommended: 1, is_home_show: 1,
    seo_title: '香港公司注册|1天下证|永鸿国际',
    seo_description: '香港公司注册加急最快1天下证，含政府规费、法定地址、公司秘书与绿盒，持牌顾问全程代办。',
    seo_keywords: '香港公司注册,香港注册公司,香港公司设立',
    i18n_json: {
      en: {
        title: 'Hong Kong Company Registration',
        sub_title: 'Fast track · Licensed company secretary',
        summary: 'A free port and world-class financial centre — a Hong Kong company strengthens your international brand and opens up overseas business.',
        content: `
      <p>Hong Kong is one of the world's freest economies, with a simple low-tax regime and no exchange controls — the top choice for Chinese enterprises setting up a regional headquarters.</p>
      <h2>What you get</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">1 day</div><div class="cb-card__label">Fastest e-filing</div></div>
        <div class="cb-card"><div class="cb-card__value">No FX</div><div class="cb-card__label">Free cross-border transfers</div></div>
        <div class="cb-card"><div class="cb-card__value">8.25%</div><div class="cb-card__label">Two-tier profits tax</div></div>
        <div class="cb-card"><div class="cb-card__value">Global</div><div class="cb-card__label">International brand credibility</div></div>
      </div>
      <h2>Documents required</h2>
      <ul>
        <li>Proposed company name (one Chinese and one English)</li>
        <li>Valid ID / passport of directors and shareholders</li>
        <li>Proof of address (within the last 3 months)</li>
        <li>Share capital (standard 10,000 shares, no verification required)</li>
      </ul>
      <h2>What is included</h2>
      <p>Government fees, statutory registered address, company secretary, a full green box (common seal, chop, articles, share book) and insured express delivery.</p>
      <blockquote>A written risk note and itemised fee list is issued for every plan; full refund if the name search fails.</blockquote>
    `,
        seo_title: 'Hong Kong Company Registration | 1-day Certificate | YONGHONG',
        seo_description: 'Hong Kong company registration in as fast as 1 day — government fees, statutory address, secretary and green box included.',
        seo_keywords: 'hong kong company registration,hong kong incorporate',
        badge_text: 'Fully compliant',
        price_text: 'From ¥4,580',
        // en 必须显式给 price/unit：localize() 会把 zh 的 ext_json 浅合并进来，
        // 不覆盖 unit 的话英文页会显示中文「元起」
        ext_json: { btn_text: 'Apply now →', price: '4,580', unit: '' }
      }
    },
    ext_json: { gradient: 'from-emerald-500 to-teal-600', icon: 'fa-building-columns', price: '4580', unit: '元起', btn_text: '我要办理 →' },
    status: 1
  },
  {
    id: 2, category: 'annual_audit', country_id: 1,
    title: '香港公司年审',
    sub_title: '周年申报 · 专人智能预警',
    summary: '在香港注册公司后嫌年审繁琐？交给永鸿国际专业秘书团队，专人智能预警，让您彻底省心放心。',
    badge_text: '企业级合规', price_text: '¥2980 元起',
    slug: 'hk-company-annual-return', cover_url: null,
    content: `
      <p>香港公司成立满 12 个月后须办理周年申报（NAR1）并换领商业登记证（BR），逾期将产生高额罚款甚至被法院传票。</p>
      <h2>年审服务内容</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>周年申报表 NAR1</strong><p>向公司注册处递交上年度公司资料变更申报。</p></div>
        <div class="cb-card"><strong>换领商业登记证 BR</strong><p>向税务局续期商业登记，避免罚款与经营受限。</p></div>
        <div class="cb-card"><strong>法定地址与秘书续期</strong><p>维持注册地址与公司秘书，保障合规存续。</p></div>
        <div class="cb-card"><strong>智能到期预警</strong><p>到期前 30/15/7 天三重提醒，绝不遗漏。</p></div>
      </div>
      <blockquote>逾期 42 天以内罚款 HK$870；超过 42 天罚款将逐级递增，最高可达 HK$5,000 并可能收到法院传票。</blockquote>
    `,
    process_steps: genericStepsZh,
    related_ids: [], views: 0, sort_order: 2,
    is_recommended: 1, is_home_show: 1,
    seo_title: '香港公司年审|周年申报|永鸿国际',
    seo_description: '香港公司年审周年申报与商业登记证续期一站式代办，到期前三重提醒，逾期补办亦可处理。',
    seo_keywords: '香港公司年审,香港周年申报,香港商业登记证',
    i18n_json: {
      en: {
        title: 'Hong Kong Annual Return',
        sub_title: 'Annual filing · Proactive deadline alerts',
        summary: 'Tired of the annual return? Our professional secretaries track every deadline so you never have to.',
        content: `
      <p>Twelve months after incorporation a Hong Kong company must file its annual return (NAR1) and renew its business registration certificate (BR). Late filing triggers escalating penalties and a possible court summons.</p>
      <h2>What is included</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Annual return NAR1</strong><p>Filing of the previous year's company particulars with the Companies Registry.</p></div>
        <div class="cb-card"><strong>Business registration renewal</strong><p>Renewal with the Inland Revenue Department to keep trading legally.</p></div>
        <div class="cb-card"><strong>Address & secretary renewal</strong><p>Statutory registered address and company secretary maintained.</p></div>
        <div class="cb-card"><strong>Smart deadline alerts</strong><p>Reminders at 30, 15 and 7 days before the due date.</p></div>
      </div>
      <blockquote>Late by up to 42 days: HK$870. Beyond that the penalty escalates to HK$5,000 and a court summons may be issued.</blockquote>
    `,
        seo_title: 'Hong Kong Annual Return | YONGHONG',
        seo_description: 'One-stop Hong Kong annual return and business registration renewal with triple deadline reminders.',
        seo_keywords: 'hong kong annual return,hong kong business registration',
        badge_text: 'Fully compliant',
        price_text: 'From ¥2,980',
        ext_json: { btn_text: 'Apply now →', price: '2,980', unit: '' }
      }
    },
    ext_json: { gradient: 'from-amber-500 to-amber-600', icon: 'fa-user-check', price: '2980', unit: '元起', btn_text: '我要办理 →' },
    status: 1
  },
  {
    id: 3, category: 'bank_acct', country_id: 1,
    title: '香港银行开户',
    sub_title: '视频远程见证 · 包下户通道',
    summary: '个人开立香港公司账户难？永鸿国际特殊银行包开绿色渠道，视频远程见证，助力高效开户。',
    badge_text: '企业级合规', price_text: '¥2000 元起',
    slug: 'hk-bank-account-opening', cover_url: null,
    content: `
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
    `,
    process_steps: genericStepsZh,
    related_ids: [], views: 0, sort_order: 3,
    is_recommended: 1, is_home_show: 1,
    seo_title: '香港银行开户|视频远程见证|永鸿国际',
    seo_description: '香港公司银行开户免赴港视频见证，汇丰渣打华侨东亚总行直联，KYC 辅导通关，通过率 98.6%。',
    seo_keywords: '香港银行开户,离岸账户,汇丰开户,渣打开户',
    i18n_json: {
      en: {
        title: 'Hong Kong Bank Account Opening',
        sub_title: 'Remote video witnessing · Guaranteed channel',
        summary: 'Hard to open a Hong Kong corporate account? Our green channel offers remote video witnessing for a smooth opening.',
        content: `
      <p>We work directly with HSBC, Standard Chartered, OCBC and BEA so that a relationship manager can witness your interview by video — no travel to Hong Kong.</p>
      <h2>How we prepare you</h2>
      <ul>
        <li>Match you to the right bank for your industry and fund flows</li>
        <li>Pre-audit KYC documents to remove rejection risks</li>
        <li>Rehearse the bank interview question by question</li>
        <li>Compile contracts, invoices and website evidence</li>
      </ul>
      <h2>Timelines</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">2 weeks</div><div class="cb-card__label">HSBC / SCB typical</div></div>
        <div class="cb-card"><div class="cb-card__value">1–2 weeks</div><div class="cb-card__label">OCBC</div></div>
        <div class="cb-card"><div class="cb-card__value">10 days</div><div class="cb-card__label">BEA</div></div>
        <div class="cb-card"><div class="cb-card__value">98.6%</div><div class="cb-card__label">Our approval rate</div></div>
      </div>
    `,
        seo_title: 'Hong Kong Bank Account | Remote Video Witnessing | YONGHONG',
        seo_description: 'Open a Hong Kong corporate account without travelling — video witnessing, KYC coaching, 98.6% approval.',
        seo_keywords: 'hong kong bank account,offshore account,hsbc account',
        badge_text: 'Fully compliant',
        price_text: 'From ¥2,000',
        ext_json: { btn_text: 'Apply now →', price: '2,000', unit: '' }
      }
    },
    ext_json: { gradient: 'from-teal-600 to-emerald-700', icon: 'fa-vault', price: '2000', unit: '元起', btn_text: '我要办理 →' },
    status: 1
  },
  {
    id: 4, category: 'annual_audit', country_id: 1,
    title: '香港审计报税',
    sub_title: '持牌 CPA · 无保留意见',
    summary: '代理香港公司财税审计怎么做最省心？香港持牌执业会计师(CPA)，让永鸿来为您“金”打细算。',
    badge_text: '企业级合规', price_text: '¥2980 元起',
    slug: 'hk-audit-tax-filing', cover_url: null,
    content: `
      <p>香港利得税报税分两个阶段：收到报税表后需在 1 个月内提交；首年可申请延期至 3 个月。所有香港公司每年均须由执业会计师出具审计报告。</p>
      <h2>服务范围</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>做账</strong><p>整理银行流水、单据与合同，按香港准则编制财务报表。</p></div>
        <div class="cb-card"><strong>审计</strong><p>由执业会计师出具无保留意见 / 保留意见审计报告。</p></div>
        <div class="cb-card"><strong>报税</strong><p>填报利得税报税表，申请两级制与离岸豁免。</p></div>
        <div class="cb-card"><strong>税务筹划</strong><p>结合 BEPS 2.0 与离岸所得免税，制定合规节税路径。</p></div>
      </div>
      <blockquote>离岸所得免税并非“零申报”——税务局对无保留意见报告的抽查率正在上升，务必保留完整证据链。</blockquote>
    `,
    process_steps: genericStepsZh,
    related_ids: [], views: 0, sort_order: 4,
    is_recommended: 1, is_home_show: 1,
    seo_title: '香港审计报税|持牌CPA|永鸿国际',
    seo_description: '香港公司做账审计报税一站式，执业会计师出具报告，两级制与离岸免税申请，合规节税。',
    seo_keywords: '香港审计,香港报税,香港做账,离岸免税',
    i18n_json: {
      en: {
        title: 'Hong Kong Audit & Tax Filing',
        sub_title: 'Licensed CPA · Unqualified opinion',
        summary: 'Let licensed practising accountants (CPA) handle your Hong Kong bookkeeping and audit down to the last penny.',
        content: `
      <p>Hong Kong profits tax runs in two stages: the return must be filed within one month of receipt (extendable to three for the first year), and every company needs an audit report from a practising accountant each year.</p>
      <h2>Scope</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Bookkeeping</strong><p>Bank statements, vouchers and contracts compiled under HK standards.</p></div>
        <div class="cb-card"><strong>Audit</strong><p>Unqualified or qualified opinion issued by a practising accountant.</p></div>
        <div class="cb-card"><strong>Filing</strong><p>Profits tax return prepared; two-tier and offshore claims applied.</p></div>
        <div class="cb-card"><strong>Tax planning</strong><p>Compliant structuring around BEPS 2.0 and offshore exemption.</p></div>
      </div>
      <blockquote>An offshore claim is not a nil filing — the IRD audits far more frequently, so keep a complete evidence chain.</blockquote>
    `,
        seo_title: 'Hong Kong Audit & Tax | Licensed CPA | YONGHONG',
        seo_description: 'One-stop Hong Kong bookkeeping, audit and tax filing by licensed CPAs with two-tier and offshore claims.',
        seo_keywords: 'hong kong audit,hong kong tax filing,hong kong bookkeeping',
        badge_text: 'Fully compliant',
        price_text: 'From ¥2,980',
        ext_json: { btn_text: 'Apply now →', price: '2,980', unit: '' }
      }
    },
    ext_json: { gradient: 'from-rose-500 to-rose-600', icon: 'fa-calculator', price: '2980', unit: '元起', btn_text: '我要办理 →' },
    status: 1
  },
  {
    id: 5, category: 'company_reg', country_id: 1,
    title: '香港公司注销',
    sub_title: '清盘清税 · 15天下证',
    summary: '合规安全注销避免政府高额罚款，简单轻松，清账清税快速注销或转让，免除后顾之忧。',
    badge_text: '企业级合规', price_text: '¥1500 元起',
    slug: 'hk-company-deregistration', cover_url: null,
    content: `
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
    `,
    process_steps: genericStepsZh,
    related_ids: [], views: 0, sort_order: 5,
    is_recommended: 0, is_home_show: 1,
    seo_title: '香港公司注销|撤销注册|永鸿国际',
    seo_description: '香港公司注销与撤销注册一站式办理，清盘清税、避免罚款，15 天启动、免除后顾之忧。',
    seo_keywords: '香港公司注销,香港撤销注册,香港清盘',
    i18n_json: {
      en: {
        title: 'Hong Kong Company Deregistration',
        sub_title: 'Winding up · Certificate in 15 days',
        summary: 'Compliant deregistration avoids heavy government penalties — settle accounts and tax, then strike off or transfer.',
        content: `
      <p>An idle Hong Kong company still owes annual returns and business registration fees; penalties accumulate and the director's credit record suffers.</p>
      <h2>Two ways out</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Deregistration</strong><p>For companies with no outstanding liabilities — approved jointly by the IRD and the CR in about 5–6 months.</p></div>
        <div class="cb-card"><strong>Winding up</strong><p>For companies with debts or assets; requires a liquidator and a stricter process.</p></div>
      </div>
      <h2>Prerequisites</h2>
      <ul>
        <li>The company never traded, or ceased trading more than 3 months ago</li>
        <li>All tax returns are filed and no tax remains unpaid</li>
        <li>No pending legal proceedings or liabilities</li>
      </ul>
    `,
        seo_title: 'Hong Kong Company Deregistration | YONGHONG',
        seo_description: 'One-stop Hong Kong deregistration and winding up — avoid penalties and close cleanly.',
        seo_keywords: 'hong kong company deregistration,hong kong winding up',
        badge_text: 'Fully compliant',
        price_text: 'From ¥1,500',
        ext_json: { btn_text: 'Apply now →', price: '1,500', unit: '' }
      }
    },
    ext_json: { gradient: 'from-sky-500 to-sky-600', icon: 'fa-lightbulb', price: '1500', unit: '元起', btn_text: '我要办理 →' },
    status: 1
  },
  {
    id: 6, category: 'trademark', country_id: 0,
    title: '全球商标注册',
    sub_title: '马德里体系 · 1对1 检索',
    summary: '全球两百多个国家地区在线一站式商标布局，1对1涉外知识产权专家免费近似检索，防抢注侵权。',
    badge_text: '企业级合规', price_text: '¥800 元起',
    slug: 'global-trademark-registration', cover_url: null,
    content: `
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
    `,
    process_steps: genericStepsZh,
    related_ids: [], views: 0, sort_order: 6,
    is_recommended: 1, is_home_show: 1,
    seo_title: '全球商标注册|马德里国际商标|永鸿国际',
    seo_description: '全球商标注册一站式，覆盖中国、香港、马德里 120+ 成员国、美国与欧盟，免费近似检索防抢注。',
    seo_keywords: '商标注册,马德里商标,美国商标,香港商标',
    i18n_json: {
      en: {
        title: 'Global Trademark Registration',
        sub_title: 'Madrid System · 1-on-1 clearance search',
        summary: 'Register your trademark across 200+ jurisdictions with a free similarity search by overseas IP specialists.',
        content: `
      <p>Being squatted or taken down on a marketplace costs far more than filing. Securing your mark early is the best-value investment in going global.</p>
      <h2>Where we file</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">China</div><div class="cb-card__label">Domestic filing & renewal</div></div>
        <div class="cb-card"><div class="cb-card__value">HK</div><div class="cb-card__label">Trade Marks Ordinance</div></div>
        <div class="cb-card"><div class="cb-card__value">Madrid</div><div class="cb-card__label">120+ members, one application</div></div>
        <div class="cb-card"><div class="cb-card__value">US/EU</div><div class="cb-card__label">Single country & EUIPO</div></div>
      </div>
      <h2>Process</h2>
      <ul>
        <li>Free similarity search and registrability assessment</li>
        <li>Class and goods/services selection (Nice Classification)</li>
        <li>Filing and follow-up on office actions</li>
        <li>Certificate issued with a 10-year renewal reminder</li>
      </ul>
    `,
        seo_title: 'Global Trademark Registration | Madrid | YONGHONG',
        seo_description: 'Register trademarks in China, Hong Kong, 120+ Madrid members, the US and the EU with a free clearance search.',
        seo_keywords: 'trademark registration,madrid trademark,us trademark',
        badge_text: 'Fully compliant',
        price_text: 'From ¥800',
        ext_json: { btn_text: 'Apply now →', price: '800', unit: '' }
      }
    },
    ext_json: { gradient: 'from-indigo-500 to-indigo-600', icon: 'fa-trademark', price: '800', unit: '元起', btn_text: '我要办理 →' },
    status: 1
  }
]

/* -------------------------------------------------------------------------- */
/* cms_partner_bank                                                            */
/* -------------------------------------------------------------------------- */
export const banks: PartnerBank[] = [
  {
    id: 1, country_id: 1, name: '汇丰银行 (HSBC)', en_name: 'HSBC', logo_url: '',
    features: '全球公认第一外资银行，支持多币种即时结算及全球提现。',
    success_rate: '98.6%', sort_order: 1, status: 1,
    ext_json: { badge: '极速面签', period: '2-3周下户' },
    i18n_json: {
      en: {
        name: 'HSBC', features: 'Widely regarded as the leading foreign bank, with instant multi-currency settlement and global cash withdrawal.',
        ext_json: { badge: 'Fast interview', period: '2–3 weeks' }
      }
    }
  },
  {
    id: 2, country_id: 1, name: '渣打银行 (SCB)', en_name: 'Standard Chartered', logo_url: '',
    features: '支持内地远程视频面签见证，免亲自跑港，网银操作简捷。',
    success_rate: '97.2%', sort_order: 2, status: 1,
    ext_json: { badge: '视频见证', period: '2周稳下户' },
    i18n_json: {
      en: {
        name: 'Standard Chartered', features: 'Remote video witnessing from the mainland — no trip to Hong Kong, simple online banking.',
        ext_json: { badge: 'Video witnessing', period: '2 weeks' }
      }
    }
  },
  {
    id: 3, country_id: 2, name: '华侨银行 (OCBC)', en_name: 'OCBC', logo_url: '',
    features: '新加坡顶尖资管银行，资金流转无外汇管制，东南亚首选。',
    success_rate: '96.4%', sort_order: 3, status: 1,
    ext_json: { badge: '新加坡直联', period: '1-2周下户' },
    i18n_json: {
      en: {
        name: 'OCBC', features: 'A top Singapore wealth-management bank with no exchange controls — first choice in Southeast Asia.',
        ext_json: { badge: 'Singapore direct', period: '1–2 weeks' }
      }
    }
  },
  {
    id: 4, country_id: 1, name: '东亚银行 (BEA)', en_name: 'BEA', logo_url: '',
    features: '专注中资出海企业信贷与外汇服务，下户准签率业内领先。',
    success_rate: '95.1%', sort_order: 4, status: 1,
    ext_json: { badge: '门槛亲民', period: '10工作日' },
    i18n_json: {
      en: {
        name: 'BEA', features: 'Focused on lending and FX for Chinese businesses going overseas, with an industry-leading approval rate.',
        ext_json: { badge: 'Low threshold', period: '10 working days' }
      }
    }
  }
]

/* -------------------------------------------------------------------------- */
/* cms_case                                                                    */
/* -------------------------------------------------------------------------- */
export const cases: CmsCase[] = [
  {
    id: 1, country_id: 1, service_id: 1,
    company_name: '深圳某头部跨境电商科技公司',
    service_title: '注册+银行账户+商标',
    cost_text: '总费用 ¥12,800',
    time_text: '历时 4 个工作日办结',
    quote_text: '“永鸿团队非常专业，2天拿到BR商业登记证，汇丰包下户更是帮我们解决了结汇大难题！”',
    portrait_url: null, content: null, sort_order: 1, status: 1,
    ext_json: { cert: '香港CR证书第3419082号' },
    i18n_json: {
      en: {
        company_name: 'A leading cross-border e-commerce tech company in Shenzhen',
        service_title: 'Registration + Bank Account + Trademark',
        cost_text: 'Total fee ¥12,800',
        time_text: 'Completed in 4 working days',
        quote_text: '“Very professional — the BR arrived in 2 days and the guaranteed HSBC account solved our FX settlement problem.”',
        ext_json: { cert: 'HK CR Certificate No. 3419082' }
      }
    }
  },
  {
    id: 2, country_id: 2, service_id: 6,
    company_name: '杭州某AI软硬件出海独角兽',
    service_title: '新加坡设立+ODI备案',
    cost_text: '总费用 ¥26,500',
    time_text: '历时 7 个工作日办结',
    quote_text: '“持牌顾问全程跟进，合规架构搭建非常严谨，让资方在ODI备案审核中一次性通过。”',
    portrait_url: null, content: null, sort_order: 2, status: 1,
    ext_json: { cert: '新加坡ACRA注册编号UEN2024098X' },
    i18n_json: {
      en: {
        company_name: 'An AI hardware & software unicorn in Hangzhou',
        service_title: 'Singapore setup + ODI filing',
        cost_text: 'Total fee ¥26,500',
        time_text: 'Completed in 7 working days',
        quote_text: '“The licensed consultant ran the whole thing — the compliance structure passed ODI review at the first attempt.”',
        ext_json: { cert: 'Singapore ACRA UEN 2024098X' }
      }
    }
  },
  {
    id: 3, country_id: 1, service_id: 4,
    company_name: '东莞某精密智能制造出口企业',
    service_title: '香港逾期年审补办+审计',
    cost_text: '总费用 ¥6,800',
    time_text: '历时 3 个工作日办结',
    quote_text: '“之前代理不专业导致逾期被法院传票，永鸿持牌会计师出面快速化解并豁免罚金！”',
    portrait_url: null, content: null, sort_order: 3, status: 1,
    ext_json: { cert: '税局免罚申请成功批复函' },
    i18n_json: {
      en: {
        company_name: 'A precision smart-manufacturing exporter in Dongguan',
        service_title: 'Overdue HK annual return + audit',
        cost_text: 'Total fee ¥6,800',
        time_text: 'Completed in 3 working days',
        quote_text: '“A previous agent botched it and we were summoned to court. Our CPA resolved it fast and the penalty was waived.”',
        ext_json: { cert: 'Tax bureau penalty-waiver approval' }
      }
    }
  }
]
