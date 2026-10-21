/**
 * 后台「客户留资 CRM」的数据归一层。
 *
 * 两个来源，渲染成同一种行、UI 上没有任何差别：
 *   1. 常驻线索 15 条 —— 让明细区任何时候都不是空的（5 待跟进 / 5 跟进中 / 5 已签约）
 *   2. 前台 POST /api/public/lead/submit 提交的真实线索（见 ./leads.ts，内存态），排在最前
 *
 * 归档基数（113 条更早的历史线索）不在这里，放在 useAdminLeads：
 *   计数 = 归档基数 + 当前列表 = 128 / 23 / 57 / 48，与 BI 大屏口径一致。
 *
 * id 从 9001 起：前台新线索从 1 自增，两段号段不会撞车（撞车会让列表 key 重复）。
 */
import type { AdminLeadRow } from '../../../app/types'
import type { StoredLead } from './leads'

/** 常驻线索：ISO 时间（与前台线索同一个字段格式，列表统一解析） */
const SAMPLE_LEADS: AdminLeadRow[] = [
  {
    id: 9001,
    name: '陈先生 (深圳跨境电商)',
    phone: '13802681234',
    service: '香港公司注册 (¥4580起)',
    status: '待跟进',
    created_at: '2026-09-28T01:40:00.000Z',
    note: '做亚马逊铺货，急需下证办美金结汇，今天回电最快。',
    source: 'web',
    utm_source: 'baidu-seo',
    ip: '113.66.24.51'
  },
  {
    id: 9002,
    name: '刘女士 (上海时尚品牌)',
    phone: '13711223344',
    service: '全球商标注册 (¥1980起)',
    status: '待跟进',
    created_at: '2026-09-28T01:05:00.000Z',
    note: '品牌准备出海欧美，想先走马德里国际商标，已问报价与周期。',
    source: 'web',
    utm_source: 'google-ads',
    ip: '101.88.12.7'
  },
  {
    id: 9003,
    name: '王总 (义乌小商品)',
    phone: '15921009876',
    service: '离岸银行见证开户 (¥2000起)',
    status: '待跟进',
    created_at: '2026-09-27T09:20:00.000Z',
    note: '跨境收结汇量大，想开香港公司户收美金，关心过账额度。',
    source: 'web',
    utm_source: '-',
    ip: '117.136.33.90'
  },
  {
    id: 9004,
    name: '周先生 (成都游戏出海)',
    phone: '13507654321',
    service: '香港做账审计 (¥2980起)',
    status: '待跟进',
    created_at: '2026-09-27T06:45:00.000Z',
    note: '公司运营两年，首份审计报告要赶在年底前出具。',
    source: 'web',
    utm_source: 'wechat-moment',
    ip: '171.221.9.66'
  },
  {
    id: 9005,
    name: '何经理 (苏州制造)',
    phone: '18662233445',
    service: '全球商标注册 (¥1980起)',
    status: '待跟进',
    created_at: '2026-09-26T14:30:00.000Z',
    note: '三个系列 Logo 都要海外布局，先咨询欧盟 + 美国两件套。',
    source: 'web',
    utm_source: 'baidu-seo',
    ip: '58.210.11.203'
  },
  {
    id: 9006,
    name: '林总 (杭州外贸)',
    phone: '13912345678',
    service: '离岸银行见证开户 (¥2000起)',
    status: '跟进中',
    created_at: '2026-09-28T00:55:00.000Z',
    note: '已预约明天下午汇丰银行远程视频见证面签，需提醒带证件。',
    source: 'web',
    utm_source: 'baidu-seo',
    ip: '115.204.6.88'
  },
  {
    id: 9007,
    name: '赵女士 (广州实业)',
    phone: '13788889999',
    service: '香港做账审计 (¥2980起)',
    status: '跟进中',
    created_at: '2026-09-27T07:10:00.000Z',
    note: '需补办 2024-2025 逾期做账审计，资料已收到一半。',
    source: 'web',
    utm_source: '-',
    ip: '113.108.99.14'
  },
  {
    id: 9008,
    name: '郑先生 (泉州鞋服)',
    phone: '13600551122',
    service: '香港公司注册 (¥4580起)',
    status: '跟进中',
    created_at: '2026-09-27T03:25:00.000Z',
    note: '公司名称核准已通过，明天补签法定文件与 NNC1。',
    source: 'web',
    utm_source: 'douyin',
    ip: '120.38.51.7'
  },
  {
    id: 9009,
    name: '孙总 (北京教育科技)',
    phone: '13910012233',
    service: '全球商标注册 (¥1980起)',
    status: '跟进中',
    created_at: '2026-09-26T09:50:00.000Z',
    note: '欧盟商标已提交，等补充三年内的使用证据。',
    source: 'web',
    utm_source: 'google-ads',
    ip: '123.113.7.45'
  },
  {
    id: 9010,
    name: '吴女士 (长沙 MCN)',
    phone: '18973336655',
    service: '离岸银行见证开户 (¥2000起)',
    status: '跟进中',
    created_at: '2026-09-25T11:15:00.000Z',
    note: '银行要求补近三个月流水与采购合同，已发清单过去。',
    source: 'web',
    utm_source: 'xiaohongshu',
    ip: '110.246.18.90'
  },
  {
    id: 9011,
    name: '黄总 (东莞电子)',
    phone: '13802689988',
    service: '香港公司注册 (¥4580起)',
    status: '已签约',
    created_at: '2026-09-26T02:40:00.000Z',
    note: '已签年度秘书 + 注册地址服务，等待收齐董事证件归档。',
    source: 'web',
    utm_source: '-',
    ip: '116.25.44.19'
  },
  {
    id: 9012,
    name: '徐先生 (宁波机械)',
    phone: '13777001122',
    service: '香港做账审计 (¥2980起)',
    status: '已签约',
    created_at: '2026-09-25T06:05:00.000Z',
    note: '已签 2025 年度审计委托协议，本周启动账务整理。',
    source: 'web',
    utm_source: 'baidu-seo',
    ip: '115.199.30.77'
  },
  {
    id: 9013,
    name: '马女士 (天津物流)',
    phone: '13612223344',
    service: '全球商标注册 (¥1980起)',
    status: '已签约',
    created_at: '2026-09-24T08:30:00.000Z',
    note: '马德里商标已下单，覆盖 8 个国家，回执已发客户。',
    source: 'web',
    utm_source: 'wechat-moment',
    ip: '117.13.42.160'
  },
  {
    id: 9014,
    name: '曹先生 (福州跨境电商)',
    phone: '13905911234',
    service: '离岸银行见证开户 (¥2000起)',
    status: '已签约',
    created_at: '2026-09-23T05:55:00.000Z',
    note: '汇丰见证开户已面签通过，等下户短信后安排激活。',
    source: 'web',
    utm_source: 'douyin',
    ip: '110.86.4.201'
  },
  {
    id: 9015,
    name: '邓总 (重庆汽车配件)',
    phone: '13902345678',
    service: '香港公司注册 (¥4580起)',
    status: '已签约',
    created_at: '2026-09-22T01:20:00.000Z',
    note: '注册证书与商业登记证已交付，转入年度维护阶段。',
    source: 'web',
    utm_source: '-',
    ip: '183.228.19.52'
  }
]

/** 新线索在前（最新在上）：真实留资与常驻线索按提交时间统一倒序 */
export function toAdminRows(real: StoredLead[]): AdminLeadRow[] {
  const live: AdminLeadRow[] = real.map(row => ({
    id: row.id,
    name: row.name || '匿名访客',
    phone: row.phone,
    service: row.source_title || '网站留资表单',
    status: '待跟进',
    created_at: row.created_at,
    note: row.remark || '前台表单提交，已留存手机号，等待顾问回访。',
    source: 'web',
    utm_source: row.utm_source || '-',
    ip: row.ip
  }))

  const rows = [...live, ...SAMPLE_LEADS]
  rows.sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0))
  return rows
}
