package com.ruoyi.cms.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * JSON 列（i18n_json / ext_json / process_steps / related_ids）读写处理器。
 *
 * <p>读：把 MySQL 的 JSON 文本解析成 Jackson 的 LinkedHashMap / ArrayList，
 * 这样 Jackson 序列化时下发的是真 JSON 结构，而不是一整段被转义的字符串。</p>
 * <p>写：把对象序列化回 JSON 文本（S4 编辑保存时使用）。</p>
 *
 * <p>用 Jackson 而不是 fastjson2 解析，是为了保证「读进来再写出去」的键顺序
 * 与前台 mock 完全一致（Jackson 对 Map 按插入顺序输出）。</p>
 */
@MappedTypes(Object.class)
@MappedJdbcTypes(JdbcType.NULL)
public class JsonTypeHandler extends BaseTypeHandler<Object>
{
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType)
            throws SQLException
    {
        try
        {
            ps.setString(i, MAPPER.writeValueAsString(parameter));
        }
        catch (Exception e)
        {
            throw new SQLException("JSON 列序列化失败: " + e.getMessage(), e);
        }
    }

    @Override
    public Object getNullableResult(ResultSet rs, String columnName) throws SQLException
    {
        return parse(rs.getString(columnName));
    }

    @Override
    public Object getNullableResult(ResultSet rs, int columnIndex) throws SQLException
    {
        return parse(rs.getString(columnIndex));
    }

    @Override
    public Object getNullableResult(CallableStatement cs, int columnIndex) throws SQLException
    {
        return parse(cs.getString(columnIndex));
    }

    private Object parse(String text)
    {
        if (text == null || text.isEmpty())
        {
            return null;
        }
        try
        {
            return MAPPER.readValue(text, Object.class);
        }
        catch (Exception e)
        {
            // 库里存的不是合法 JSON 时原样返回，不让单行脏数据打挂整个列表
            return text;
        }
    }
}
