package com.ruoyi.cms.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * 工作流的通用数据访问 —— 8 个发布单元落在 6 张内容表上，
 * 用「白名单表名 + 动态列」一次性覆盖，避免为每张表抄 6 遍 SQL。
 *
 * <p>安全约定：{@code ${table}} / {@code ${orderBy}} <b>只允许</b>来自 {@link com.ruoyi.cms.constant.CmsFlow}
 * 的白名单，调用前必须先过 {@code CmsFlow.isSafeTable}；列名来自 information_schema，同样不是用户输入。</p>
 */
public interface CmsFlowMapper
{
    /** 读整表内容行（is_deleted=0），按前台顺序排 */
    List<Map<String, Object>> selectAll(@Param("table") String table, @Param("orderBy") String orderBy);

    /** 读表结构（information_schema）：列名 + 数据类型，用来区分 JSON 列与普通列 */
    List<Map<String, Object>> selectColumns(@Param("table") String table);

    /** 读单行 */
    Map<String, Object> selectRow(@Param("table") String table, @Param("id") Long id);

    /** 写内容列（列名必须已过白名单过滤），顺手更新 updated_by/updated_at */
    int updateFields(@Param("table") String table, @Param("vals") Map<String, Object> vals,
            @Param("id") Long id, @Param("operator") String operator);

    /**
     * 写工作流列。参数 p 的可用键（只写非 null 的那些）：
     * draft（草稿 JSON 串）/ clearDraft（true=清草稿）/ publishStatus / liveFlag /
     * submittedBy / publishedBy / liveVersionId / deleted（true=is_deleted=1）
     */
    int updateFlow(@Param("table") String table, @Param("p") Map<String, Object> p,
            @Param("id") Long id, @Param("operator") String operator);

    /** 新增内容行：vals 是内容列（白名单内），工作流列由 SQL 固定给草稿初值 */
    int insertRow(@Param("table") String table, @Param("vals") Map<String, Object> vals,
            @Param("operator") String operator);

    /** 取上一步自增 ID（与插入同事务同连接） */
    Long lastInsertId();

    /** 软删（is_deleted=1）—— 只有「审核通过」时才会把草稿里标记删除的行真的删掉 */
    int softDelete(@Param("table") String table, @Param("id") Long id, @Param("operator") String operator);

    /* ------------------------------------------------------------ 版本 */

    /** 该内容行当前最大版本号（新版本 = +1） */
    Long selectMaxVersionNo(@Param("refTable") String refTable, @Param("refId") Long refId);

    /** 只 INSERT，永不 UPDATE/DELETE（表设计 §10.4 运维约定） */
    int insertVersion(@Param("refTable") String refTable, @Param("refId") Long refId,
            @Param("versionNo") long versionNo, @Param("snapshot") String snapshot,
            @Param("opType") String opType, @Param("opNote") String opNote, @Param("operator") String operator);

    /** 版本列表（带出配置键，供前台反查是哪个模块） */
    List<Map<String, Object>> selectVersions(@Param("tables") List<String> tables, @Param("limit") int limit);

    /** 单个版本（含快照，回滚数据源） */
    Map<String, Object> selectVersionById(@Param("versionId") Long versionId);

    /* ------------------------------------------------------------ 审计 */

    int insertAudit(@Param("refTable") String refTable, @Param("refId") Long refId,
            @Param("refTitle") String refTitle, @Param("action") String action,
            @Param("statusFrom") String statusFrom, @Param("statusTo") String statusTo,
            @Param("changes") String changes, @Param("operator") String operator, @Param("ip") String ip);

    List<Map<String, Object>> selectAudit(@Param("limit") int limit);

    /**
     * 该模块「审核通过 + 回滚」的次数 —— 这就是模块的版本序号（v1、v2…）。
     * 模块里一次发布会给它改到的每一行各留一条版本记录，version_no 共用同一个序号，
     * 于是前台版本列表显示的 vN 始终是「这个模块第几次上线」。
     */
    long selectVersionCount(@Param("refTable") String refTable, @Param("refTitle") String refTitle);
}
