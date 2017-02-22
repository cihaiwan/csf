<%@page import="java.sql.Timestamp"%>
<%@page import="com.mysql.jdbc.StatementImpl"%>
<%@page import="java.sql.PreparedStatement"%>
<%@page import="com.google.gson.reflect.TypeToken"%>
<%@page import="com.google.gson.GsonBuilder"%>
<%@page import="com.google.gson.Gson"%>
<%@page import="java.sql.SQLException"%>
<%@page import="java.sql.DriverManager"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.Connection"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<%
		boolean isok=false;
		boolean exists=false;
		String fields=request.getParameter("fields");
		String sql2=request.getParameter("sql");
		String dburl=request.getParameter("dburl");
		Connection conn = null;
		String sql;
		// MySQL的JDBC URL编写方式：jdbc:mysql://主机名称：连接端口/数据库的名称?参数=值
		// 避免中文乱码要指定useUnicode和characterEncoding
		// 执行数据库操作之前要在数据库管理系统上创建一个数据库，名字自己定，
		// 下面语句之前就要先创建javademo数据库
		String url = dburl;
		Gson gson=new GsonBuilder().create();
		List<LinkedHashMap<String,Object>> list=gson.fromJson(fields,new TypeToken<List<LinkedHashMap<String,Object>>>(){}.getType());
		try {
		    // 之所以要使用下面这条语句，是因为要使用MySQL的驱动，所以我们要把它驱动起来，
		    // 可以通过Class.forName把它加载进去，也可以通过初始化来驱动起来，下面三种形式都可以
		    Class.forName("com.mysql.jdbc.Driver");// 动态加载mysql驱动
		    // 一个Connection代表一个数据库连接
		    conn = DriverManager.getConnection(url,"cmsroot","cmsroot");
		    // Statement里面带有很多方法，比如executeUpdate可以实现插入，更新和删除等
		    Statement stmt = conn.createStatement();
		    Map<String,Object> tab=list.get(0);
		    try{
		    	stmt.executeQuery("select count(*) from "+tab.get("dst").toString());
		    	exists=true;	
		    	//System.out.println("表已经存在");
		    }catch(Exception e){
		    	
		    	stmt.executeUpdate(sql2);
		    }
		    
		   
		    
		    for(Map<String,Object> m:list){
		    	stmt.execute("delete from t_dir where src='"+m.get("src").toString()+"'");
		    	stmt.execute("insert into t_dir values('"+UUID.randomUUID().toString().replaceAll("-","")+"','"+m.get("src").toString()+"',"
		    			+"'"+m.get("dst").toString()+"',"
		    			+"'"+m.get("srctype")+"',current_timestamp())");
		    }
		    isok=true;
		} catch (SQLException e) {
		    //System.out.println("MySQL操作错误");
		    e.printStackTrace();
		} catch (Exception e) {
		    e.printStackTrace();
		} finally {
		    try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		response.setContentType("application/json;charset=utf-8");
		response.getWriter().write("{\"success\":\""+isok+"\",\"exists\":\""+exists+"\"}");
		
%>