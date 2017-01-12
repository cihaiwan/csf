<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    


  </head>
  
  <body>
	<%
		String createtype=request.getParameter("createtype");
		request.setAttribute("createtype",createtype);
	%>
   <jsp:include page="simpleTransformFragment.jsp">
   	<jsp:param name="createtype" value="${createtype}" />
   </jsp:include>
  </body>
</html>
