// ../../frontend/server/utils/mock/config.ts
var configSeeds = [
  /* ---------------- base ---------------- */
  {
    config_key: "site_name",
    config_name: "\u7AD9\u70B9\u540D\u79F0",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    remark: "\u5BFC\u822A Logo \u65C1\u6587\u5B57",
    zh: "\u6C38\u9E3F\u56FD\u9645",
    en: "YONGHONG"
  },
  {
    config_key: "brand_en",
    config_name: "\u54C1\u724C\u82F1\u6587\u526F\u6807\u9898",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    remark: "\u5BFC\u822A\u4E2D\u6587\u540D\u4E0B\u65B9\u7684\u82F1\u6587\u5C0F\u5B57",
    zh: "YONGHONG INTERNATIONAL CONSULTING",
    en: "YONGHONG INTERNATIONAL CONSULTING"
  },
  {
    config_key: "company_full",
    config_name: "\u516C\u53F8\u5168\u79F0",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    remark: "\u9875\u811A\u5C55\u793A",
    zh: "\u6C38\u9E3F\u56FD\u9645\u54A8\u8BE2\uFF08\u6DF1\u5733\uFF09\u6709\u9650\u516C\u53F8",
    en: "Yonghong International Consulting (Shenzhen) Co., Ltd."
  },
  {
    config_key: "company_addr",
    config_name: "\u516C\u53F8\u5730\u5740",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    zh: "\u6DF1\u5733\u5E02\u7F57\u6E56\u533A\u5357\u6E56\u8857\u9053\u5609\u5317\u793E\u533A\u8FCE\u6625\u8DEF3\u53F7\u6D77\u71D5\u5927\u53A620\u5C422010",
    en: "20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District, Shenzhen, China"
  },
  {
    config_key: "company_phone",
    config_name: "\u5BA2\u670D\u7535\u8BDD",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    zh: "18123763835",
    en: "+86 18123763835"
  },
  {
    config_key: "company_email",
    config_name: "\u8054\u7CFB\u90AE\u7BB1",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    zh: "805856285@qq.com",
    en: "805856285@qq.com"
  },
  {
    config_key: "company_credit",
    config_name: "\u7EDF\u4E00\u793E\u4F1A\u4FE1\u7528\u4EE3\u7801",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    zh: "91440300MA5FEMF959",
    en: "91440300MA5FEMF959"
  },
  {
    config_key: "company_regdate",
    config_name: "\u6210\u7ACB\u65E5\u671F",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    zh: "2018-12-20",
    en: "2018-12-20"
  },
  {
    config_key: "privacy_version",
    config_name: "\u9690\u79C1\u653F\u7B56\u7248\u672C\u53F7",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    remark: "\u2605\u7559\u8D44\u540C\u610F\u65F6\u5199\u5165 consent_version",
    zh: "v1.0",
    en: "v1.0"
  },
  {
    config_key: "cdn_base",
    config_name: "CDN/\u9759\u6001\u8D44\u6E90\u57DF\u540D",
    value_type: "string",
    group_name: "base",
    is_public: 1,
    remark: "\u2605\u5207OSS/\u6362\u57DF\u540D\u53EA\u6539\u8FD9\u4E00\u6761\uFF08\u5F00\u53D1\u671F\u7559\u7A7A = \u4E0D\u52A0\u524D\u7F00\uFF09",
    zh: "",
    en: ""
  },
  {
    config_key: "turnstile_site_key",
    config_name: "\u4EBA\u673A\u9A8C\u8BC1 SiteKey",
    value_type: "string",
    group_name: "base",
    is_public: 0,
    zh: "",
    en: ""
  },
  /* ---------------- seo ---------------- */
  {
    config_key: "seo_site_title",
    config_name: "\u9996\u9875\u6807\u9898 TDK",
    value_type: "string",
    group_name: "seo",
    is_public: 1,
    zh: "\u6C38\u9E3F\u56FD\u9645|\u9999\u6E2F\u65B0\u52A0\u5761\u7F8E\u56FD\u516C\u53F8\u6CE8\u518C|\u94F6\u884C\u5F00\u6237\u5E74\u5BA1",
    en: "YONGHONG|Hong Kong & Singapore Company Registration|Bank Account Opening"
  },
  {
    config_key: "seo_site_desc",
    config_name: "\u9996\u9875\u63CF\u8FF0 TDK",
    value_type: "string",
    group_name: "seo",
    is_public: 1,
    zh: "\u6C38\u9E3F\u56FD\u9645\u4E13\u6CE8\u6D77\u5916\u4F01\u670D\uFF1A\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u3001\u65B0\u52A0\u5761\u5F00\u6237\u3001\u7F8E\u56FD\u516C\u53F8\u8BBE\u7ACB\u3001\u5E74\u5BA1\u62A5\u7A0E\u3001\u5546\u6807\u4E13\u5229\uFF0C20000+ \u5BA2\u6237\u9009\u62E9",
    en: "YONGHONG focuses on overseas corporate services: Hong Kong company registration, Singapore bank accounts, US incorporation, audit & trademark. Chosen by 20,000+ clients."
  },
  {
    config_key: "seo_site_kw",
    config_name: "\u9996\u9875\u5173\u952E\u8BCD TDK",
    value_type: "string",
    group_name: "seo",
    is_public: 1,
    zh: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C,\u65B0\u52A0\u5761\u516C\u53F8\u5F00\u6237,\u7F8E\u56FD\u516C\u53F8\u8BBE\u7ACB,\u6D77\u5916\u5E74\u5BA1",
    en: "hong kong company registration,singapore bank account,us incorporation,offshore audit"
  },
  {
    config_key: "icp_number",
    config_name: "ICP \u5907\u6848\u53F7",
    value_type: "string",
    group_name: "seo",
    is_public: 1,
    zh: "\u7CA4ICP\u59072022121434\u53F7-1",
    en: "\u7CA4ICP\u59072022121434\u53F7-1"
  },
  /* ---------------- home ---------------- */
  {
    config_key: "home_rec",
    config_name: "\u4ECA\u65E5\u63A8\u8350",
    value_type: "json",
    group_name: "home",
    is_public: 1,
    zh: { title: "\u4ECA\u65E5\u63A8\u8350", num: "12,304\u4F4D", sub: "\u672C\u6708\u5DF2\u4E3A\u4F01\u4E1A\u5BB6\u6210\u529F\u51FA\u6D77\u529E\u7ED3" },
    en: { title: "Today's Pick", num: "12,304", sub: "Businesses successfully landed overseas this month" }
  },
  {
    config_key: "home_stats",
    config_name: "\u4E1A\u52A1\u52A8\u6001",
    value_type: "json",
    group_name: "home",
    is_public: 1,
    zh: [
      { name: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C", sub: "\u4E00\u5BF9\u4E00\u4E13\u4E1A", num: "22,102\u5BB6" },
      { name: "\u9999\u6E2F\u94F6\u884C\u5F00\u6237", sub: "100%\u5305\u5F00\u6237", num: "1,710\u4EF6" },
      { name: "\u9999\u6E2F\u505A\u8D26\u5BA1\u8BA1", sub: "\u529E\u7406\u8FC7\u7A0B\u5168\u900F\u660E", num: "51,042\u4EF6" },
      { name: "\u9999\u6E2F\u516C\u53F8\u6CE8\u9500", sub: "15\u5929\u5FEB\u901F\u4E0B\u8BC1", num: "1,911\u4EF6" }
    ],
    en: [
      { name: "HK Company Setup", sub: "1-on-1 specialists", num: "22,102" },
      { name: "HK Bank Account", sub: "100% guaranteed", num: "1,710" },
      { name: "HK Audit & Tax", sub: "Fully transparent", num: "51,042" },
      { name: "HK Deregistration", num: "1,911", sub: "Certificate in 15 days" }
    ]
  },
  {
    config_key: "home_service",
    config_name: "\u6838\u5FC3\u670D\u52A1\u77E9\u9635\u4E13\u533A\u6807\u9898",
    value_type: "json",
    group_name: "home",
    is_public: 1,
    remark: "\u2605\u65B0\u589E\u952E\uFF1A\u9996\u9875\u300C\u6838\u5FC3\u51FA\u6D77\u4E1A\u52A1\u77E9\u9635\u300D\u6807\u9898/\u526F\u6807\u9898",
    zh: { title: "\u6838\u5FC3\u51FA\u6D77\u4E1A\u52A1\u77E9\u9635", subtitle: "\u5168\u724C\u7167\u5408\u89C4\u670D\u52A1 \xB7 \u52A9\u529B\u4E2D\u56FD\u4F01\u4E1A\u65E0\u7F1D\u62D3\u5C55\u5168\u7403\u84DD\u6D77\u5E02\u573A" },
    en: { title: "Global Expansion Matrix", subtitle: "Fully licensed compliance services \xB7 Helping Chinese enterprises open up new global markets" }
  },
  {
    config_key: "home_process",
    config_name: "\u529E\u7406\u6D41\u7A0B\u4E13\u533A",
    value_type: "json",
    group_name: "home",
    is_public: 1,
    zh: {
      title: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u670D\u52A1\u843D\u5730\u9875 (2026\u5E74\u6700\u65B0\u653F\u7B56\u6D41\u7A0B)",
      sub: "\u5168\u7A0B\u4E00\u5BF9\u4E00\u6301\u724C\u79D8\u4E66\u4EE3\u529E\uFF0C\u6700\u5FEB 1 \u4E2A\u5DE5\u4F5C\u65E5\u4E0B\u53D1\u6CE8\u518C\u8BC1\u4E66\u53CA\u5546\u4E1A\u767B\u8BB0\u8BC1",
      steps: [
        { name: "\u514D\u8D39\u540D\u79F0\u6838\u67E5", desc: "\u67E5\u518C\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u7F72\u6570\u636E\u5E93\uFF0C30\u5206\u949F\u5185\u5FEB\u901F\u51FA\u5177\u67E5\u518C\u62A5\u544A", time: "30\u5206\u949F" },
        { name: "\u7B7E\u7F72\u6CD5\u5B9A\u534F\u8BAE", desc: "\u63D0\u4F9B\u8463\u4E8B\u80A1\u4E1C\u6709\u6548\u8EAB\u4EFD\u8BC1\u4EF6\uFF0C\u7B7E\u7F72\u59D4\u6258\u534F\u8BAE\u53CA\u6CD5\u5B9A\u7533\u8BF7\u8868", time: "1\u5C0F\u65F6" },
        { name: "\u9012\u4EA4\u9999\u6E2F\u6CE8\u518C\u7F72", desc: "\u6C38\u9E3F\u4E13\u5C5E\u653F\u5E9C\u901A\u9053\u5728\u7EBF\u76F4\u5448CR\u7535\u5B50\u7CFB\u7EDF\uFF0C\u5408\u89C4\u52A0\u901F\u5BA1\u6279", time: "1\u4E2A\u5DE5\u4F5C\u65E5" },
        { name: "\u5236\u4F5C\u5168\u5957\u7EFF\u76D2\u5370\u7AE0", desc: "\u4E0B\u53D1\u6CE8\u518C\u8BC1\u4E66(CR)\u4E0E\u5546\u4E1A\u767B\u8BB0\u8BC1(BR)\uFF0C\u7CBE\u96D5\u6CD5\u5B9A\u5370\u7AE0\u4E0E\u7AE0\u7A0B", time: "1\u4E2A\u5DE5\u4F5C\u65E5" },
        { name: "\u5B89\u6392\u76F4\u8054\u94F6\u884C\u5F00\u6237", desc: "\u5BF9\u63A5\u6C47\u4E30/\u6E23\u6253/\u534E\u4FA8\u7B49\u5408\u4F5C\u94F6\u884C\u5BA2\u6237\u7ECF\u7406\uFF0C\u89C6\u9891\u89C1\u8BC1\u4E0B\u6237", time: "3-5\u5DE5\u4F5C\u65E5" },
        { name: "\u987A\u4E30\u4FDD\u4EF7\u5305\u90AE\u9001\u8FBE", desc: "\u5168\u5957\u539F\u7248\u7EFF\u76D2\u3001\u5370\u7AE0\u53CA\u5F00\u6237\u7ED3\u7B97\u5361\u987A\u4E30\u4FDD\u4EF7\u5B89\u5168\u901F\u9012\u5230\u624B", time: "\u6B21\u65E5\u8FBE" }
      ]
    },
    en: {
      title: "Hong Kong Company Registration \u2014 2026 Latest Process",
      sub: "Handled 1-on-1 by licensed company secretaries; certificate of incorporation issued in as fast as 1 working day",
      steps: [
        { name: "Free name search", desc: "Search the Companies Registry database and receive a search report within 30 minutes", time: "30 min" },
        { name: "Sign the engagement letter", desc: "Provide valid ID of directors and shareholders; sign the mandate and statutory forms", time: "1 hour" },
        { name: "File with the Companies Registry", desc: "Our dedicated government channel submits electronically to the CR system", time: "1 working day" },
        { name: "Produce the full green box", desc: "CR certificate and business registration issued; statutory chops and articles engraved", time: "1 working day" },
        { name: "Arrange the bank account", desc: "Introduced to relationship managers at HSBC / SCB / OCBC with video witnessing", time: "3\u20135 days" },
        { name: "Insured courier delivery", desc: "The original green box, chops and settlement card delivered by insured express", time: "Next day" }
      ]
    }
  },
  {
    config_key: "home_section_switch",
    config_name: "\u9996\u9875\u533A\u5757\u663E\u9690",
    value_type: "json",
    group_name: "home",
    is_public: 1,
    zh: { banner: true, stats: true, service: true, process: true, bank: true, case: true, article: true, footer: true },
    en: { banner: true, stats: true, service: true, process: true, bank: true, case: true, article: true, footer: true }
  },
  /* ---------------- footer ---------------- */
  {
    config_key: "footer_links",
    config_name: "\u9875\u811A\u5FEB\u6377\u94FE\u63A5",
    value_type: "json",
    group_name: "footer",
    is_public: 1,
    zh: [
      { name: "\u9690\u79C1\u653F\u7B56", url: "/privacy-policy" },
      { name: "\u670D\u52A1\u6761\u6B3E", url: "/terms-of-service" },
      { name: "\u516C\u53F8\u7B80\u4ECB", url: "/about-profile" },
      { name: "\u8054\u7CFB\u6211\u4EEC", url: "/about-contact" }
    ],
    en: [
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Terms of Service", url: "/terms-of-service" },
      { name: "Company Profile", url: "/about-profile" },
      { name: "Contact Us", url: "/about-contact" }
    ]
  },
  {
    config_key: "friend_links",
    config_name: "\u53CB\u60C5\u94FE\u63A5",
    value_type: "json",
    group_name: "footer",
    is_public: 1,
    remark: "SEO \u53CB\u94FE\uFF1Burl \u7559\u7A7A\u5219\u524D\u53F0\u6E32\u67D3\u4E3A\u7EAF\u6587\u5B57\uFF0C\u586B\u4E86\u624D\u662F\u53EF\u70B9\u94FE\u63A5",
    zh: [
      { name: "\u9AD8\u65B0\u6280\u672F\u4F01\u4E1A\u8BA4\u5B9A", url: "" },
      { name: "\u5B9E\u9A8C\u5BA4\u8BA4\u53EF", url: "" },
      { name: "B2B", url: "" },
      { name: "\u4E2D\u5C0F\u4F01\u4E1A\u7BA1\u7406\u8F6F\u4EF6", url: "" },
      { name: "\u6606\u5C71\u4E2A\u4F53\u6237\u6CE8\u518C", url: "" },
      { name: "\u7F51\u7AD9\u5EFA\u8BBE\u516C\u53F8", url: "" }
    ],
    en: [
      { name: "Hi-tech Enterprise Accreditation", url: "" },
      { name: "Laboratory Accreditation", url: "" },
      { name: "B2B", url: "" },
      { name: "SME Management Software", url: "" },
      { name: "Kunshan Sole Trader Registration", url: "" },
      { name: "Website Building", url: "" }
    ]
  },
  /* ---------------- cs ---------------- */
  {
    config_key: "cs_quick_tags",
    config_name: "\u5BA2\u670D\u5FEB\u6377\u6807\u7B7E",
    value_type: "json",
    group_name: "cs",
    is_public: 1,
    remark: "\u2605\u7531\u5B57\u7B26\u4E32\u6570\u7EC4\u6539\u4E3A\u5BF9\u8C61\u6570\u7EC4\uFF1Aemoji / \u6309\u94AE\u6587\u5B57 / \u70B9\u51FB\u540E\u53D1\u9001\u7684\u95EE\u53E5",
    zh: [
      { emoji: "\u{1F1ED}\u{1F1F0}", label: "\u9999\u6E2F\u516C\u53F8\u8BBE\u7ACB\u4E0E\u8D39\u7528", question: "\u9999\u6E2F\u516C\u53F8\u8BBE\u7ACB\u6761\u4EF6\u4E0E\u5468\u671F" },
      { emoji: "\u{1F3E6}", label: "\u6C47\u4E30/\u6E23\u6253\u514D\u8D74\u6E2F\u5F00\u6237", question: "\u9999\u6E2F\u79BB\u5CB8\u94F6\u884C\u8FDC\u7A0B\u5F00\u6237" },
      { emoji: "\u{1F4D1}", label: "\u505A\u8D26\u5BA1\u8BA1\u4E0E\u5408\u89C4\u7533\u62A5", question: "\u9999\u6E2F\u505A\u8D26\u5BA1\u8BA1\u4E0E\u5408\u89C4\u7533\u62A5" },
      { emoji: "\u{1F1F8}\u{1F1EC}", label: "\u65B0\u52A0\u5761\u8BBE\u7ACB\u53CA\u5546\u6807", question: "\u65B0\u52A0\u5761\u8BBE\u7ACB\u4E0E\u6D77\u5916\u5546\u6807" }
    ],
    en: [
      { emoji: "\u{1F1ED}\u{1F1F0}", label: "HK setup & fees", question: "Requirements and timeline for setting up a Hong Kong company" },
      { emoji: "\u{1F3E6}", label: "HSBC / SCB remote account", question: "Remote offshore bank account opening in Hong Kong" },
      { emoji: "\u{1F4D1}", label: "Audit & compliance filing", question: "Hong Kong bookkeeping, audit and compliance filing" },
      { emoji: "\u{1F1F8}\u{1F1EC}", label: "Singapore setup & TM", question: "Singapore incorporation and overseas trademarks" }
    ]
  },
  {
    config_key: "cs_auto_reply",
    config_name: "\u5BA2\u670D\u81EA\u52A8\u56DE\u590D",
    value_type: "string",
    group_name: "cs",
    is_public: 1,
    zh: "\u60A8\u597D\uFF0C\u6211\u662F\u6C38\u9E3F\u56FD\u9645\u987E\u95EE\uFF0C\u6B63\u5728\u4E3A\u60A8\u67E5\u8BE2\u76F8\u5173\u4E1A\u52A1\uFF0C\u8BF7\u7A0D\u7B49\u7247\u523B\u3002",
    en: "Hello, this is your YONGHONG consultant. I am checking the details for you \u2014 one moment please."
  }
];

// ../../frontend/server/utils/mock/articles.ts
var articles = [
  /* ======================================================================= */
  /* 1. 政策文章 ×3（首页「出海合规与海外财税政策专栏」）                        */
  /* ======================================================================= */
  {
    id: 1,
    category_type: "news",
    country_id: 1,
    title: "\u9999\u6E2F\u7279\u533A\u516C\u53F8\u6CE8\u518C\u59042026\u5E74\u6700\u65B0\u5168\u9762\u7535\u5B50\u67E5\u518C\u53CA\u7A7F\u900F\u76D1\u7BA1\u8981\u70B9",
    summary: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u5904\u6700\u65B0\u5408\u89C4\u6307\u5F15\u6B63\u5F0F\u751F\u6548\uFF0C\u9488\u5BF9\u91CD\u8981\u63A7\u5236\u4EBA\u767B\u8BB0\u518C(SCR)\u53CA\u6302\u724C\u5730\u5740\u6838\u67E5\u63D0\u51FA\u66F4\u9AD8\u6807\u51C6...",
    cover_url: null,
    content: `
      <p>\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u5904\u4E8E 2026 \u5E74\u8D77\u8FDB\u4E00\u6B65\u6536\u7D27\u7535\u5B50\u67E5\u518C\u4E0E\u91CD\u8981\u63A7\u5236\u4EBA\u900F\u660E\u5EA6\u8981\u6C42\u3002\u5BF9\u5DF2\u6709\u9999\u6E2F\u516C\u53F8\u7684\u4F01\u4E1A\u800C\u8A00\uFF0C\u8FD9\u65E2\u662F\u5408\u89C4\u538B\u529B\uFF0C\u4E5F\u662F\u4E00\u6B21\u628A\u5386\u53F2\u9057\u7559\u95EE\u9898\u6E05\u7406\u5E72\u51C0\u7684\u673A\u4F1A\u3002</p>
      <h2>\u4E09\u4E2A\u6700\u9700\u8981\u5173\u6CE8\u7684\u53D8\u5316</h2>
      <ul>
        <li><strong>\u7535\u5B50\u67E5\u518C\u8BB0\u5F55\u7559\u75D5</strong>\u2014\u2014\u67E5\u518C\u4EBA\u8EAB\u4EFD\u4E0E\u7528\u9014\u9700\u767B\u8BB0\uFF0C\u654F\u611F\u8D44\u6599\u7684\u6279\u91CF\u5BFC\u51FA\u53D7\u5230\u9650\u5236\u3002</li>
        <li><strong>\u91CD\u8981\u63A7\u5236\u4EBA\u767B\u8BB0\u518C\uFF08SCR\uFF09\u62BD\u67E5\u5E38\u6001\u5316</strong>\u2014\u2014\u6CE8\u518C\u529E\u4E8B\u5904\u987B\u5907\u5B58\u6700\u65B0 SCR\uFF0C\u79D8\u4E66\u516C\u53F8\u4F1A\u4E0D\u5B9A\u671F\u6838\u5BF9\u3002</li>
        <li><strong>\u6302\u724C\u5730\u5740\u7A7F\u900F\u6838\u67E5</strong>\u2014\u2014\u865A\u62DF\u5730\u5740\u82E5\u65E0\u6CD5\u8054\u7CFB\u5230\u516C\u53F8\uFF0C\u53EF\u80FD\u88AB\u8981\u6C42\u9650\u671F\u6574\u6539\u3002</li>
      </ul>
      <h2>\u4F01\u4E1A\u73B0\u5728\u5E94\u8BE5\u505A\u7684\u56DB\u4EF6\u4E8B</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u6838\u5BF9\u8463\u4E8B\u80A1\u4E1C\u8D44\u6599</strong><p>\u786E\u4FDD\u62A4\u7167/\u8EAB\u4EFD\u8BC1\u4EF6\u5728\u6709\u6548\u671F\u5185\uFF0C\u4F4F\u5740\u8BC1\u660E\u4E0D\u8D85\u8FC7 3 \u4E2A\u6708\u3002</p></div>
        <div class="cb-card"><strong>\u66F4\u65B0 SCR</strong><p>\u80A1\u6743\u8F6C\u8BA9\u3001\u8463\u4E8B\u53D8\u66F4\u540E 7 \u4E2A\u5DE5\u4F5C\u65E5\u5185\u66F4\u65B0\u91CD\u8981\u63A7\u5236\u4EBA\u8D44\u6599\u3002</p></div>
        <div class="cb-card"><strong>\u786E\u8BA4\u6302\u724C\u5730\u5740\u53EF\u8FBE</strong><p>\u786E\u4FDD\u4FE1\u4EF6\u6709\u4EBA\u7B7E\u6536\uFF0C\u907F\u514D\u88AB\u6CE8\u518C\u5904\u6807\u8BB0\u4E3A\u5931\u8054\u3002</p></div>
        <div class="cb-card"><strong>\u6574\u7406\u4E1A\u52A1\u4F50\u8BC1</strong><p>\u5408\u540C\u3001\u53D1\u7968\u3001\u7F51\u7AD9\u4E0E\u6D41\u6C34\u76F8\u4E92\u5370\u8BC1\uFF0C\u5E94\u5BF9\u94F6\u884C\u5E74\u5EA6\u590D\u6838\u3002</p></div>
      </div>
      <blockquote>\u5408\u89C4\u4E0D\u662F\u6210\u672C\uFF0C\u800C\u662F\u878D\u8D44\u3001\u4E0A\u5E02\u4E0E\u8DE8\u5883\u7ED3\u6C47\u7684\u901A\u884C\u8BC1\u3002\u6C38\u9E3F\u56FD\u9645\u53EF\u4E3A\u5B58\u91CF\u9999\u6E2F\u516C\u53F8\u63D0\u4F9B SCR \u4E0E\u6302\u724C\u5730\u5740\u7684\u5E74\u5EA6\u4F53\u68C0\u670D\u52A1\u3002</blockquote>
    `,
    slug: "hk-registry-2026-electronic-search",
    author: "\u6C38\u9E3F\u56FD\u9645\u5408\u89C4\u7814\u7A76\u4E2D\u5FC3",
    views: 1420,
    is_top: 1,
    is_recommend: 1,
    related_ids: [2, 3],
    published_at: "2026-03-15T09:00:00",
    seo_title: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u59042026\u7535\u5B50\u67E5\u518C\u4E0ESCR\u76D1\u7BA1\u8981\u70B9\u89E3\u8BFB",
    seo_description: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u5904 2026 \u5E74\u7535\u5B50\u67E5\u518C\u3001\u91CD\u8981\u63A7\u5236\u4EBA\u767B\u8BB0\u518C SCR \u4E0E\u6302\u724C\u5730\u5740\u6838\u67E5\u65B0\u8981\u6C42\uFF0C\u53CA\u4F01\u4E1A\u5E94\u5BF9\u6E05\u5355\u3002",
    seo_keywords: "\u9999\u6E2F\u7535\u5B50\u67E5\u518C,SCR,\u91CD\u8981\u63A7\u5236\u4EBA\u767B\u8BB0\u518C,\u9999\u6E2F\u5408\u89C4",
    i18n_json: {
      en: {
        title: "Hong Kong Companies Registry 2026: e-Search and look-through regulation explained",
        summary: "The latest compliance guidance takes effect, raising the bar for the Significant Controllers Register and registered office checks...",
        content: `
      <p>From 2026 the Companies Registry tightens electronic search records and beneficial-ownership transparency. For companies already established in Hong Kong this is both a compliance burden and a chance to clear historical issues.</p>
      <h2>Three changes that matter most</h2>
      <ul>
        <li><strong>Search records are logged</strong> \u2014 searcher identity and purpose are registered, and bulk export of sensitive data is restricted.</li>
        <li><strong>SRC spot checks become routine</strong> \u2014 a current Significant Controllers Register must be kept at the registered office.</li>
        <li><strong>Registered office look-through</strong> \u2014 virtual addresses that cannot reach the company may face a rectification order.</li></ul>
      <h2>Four things to do now</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Verify director data</strong><p>IDs and passports valid, proof of address under three months old.</p></div>
        <div class="cb-card"><strong>Update the SRC</strong><p>Update within seven working days of any share transfer or director change.</p></div>
        <div class="cb-card"><strong>Confirm the office is reachable</strong><p>Make sure post is collected so the Registry does not flag the entity.</p></div>
        <div class="cb-card"><strong>Compile evidence</strong><p>Contracts, invoices, website and statements that corroborate each other.</p></div>
      </div>
      <blockquote>Compliance is not a cost \u2014 it is the passport to financing, listing and cross-border settlement. YONGHONG offers an annual SRC and registered-office health check.</blockquote>
    `,
        seo_title: "Hong Kong Companies Registry 2026 e-Search and SRC update",
        seo_description: "What the 2026 Hong Kong e-Search, Significant Controllers Register and registered office changes mean, plus a checklist.",
        seo_keywords: "hong kong electronic search,SRC,significant controllers register",
        ext_json: { tag: "2026 Compliance Update" }
      }
    },
    ext_json: { tag: "2026\u65B0\u89C4\u89E3\u8BFB" },
    status: 1
  },
  {
    id: 2,
    category_type: "guide",
    country_id: 0,
    title: "2026\u5E74\u5168\u7403\u79BB\u5CB8\u94F6\u884C\u5F00\u6237\u98CE\u63A7\u767D\u76AE\u4E66\uFF1A\u5982\u4F55100%\u907F\u5F00KYC\u5BA1\u67E5\u96F7\u533A\uFF1F",
    summary: "\u5404\u5927\u5916\u8D44\u94F6\u884C\u5BF9\u5408\u89C4\u6D41\u6C34\u7A7F\u900F\u5BA1\u6838\u52A0\u5267\uFF0C\u672C\u6587\u7531\u524D\u5916\u8D44\u94F6\u884C\u5408\u89C4\u7ECF\u7406\u4E3A\u60A8\u63ED\u79D8\u89C6\u9891\u89C1\u8BC1\u5FC5\u95EE\u76845\u5927\u6838\u5FC3\u95EE\u9898...",
    cover_url: null,
    content: `
      <p>2026 \u5E74\u4E3B\u8981\u5916\u8D44\u94F6\u884C\u5BF9\u8DE8\u5883\u8D44\u91D1\u7684\u7A7F\u900F\u5F0F\u5BA1\u6838\u660E\u663E\u6536\u7D27\uFF0C\u5F00\u6237\u88AB\u62D2\u7684\u4E3B\u8981\u539F\u56E0\u5DF2\u7ECF\u4ECE"\u8D44\u6599\u4E0D\u5168"\u8F6C\u5411"\u8D44\u91D1\u6765\u6E90\u89E3\u91CA\u4E0D\u6E05"\u3002</p>
      <h2>\u89C6\u9891\u89C1\u8BC1\u5FC5\u95EE\u7684 5 \u4E2A\u95EE\u9898</h2>
      <ol>
        <li>\u60A8\u7684\u516C\u53F8\u4E3B\u8981\u5BA2\u6237\u5728\u54EA\u4E9B\u56FD\u5BB6\uFF1F\u5355\u7B14\u4EA4\u6613\u91D1\u989D\u533A\u95F4\u662F\u591A\u5C11\uFF1F</li>
        <li>\u8D44\u91D1\u6765\u6E90\u662F\u8D27\u6B3E\u3001\u670D\u52A1\u8D39\u8FD8\u662F\u6295\u8D44\u6B3E\uFF1F\u80FD\u5426\u63D0\u4F9B\u5408\u540C\u4E0E\u53D1\u7968\uFF1F</li>
        <li>\u9884\u8BA1\u6BCF\u6708\u6536\u652F\u7B14\u6570\u4E0E\u91D1\u989D\uFF1F\u662F\u5426\u6709\u5927\u989D\u4E00\u6B21\u6027\u4EA4\u6613\uFF1F</li>
        <li>\u662F\u5426\u6709\u5B9E\u8D28\u7ECF\u8425\u6D3B\u52A8\uFF08\u529E\u516C\u5BA4\u3001\u5458\u5DE5\u3001\u7F51\u7AD9\uFF09\uFF1F</li>
        <li>\u6700\u7EC8\u53D7\u76CA\u4EBA\u662F\u8C01\uFF1F\u80A1\u6743\u7ED3\u6784\u662F\u5426\u6709\u4EE3\u6301\uFF1F</li>
      </ol>
      <h2>\u88AB\u62D2\u7387\u6700\u9AD8\u7684\u4E09\u7C7B\u60C5\u5F62</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u884C\u4E1A\u654F\u611F</strong><p>\u52A0\u5BC6\u8D27\u5E01\u3001\u535A\u5F69\u3001\u8D35\u91D1\u5C5E\u3001\u519B\u6C11\u4E24\u7528\u7B49\u9700\u63D0\u524D\u51C6\u5907\u4E13\u9879\u8BF4\u660E\u3002</p></div>
        <div class="cb-card"><strong>\u6D41\u6C34\u5F02\u5E38</strong><p>\u4E2A\u4EBA\u8D26\u6237\u4E0E\u516C\u53F8\u8D26\u6237\u6DF7\u7528\u3001\u9891\u7E41\u5927\u989D\u6574\u6570\u8FDB\u51FA\u3002</p></div>
        <div class="cb-card"><strong>\u8D44\u6599\u77DB\u76FE</strong><p>\u7F51\u7AD9\u3001\u5408\u540C\u3001\u53D1\u7968\u4E0E\u6D41\u6C34\u5BF9\u4E0D\u4E0A\uFF0C\u662F\u9762\u7B7E\u6700\u5BB9\u6613\u7FFB\u8F66\u7684\u70B9\u3002</p></div>
        <div class="cb-card"><strong>\u5E94\u5BF9\u65B9\u6848</strong><p>\u63D0\u524D\u505A KYC \u9884\u5BA1 + \u9762\u7B7E\u6A21\u62DF\uFF0C\u662F\u6211\u4EEC\u901A\u8FC7\u7387 98.6% \u7684\u5173\u952E\u3002</p></div>
      </div>
      <blockquote>\u63D0\u793A\uFF1A\u5207\u52FF\u542C\u4FE1"\u5305\u8FC7"\u8BDD\u672F\u3002\u5408\u89C4\u7684\u5F00\u6237\u8F85\u5BFC\u662F\u628A\u60A8\u7684\u771F\u5B9E\u7ECF\u8425\u8BB2\u6E05\u695A\uFF0C\u800C\u4E0D\u662F\u7F16\u9020\u6545\u4E8B\u3002</blockquote>
    `,
    slug: "offshore-bank-kyc-whitepaper-2026",
    author: "\u6C38\u9E3F\u56FD\u9645\u94F6\u884C\u6E20\u9053\u90E8",
    views: 2890,
    is_top: 0,
    is_recommend: 1,
    related_ids: [1, 3],
    published_at: "2026-03-10T10:30:00",
    seo_title: "2026\u79BB\u5CB8\u94F6\u884C\u5F00\u6237KYC\u98CE\u63A7\u767D\u76AE\u4E66|\u907F\u514D\u88AB\u62D2\u76845\u4E2A\u8981\u70B9",
    seo_description: "\u524D\u5916\u8D44\u94F6\u884C\u5408\u89C4\u7ECF\u7406\u89E3\u6790 2026 \u79BB\u5CB8\u5F00\u6237 KYC \u5BA1\u67E5\uFF1A5 \u5927\u5FC5\u95EE\u95EE\u9898\u30013 \u7C7B\u9AD8\u62D2\u7387\u60C5\u5F62\u4E0E\u9884\u5BA1\u65B9\u6CD5\u3002",
    seo_keywords: "\u79BB\u5CB8\u94F6\u884C\u5F00\u6237,KYC,\u9999\u6E2F\u5F00\u6237,\u94F6\u884C\u9762\u7B7E",
    i18n_json: {
      en: {
        title: "2026 Global Offshore Banking KYC Whitepaper: how to clear screening",
        summary: "Banks now audit cross-border flows far more aggressively. A former compliance manager reveals the five questions asked in every video interview...",
        content: `
      <p>In 2026 the major foreign banks tightened look-through review of cross-border funds. Rejections now stem less from missing paperwork and more from an unconvincing source of wealth.</p>
      <h2>The five questions asked in every interview</h2>
      <ol>
        <li>Which countries are your customers in, and what is the typical transaction size?</li>
        <li>Is the money from goods, services or investment? Can you show contracts and invoices?</li>
        <li>What monthly volume do you expect? Any large one-off transactions?</li>
        <li>Is there real substance \u2014 office, staff, website?</li>
        <li>Who are the ultimate beneficial owners? Any nominee holdings?</li>
      </ol>
      <h2>Three situations with the highest rejection rate</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Sensitive industries</strong><p>Crypto, gambling, precious metals and dual-use goods need a pre-written explanation.</p></div>
        <div class="cb-card"><strong>Abnormal flows</strong><p>Mixing personal and corporate accounts, frequent round-number transfers.</p></div>
        <div class="cb-card"><strong>Contradictory files</strong><p>Website, contracts, invoices and statements that do not line up.</p></div>
        <div class="cb-card"><strong>The fix</strong><p>Pre-audit plus a mock interview \u2014 the reason our approval rate is 98.6%.</p></div>
      </div>
      <blockquote>A warning: ignore anyone promising a guaranteed account. Proper coaching tells your real business story \u2014 it does not invent one.</blockquote>
    `,
        seo_title: "2026 Offshore Bank KYC Whitepaper | Clear every interview",
        seo_description: "The five KYC questions, three highest-risk situations and how to pre-audit an offshore account application.",
        seo_keywords: "offshore bank account,kyc,hong kong account opening",
        ext_json: { tag: "Banking Brief" }
      }
    },
    ext_json: { tag: "\u79BB\u5CB8\u94F6\u884C\u4E13\u62A5" },
    status: 1
  },
  {
    id: 3,
    category_type: "news",
    country_id: 1,
    title: "\u9999\u6E2F\u516C\u53F8\u79BB\u5CB8\u514D\u7A0E\u7533\u8BF7(Offshore Claim)\u5B9E\u64CD\u6848\u4F8B\u4E0E\u5408\u89C4\u98CE\u9669\u9632\u8303",
    summary: "\u79BB\u5CB8\u6240\u5F97\u514D\u7A0E\u5E76\u975E\u201C\u96F6\u7533\u62A5\u201D\uFF01\u7A0E\u52A1\u5C40\u5BF9\u65E0\u4FDD\u7559\u610F\u89C1\u5BA1\u8BA1\u62A5\u544A\u7684\u62BD\u67E5\u7387\u5927\u5E45\u4E0A\u5347\uFF0C\u4F01\u4E1A\u5E94\u5982\u4F55\u5EFA\u7ACB\u5408\u89C4\u8BC1\u636E\u94FE...",
    cover_url: null,
    content: `
      <p>\u5F88\u591A\u4F01\u4E1A\u8BEF\u4EE5\u4E3A"\u516C\u53F8\u5728\u9999\u6E2F\u6CA1\u6709\u529E\u516C\u5BA4 = \u53EF\u4EE5\u96F6\u7533\u62A5"\u3002\u5B9E\u9645\u4E0A\uFF0C\u79BB\u5CB8\u6240\u5F97\u514D\u7A0E\uFF08Offshore Claim\uFF09\u9700\u8981\u5728\u5BA1\u8BA1\u62A5\u544A\u4E2D\u7ED9\u51FA\u5145\u5206\u4F9D\u636E\uFF0C\u7531\u7A0E\u52A1\u5C40\u4E2A\u6848\u5BA1\u6279\u3002</p>
      <h2>\u7A0E\u52A1\u5C40\u91CD\u70B9\u770B\u4EC0\u4E48</h2>
      <ul>
        <li>\u5408\u540C\u7B7E\u7F72\u5730\u4E0E\u5C65\u7EA6\u5730\u5728\u54EA\u91CC</li>
        <li>\u8D27\u7269\u7684\u5B9E\u9645\u8FD0\u8F93\u8DEF\u5F84\u4E0E\u62A5\u5173\u8BB0\u5F55</li>
        <li>\u51B3\u7B56\u4E0E\u7BA1\u7406\u662F\u5426\u5728\u9999\u6E2F\u5883\u5185\u53D1\u751F</li>
        <li>\u6536\u6B3E\u8D26\u6237\u6240\u5728\u5730\u4E0E\u8D44\u91D1\u6D41\u5411</li>
      </ul>
      <h2>\u5B9E\u64CD\u6848\u4F8B</h2>
      <p>\u67D0\u8DE8\u5883\u7535\u5546\u4F01\u4E1A 2024 \u5E74\u7533\u8BF7\u79BB\u5CB8\u514D\u7A0E\uFF0C\u56E0\u65E0\u6CD5\u63D0\u4F9B\u4E0E\u5883\u5916\u4F9B\u5E94\u5546\u7684\u5B8C\u6574\u7269\u6D41\u5355\u8BC1\uFF0C\u88AB\u8981\u6C42\u8865\u5145\u8D44\u6599\u5E76\u6700\u7EC8\u6309 80% \u6838\u5B9A\u3002\u6574\u6539\u540E\u6211\u4EEC\u534F\u52A9\u8865\u9F50\u4E86\u5408\u540C\u3001\u63D0\u5355\u4E0E\u90AE\u4EF6\u51B3\u7B56\u8BB0\u5F55\uFF0C2025 \u5E74\u83B7\u6279\u5168\u989D\u79BB\u5CB8\u8C41\u514D\u3002</p>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u8BC1\u636E\u94FE\u56DB\u4EF6\u5957</strong><p>\u5408\u540C + \u7269\u6D41\u5355\u8BC1 + \u51B3\u7B56\u90AE\u4EF6 + \u6536\u4ED8\u6B3E\u51ED\u8BC1\uFF0C\u7F3A\u4E00\u4E0D\u53EF\u3002</p></div>
        <div class="cb-card"><strong>\u65F6\u95F4\u7EBF\u8981\u95ED\u5408</strong><p>\u5408\u540C\u65E5\u671F\u3001\u53D1\u8D27\u65E5\u671F\u3001\u6536\u6B3E\u65E5\u671F\u5FC5\u987B\u80FD\u4E32\u6210\u5408\u7406\u987A\u5E8F\u3002</p></div>
        <div class="cb-card"><strong>\u5207\u5FCC\u8D26\u5916\u8D26</strong><p>\u4E24\u5957\u8D26\u4E00\u65E6\u88AB\u7A7F\u900F\uFF0C\u540E\u7EED\u4E09\u5E74\u90FD\u4F1A\u6210\u4E3A\u91CD\u70B9\u62BD\u67E5\u5BF9\u8C61\u3002</p></div>
        <div class="cb-card"><strong>\u5E74\u5EA6\u590D\u76D8</strong><p>\u6BCF\u5E74\u62A5\u7A0E\u524D\u505A\u4E00\u6B21\u79BB\u5CB8\u8BC1\u636E\u94FE\u81EA\u67E5\uFF0C\u6BD4\u4E8B\u540E\u8865\u6551\u7701\u5341\u500D\u3002</p></div>
      </div>
      <blockquote>\u79BB\u5CB8\u514D\u7A0E\u662F\u5408\u6CD5\u6743\u5229\uFF0C\u4F46\u4E0D\u662F\u9ED8\u8BA4\u7ED3\u679C\u3002\u628A\u8BC1\u636E\u505A\u5728\u5E73\u65F6\uFF0C\u624D\u662F\u6700\u7A33\u7684\u7B79\u5212\u3002</blockquote>
    `,
    slug: "hong-kong-offshore-claim-guide",
    author: "\u6C38\u9E3F\u56FD\u9645\u8D22\u7A0E\u90E8",
    views: 3150,
    is_top: 0,
    is_recommend: 1,
    related_ids: [1, 2],
    published_at: "2026-02-28T14:00:00",
    seo_title: "\u9999\u6E2F\u79BB\u5CB8\u514D\u7A0E\u7533\u8BF7\u5B9E\u64CD\u6848\u4F8B|Offshore Claim\u5408\u89C4\u98CE\u9669\u9632\u8303",
    seo_description: "\u9999\u6E2F\u79BB\u5CB8\u6240\u5F97\u514D\u7A0E\u5E76\u975E\u96F6\u7533\u62A5\uFF1A\u7A0E\u52A1\u5C40\u5BA1\u67E5\u8981\u70B9\u3001\u5B9E\u64CD\u6848\u4F8B\u4E0E\u5408\u89C4\u8BC1\u636E\u94FE\u5EFA\u8BBE\u65B9\u6CD5\u3002",
    seo_keywords: "\u9999\u6E2F\u79BB\u5CB8\u514D\u7A0E,offshore claim,\u9999\u6E2F\u5BA1\u8BA1,\u9999\u6E2F\u62A5\u7A0E",
    i18n_json: {
      en: {
        title: "Hong Kong offshore claim: worked example and compliance risks",
        summary: "An offshore claim is not a nil filing. With audit sampling rising sharply, how should a company build its evidence chain?",
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
      <blockquote>An offshore claim is a right, not a default outcome. Build the evidence throughout the year \u2014 that is the safest planning.</blockquote>
    `,
        seo_title: "Hong Kong Offshore Claim guide | Compliance risks",
        seo_description: "What the IRD checks in an offshore claim, a worked example and how to build a complete evidence chain.",
        seo_keywords: "hong kong offshore claim,hong kong audit,hong kong tax",
        ext_json: { tag: "Tax & Audit" }
      }
    },
    ext_json: { tag: "\u8D22\u7A0E\u5BA1\u8BA1\u7B79\u5212" },
    status: 1
  },
  /* ======================================================================= */
  /* 2. 关于我们 ×4（原型 #about-pages 四个独立整页）                           */
  /* ======================================================================= */
  {
    id: 11,
    category_type: "about",
    country_id: 0,
    title: "\u516C\u53F8\u7B80\u4ECB",
    summary: "\u6C38\u9E3F\u56FD\u9645\u54A8\u8BE2\uFF08\u6DF1\u5733\uFF09\u6709\u9650\u516C\u53F8 \xB7 \u5B98\u65B9\u8BA4\u8BC1\u6743\u5A01\u51FA\u6D77\u673A\u6784\uFF0C\u4E00\u7AD9\u5F0F\u3001\u5168\u5408\u89C4\u7684\u8DE8\u5883\u4F01\u4E1A\u7EFC\u5408\u670D\u52A1",
    cover_url: null,
    content: `
      <div class="cb-lead">\u6C38\u9E3F\u56FD\u9645\u54A8\u8BE2\uFF08\u6DF1\u5733\uFF09\u6709\u9650\u516C\u53F8\uFF0C\u6210\u7ACB\u4E8E 2018 \u5E74 12 \u6708 20 \u65E5\uFF0C\u7EDF\u4E00\u793E\u4F1A\u4FE1\u7528\u4EE3\u7801\uFF1A91440300MA5FEMF959\u3002</div>

      <h2>\u7ACB\u8DB3\u5927\u6E7E\u533A\uFF0C\u670D\u52A1\u4E2D\u8D44\u4F01\u4E1A\u51FA\u6D77</h2>
      <p>\u516C\u53F8\u7ACB\u8DB3\u6DF1\u5733\u5927\u6E7E\u533A\u67A2\u7EBD\uFF08\u6DF1\u5733\u5E02\u7F57\u6E56\u533A\u8FCE\u6625\u8DEF3\u53F7\u6D77\u71D5\u5927\u53A620\u5C42\uFF09\uFF0C\u8F90\u5C04\u5168\u7403\u79BB\u5CB8\u91D1\u878D\u4E2D\u5FC3\u3002\u81F4\u529B\u4E8E\u4E3A\u4E2D\u56FD\u4F18\u8D28\u51FA\u6D77\u4F01\u4E1A\u3001\u8DE8\u5883\u7535\u5546\u5356\u5BB6\u3001\u8DE8\u56FD\u6295\u8D44\u673A\u6784\u63D0\u4F9B\u4E00\u7AD9\u5F0F\u3001\u5168\u5408\u89C4\u7684\u8DE8\u5883\u4F01\u4E1A\u7EFC\u5408\u670D\u52A1\u3002</p>
      <p>\u4E1A\u52A1\u8986\u76D6\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u4E0E\u7EF4\u62A4\u3001\u9999\u6E2F/\u65B0\u52A0\u5761\u94F6\u884C\u5F00\u6237\u3001\u79BB\u5CB8\u516C\u53F8\u67B6\u6784\u4E0E\u505A\u8D26\u5BA1\u8BA1\u3001\u6D77\u5916\u5546\u6807\u4E13\u5229\u6CE8\u518C\u7B49\u6838\u5FC3\u677F\u5757\u3002\u6211\u4EEC\u575A\u6301"\u5408\u89C4\u5148\u884C\u3001\u7ED3\u679C\u53EF\u9A8C"\uFF0C\u6BCF\u4E00\u4EFD\u65B9\u6848\u5747\u51FA\u5177\u4E66\u9762\u98CE\u9669\u63D0\u793A\u4E0E\u8D39\u7528\u6E05\u5355\uFF0C\u5E2E\u52A9\u5BA2\u6237\u5728\u964C\u751F\u6CD5\u57DF\u91CC\u8D70\u5F97\u7A33\u3001\u8D70\u5F97\u8FDC\u3002</p>

      <div class="cb-cards2">
        <div class="cb-card"><span class="cb-card__icon">\u25C6</span><strong>\u6301\u724C\u4FE1\u6258\u53CA\u516C\u53F8\u670D\u52A1\u63D0\u4F9B\u5546 (TCSP)</strong></div>
        <div class="cb-card"><span class="cb-card__icon">\u2696</span><strong>\u8D44\u6DF1\u5408\u89C4\u8D22\u7A0E\u5BA1\u8BA1\u5E08\u9A7B\u573A\u4FDD\u969C</strong></div>
      </div>

      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">2018</div><div class="cb-card__label">\u6210\u7ACB\u5E74\u4EFD</div></div>
        <div class="cb-card"><div class="cb-card__value">10,000+</div><div class="cb-card__label">\u7D2F\u8BA1\u670D\u52A1\u4F01\u4E8B\u4E1A\u5355\u4F4D</div></div>
        <div class="cb-card"><div class="cb-card__value">8 \u5E74+</div><div class="cb-card__label">\u56E2\u961F\u5E73\u5747\u4ECE\u4E1A\u5E74\u9650</div></div>
        <div class="cb-card"><div class="cb-card__value">HK / SG</div><div class="cb-card__label">\u9999\u6E2F\xB7\u65B0\u52A0\u5761\u53CC\u4E2D\u5FC3</div></div>
      </div>
    `,
    slug: "about-profile",
    author: "\u6C38\u9E3F\u56FD\u9645",
    views: 0,
    is_top: 0,
    is_recommend: 0,
    related_ids: [12, 13, 14],
    published_at: "2026-01-01T00:00:00",
    seo_title: "\u516C\u53F8\u7B80\u4ECB|\u6C38\u9E3F\u56FD\u9645\u54A8\u8BE2\uFF08\u6DF1\u5733\uFF09\u6709\u9650\u516C\u53F8",
    seo_description: "\u6C38\u9E3F\u56FD\u9645\u54A8\u8BE2\uFF08\u6DF1\u5733\uFF09\u6709\u9650\u516C\u53F8\u6210\u7ACB\u4E8E2018\u5E74\uFF0CTCSP\u6301\u724C\uFF0C\u63D0\u4F9B\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u3001\u94F6\u884C\u5F00\u6237\u3001\u505A\u8D26\u5BA1\u8BA1\u4E0E\u6D77\u5916\u5546\u6807\u4E00\u7AD9\u5F0F\u670D\u52A1\u3002",
    seo_keywords: "\u6C38\u9E3F\u56FD\u9645,\u516C\u53F8\u7B80\u4ECB,\u51FA\u6D77\u4F01\u670D",
    i18n_json: {
      en: {
        title: "Company Profile",
        summary: "YONGHONG International Consulting (Shenzhen) \u2014 an accredited one-stop, fully compliant cross-border corporate services firm.",
        content: `
      <div class="cb-lead">YONGHONG International Consulting (Shenzhen) Co., Ltd. was incorporated on 20 December 2018. Unified Social Credit Code: 91440300MA5FEMF959.</div>

      <h2>Anchored in the Greater Bay Area</h2>
      <p>Based in Shenzhen at the heart of the Greater Bay Area (20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District) and reaching the world's offshore financial centres, we serve Chinese exporters, cross-border e-commerce sellers and multinational investors with a one-stop, fully compliant service.</p>
      <p>Our core practices cover Hong Kong company registration and maintenance, Hong Kong and Singapore bank accounts, offshore structures with bookkeeping and audit, and overseas trademark and patent filing. We put compliance first and prove results: every plan comes with a written risk note and an itemised fee list.</p>

      <div class="cb-cards2">
        <div class="cb-card"><span class="cb-card__icon">\u25C6</span><strong>Licensed Trust or Company Service Provider (TCSP)</strong></div>
        <div class="cb-card"><span class="cb-card__icon">\u2696</span><strong>Senior compliance and audit specialists on site</strong></div>
      </div>

      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">2018</div><div class="cb-card__label">Founded</div></div>
        <div class="cb-card"><div class="cb-card__value">10,000+</div><div class="cb-card__label">Organisations served</div></div>
        <div class="cb-card"><div class="cb-card__value">8 yrs+</div><div class="cb-card__label">Average consultant experience</div></div>
        <div class="cb-card"><div class="cb-card__value">HK / SG</div><div class="cb-card__label">Hong Kong & Singapore hubs</div></div>
      </div>
    `,
        seo_title: "Company Profile | YONGHONG International Consulting",
        seo_description: "Founded in 2018, TCSP licensed \u2014 one-stop Hong Kong company registration, bank accounts, audit and trademarks.",
        seo_keywords: "yonghong,company profile,corporate services"
      }
    },
    ext_json: { badge: "About Us \xB7 Company Profile" },
    status: 1
  },
  {
    id: 12,
    category_type: "about",
    country_id: 0,
    title: "\u56E2\u961F\u5C55\u793A",
    summary: "\u79BB\u5CB8\u5546\u52A1\u67B6\u6784\u5E08\u3001\u9999\u6E2F\u6267\u4E1A\u6CE8\u518C\u4F1A\u8BA1\u5E08\u4E0E\u6D89\u5916\u5408\u89C4\u6CD5\u52A1\u7EC4\u6210\u7684\u4E13\u4E1A\u73ED\u5E95",
    cover_url: null,
    content: `
      <p>\u6C38\u9E3F\u56FD\u9645\u6C47\u805A\u4E1A\u5185\u9876\u5C16\u79BB\u5CB8\u5546\u52A1\u67B6\u6784\u5E08\u3001\u9999\u6E2F\u6267\u4E1A\u6CE8\u518C\u4F1A\u8BA1\u5E08 (HKICPA) \u53CA\u6D89\u5916\u5408\u89C4\u6CD5\u52A1\u56E2\u961F\uFF0C\u5E73\u5747\u4ECE\u4E1A\u5E74\u9650 8 \u5E74\u4EE5\u4E0A\u3002\u6838\u5FC3\u987E\u95EE\u5747\u5177\u5907\u5927\u6E7E\u533A\u94F6\u884C\u3001\u4F1A\u8BA1\u5E08\u4E8B\u52A1\u6240\u6216\u5F8B\u6240\u80CC\u666F\uFF0C\u80FD\u591F\u9488\u5BF9\u5BA2\u6237\u5B9E\u9645\u7ECF\u8425\u573A\u666F\u7ED9\u51FA\u53EF\u843D\u5730\u7684\u5408\u89C4\u8DEF\u5F84\u3002</p>

      <div class="cb-persons">
        <div class="cb-person">
          <span class="cb-person__avatar">\u9648</span>
          <div class="cb-person__body">
            <div class="cb-person__name">\u9648\u7ECF\u7406 \xB7 \u9AD8\u7EA7\u51FA\u6D77\u5408\u89C4\u987E\u95EE</div>
            <div class="cb-person__meta">\u5DE5\u53F7 8016 \xB7 10\u5E74\u5927\u6E7E\u533A\u79BB\u5CB8\u67B6\u6784\u4E0E\u94F6\u884CVIP\u901A\u9053\u7ECF\u9A8C</div>
          </div>
          <span class="cb-person__badge">\u91D1\u724C\u987E\u95EE</span>
        </div>
        <div class="cb-person cb-person--teal">
          <span class="cb-person__avatar">\u9EC4</span>
          <div class="cb-person__body">
            <div class="cb-person__name">\u9EC4\u4F1A\u8BA1\u5E08 \xB7 \u9999\u6E2F\u6267\u4E1A\u6CE8\u518C\u5BA1\u8BA1\u5E08</div>
            <div class="cb-person__meta">\u9999\u6E2F\u4F1A\u8BA1\u5E08\u516C\u4F1A\u8D44\u6DF1\u4F1A\u5458 \xB7 \u7CBE\u901A\u79BB\u5CB8\u514D\u7A0E\u7533\u62A5\u4E0EBEPS 2.0</div>
          </div>
          <span class="cb-person__badge">\u5BA1\u8BA1\u4E3B\u7BA1</span>
        </div>
      </div>

      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">HKICPA</div><div class="cb-card__label">\u9999\u6E2F\u6267\u4E1A\u6CE8\u518C\u4F1A\u8BA1\u5E08</div></div>
        <div class="cb-card"><div class="cb-card__value">TCSP</div><div class="cb-card__label">\u6301\u724C\u516C\u53F8\u670D\u52A1\u987E\u95EE</div></div>
        <div class="cb-card"><div class="cb-card__value">Legal</div><div class="cb-card__label">\u6D89\u5916\u5408\u89C4\u6CD5\u52A1</div></div>
        <div class="cb-card"><div class="cb-card__value">CS</div><div class="cb-card__label">\u4E13\u5C5E\u5BA2\u670D\u8DDF\u8FDB</div></div>
      </div>
    `,
    slug: "about-team",
    author: "\u6C38\u9E3F\u56FD\u9645",
    views: 0,
    is_top: 0,
    is_recommend: 0,
    related_ids: [11, 13, 14],
    published_at: "2026-01-01T00:00:00",
    seo_title: "\u56E2\u961F\u5C55\u793A|\u79BB\u5CB8\u67B6\u6784\u5E08\u4E0E\u9999\u6E2F\u6267\u4E1A\u4F1A\u8BA1\u5E08",
    seo_description: "\u6C38\u9E3F\u56FD\u9645\u6838\u5FC3\u56E2\u961F\u7531\u79BB\u5CB8\u5546\u52A1\u67B6\u6784\u5E08\u3001\u9999\u6E2F\u6267\u4E1A\u6CE8\u518C\u4F1A\u8BA1\u5E08 HKICPA \u4E0E\u6D89\u5916\u5408\u89C4\u6CD5\u52A1\u7EC4\u6210\uFF0C\u5E73\u5747\u4ECE\u4E1A8\u5E74\u4EE5\u4E0A\u3002",
    seo_keywords: "\u56E2\u961F\u5C55\u793A,\u79BB\u5CB8\u67B6\u6784\u5E08,\u9999\u6E2F\u4F1A\u8BA1\u5E08",
    i18n_json: {
      en: {
        title: "Our Team",
        summary: "A professional bench of offshore structuring consultants, Hong Kong certified practising accountants and cross-border compliance lawyers.",
        content: `
      <p>YONGHONG brings together leading offshore structuring consultants, Hong Kong certified practising accountants (HKICPA) and cross-border compliance lawyers with an average of more than eight years' experience. Our core advisers come from Greater Bay Area banks, accounting firms and law firms, and turn real operating conditions into workable compliance paths.</p>

      <div class="cb-persons">
        <div class="cb-person">
          <span class="cb-person__avatar">C</span>
          <div class="cb-person__body">
            <div class="cb-person__name">Mr. Chan \xB7 Senior Overseas Compliance Consultant</div>
            <div class="cb-person__meta">Staff No. 8016 \xB7 10 years in GBA offshore structuring and bank VIP channels</div>
          </div>
          <span class="cb-person__badge">Gold adviser</span>
        </div>
        <div class="cb-person cb-person--teal">
          <span class="cb-person__avatar">W</span>
          <div class="cb-person__body">
            <div class="cb-person__name">Ms. Wong \xB7 HK Certified Practising Auditor</div>
            <div class="cb-person__meta">Fellow of the HKICPA \xB7 offshore exemption filing and BEPS 2.0</div>
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
        seo_title: "Our Team | Offshore consultants & HK practising accountants",
        seo_description: "Our core team of offshore structuring consultants, HKICPA practising accountants and cross-border compliance lawyers.",
        seo_keywords: "our team,offshore consultant,hkicpa"
      }
    },
    ext_json: { badge: "About Us \xB7 Our Team" },
    status: 1
  },
  {
    id: 13,
    category_type: "about",
    country_id: 0,
    title: "\u4F01\u4E1A\u62DB\u8058",
    summary: "\u6C38\u9E3F\u56FD\u9645\u4E1A\u52A1\u9AD8\u901F\u53D1\u5C55\uFF0C\u8BDA\u9080\u70ED\u7231\u8DE8\u5883\u51FA\u6D77\u884C\u4E1A\u7684\u4F18\u79C0\u4EBA\u624D\u52A0\u5165\u6211\u4EEC",
    cover_url: null,
    content: `
      <div class="cb-jobs">
        <div class="cb-job cb-job--amber">
          <div class="cb-job__head">
            <span class="cb-job__title">\u51FA\u6D77\u4F01\u670D\u5546\u52A1\u987E\u95EE (\u5168\u804C)</span>
            <span class="cb-job__pay">8K-18K + \u63D0\u6210</span>
          </div>
          <p class="cb-job__desc">\u8981\u6C42\uFF1A\u5927\u4E13\u53CA\u4EE5\u4E0A\uFF0C1\u5E74\u4EE5\u4E0A\u8DE8\u5883\u4F01\u670D/\u5916\u8D38\u5546\u52A1\u7ECF\u9A8C\uFF0C\u6C9F\u901A\u80FD\u529B\u5F3A\u3002\u4EAB\u6709\u4E94\u9669\u4E00\u91D1\u3001\u5E26\u85AA\u5E74\u5047\u3002</p>
        </div>
        <div class="cb-job cb-job--emerald">
          <div class="cb-job__head">
            <span class="cb-job__title">\u79BB\u5CB8\u505A\u8D26\u5BA1\u8BA1\u5408\u89C4\u4E13\u5458 (\u53CC\u4F11)</span>
            <span class="cb-job__pay">7K-13K</span>
          </div>
          <p class="cb-job__desc">\u8981\u6C42\uFF1A\u8D22\u4F1A\u4E13\u4E1A\uFF0C\u719F\u6089\u9999\u6E2F/\u65B0\u52A0\u5761\u7A0E\u6CD5\u5BA1\u8BA1\u6D41\u7A0B\uFF0C\u5177\u5907\u9AD8\u5EA6\u4FDD\u5BC6\u610F\u8BC6\u3002</p>
        </div>
      </div>

      <div class="cb-resume">
        <div class="cb-resume__body">
          <div class="cb-resume__label">\u7B80\u5386\u76F4\u6295\u90AE\u7BB1</div>
          <div class="cb-resume__mail">805856285@qq.com\uFF08\u6CE8\u660E\u5E94\u8058\u5C97\u4F4D\uFF09</div>
        </div>
        <span class="cb-resume__tip">\u5B98\u65B9\u54A8\u8BE2\u4E13\u7EBF 18123763835</span>
      </div>
    `,
    slug: "about-careers",
    author: "\u6C38\u9E3F\u56FD\u9645",
    views: 0,
    is_top: 0,
    is_recommend: 0,
    related_ids: [11, 12, 14],
    published_at: "2026-01-01T00:00:00",
    seo_title: "\u4F01\u4E1A\u62DB\u8058|\u6C38\u9E3F\u56FD\u9645\u52A0\u5165\u6211\u4EEC",
    seo_description: "\u6C38\u9E3F\u56FD\u9645\u62DB\u8058\u51FA\u6D77\u4F01\u670D\u5546\u52A1\u987E\u95EE\u4E0E\u79BB\u5CB8\u505A\u8D26\u5BA1\u8BA1\u5408\u89C4\u4E13\u5458\uFF0C\u4E94\u9669\u4E00\u91D1\u5E26\u85AA\u5E74\u5047\uFF0C\u7B80\u5386\u76F4\u6295 805856285@qq.com\u3002",
    seo_keywords: "\u4F01\u4E1A\u62DB\u8058,\u51FA\u6D77\u4F01\u670D,\u8DE8\u5883\u5546\u52A1\u987E\u95EE",
    i18n_json: {
      en: {
        title: "Careers",
        summary: "YONGHONG is growing fast \u2014 we would love to meet talented people who are passionate about cross-border business.",
        content: `
      <div class="cb-jobs">
        <div class="cb-job cb-job--amber">
          <div class="cb-job__head">
            <span class="cb-job__title">Business Consultant, Global Services (Full-time)</span>
            <span class="cb-job__pay">\xA58K\u201318K + commission</span>
          </div>
          <p class="cb-job__desc">Associate degree or above; 1+ year in cross-border services or foreign trade; strong communicator. Social insurance, housing fund and paid annual leave included.</p>
        </div>
        <div class="cb-job cb-job--emerald">
          <div class="cb-job__head">
            <span class="cb-job__title">Offshore Audit & Compliance Officer (5 days)</span>
            <span class="cb-job__pay">\xA57K\u201313K</span>
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
        seo_title: "Careers | Join YONGHONG",
        seo_description: "We are hiring business consultants and offshore audit compliance officers \u2014 apply at 805856285@qq.com.",
        seo_keywords: "careers,corporate services jobs"
      }
    },
    ext_json: { badge: "About Us \xB7 Careers" },
    status: 1
  },
  {
    id: 14,
    category_type: "about",
    country_id: 0,
    title: "\u8054\u7CFB\u6211\u4EEC",
    summary: "\u6DF1\u5733\u603B\u90E8 \xB7 \u9999\u6E2F/\u65B0\u52A0\u5761\u53CC\u4E2D\u5FC3\uFF0C\u6B22\u8FCE\u6765\u7535\u6216\u5230\u8BBF\u54A8\u8BE2",
    cover_url: null,
    /* 联系方式卡片由前台从 cms_site_config 渲染（配置改了这里自动变），此处只存 CTA 横幅 */
    content: `
      <div class="cb-cta">
        <div class="cb-cta__body">
          <div class="cb-cta__title">\u7559\u4E0B\u60A8\u7684\u8054\u7CFB\u65B9\u5F0F</div>
          <div class="cb-cta__sub">\u8D44\u6DF1\u987E\u95EE\u5C06\u4E3A\u60A8\u51FA\u5177\u4E66\u9762\u65B9\u6848\u4E0E\u8D39\u7528\u6E05\u5355\uFF0C\u54A8\u8BE2\u5168\u7A0B\u514D\u8D39</div>
        </div>
        <button type="button" class="cb-cta__btn" data-inquiry="\u516C\u53F8\u7B80\u4ECB\u4E0E\u5408\u4F5C\u54A8\u8BE2">\u5728\u7EBF\u7559\u8A00\u83B7\u53D6\u65B9\u6848</button>
      </div>

      <h2>\u670D\u52A1\u65F6\u95F4</h2>
      <p>\u5468\u4E00\u81F3\u5468\u516D 09:00 \u2013 18:30\uFF08GMT+8\uFF09\uFF1B\u975E\u5DE5\u4F5C\u65F6\u95F4\u7559\u8A00\uFF0C\u987E\u95EE\u5C06\u4E8E\u4E0B\u4E00\u4E2A\u5DE5\u4F5C\u65E5 10 \u5206\u949F\u5185\u54CD\u5E94\u3002</p>

      <div class="cb-cards2">
        <div class="cb-card"><strong>\u6DF1\u5733\u603B\u90E8</strong><p>\u6DF1\u5733\u5E02\u7F57\u6E56\u533A\u5357\u6E56\u8857\u9053\u5609\u5317\u793E\u533A\u8FCE\u6625\u8DEF3\u53F7\u6D77\u71D5\u5927\u53A620\u5C422010</p></div>
        <div class="cb-card"><strong>\u9999\u6E2F\u4E2D\u5FC3</strong><p>\u9999\u6E2F\u4E5D\u9F99\u5C16\u6C99\u5480\uFF08\u9762\u7B7E\u4E0E\u653F\u5E9C\u9012\u4EA4\uFF0C\u9700\u63D0\u524D\u9884\u7EA6\uFF09</p></div>
      </div>
    `,
    slug: "about-contact",
    author: "\u6C38\u9E3F\u56FD\u9645",
    views: 0,
    is_top: 0,
    is_recommend: 0,
    related_ids: [11, 12, 13],
    published_at: "2026-01-01T00:00:00",
    seo_title: "\u8054\u7CFB\u6211\u4EEC|\u6C38\u9E3F\u56FD\u9645\u6DF1\u5733\u603B\u90E8\u5730\u5740\u7535\u8BDD",
    seo_description: "\u6C38\u9E3F\u56FD\u9645\u6DF1\u5733\u603B\u90E8\u5730\u5740\u3001\u5B98\u65B9\u54A8\u8BE2\u4E13\u7EBF 18123763835 \u4E0E\u90AE\u7BB1\uFF0C\u5728\u7EBF\u7559\u8A00 10 \u5206\u949F\u5185\u54CD\u5E94\u3002",
    seo_keywords: "\u8054\u7CFB\u6211\u4EEC,\u6DF1\u5733\u51FA\u6D77\u4F01\u670D,\u54A8\u8BE2\u7535\u8BDD",
    i18n_json: {
      en: {
        title: "Contact Us",
        summary: "Shenzhen headquarters \xB7 Hong Kong and Singapore hubs \u2014 call or visit us.",
        content: `
      <div class="cb-cta">
        <div class="cb-cta__body">
          <div class="cb-cta__title">Leave your contact details</div>
          <div class="cb-cta__sub">A senior consultant will send a written plan and fee list \u2014 consultation is free</div>
        </div>
        <button type="button" class="cb-cta__btn" data-inquiry="Company profile & partnership enquiry">Send an online enquiry</button>
      </div>

      <h2>Opening hours</h2>
      <p>Monday to Saturday, 09:00 \u2013 18:30 (GMT+8). Messages left outside these hours are answered within 10 minutes of the next working day.</p>

      <div class="cb-cards2">
        <div class="cb-card"><strong>Shenzhen HQ</strong><p>20/F, Haiyan Building, No.3 Yingchun Lu, Luohu District, Shenzhen</p></div>
        <div class="cb-card"><strong>Hong Kong office</strong><p>Tsim Sha Tsui, Kowloon (interviews and government filings by appointment)</p></div>
      </div>
    `,
        seo_title: "Contact Us | YONGHONG Shenzhen HQ",
        seo_description: "Address, hotline +86 18123763835 and email of YONGHONG \u2014 online enquiries answered within 10 minutes.",
        seo_keywords: "contact us,corporate services shenzhen"
      }
    },
    ext_json: { badge: "About Us \xB7 Contact" },
    status: 1
  },
  /* ======================================================================= */
  /* 3. 独立页面 —— 隐私政策 / 服务条款（PIPL 留证必须可跳转）                    */
  /* ======================================================================= */
  {
    id: 21,
    category_type: "page",
    country_id: 0,
    title: "\u9690\u79C1\u653F\u7B56",
    summary: "\u6211\u4EEC\u5982\u4F55\u6536\u96C6\u3001\u4F7F\u7528\u3001\u5B58\u50A8\u4E0E\u4FDD\u62A4\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\uFF0C\u4EE5\u53CA\u60A8\u4EAB\u6709\u7684\u6743\u5229\u3002",
    cover_url: null,
    content: `
      <p><strong>\u7248\u672C\u53F7\uFF1Av1.0\u3000\xB7\u3000\u751F\u6548\u65E5\u671F\uFF1A2026-01-01</strong></p>
      <p>\u672C\u653F\u7B56\u9002\u7528\u4E8E\u6C38\u9E3F\u56FD\u9645\u54A8\u8BE2\uFF08\u6DF1\u5733\uFF09\u6709\u9650\u516C\u53F8\uFF08\u4EE5\u4E0B\u7B80\u79F0"\u6211\u4EEC"\uFF09\u5B98\u65B9\u7F51\u7AD9\u53CA\u5728\u7EBF\u54A8\u8BE2\u670D\u52A1\u3002\u60A8\u5728\u63D0\u4EA4\u54A8\u8BE2\u8868\u5355\u524D\uFF0C\u5FC5\u987B\u52FE\u9009"\u6211\u5DF2\u9605\u8BFB\u5E76\u540C\u610F\u300A\u9690\u79C1\u653F\u7B56\u300B"\uFF0C\u6211\u4EEC\u5C06\u5728\u670D\u52A1\u5668\u8BB0\u5F55\u60A8\u7684\u540C\u610F\u65F6\u95F4\u4E0E\u672C\u653F\u7B56\u7248\u672C\u53F7\u4F5C\u4E3A\u540C\u610F\u51ED\u8BC1\u3002</p>

      <h2>\u4E00\u3001\u6211\u4EEC\u6536\u96C6\u54EA\u4E9B\u4FE1\u606F</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u60A8\u4E3B\u52A8\u63D0\u4F9B\u7684</strong><p>\u79F0\u547C\u3001\u8054\u7CFB\u7535\u8BDD\u3001\u5FAE\u4FE1/\u90AE\u7BB1\u3001\u516C\u53F8\u540D\u79F0\u3001\u9700\u6C42\u63CF\u8FF0\u3002</p></div>
        <div class="cb-card"><strong>\u81EA\u52A8\u91C7\u96C6\u7684</strong><p>IP \u5730\u5740\u3001\u6D4F\u89C8\u5668\u4E0E\u8BBE\u5907\u6807\u8BC6\u3001\u6765\u8DEF\u9875\u9762\u3001UTM \u8425\u9500\u53C2\u6570\u3001\u8BBF\u95EE\u65E5\u5FD7\u3002</p></div>
      </div>

      <h2>\u4E8C\u3001\u6211\u4EEC\u5982\u4F55\u4F7F\u7528\u8FD9\u4E9B\u4FE1\u606F</h2>
      <ul>
        <li>\u7528\u4E8E\u4E0E\u60A8\u53D6\u5F97\u8054\u7CFB\u5E76\u63D0\u4F9B\u60A8\u6240\u54A8\u8BE2\u7684\u4E1A\u52A1\u65B9\u6848\u4E0E\u62A5\u4EF7\uFF1B</li>
        <li>\u7528\u4E8E\u5C65\u884C\u6CD5\u5F8B\u6CD5\u89C4\u8981\u6C42\u7684\u5BA2\u6237\u5C3D\u804C\u8C03\u67E5\uFF08KYC\uFF09\u4E49\u52A1\uFF1B</li>
        <li>\u7528\u4E8E\u6539\u8FDB\u7F51\u7AD9\u5185\u5BB9\u4E0E\u670D\u52A1\u4F53\u9A8C\uFF08\u53BB\u6807\u8BC6\u5316\u7EDF\u8BA1\uFF09\uFF1B</li>
        <li><strong>\u6211\u4EEC\u4E0D\u4F1A\u5411\u4EFB\u4F55\u7B2C\u4E09\u65B9\u51FA\u552E\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\u3002</strong></li>
      </ul>

      <h2>\u4E09\u3001\u5B58\u50A8\u4E0E\u4FDD\u62A4</h2>
      <p>\u4E2A\u4EBA\u4FE1\u606F\u5B58\u50A8\u4E8E\u4E2D\u534E\u4EBA\u6C11\u5171\u548C\u56FD\u5883\u5185\u7684\u670D\u52A1\u5668\uFF0C\u4FDD\u5B58\u671F\u9650\u4E3A\u5B9E\u73B0\u5904\u7406\u76EE\u7684\u6240\u5FC5\u8981\u7684\u6700\u77ED\u65F6\u95F4\uFF0C\u4E00\u822C\u4E3A\u81EA\u6700\u540E\u4E00\u6B21\u8054\u7CFB\u8D77 3 \u5E74\u3002\u6211\u4EEC\u91C7\u53D6\u4F20\u8F93\u52A0\u5BC6\u3001\u540E\u53F0\u6743\u9650\u5206\u7EA7\u3001\u5217\u8868\u8131\u654F\uFF08\u624B\u673A\u53F7\u9ED8\u8BA4\u663E\u793A\u4E3A 138****8000\uFF09\u7B49\u63AA\u65BD\u3002</p>

      <h2>\u56DB\u3001\u60A8\u4EAB\u6709\u7684\u6743\u5229</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u67E5\u9605\u4E0E\u590D\u5236</strong><p>\u60A8\u6709\u6743\u67E5\u9605\u3001\u590D\u5236\u6211\u4EEC\u6301\u6709\u7684\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\u3002</p></div>
        <div class="cb-card"><strong>\u66F4\u6B63\u4E0E\u8865\u5145</strong><p>\u4FE1\u606F\u6709\u8BEF\u65F6\u53EF\u8981\u6C42\u66F4\u6B63\u3002</p></div>
        <div class="cb-card"><strong>\u5220\u9664</strong><p>\u5728\u6CD5\u5B9A\u60C5\u5F62\u4E0B\u53EF\u8981\u6C42\u5220\u9664\u3002</p></div>
        <div class="cb-card"><strong>\u64A4\u56DE\u540C\u610F</strong><p>\u60A8\u53EF\u968F\u65F6\u64A4\u56DE\u540C\u610F\uFF0C\u64A4\u56DE\u4E0D\u5F71\u54CD\u6B64\u524D\u5904\u7406\u7684\u6548\u529B\u3002</p></div>
      </div>

      <h2>\u4E94\u3001\u8054\u7CFB\u6211\u4EEC</h2>
      <p>\u5982\u5BF9\u672C\u653F\u7B56\u6709\u4EFB\u4F55\u7591\u95EE\uFF0C\u6216\u884C\u4F7F\u4E0A\u8FF0\u6743\u5229\uFF0C\u8BF7\u53D1\u9001\u90AE\u4EF6\u81F3 <strong>805856285@qq.com</strong>\uFF0C\u6216\u81F4\u7535 <strong>18123763835</strong>\u3002\u6211\u4EEC\u5C06\u5728 15 \u4E2A\u5DE5\u4F5C\u65E5\u5185\u7B54\u590D\u3002</p>

      <h2>\u516D\u3001\u653F\u7B56\u66F4\u65B0</h2>
      <p>\u672C\u653F\u7B56\u53D1\u751F\u5B9E\u8D28\u53D8\u66F4\u65F6\uFF0C\u6211\u4EEC\u5C06\u63D0\u5347\u7248\u672C\u53F7\u5E76\u5728\u672C\u9875\u516C\u793A\u3002\u65B0\u7684\u7248\u672C\u53F7\u5C06\u7528\u4E8E\u540E\u7EED\u65B0\u7684\u540C\u610F\u8BB0\u5F55\uFF0C\u5386\u53F2\u540C\u610F\u51ED\u8BC1\u4ECD\u5BF9\u5E94\u5F53\u65F6\u7684\u7248\u672C\u3002</p>
    `,
    slug: "privacy-policy",
    author: "\u6C38\u9E3F\u56FD\u9645",
    views: 0,
    is_top: 0,
    is_recommend: 0,
    related_ids: [22],
    published_at: "2026-01-01T00:00:00",
    seo_title: "\u9690\u79C1\u653F\u7B56|\u6C38\u9E3F\u56FD\u9645\u4E2A\u4EBA\u4FE1\u606F\u4FDD\u62A4",
    seo_description: "\u6C38\u9E3F\u56FD\u9645\u9690\u79C1\u653F\u7B56 v1.0\uFF1A\u6536\u96C6\u8303\u56F4\u3001\u4F7F\u7528\u76EE\u7684\u3001\u5B58\u50A8\u671F\u9650\u3001\u8131\u654F\u63AA\u65BD\u4E0E\u60A8\u4EAB\u6709\u7684\u67E5\u9605/\u66F4\u6B63/\u5220\u9664/\u64A4\u56DE\u540C\u610F\u6743\u5229\u3002",
    seo_keywords: "\u9690\u79C1\u653F\u7B56,\u4E2A\u4EBA\u4FE1\u606F\u4FDD\u62A4,PIPL",
    i18n_json: {
      en: {
        title: "Privacy Policy",
        summary: "How we collect, use, store and protect your personal information, and the rights available to you.",
        content: `
      <p><strong>Version v1.0 \xB7 Effective 1 January 2026</strong></p>
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
      <p>Data is stored on servers within the People's Republic of China for the shortest period necessary \u2014 normally three years after your last contact. We use encrypted transport, tiered back-office permissions and masked listing (phone shown as 138****8000 by default).</p>

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
        seo_title: "Privacy Policy | YONGHONG",
        seo_description: "YONGHONG Privacy Policy v1.0 \u2014 what we collect, why, how long we keep it and the rights you can exercise.",
        seo_keywords: "privacy policy,personal information,PIPL"
      }
    },
    ext_json: {},
    status: 1
  },
  {
    id: 22,
    category_type: "page",
    country_id: 0,
    title: "\u670D\u52A1\u6761\u6B3E",
    summary: "\u4F7F\u7528\u672C\u7F51\u7AD9\u4E0E\u5728\u7EBF\u54A8\u8BE2\u670D\u52A1\u7684\u6CD5\u5F8B\u6761\u6B3E\u4E0E\u53CC\u65B9\u6743\u5229\u4E49\u52A1\u3002",
    cover_url: null,
    content: `
      <p><strong>\u7248\u672C\u53F7\uFF1Av1.0\u3000\xB7\u3000\u751F\u6548\u65E5\u671F\uFF1A2026-01-01</strong></p>

      <h2>\u4E00\u3001\u670D\u52A1\u6027\u8D28</h2>
      <p>\u672C\u7F51\u7AD9\u63D0\u4F9B\u7684\u5185\u5BB9\u4EC5\u4F9B\u53C2\u8003\uFF0C\u4E0D\u6784\u6210\u6CD5\u5F8B\u3001\u7A0E\u52A1\u6216\u6295\u8D44\u610F\u89C1\u3002\u5177\u4F53\u670D\u52A1\u4EE5\u53CC\u65B9\u53E6\u884C\u7B7E\u7F72\u7684\u4E66\u9762\u59D4\u6258\u534F\u8BAE\u4E3A\u51C6\u3002</p>

      <h2>\u4E8C\u3001\u7F51\u7AD9\u4F7F\u7528\u89C4\u8303</h2>
      <ul>
        <li>\u4E0D\u5F97\u5229\u7528\u672C\u7AD9\u4ECE\u4E8B\u4EFB\u4F55\u8FDD\u6CD5\u8FDD\u89C4\u6D3B\u52A8\uFF1B</li>
        <li>\u4E0D\u5F97\u4EE5\u722C\u866B\u3001\u811A\u672C\u7B49\u65B9\u5F0F\u5E72\u6270\u7F51\u7AD9\u6B63\u5E38\u8FD0\u884C\uFF1B</li>
        <li>\u4E0D\u5F97\u5192\u7528\u4ED6\u4EBA\u8EAB\u4EFD\u63D0\u4EA4\u54A8\u8BE2\u4FE1\u606F\u3002</li>
      </ul>

      <h2>\u4E09\u3001\u77E5\u8BC6\u4EA7\u6743</h2>
      <p>\u672C\u7AD9\u7684\u6587\u5B57\u3001\u56FE\u7247\u3001\u7248\u5F0F\u4E0E\u6807\u8BC6\u5F52\u6C38\u9E3F\u56FD\u9645\u6216\u5176\u6743\u5229\u4EBA\u6240\u6709\u3002\u672A\u7ECF\u4E66\u9762\u8BB8\u53EF\uFF0C\u4E0D\u5F97\u590D\u5236\u3001\u8F6C\u8F7D\u6216\u7528\u4E8E\u5546\u4E1A\u7528\u9014\u3002</p>

      <h2>\u56DB\u3001\u514D\u8D23\u4E0E\u9650\u5236</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u5BA1\u6279\u7ED3\u679C</strong><p>\u653F\u5E9C\u4E0E\u94F6\u884C\u7684\u5BA1\u6279\u7ED3\u679C\u7531\u4E3B\u7BA1\u673A\u5173\u72EC\u7ACB\u51B3\u5B9A\uFF0C\u6211\u65B9\u4E0D\u627F\u8BFA\u5FC5\u7136\u901A\u8FC7\u3002</p></div>
        <div class="cb-card"><strong>\u7B2C\u4E09\u65B9\u7F51\u7AD9</strong><p>\u53CB\u60C5\u94FE\u63A5\u6307\u5411\u7684\u7B2C\u4E09\u65B9\u7F51\u7AD9\uFF0C\u5176\u5185\u5BB9\u4E0E\u9690\u79C1 practices \u7531\u8BE5\u65B9\u8D1F\u8D23\u3002</p></div>
      </div>

      <h2>\u4E94\u3001\u8D39\u7528\u4E0E\u9000\u6B3E</h2>
      <p>\u6240\u6709\u8D39\u7528\u4EE5\u4E66\u9762\u62A5\u4EF7\u5355\u4E3A\u51C6\uFF1B\u56E0\u6211\u65B9\u539F\u56E0\u672A\u80FD\u5B8C\u6210\u59D4\u6258\u4E8B\u9879\u7684\uFF0C\u6309\u59D4\u6258\u534F\u8BAE\u7EA6\u5B9A\u9000\u8FD8\u76F8\u5E94\u670D\u52A1\u8D39\u3002</p>

      <h2>\u516D\u3001\u9002\u7528\u6CD5\u5F8B\u4E0E\u4E89\u8BAE\u89E3\u51B3</h2>
      <p>\u672C\u6761\u6B3E\u9002\u7528\u4E2D\u534E\u4EBA\u6C11\u5171\u548C\u56FD\u6CD5\u5F8B\u3002\u4E89\u8BAE\u53CC\u65B9\u5E94\u5148\u53CB\u597D\u534F\u5546\uFF1B\u534F\u5546\u4E0D\u6210\u7684\uFF0C\u63D0\u4EA4\u6211\u65B9\u6240\u5728\u5730\u6709\u7BA1\u8F96\u6743\u7684\u4EBA\u6C11\u6CD5\u9662\u8BC9\u8BBC\u89E3\u51B3\u3002</p>

      <h2>\u4E03\u3001\u8054\u7CFB\u6211\u4EEC</h2>
      <p>\u90AE\u7BB1 <strong>805856285@qq.com</strong>\u3000\u7535\u8BDD <strong>18123763835</strong></p>
    `,
    slug: "terms-of-service",
    author: "\u6C38\u9E3F\u56FD\u9645",
    views: 0,
    is_top: 0,
    is_recommend: 0,
    related_ids: [21],
    published_at: "2026-01-01T00:00:00",
    seo_title: "\u670D\u52A1\u6761\u6B3E|\u6C38\u9E3F\u56FD\u9645\u7F51\u7AD9\u4F7F\u7528\u6761\u6B3E",
    seo_description: "\u6C38\u9E3F\u56FD\u9645\u670D\u52A1\u6761\u6B3E v1.0\uFF1A\u7F51\u7AD9\u4F7F\u7528\u89C4\u8303\u3001\u77E5\u8BC6\u4EA7\u6743\u3001\u514D\u8D23\u9650\u5236\u3001\u8D39\u7528\u9000\u6B3E\u4E0E\u4E89\u8BAE\u89E3\u51B3\u3002",
    seo_keywords: "\u670D\u52A1\u6761\u6B3E,\u7F51\u7AD9\u6761\u6B3E,\u4F7F\u7528\u534F\u8BAE",
    i18n_json: {
      en: {
        title: "Terms of Service",
        summary: "Legal terms governing the use of this website and our online consultation services.",
        content: `
      <p><strong>Version v1.0 \xB7 Effective 1 January 2026</strong></p>

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
      <p>Email <strong>805856285@qq.com</strong>\u3000Phone <strong>+86 18123763835</strong></p>
    `,
        seo_title: "Terms of Service | YONGHONG",
        seo_description: "YONGHONG Terms of Service v1.0 \u2014 acceptable use, IP, disclaimers, fees and governing law.",
        seo_keywords: "terms of service,terms of use"
      }
    },
    ext_json: {},
    status: 1
  }
];
var featuredArticles = articles.filter((a) => a.category_type === "news" || a.category_type === "guide");

// ../../frontend/server/utils/mock/content.ts
var countries = [
  { id: 1, code: "HK", name: "\u4E2D\u56FD\u9999\u6E2F", en_name: "Hong Kong", icon_url: "", sort_order: 1, status: 1 },
  { id: 2, code: "SG", name: "\u65B0\u52A0\u5761", en_name: "Singapore", icon_url: "", sort_order: 2, status: 1 },
  { id: 3, code: "US", name: "\u7F8E\u56FD", en_name: "United States", icon_url: "", sort_order: 3, status: 1 },
  { id: 4, code: "CN", name: "\u4E2D\u56FD\u5185\u5730", en_name: "Mainland China", icon_url: "", sort_order: 4, status: 1 }
];
var banners = [
  {
    id: 1,
    position: "home",
    poster_type: "cr",
    image_url: null,
    tag: "\u{1F1ED}\u{1F1F0} \u9999\u6E2F\u516C\u53F8\u8BBE\u7ACB \xB7 2026\u5408\u89C4\u65B0\u89C4",
    title: "\u9999\u6E2F\u516C\u53F8\u8BBE\u7ACB\xB7\u6781\u901F\u4E0B\u8BC1",
    desc: "\u6301\u724C\u79D8\u4E66\u5408\u89C4\u6258\u7BA1\uFF0C\u4E00\u7AD9\u5F0F\u89E3\u51B3\u6CE8\u518C\u3001\u5E74\u5BA1\u3001\u5F00\u6237\u53CA\u505A\u8D26\u5BA1\u8BA1\u75DB\u70B9\uFF0C\u7279\u8BBE\u5305\u5F00\u6237\u7EFF\u8272\u901A\u9053\u3002",
    price_text: "\u7279\u60E0 \xA54580\u8D77",
    button_text: "\u7ACB\u5373\u83B7\u53D6\u5E95\u4EF7\u65B9\u6848",
    button_link: null,
    sort_order: 1,
    status: 1,
    i18n_json: {
      en: {
        tag: "\u{1F1ED}\u{1F1F0} Hong Kong Company Setup \xB7 2026 Compliance Update",
        title: "Hong Kong Company Setup \xB7 Fast Track",
        desc: "Licensed company-secretary handling \u2014 one stop for registration, annual return, bank account and audit, with a guaranteed account-opening channel.",
        price_text: "From \xA54,580",
        button_text: "Get the best quote now"
      }
    }
  },
  {
    id: 2,
    position: "home",
    poster_type: "bank",
    image_url: null,
    tag: "\u{1F3E6} \u73AF\u7403\u79BB\u5CB8\u94F6\u884C \xB7 \u89C6\u9891\u8FDC\u7A0B\u5F00\u6237",
    title: "\u73AF\u7403\u79BB\u5CB8\u94F6\u884C\xB7\u5305\u4E0B\u6237\u901A\u9053",
    desc: "\u9999\u6E2F/\u65B0\u52A0\u5761/\u7F8E\u56FD\u9876\u5C16\u94F6\u884C\u76F4\u8054\uFF0C\u65E0\u9700\u4EB2\u81EA\u8FC7\u6E2F\uFF0C\u4E13\u4E1A\u8D44\u6DF1\u94F6\u884C\u5F00\u6237\u7ECF\u7406 1\u5BF91 \u8F85\u5BFC\u5305\u8FC7\u3002",
    price_text: "\u7EFF\u8272\u5305\u5F00\u901A\u9053",
    button_text: "\u514D\u8D39\u8BC4\u4F30\u5F00\u6237\u8D44\u683C",
    button_link: null,
    sort_order: 2,
    status: 1,
    i18n_json: {
      en: {
        tag: "\u{1F3E6} Global Offshore Banking \xB7 Remote Video Onboarding",
        title: "Global Offshore Accounts \xB7 Guaranteed Opening",
        desc: "Direct access to top banks in Hong Kong, Singapore and the US \u2014 no travel required, with senior relationship managers coaching you 1-on-1.",
        price_text: "Guaranteed channel",
        button_text: "Check my eligibility free"
      }
    }
  },
  {
    id: 3,
    position: "home",
    poster_type: "cpa",
    image_url: null,
    tag: "\u2122\uFE0F \u56FD\u9645\u54C1\u724C\u5E03\u5C40 \xB7 \u9999\u6E2F\u6301\u724C\u5BA1\u8BA1",
    title: "\u56FD\u9645\u54C1\u724C\u51FA\u6D77\xB7\u5408\u89C4\u5BA1\u8BA1\u7B79\u5212",
    desc: "\u9A6C\u5FB7\u91CC\u56FD\u9645\u5546\u6807\u5FEB\u901F\u6CE8\u518C\uFF0C\u9999\u6E2F\u6267\u4E1A\u4F1A\u8BA1\u5E08(CPA)\u6B63\u89C4\u505A\u8D26\u5BA1\u8BA1\u51FA\u5177\u62A5\u544A\uFF0C\u5408\u89C4\u65E0\u5FE7\u3002",
    price_text: "1\u5BF91\u8D44\u6DF1\u65B9\u6848",
    button_text: "\u9884\u7EA6\u8D44\u6DF1\u8D22\u7A0E\u987E\u95EE",
    button_link: null,
    sort_order: 3,
    status: 1,
    i18n_json: {
      en: {
        tag: "\u2122\uFE0F Global Branding \xB7 Hong Kong Licensed Audit",
        title: "Go Global \xB7 Compliant Audit & Trademark",
        desc: "Fast Madrid trademark registration and proper bookkeeping/audit reports issued by Hong Kong certified practising accountants.",
        price_text: "1-on-1 senior plan",
        button_text: "Book a senior tax advisor"
      }
    }
  }
];
var homeProcess = configSeeds.find((s) => s.config_key === "home_process");
var genericStepsZh = [
  { name: "\u63D0\u4EA4\u529E\u7406\u8D44\u6599", desc: "\u5728\u7EBF\u586B\u5199\u4E1A\u52A1\u9700\u6C42\uFF0C\u4E13\u5C5E\u987E\u95EE 10 \u5206\u949F\u5185\u4E0E\u60A8\u5BF9\u63A5", time: "10\u5206\u949F" },
  { name: "\u6301\u724C\u987E\u95EE\u5BA1\u6838", desc: "\u6838\u5BF9\u8BC1\u4EF6\u4E0E\u65B9\u6848\u6761\u6B3E\uFF0C\u51FA\u5177\u4E66\u9762\u98CE\u9669\u63D0\u793A\u4E0E\u8D39\u7528\u6E05\u5355", time: "1\u5C0F\u65F6" },
  { name: "\u9012\u4EA4\u5B98\u65B9\u53D7\u7406", desc: "\u901A\u8FC7\u4E13\u5C5E\u653F\u5E9C/\u94F6\u884C\u901A\u9053\u76F4\u5448\u7CFB\u7EDF\uFF0C\u5408\u89C4\u52A0\u901F\u5BA1\u6279", time: "1-3\u4E2A\u5DE5\u4F5C\u65E5" },
  { name: "\u4EA4\u4ED8\u6210\u679C\u51ED\u8BC1", desc: "\u8BC1\u4E66\u3001\u5370\u7AE0\u3001\u8D26\u6237\u6216\u62A5\u544A\u987A\u4E30\u4FDD\u4EF7\u5305\u90AE\u5230\u624B", time: "1\u4E2A\u5DE5\u4F5C\u65E5" }
];
var services = [
  {
    id: 1,
    category: "company_reg",
    country_id: 1,
    title: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C",
    sub_title: "\u6781\u901F\u4E0B\u8BC1 \xB7 \u6301\u724C\u79D8\u4E66\u5408\u89C4\u6258\u7BA1",
    summary: "\u4E16\u754C\u91D1\u878D\u4E2D\u5FC3\uFF0C\u81EA\u7531\u7684\u5546\u8D38\u6E2F\u53E3\uFF0C\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u4FBF\u4E8E\u63D0\u5347\u516C\u53F8\u56FD\u9645\u54C1\u724C\u5F62\u8C61\u53CA\u5F00\u62D3\u6D77\u5916\u4E1A\u52A1\u3002",
    badge_text: "\u4F01\u4E1A\u7EA7\u5408\u89C4",
    price_text: "\xA54580 \u5143\u8D77",
    slug: "hk-company-registration",
    cover_url: null,
    content: `
      <p>\u9999\u6E2F\u662F\u5168\u7403\u6700\u81EA\u7531\u7684\u7ECF\u6D4E\u4F53\u4E4B\u4E00\uFF0C\u5B9E\u884C\u7B80\u5355\u4F4E\u7A0E\u5236\u3001\u65E0\u5916\u6C47\u7BA1\u5236\uFF0C\u662F\u4E2D\u8D44\u4F01\u4E1A\u8BBE\u7ACB\u6D77\u5916\u603B\u90E8\u4E0E\u8D44\u91D1\u4E2D\u8F6C\u7684\u9996\u9009\u5730\u3002</p>
      <h2>\u529E\u7406\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\uFF0C\u60A8\u5C06\u83B7\u5F97</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">1 \u5929</div><div class="cb-card__label">\u7535\u5B50\u6CE8\u518C\u6700\u5FEB\u4E0B\u8BC1</div></div>
        <div class="cb-card"><div class="cb-card__value">0 \u5916\u6C47</div><div class="cb-card__label">\u65E0\u5916\u6C47\u7BA1\u5236\u81EA\u7531\u6536\u4ED8</div></div>
        <div class="cb-card"><div class="cb-card__value">8.25%</div><div class="cb-card__label">\u5229\u5F97\u7A0E\u4E24\u7EA7\u5236\u7A0E\u7387</div></div>
        <div class="cb-card"><div class="cb-card__value">\u5168\u7403</div><div class="cb-card__label">\u56FD\u9645\u54C1\u724C\u5F62\u8C61\u80CC\u4E66</div></div>
      </div>
      <h2>\u6CE8\u518C\u6240\u9700\u8D44\u6599</h2>
      <ul>
        <li>\u62DF\u7528\u516C\u53F8\u540D\u79F0\uFF08\u4E2D\u82F1\u6587\u5404\u4E00\u4E2A\uFF0C\u9700\u5148\u67E5\u518C\uFF09</li>
        <li>\u8463\u4E8B\u53CA\u80A1\u4E1C\u7684\u6709\u6548\u8EAB\u4EFD\u8BC1\u4EF6 / \u62A4\u7167</li>
        <li>\u8463\u4E8B\u53CA\u80A1\u4E1C\u7684\u4F4F\u5740\u8BC1\u660E\uFF08\u8FD1 3 \u4E2A\u6708\uFF09</li>
        <li>\u6CE8\u518C\u8D44\u672C\uFF08\u6807\u51C6 10,000 \u80A1\uFF0C\u65E0\u9700\u9A8C\u8D44\uFF09</li>
      </ul>
      <h2>\u8D39\u7528\u5305\u542B</h2>
      <p>\u653F\u5E9C\u89C4\u8D39\u3001\u6CD5\u5B9A\u6CE8\u518C\u5730\u5740\u3001\u516C\u53F8\u79D8\u4E66\u670D\u52A1\u3001\u7CBE\u7F8E\u7EFF\u76D2\uFF08\u542B\u94A2\u5370\u3001\u5C0F\u5706\u7AE0\u3001\u7AE0\u7A0B\u3001\u80A1\u7968\u672C\uFF09\u3001\u987A\u4E30\u4FDD\u4EF7\u5305\u90AE\u3002</p>
      <blockquote>\u6240\u6709\u65B9\u6848\u5747\u51FA\u5177\u4E66\u9762\u98CE\u9669\u63D0\u793A\u4E0E\u8D39\u7528\u6E05\u5355\uFF1B\u5982\u67E5\u518C\u4E0D\u901A\u8FC7\uFF0C\u6CE8\u518C\u8D39\u5168\u989D\u9000\u8FD8\u3002</blockquote>
    `,
    process_steps: homeProcess.zh.steps,
    related_ids: [1],
    views: 0,
    sort_order: 1,
    is_recommended: 1,
    is_home_show: 1,
    seo_title: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C|1\u5929\u4E0B\u8BC1|\u6C38\u9E3F\u56FD\u9645",
    seo_description: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C\u52A0\u6025\u6700\u5FEB1\u5929\u4E0B\u8BC1\uFF0C\u542B\u653F\u5E9C\u89C4\u8D39\u3001\u6CD5\u5B9A\u5730\u5740\u3001\u516C\u53F8\u79D8\u4E66\u4E0E\u7EFF\u76D2\uFF0C\u6301\u724C\u987E\u95EE\u5168\u7A0B\u4EE3\u529E\u3002",
    seo_keywords: "\u9999\u6E2F\u516C\u53F8\u6CE8\u518C,\u9999\u6E2F\u6CE8\u518C\u516C\u53F8,\u9999\u6E2F\u516C\u53F8\u8BBE\u7ACB",
    i18n_json: {
      en: {
        title: "Hong Kong Company Registration",
        sub_title: "Fast track \xB7 Licensed company secretary",
        summary: "A free port and world-class financial centre \u2014 a Hong Kong company strengthens your international brand and opens up overseas business.",
        content: `
      <p>Hong Kong is one of the world's freest economies, with a simple low-tax regime and no exchange controls \u2014 the top choice for Chinese enterprises setting up a regional headquarters.</p>
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
        seo_title: "Hong Kong Company Registration | 1-day Certificate | YONGHONG",
        seo_description: "Hong Kong company registration in as fast as 1 day \u2014 government fees, statutory address, secretary and green box included.",
        seo_keywords: "hong kong company registration,hong kong incorporate",
        badge_text: "Fully compliant",
        price_text: "From \xA54,580",
        // en 必须显式给 price/unit：localize() 会把 zh 的 ext_json 浅合并进来，
        // 不覆盖 unit 的话英文页会显示中文「元起」
        ext_json: { btn_text: "Apply now \u2192", price: "4,580", unit: "" }
      }
    },
    ext_json: { gradient: "from-emerald-500 to-teal-600", icon: "fa-building-columns", price: "4580", unit: "\u5143\u8D77", btn_text: "\u6211\u8981\u529E\u7406 \u2192" },
    status: 1
  },
  {
    id: 2,
    category: "annual_audit",
    country_id: 1,
    title: "\u9999\u6E2F\u516C\u53F8\u5E74\u5BA1",
    sub_title: "\u5468\u5E74\u7533\u62A5 \xB7 \u4E13\u4EBA\u667A\u80FD\u9884\u8B66",
    summary: "\u5728\u9999\u6E2F\u6CE8\u518C\u516C\u53F8\u540E\u5ACC\u5E74\u5BA1\u7E41\u7410\uFF1F\u4EA4\u7ED9\u6C38\u9E3F\u56FD\u9645\u4E13\u4E1A\u79D8\u4E66\u56E2\u961F\uFF0C\u4E13\u4EBA\u667A\u80FD\u9884\u8B66\uFF0C\u8BA9\u60A8\u5F7B\u5E95\u7701\u5FC3\u653E\u5FC3\u3002",
    badge_text: "\u4F01\u4E1A\u7EA7\u5408\u89C4",
    price_text: "\xA52980 \u5143\u8D77",
    slug: "hk-company-annual-return",
    cover_url: null,
    content: `
      <p>\u9999\u6E2F\u516C\u53F8\u6210\u7ACB\u6EE1 12 \u4E2A\u6708\u540E\u987B\u529E\u7406\u5468\u5E74\u7533\u62A5\uFF08NAR1\uFF09\u5E76\u6362\u9886\u5546\u4E1A\u767B\u8BB0\u8BC1\uFF08BR\uFF09\uFF0C\u903E\u671F\u5C06\u4EA7\u751F\u9AD8\u989D\u7F5A\u6B3E\u751A\u81F3\u88AB\u6CD5\u9662\u4F20\u7968\u3002</p>
      <h2>\u5E74\u5BA1\u670D\u52A1\u5185\u5BB9</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u5468\u5E74\u7533\u62A5\u8868 NAR1</strong><p>\u5411\u516C\u53F8\u6CE8\u518C\u5904\u9012\u4EA4\u4E0A\u5E74\u5EA6\u516C\u53F8\u8D44\u6599\u53D8\u66F4\u7533\u62A5\u3002</p></div>
        <div class="cb-card"><strong>\u6362\u9886\u5546\u4E1A\u767B\u8BB0\u8BC1 BR</strong><p>\u5411\u7A0E\u52A1\u5C40\u7EED\u671F\u5546\u4E1A\u767B\u8BB0\uFF0C\u907F\u514D\u7F5A\u6B3E\u4E0E\u7ECF\u8425\u53D7\u9650\u3002</p></div>
        <div class="cb-card"><strong>\u6CD5\u5B9A\u5730\u5740\u4E0E\u79D8\u4E66\u7EED\u671F</strong><p>\u7EF4\u6301\u6CE8\u518C\u5730\u5740\u4E0E\u516C\u53F8\u79D8\u4E66\uFF0C\u4FDD\u969C\u5408\u89C4\u5B58\u7EED\u3002</p></div>
        <div class="cb-card"><strong>\u667A\u80FD\u5230\u671F\u9884\u8B66</strong><p>\u5230\u671F\u524D 30/15/7 \u5929\u4E09\u91CD\u63D0\u9192\uFF0C\u7EDD\u4E0D\u9057\u6F0F\u3002</p></div>
      </div>
      <blockquote>\u903E\u671F 42 \u5929\u4EE5\u5185\u7F5A\u6B3E HK$870\uFF1B\u8D85\u8FC7 42 \u5929\u7F5A\u6B3E\u5C06\u9010\u7EA7\u9012\u589E\uFF0C\u6700\u9AD8\u53EF\u8FBE HK$5,000 \u5E76\u53EF\u80FD\u6536\u5230\u6CD5\u9662\u4F20\u7968\u3002</blockquote>
    `,
    process_steps: genericStepsZh,
    related_ids: [],
    views: 0,
    sort_order: 2,
    is_recommended: 1,
    is_home_show: 1,
    seo_title: "\u9999\u6E2F\u516C\u53F8\u5E74\u5BA1|\u5468\u5E74\u7533\u62A5|\u6C38\u9E3F\u56FD\u9645",
    seo_description: "\u9999\u6E2F\u516C\u53F8\u5E74\u5BA1\u5468\u5E74\u7533\u62A5\u4E0E\u5546\u4E1A\u767B\u8BB0\u8BC1\u7EED\u671F\u4E00\u7AD9\u5F0F\u4EE3\u529E\uFF0C\u5230\u671F\u524D\u4E09\u91CD\u63D0\u9192\uFF0C\u903E\u671F\u8865\u529E\u4EA6\u53EF\u5904\u7406\u3002",
    seo_keywords: "\u9999\u6E2F\u516C\u53F8\u5E74\u5BA1,\u9999\u6E2F\u5468\u5E74\u7533\u62A5,\u9999\u6E2F\u5546\u4E1A\u767B\u8BB0\u8BC1",
    i18n_json: {
      en: {
        title: "Hong Kong Annual Return",
        sub_title: "Annual filing \xB7 Proactive deadline alerts",
        summary: "Tired of the annual return? Our professional secretaries track every deadline so you never have to.",
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
        seo_title: "Hong Kong Annual Return | YONGHONG",
        seo_description: "One-stop Hong Kong annual return and business registration renewal with triple deadline reminders.",
        seo_keywords: "hong kong annual return,hong kong business registration",
        badge_text: "Fully compliant",
        price_text: "From \xA52,980",
        ext_json: { btn_text: "Apply now \u2192", price: "2,980", unit: "" }
      }
    },
    ext_json: { gradient: "from-amber-500 to-amber-600", icon: "fa-user-check", price: "2980", unit: "\u5143\u8D77", btn_text: "\u6211\u8981\u529E\u7406 \u2192" },
    status: 1
  },
  {
    id: 3,
    category: "bank_acct",
    country_id: 1,
    title: "\u9999\u6E2F\u94F6\u884C\u5F00\u6237",
    sub_title: "\u89C6\u9891\u8FDC\u7A0B\u89C1\u8BC1 \xB7 \u5305\u4E0B\u6237\u901A\u9053",
    summary: "\u4E2A\u4EBA\u5F00\u7ACB\u9999\u6E2F\u516C\u53F8\u8D26\u6237\u96BE\uFF1F\u6C38\u9E3F\u56FD\u9645\u7279\u6B8A\u94F6\u884C\u5305\u5F00\u7EFF\u8272\u6E20\u9053\uFF0C\u89C6\u9891\u8FDC\u7A0B\u89C1\u8BC1\uFF0C\u52A9\u529B\u9AD8\u6548\u5F00\u6237\u3002",
    badge_text: "\u4F01\u4E1A\u7EA7\u5408\u89C4",
    price_text: "\xA52000 \u5143\u8D77",
    slug: "hk-bank-account-opening",
    cover_url: null,
    content: `
      <p>\u6211\u4EEC\u4E0E\u6C47\u4E30\u3001\u6E23\u6253\u3001\u534E\u4FA8\u3001\u4E1C\u4E9A\u7B49\u94F6\u884C\u5EFA\u7ACB\u603B\u884C\u76F4\u8054\u6E20\u9053\uFF0C\u5BA2\u6237\u7ECF\u7406\u8FDC\u7A0B\u89C6\u9891\u89C1\u8BC1\u5373\u53EF\u5B8C\u6210\u9762\u7B7E\uFF0C\u65E0\u9700\u4EB2\u81EA\u8D74\u6E2F\u3002</p>
      <h2>\u5F00\u6237\u524D\u6211\u4EEC\u4F1A\u505A\u7684\u51C6\u5907</h2>
      <ul>
        <li>\u6309\u60A8\u7684\u884C\u4E1A\u4E0E\u8D44\u91D1\u6D41\u5411\u5339\u914D\u6700\u5408\u9002\u7684\u94F6\u884C</li>
        <li>\u9884\u5BA1 KYC \u6750\u6599\uFF0C\u63D0\u524D\u89C4\u907F\u88AB\u62D2\u98CE\u9669</li>
        <li>\u6A21\u62DF\u94F6\u884C\u9762\u7B7E\u95EE\u7B54\uFF0C\u9010\u6761\u8F85\u5BFC\u901A\u5173\u8981\u70B9</li>
        <li>\u6574\u7406\u4E1A\u52A1\u5408\u540C\u3001\u53D1\u7968\u3001\u7F51\u7AD9\u7B49\u4F50\u8BC1\u8D44\u6599</li>
      </ul>
      <h2>\u5F00\u6237\u5468\u671F</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">2 \u5468</div><div class="cb-card__label">\u6C47\u4E30/\u6E23\u6253\u5178\u578B\u4E0B\u6237</div></div>
        <div class="cb-card"><div class="cb-card__value">1-2 \u5468</div><div class="cb-card__label">\u534E\u4FA8\u94F6\u884C</div></div>
        <div class="cb-card"><div class="cb-card__value">10 \u5929</div><div class="cb-card__label">\u4E1C\u4E9A\u94F6\u884C</div></div>
        <div class="cb-card"><div class="cb-card__value">98.6%</div><div class="cb-card__label">\u6211\u4EEC\u7684\u901A\u8FC7\u7387</div></div>
      </div>
    `,
    process_steps: genericStepsZh,
    related_ids: [],
    views: 0,
    sort_order: 3,
    is_recommended: 1,
    is_home_show: 1,
    seo_title: "\u9999\u6E2F\u94F6\u884C\u5F00\u6237|\u89C6\u9891\u8FDC\u7A0B\u89C1\u8BC1|\u6C38\u9E3F\u56FD\u9645",
    seo_description: "\u9999\u6E2F\u516C\u53F8\u94F6\u884C\u5F00\u6237\u514D\u8D74\u6E2F\u89C6\u9891\u89C1\u8BC1\uFF0C\u6C47\u4E30\u6E23\u6253\u534E\u4FA8\u4E1C\u4E9A\u603B\u884C\u76F4\u8054\uFF0CKYC \u8F85\u5BFC\u901A\u5173\uFF0C\u901A\u8FC7\u7387 98.6%\u3002",
    seo_keywords: "\u9999\u6E2F\u94F6\u884C\u5F00\u6237,\u79BB\u5CB8\u8D26\u6237,\u6C47\u4E30\u5F00\u6237,\u6E23\u6253\u5F00\u6237",
    i18n_json: {
      en: {
        title: "Hong Kong Bank Account Opening",
        sub_title: "Remote video witnessing \xB7 Guaranteed channel",
        summary: "Hard to open a Hong Kong corporate account? Our green channel offers remote video witnessing for a smooth opening.",
        content: `
      <p>We work directly with HSBC, Standard Chartered, OCBC and BEA so that a relationship manager can witness your interview by video \u2014 no travel to Hong Kong.</p>
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
        <div class="cb-card"><div class="cb-card__value">1\u20132 weeks</div><div class="cb-card__label">OCBC</div></div>
        <div class="cb-card"><div class="cb-card__value">10 days</div><div class="cb-card__label">BEA</div></div>
        <div class="cb-card"><div class="cb-card__value">98.6%</div><div class="cb-card__label">Our approval rate</div></div>
      </div>
    `,
        seo_title: "Hong Kong Bank Account | Remote Video Witnessing | YONGHONG",
        seo_description: "Open a Hong Kong corporate account without travelling \u2014 video witnessing, KYC coaching, 98.6% approval.",
        seo_keywords: "hong kong bank account,offshore account,hsbc account",
        badge_text: "Fully compliant",
        price_text: "From \xA52,000",
        ext_json: { btn_text: "Apply now \u2192", price: "2,000", unit: "" }
      }
    },
    ext_json: { gradient: "from-teal-600 to-emerald-700", icon: "fa-vault", price: "2000", unit: "\u5143\u8D77", btn_text: "\u6211\u8981\u529E\u7406 \u2192" },
    status: 1
  },
  {
    id: 4,
    category: "annual_audit",
    country_id: 1,
    title: "\u9999\u6E2F\u5BA1\u8BA1\u62A5\u7A0E",
    sub_title: "\u6301\u724C CPA \xB7 \u65E0\u4FDD\u7559\u610F\u89C1",
    summary: "\u4EE3\u7406\u9999\u6E2F\u516C\u53F8\u8D22\u7A0E\u5BA1\u8BA1\u600E\u4E48\u505A\u6700\u7701\u5FC3\uFF1F\u9999\u6E2F\u6301\u724C\u6267\u4E1A\u4F1A\u8BA1\u5E08(CPA)\uFF0C\u8BA9\u6C38\u9E3F\u6765\u4E3A\u60A8\u201C\u91D1\u201D\u6253\u7EC6\u7B97\u3002",
    badge_text: "\u4F01\u4E1A\u7EA7\u5408\u89C4",
    price_text: "\xA52980 \u5143\u8D77",
    slug: "hk-audit-tax-filing",
    cover_url: null,
    content: `
      <p>\u9999\u6E2F\u5229\u5F97\u7A0E\u62A5\u7A0E\u5206\u4E24\u4E2A\u9636\u6BB5\uFF1A\u6536\u5230\u62A5\u7A0E\u8868\u540E\u9700\u5728 1 \u4E2A\u6708\u5185\u63D0\u4EA4\uFF1B\u9996\u5E74\u53EF\u7533\u8BF7\u5EF6\u671F\u81F3 3 \u4E2A\u6708\u3002\u6240\u6709\u9999\u6E2F\u516C\u53F8\u6BCF\u5E74\u5747\u987B\u7531\u6267\u4E1A\u4F1A\u8BA1\u5E08\u51FA\u5177\u5BA1\u8BA1\u62A5\u544A\u3002</p>
      <h2>\u670D\u52A1\u8303\u56F4</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u505A\u8D26</strong><p>\u6574\u7406\u94F6\u884C\u6D41\u6C34\u3001\u5355\u636E\u4E0E\u5408\u540C\uFF0C\u6309\u9999\u6E2F\u51C6\u5219\u7F16\u5236\u8D22\u52A1\u62A5\u8868\u3002</p></div>
        <div class="cb-card"><strong>\u5BA1\u8BA1</strong><p>\u7531\u6267\u4E1A\u4F1A\u8BA1\u5E08\u51FA\u5177\u65E0\u4FDD\u7559\u610F\u89C1 / \u4FDD\u7559\u610F\u89C1\u5BA1\u8BA1\u62A5\u544A\u3002</p></div>
        <div class="cb-card"><strong>\u62A5\u7A0E</strong><p>\u586B\u62A5\u5229\u5F97\u7A0E\u62A5\u7A0E\u8868\uFF0C\u7533\u8BF7\u4E24\u7EA7\u5236\u4E0E\u79BB\u5CB8\u8C41\u514D\u3002</p></div>
        <div class="cb-card"><strong>\u7A0E\u52A1\u7B79\u5212</strong><p>\u7ED3\u5408 BEPS 2.0 \u4E0E\u79BB\u5CB8\u6240\u5F97\u514D\u7A0E\uFF0C\u5236\u5B9A\u5408\u89C4\u8282\u7A0E\u8DEF\u5F84\u3002</p></div>
      </div>
      <blockquote>\u79BB\u5CB8\u6240\u5F97\u514D\u7A0E\u5E76\u975E\u201C\u96F6\u7533\u62A5\u201D\u2014\u2014\u7A0E\u52A1\u5C40\u5BF9\u65E0\u4FDD\u7559\u610F\u89C1\u62A5\u544A\u7684\u62BD\u67E5\u7387\u6B63\u5728\u4E0A\u5347\uFF0C\u52A1\u5FC5\u4FDD\u7559\u5B8C\u6574\u8BC1\u636E\u94FE\u3002</blockquote>
    `,
    process_steps: genericStepsZh,
    related_ids: [],
    views: 0,
    sort_order: 4,
    is_recommended: 1,
    is_home_show: 1,
    seo_title: "\u9999\u6E2F\u5BA1\u8BA1\u62A5\u7A0E|\u6301\u724CCPA|\u6C38\u9E3F\u56FD\u9645",
    seo_description: "\u9999\u6E2F\u516C\u53F8\u505A\u8D26\u5BA1\u8BA1\u62A5\u7A0E\u4E00\u7AD9\u5F0F\uFF0C\u6267\u4E1A\u4F1A\u8BA1\u5E08\u51FA\u5177\u62A5\u544A\uFF0C\u4E24\u7EA7\u5236\u4E0E\u79BB\u5CB8\u514D\u7A0E\u7533\u8BF7\uFF0C\u5408\u89C4\u8282\u7A0E\u3002",
    seo_keywords: "\u9999\u6E2F\u5BA1\u8BA1,\u9999\u6E2F\u62A5\u7A0E,\u9999\u6E2F\u505A\u8D26,\u79BB\u5CB8\u514D\u7A0E",
    i18n_json: {
      en: {
        title: "Hong Kong Audit & Tax Filing",
        sub_title: "Licensed CPA \xB7 Unqualified opinion",
        summary: "Let licensed practising accountants (CPA) handle your Hong Kong bookkeeping and audit down to the last penny.",
        content: `
      <p>Hong Kong profits tax runs in two stages: the return must be filed within one month of receipt (extendable to three for the first year), and every company needs an audit report from a practising accountant each year.</p>
      <h2>Scope</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Bookkeeping</strong><p>Bank statements, vouchers and contracts compiled under HK standards.</p></div>
        <div class="cb-card"><strong>Audit</strong><p>Unqualified or qualified opinion issued by a practising accountant.</p></div>
        <div class="cb-card"><strong>Filing</strong><p>Profits tax return prepared; two-tier and offshore claims applied.</p></div>
        <div class="cb-card"><strong>Tax planning</strong><p>Compliant structuring around BEPS 2.0 and offshore exemption.</p></div>
      </div>
      <blockquote>An offshore claim is not a nil filing \u2014 the IRD audits far more frequently, so keep a complete evidence chain.</blockquote>
    `,
        seo_title: "Hong Kong Audit & Tax | Licensed CPA | YONGHONG",
        seo_description: "One-stop Hong Kong bookkeeping, audit and tax filing by licensed CPAs with two-tier and offshore claims.",
        seo_keywords: "hong kong audit,hong kong tax filing,hong kong bookkeeping",
        badge_text: "Fully compliant",
        price_text: "From \xA52,980",
        ext_json: { btn_text: "Apply now \u2192", price: "2,980", unit: "" }
      }
    },
    ext_json: { gradient: "from-rose-500 to-rose-600", icon: "fa-calculator", price: "2980", unit: "\u5143\u8D77", btn_text: "\u6211\u8981\u529E\u7406 \u2192" },
    status: 1
  },
  {
    id: 5,
    category: "company_reg",
    country_id: 1,
    title: "\u9999\u6E2F\u516C\u53F8\u6CE8\u9500",
    sub_title: "\u6E05\u76D8\u6E05\u7A0E \xB7 15\u5929\u4E0B\u8BC1",
    summary: "\u5408\u89C4\u5B89\u5168\u6CE8\u9500\u907F\u514D\u653F\u5E9C\u9AD8\u989D\u7F5A\u6B3E\uFF0C\u7B80\u5355\u8F7B\u677E\uFF0C\u6E05\u8D26\u6E05\u7A0E\u5FEB\u901F\u6CE8\u9500\u6216\u8F6C\u8BA9\uFF0C\u514D\u9664\u540E\u987E\u4E4B\u5FE7\u3002",
    badge_text: "\u4F01\u4E1A\u7EA7\u5408\u89C4",
    price_text: "\xA51500 \u5143\u8D77",
    slug: "hk-company-deregistration",
    cover_url: null,
    content: `
      <p>\u4E0D\u518D\u4F7F\u7528\u7684\u9999\u6E2F\u516C\u53F8\u82E5\u4E0D\u6CE8\u9500\uFF0C\u4ECD\u987B\u9010\u5E74\u5E74\u5BA1\u5E76\u7F34\u7EB3\u5546\u4E1A\u767B\u8BB0\u8D39\uFF0C\u903E\u671F\u5C06\u7D2F\u79EF\u7F5A\u6B3E\u5E76\u5F71\u54CD\u8463\u4E8B\u4FE1\u7528\u8BB0\u5F55\u3002</p>
      <h2>\u4E24\u79CD\u9000\u51FA\u65B9\u5F0F</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>\u64A4\u9500\u6CE8\u518C\uFF08\u81EA\u613F\u6CE8\u9500\uFF09</strong><p>\u9002\u5408\u65E0\u672A\u6E05\u507F\u503A\u52A1\u7684\u516C\u53F8\uFF0C\u7531\u7A0E\u52A1\u5C40\u4E0E\u6CE8\u518C\u5904\u8054\u5408\u6279\u51C6\uFF0C\u7EA6 5-6 \u4E2A\u6708\u5B8C\u6210\u3002</p></div>
        <div class="cb-card"><strong>\u6E05\u76D8\uFF08\u5F3A\u5236/\u81EA\u613F\uFF09</strong><p>\u9002\u5408\u6709\u503A\u52A1\u6216\u8D44\u4EA7\u7684\u516C\u53F8\uFF0C\u9700\u59D4\u4EFB\u6E05\u76D8\u4EBA\uFF0C\u6D41\u7A0B\u66F4\u4E25\u8C28\u3002</p></div>
      </div>
      <h2>\u529E\u7406\u524D\u63D0</h2>
      <ul>
        <li>\u516C\u53F8\u4ECE\u672A\u5F00\u59CB\u8425\u4E1A\uFF0C\u6216\u5DF2\u505C\u6B62\u8425\u4E1A\u8D85\u8FC7 3 \u4E2A\u6708</li>
        <li>\u6240\u6709\u7A0E\u52A1\u7533\u62A5\u5DF2\u5B8C\u6210\uFF0C\u65E0\u672A\u7F34\u7A0E\u6B3E</li>
        <li>\u65E0\u672A\u51B3\u7684\u6CD5\u5F8B\u7A0B\u5E8F\u4E0E\u503A\u52A1</li>
      </ul>
    `,
    process_steps: genericStepsZh,
    related_ids: [],
    views: 0,
    sort_order: 5,
    is_recommended: 0,
    is_home_show: 1,
    seo_title: "\u9999\u6E2F\u516C\u53F8\u6CE8\u9500|\u64A4\u9500\u6CE8\u518C|\u6C38\u9E3F\u56FD\u9645",
    seo_description: "\u9999\u6E2F\u516C\u53F8\u6CE8\u9500\u4E0E\u64A4\u9500\u6CE8\u518C\u4E00\u7AD9\u5F0F\u529E\u7406\uFF0C\u6E05\u76D8\u6E05\u7A0E\u3001\u907F\u514D\u7F5A\u6B3E\uFF0C15 \u5929\u542F\u52A8\u3001\u514D\u9664\u540E\u987E\u4E4B\u5FE7\u3002",
    seo_keywords: "\u9999\u6E2F\u516C\u53F8\u6CE8\u9500,\u9999\u6E2F\u64A4\u9500\u6CE8\u518C,\u9999\u6E2F\u6E05\u76D8",
    i18n_json: {
      en: {
        title: "Hong Kong Company Deregistration",
        sub_title: "Winding up \xB7 Certificate in 15 days",
        summary: "Compliant deregistration avoids heavy government penalties \u2014 settle accounts and tax, then strike off or transfer.",
        content: `
      <p>An idle Hong Kong company still owes annual returns and business registration fees; penalties accumulate and the director's credit record suffers.</p>
      <h2>Two ways out</h2>
      <div class="cb-cards2">
        <div class="cb-card"><strong>Deregistration</strong><p>For companies with no outstanding liabilities \u2014 approved jointly by the IRD and the CR in about 5\u20136 months.</p></div>
        <div class="cb-card"><strong>Winding up</strong><p>For companies with debts or assets; requires a liquidator and a stricter process.</p></div>
      </div>
      <h2>Prerequisites</h2>
      <ul>
        <li>The company never traded, or ceased trading more than 3 months ago</li>
        <li>All tax returns are filed and no tax remains unpaid</li>
        <li>No pending legal proceedings or liabilities</li>
      </ul>
    `,
        seo_title: "Hong Kong Company Deregistration | YONGHONG",
        seo_description: "One-stop Hong Kong deregistration and winding up \u2014 avoid penalties and close cleanly.",
        seo_keywords: "hong kong company deregistration,hong kong winding up",
        badge_text: "Fully compliant",
        price_text: "From \xA51,500",
        ext_json: { btn_text: "Apply now \u2192", price: "1,500", unit: "" }
      }
    },
    ext_json: { gradient: "from-sky-500 to-sky-600", icon: "fa-lightbulb", price: "1500", unit: "\u5143\u8D77", btn_text: "\u6211\u8981\u529E\u7406 \u2192" },
    status: 1
  },
  {
    id: 6,
    category: "trademark",
    country_id: 0,
    title: "\u5168\u7403\u5546\u6807\u6CE8\u518C",
    sub_title: "\u9A6C\u5FB7\u91CC\u4F53\u7CFB \xB7 1\u5BF91 \u68C0\u7D22",
    summary: "\u5168\u7403\u4E24\u767E\u591A\u4E2A\u56FD\u5BB6\u5730\u533A\u5728\u7EBF\u4E00\u7AD9\u5F0F\u5546\u6807\u5E03\u5C40\uFF0C1\u5BF91\u6D89\u5916\u77E5\u8BC6\u4EA7\u6743\u4E13\u5BB6\u514D\u8D39\u8FD1\u4F3C\u68C0\u7D22\uFF0C\u9632\u62A2\u6CE8\u4FB5\u6743\u3002",
    badge_text: "\u4F01\u4E1A\u7EA7\u5408\u89C4",
    price_text: "\xA5800 \u5143\u8D77",
    slug: "global-trademark-registration",
    cover_url: null,
    content: `
      <p>\u8DE8\u5883\u7535\u5546\u88AB\u62A2\u6CE8\u3001\u88AB\u6295\u8BC9\u4E0B\u67B6\uFF0C\u5F80\u5F80\u635F\u5931\u8FDC\u8D85\u6CE8\u518C\u6210\u672C\u3002\u63D0\u524D\u5E03\u5C40\u5546\u6807\u662F\u54C1\u724C\u51FA\u6D77\u6700\u5212\u7B97\u7684\u6295\u5165\u3002</p>
      <h2>\u53EF\u529E\u7406\u533A\u57DF</h2>
      <div class="cb-cards4">
        <div class="cb-card"><div class="cb-card__value">\u4E2D\u56FD</div><div class="cb-card__label">\u56FD\u5185\u6CE8\u518C\u4E0E\u7EED\u5C55</div></div>
        <div class="cb-card"><div class="cb-card__value">\u9999\u6E2F</div><div class="cb-card__label">\u5546\u6807\u6CE8\u518C\u6761\u4F8B</div></div>
        <div class="cb-card"><div class="cb-card__value">\u9A6C\u5FB7\u91CC</div><div class="cb-card__label">120+ \u6210\u5458\u56FD\u4E00\u6807\u591A\u56FD</div></div>
        <div class="cb-card"><div class="cb-card__value">US/EU</div><div class="cb-card__label">\u5355\u4E00\u56FD\u5BB6\u4E0E\u6B27\u76DF</div></div>
      </div>
      <h2>\u670D\u52A1\u6D41\u7A0B</h2>
      <ul>
        <li>\u514D\u8D39\u8FD1\u4F3C\u68C0\u7D22\u4E0E\u53EF\u6CE8\u518C\u6027\u8BC4\u4F30</li>
        <li>\u786E\u5B9A\u7C7B\u522B\u4E0E\u5546\u54C1/\u670D\u52A1\u9879\u76EE\uFF08\u5C3C\u65AF\u5206\u7C7B\uFF09</li>
        <li>\u9012\u4EA4\u7533\u8BF7\u5E76\u8DDF\u8FDB\u5B98\u65B9\u5BA1\u67E5\u610F\u89C1</li>
        <li>\u9886\u53D6\u8BC1\u4E66\u5E76\u63D0\u4F9B 10 \u5E74\u7EED\u5C55\u63D0\u9192</li>
      </ul>
    `,
    process_steps: genericStepsZh,
    related_ids: [],
    views: 0,
    sort_order: 6,
    is_recommended: 1,
    is_home_show: 1,
    seo_title: "\u5168\u7403\u5546\u6807\u6CE8\u518C|\u9A6C\u5FB7\u91CC\u56FD\u9645\u5546\u6807|\u6C38\u9E3F\u56FD\u9645",
    seo_description: "\u5168\u7403\u5546\u6807\u6CE8\u518C\u4E00\u7AD9\u5F0F\uFF0C\u8986\u76D6\u4E2D\u56FD\u3001\u9999\u6E2F\u3001\u9A6C\u5FB7\u91CC 120+ \u6210\u5458\u56FD\u3001\u7F8E\u56FD\u4E0E\u6B27\u76DF\uFF0C\u514D\u8D39\u8FD1\u4F3C\u68C0\u7D22\u9632\u62A2\u6CE8\u3002",
    seo_keywords: "\u5546\u6807\u6CE8\u518C,\u9A6C\u5FB7\u91CC\u5546\u6807,\u7F8E\u56FD\u5546\u6807,\u9999\u6E2F\u5546\u6807",
    i18n_json: {
      en: {
        title: "Global Trademark Registration",
        sub_title: "Madrid System \xB7 1-on-1 clearance search",
        summary: "Register your trademark across 200+ jurisdictions with a free similarity search by overseas IP specialists.",
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
        seo_title: "Global Trademark Registration | Madrid | YONGHONG",
        seo_description: "Register trademarks in China, Hong Kong, 120+ Madrid members, the US and the EU with a free clearance search.",
        seo_keywords: "trademark registration,madrid trademark,us trademark",
        badge_text: "Fully compliant",
        price_text: "From \xA5800",
        ext_json: { btn_text: "Apply now \u2192", price: "800", unit: "" }
      }
    },
    ext_json: { gradient: "from-indigo-500 to-indigo-600", icon: "fa-trademark", price: "800", unit: "\u5143\u8D77", btn_text: "\u6211\u8981\u529E\u7406 \u2192" },
    status: 1
  }
];
var banks = [
  {
    id: 1,
    country_id: 1,
    name: "\u6C47\u4E30\u94F6\u884C (HSBC)",
    en_name: "HSBC",
    logo_url: "",
    features: "\u5168\u7403\u516C\u8BA4\u7B2C\u4E00\u5916\u8D44\u94F6\u884C\uFF0C\u652F\u6301\u591A\u5E01\u79CD\u5373\u65F6\u7ED3\u7B97\u53CA\u5168\u7403\u63D0\u73B0\u3002",
    success_rate: "98.6%",
    sort_order: 1,
    status: 1,
    ext_json: { badge: "\u6781\u901F\u9762\u7B7E", period: "2-3\u5468\u4E0B\u6237" },
    i18n_json: {
      en: {
        name: "HSBC",
        features: "Widely regarded as the leading foreign bank, with instant multi-currency settlement and global cash withdrawal.",
        ext_json: { badge: "Fast interview", period: "2\u20133 weeks" }
      }
    }
  },
  {
    id: 2,
    country_id: 1,
    name: "\u6E23\u6253\u94F6\u884C (SCB)",
    en_name: "Standard Chartered",
    logo_url: "",
    features: "\u652F\u6301\u5185\u5730\u8FDC\u7A0B\u89C6\u9891\u9762\u7B7E\u89C1\u8BC1\uFF0C\u514D\u4EB2\u81EA\u8DD1\u6E2F\uFF0C\u7F51\u94F6\u64CD\u4F5C\u7B80\u6377\u3002",
    success_rate: "97.2%",
    sort_order: 2,
    status: 1,
    ext_json: { badge: "\u89C6\u9891\u89C1\u8BC1", period: "2\u5468\u7A33\u4E0B\u6237" },
    i18n_json: {
      en: {
        name: "Standard Chartered",
        features: "Remote video witnessing from the mainland \u2014 no trip to Hong Kong, simple online banking.",
        ext_json: { badge: "Video witnessing", period: "2 weeks" }
      }
    }
  },
  {
    id: 3,
    country_id: 2,
    name: "\u534E\u4FA8\u94F6\u884C (OCBC)",
    en_name: "OCBC",
    logo_url: "",
    features: "\u65B0\u52A0\u5761\u9876\u5C16\u8D44\u7BA1\u94F6\u884C\uFF0C\u8D44\u91D1\u6D41\u8F6C\u65E0\u5916\u6C47\u7BA1\u5236\uFF0C\u4E1C\u5357\u4E9A\u9996\u9009\u3002",
    success_rate: "96.4%",
    sort_order: 3,
    status: 1,
    ext_json: { badge: "\u65B0\u52A0\u5761\u76F4\u8054", period: "1-2\u5468\u4E0B\u6237" },
    i18n_json: {
      en: {
        name: "OCBC",
        features: "A top Singapore wealth-management bank with no exchange controls \u2014 first choice in Southeast Asia.",
        ext_json: { badge: "Singapore direct", period: "1\u20132 weeks" }
      }
    }
  },
  {
    id: 4,
    country_id: 1,
    name: "\u4E1C\u4E9A\u94F6\u884C (BEA)",
    en_name: "BEA",
    logo_url: "",
    features: "\u4E13\u6CE8\u4E2D\u8D44\u51FA\u6D77\u4F01\u4E1A\u4FE1\u8D37\u4E0E\u5916\u6C47\u670D\u52A1\uFF0C\u4E0B\u6237\u51C6\u7B7E\u7387\u4E1A\u5185\u9886\u5148\u3002",
    success_rate: "95.1%",
    sort_order: 4,
    status: 1,
    ext_json: { badge: "\u95E8\u69DB\u4EB2\u6C11", period: "10\u5DE5\u4F5C\u65E5" },
    i18n_json: {
      en: {
        name: "BEA",
        features: "Focused on lending and FX for Chinese businesses going overseas, with an industry-leading approval rate.",
        ext_json: { badge: "Low threshold", period: "10 working days" }
      }
    }
  }
];
var cases = [
  {
    id: 1,
    country_id: 1,
    service_id: 1,
    company_name: "\u6DF1\u5733\u67D0\u5934\u90E8\u8DE8\u5883\u7535\u5546\u79D1\u6280\u516C\u53F8",
    service_title: "\u6CE8\u518C+\u94F6\u884C\u8D26\u6237+\u5546\u6807",
    cost_text: "\u603B\u8D39\u7528 \xA512,800",
    time_text: "\u5386\u65F6 4 \u4E2A\u5DE5\u4F5C\u65E5\u529E\u7ED3",
    quote_text: "\u201C\u6C38\u9E3F\u56E2\u961F\u975E\u5E38\u4E13\u4E1A\uFF0C2\u5929\u62FF\u5230BR\u5546\u4E1A\u767B\u8BB0\u8BC1\uFF0C\u6C47\u4E30\u5305\u4E0B\u6237\u66F4\u662F\u5E2E\u6211\u4EEC\u89E3\u51B3\u4E86\u7ED3\u6C47\u5927\u96BE\u9898\uFF01\u201D",
    portrait_url: null,
    content: null,
    sort_order: 1,
    status: 1,
    ext_json: { cert: "\u9999\u6E2FCR\u8BC1\u4E66\u7B2C3419082\u53F7" },
    i18n_json: {
      en: {
        company_name: "A leading cross-border e-commerce tech company in Shenzhen",
        service_title: "Registration + Bank Account + Trademark",
        cost_text: "Total fee \xA512,800",
        time_text: "Completed in 4 working days",
        quote_text: "\u201CVery professional \u2014 the BR arrived in 2 days and the guaranteed HSBC account solved our FX settlement problem.\u201D",
        ext_json: { cert: "HK CR Certificate No. 3419082" }
      }
    }
  },
  {
    id: 2,
    country_id: 2,
    service_id: 6,
    company_name: "\u676D\u5DDE\u67D0AI\u8F6F\u786C\u4EF6\u51FA\u6D77\u72EC\u89D2\u517D",
    service_title: "\u65B0\u52A0\u5761\u8BBE\u7ACB+ODI\u5907\u6848",
    cost_text: "\u603B\u8D39\u7528 \xA526,500",
    time_text: "\u5386\u65F6 7 \u4E2A\u5DE5\u4F5C\u65E5\u529E\u7ED3",
    quote_text: "\u201C\u6301\u724C\u987E\u95EE\u5168\u7A0B\u8DDF\u8FDB\uFF0C\u5408\u89C4\u67B6\u6784\u642D\u5EFA\u975E\u5E38\u4E25\u8C28\uFF0C\u8BA9\u8D44\u65B9\u5728ODI\u5907\u6848\u5BA1\u6838\u4E2D\u4E00\u6B21\u6027\u901A\u8FC7\u3002\u201D",
    portrait_url: null,
    content: null,
    sort_order: 2,
    status: 1,
    ext_json: { cert: "\u65B0\u52A0\u5761ACRA\u6CE8\u518C\u7F16\u53F7UEN2024098X" },
    i18n_json: {
      en: {
        company_name: "An AI hardware & software unicorn in Hangzhou",
        service_title: "Singapore setup + ODI filing",
        cost_text: "Total fee \xA526,500",
        time_text: "Completed in 7 working days",
        quote_text: "\u201CThe licensed consultant ran the whole thing \u2014 the compliance structure passed ODI review at the first attempt.\u201D",
        ext_json: { cert: "Singapore ACRA UEN 2024098X" }
      }
    }
  },
  {
    id: 3,
    country_id: 1,
    service_id: 4,
    company_name: "\u4E1C\u839E\u67D0\u7CBE\u5BC6\u667A\u80FD\u5236\u9020\u51FA\u53E3\u4F01\u4E1A",
    service_title: "\u9999\u6E2F\u903E\u671F\u5E74\u5BA1\u8865\u529E+\u5BA1\u8BA1",
    cost_text: "\u603B\u8D39\u7528 \xA56,800",
    time_text: "\u5386\u65F6 3 \u4E2A\u5DE5\u4F5C\u65E5\u529E\u7ED3",
    quote_text: "\u201C\u4E4B\u524D\u4EE3\u7406\u4E0D\u4E13\u4E1A\u5BFC\u81F4\u903E\u671F\u88AB\u6CD5\u9662\u4F20\u7968\uFF0C\u6C38\u9E3F\u6301\u724C\u4F1A\u8BA1\u5E08\u51FA\u9762\u5FEB\u901F\u5316\u89E3\u5E76\u8C41\u514D\u7F5A\u91D1\uFF01\u201D",
    portrait_url: null,
    content: null,
    sort_order: 3,
    status: 1,
    ext_json: { cert: "\u7A0E\u5C40\u514D\u7F5A\u7533\u8BF7\u6210\u529F\u6279\u590D\u51FD" },
    i18n_json: {
      en: {
        company_name: "A precision smart-manufacturing exporter in Dongguan",
        service_title: "Overdue HK annual return + audit",
        cost_text: "Total fee \xA56,800",
        time_text: "Completed in 3 working days",
        quote_text: "\u201CA previous agent botched it and we were summoned to court. Our CPA resolved it fast and the penalty was waived.\u201D",
        ext_json: { cert: "Tax bureau penalty-waiver approval" }
      }
    }
  }
];

// dump.ts
var import_node_fs = require("node:fs");
(0, import_node_fs.writeFileSync)(
  "D:/CMS/backend/tools/mock-data.json",
  JSON.stringify({ configSeeds, articles, banks, banners, cases, countries, services }, null, 2),
  "utf8"
);
console.log("dumped");
