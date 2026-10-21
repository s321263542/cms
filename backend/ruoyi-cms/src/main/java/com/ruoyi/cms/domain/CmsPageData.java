package com.ruoyi.cms.domain;

import java.util.List;
import java.util.Map;

/**
 * 公网文章列表的分页信封 —— 字段与 Nuxt mock 逐个对齐：
 * {@code { total, rows, pageNum, pageSize }}。
 *
 * <p>这里<b>不挂</b> {@code @JsonNaming}：mock 下发的就是驼峰 {@code pageNum} /
 * {@code pageSize}，而 rows 里的内容对象是 snake_case（由实体上的注解负责）。</p>
 */
public class CmsPageData
{
    /** 分页前的总条数 */
    private long total;

    /** 当前页数据（已 localize） */
    private List<Map<String, Object>> rows;

    /** 当前页码，从 1 开始 */
    private int pageNum;

    /** 每页条数 */
    private int pageSize;

    public CmsPageData()
    {
    }

    public CmsPageData(long total, List<Map<String, Object>> rows, int pageNum, int pageSize)
    {
        this.total = total;
        this.rows = rows;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }

    public long getTotal()
    {
        return total;
    }

    public void setTotal(long total)
    {
        this.total = total;
    }

    public List<Map<String, Object>> getRows()
    {
        return rows;
    }

    public void setRows(List<Map<String, Object>> rows)
    {
        this.rows = rows;
    }

    public int getPageNum()
    {
        return pageNum;
    }

    public void setPageNum(int pageNum)
    {
        this.pageNum = pageNum;
    }

    public int getPageSize()
    {
        return pageSize;
    }

    public void setPageSize(int pageSize)
    {
        this.pageSize = pageSize;
    }
}
