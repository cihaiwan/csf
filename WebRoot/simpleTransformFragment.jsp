<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
  	 	<script src="js/jquery.js"></script>
   <script>
   var doornot;
   //默认字段数
   var specfields={unid:{src:"主键","dst":"unid",pk:true,len:40},
   	deptid:{src:"部门id","dst":"deptid",pk:false,len:255},
   	createtime:{src:"创建时间","dst":"createtime",pk:false,len:255}}

	var addfields=[]
   var fields=[]
   var createtype='${createtype}'||'1'

   $(document).ready(function(){
   	
   	var debug=false;
   	if(debug){
   		doornot=new NotDojs();
   	}else{
   		doornot=new Dojs();
   		doornot.init()
   	}
   })
    function trans(query){
        var appid = '2015063000000001';
        var key = '12345678';
        var salt = (new Date).getTime();
        var from = 'zh';
        var to = 'en';
        var str1 = appid + query + salt +key;
        var sign = MD5(str1);
        $.ajax({
            url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
            type: 'get',
            async:false,
            dataType: 'jsonp',
            data: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: function (data1) {
                console.dir(data1)
                var data={"trans_result":[{}]}
                data["trans_result"][0]["src"]=data1.trans_result[0]["src"].replace(/[".,]/g,"");
                data["trans_result"][0]["dst"]=data1.trans_result[0]["dst"].replace(/[".,]/g,"");
                console.dir(data)
                var srcs=(data.trans_result[0].src+"").split('\\n');

                var dsts=data.trans_result[0].dst.split('\\n');
                var html=createHeader();
                for(var i=0;i<srcs.length;i++){
                    try{
                        var dstss=dsts[i].trim().split(" ");
                        var dststr=isOracle(dstss)
                        html+=createTable({ix:(i+3),src:srcs[i],dst:dststr})
                    }catch(e){}

                }
                $("#tab").html(html)
            }
        });
    }
    function eee(data){

        var html=createHeader();
        for(var i=0;i<data.length;i++){
            try{
                var dstss=data[i].dst;
                var dststr=isOracle(dstss)
                html+=createTable({ix:(i+3),src:data[i].src,dst:dststr})
            }catch(e){}
        }
        $("#tab").html(html)
    }

    function eee2(data){
        var html="";
        html+=createTable({src:data.src,dst:data.dst})
        $("#tab").append(html)
    }
    function trans2(query){
        var appid = '2015063000000001';
        var key = '12345678';
        var salt = (new Date).getTime();
        var from = 'zh';
        var to = 'en';
        var str1 = appid + query + salt +key;
        var sign = MD5(str1);
        $.ajax({
            url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
            type: 'get',
            async:false,
            dataType: 'jsonp',
            data: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: function (data1) {
            
                var data=[]
                var src=data1.trans_result[0]["src"]
                var dst=data1.trans_result[0]["dst"].replace(/(.*)(the)?number\s+of(.*)/ig,"$1$3 No").replace(/(^|\s+)(of|the|for|to|in|at|on|and|or)/ig,"").replace(/[.,]/,"").replace(/'[^\s]+/,"")
                console.dir(dst)
                data["src"]=src;
                var isExist=doornot.isExistDir(src);
               	var dststr="";
               	if(isExist==null){
               
               		data["dst"]=dst;
               		var dstss=data["dst"].trim().split(/\s+/);
               		dststr=isOracle(dstss)
               }else{
               		dststr=isExist
               }
               data["dst"]=dststr
                eee2(data)
            }
        });
    }
    /* 
     *是否是下划线 大小写
     */
    function isOracle(dstss){
    	if(dstss.join("").length>25){
    		for(var i=0;i<dstss.length;i++){
    			dstss[i]=dstss[i].substring(0,4)
    		}
    	}
        var have=$("input[name='have']:checked").val();
        var dststr=""
        if(have=="0"){
            dststr=dstss[0].toLowerCase();
            for(var j=1;j<dstss.length;j++){
                dststr+=dstss[j].substring(0,1).toUpperCase()+dstss[j].substring(1)
            }
        }else{
            for(var j=0;j<dstss.length;j++){
                dststr+="_"+dstss[j]
            }
            dststr=dststr.substring(1)
        }
        return dststr
    }

    function createHeader(){
        $("#tab").html("")
        $("#showsql").html("")
        var html="";
        html+="<tr><td>序号</td><td>中文</td><td>英文</td><td>类型</td><td>长度</td><td>可空</td><td>默认值</td><td>是否是主键</td></tr>";
        ixx=1
        for(var i in addfields){
        	html+=createTable(addfields[i],addfields[i].pk,addfields[i].len)
        }

        $("#tab").append( html);
    }
    function selectchange(_this){
        var s=$(_this).val()
        if(s=="date"){
            $(_this).parents("tr").find("input[name*='len']").val("")
        }else if(s=="timestamp"){
            $(_this).parents("tr").find("input[name*='len']").val("")
        }else if(s=="number"){
            $(_this).parents("tr").find("input[name*='len']").val("")
        }else if(s=="varchar2"){
            $(_this).parents("tr").find("input[name*='len']").val("255")
        }

    }

    var Oracle=[
        "varchar2","varchar","date","timestamp","number","clob"
    ]
    var Mysql=[
        "varchar","date","timestamp","float","int"
    ]
    var selectTypeInit=Mysql;
    function typeselect(){
        var html=""
        for(var i=0;i<selectTypeInit.length;i++){
            html+="<option>"+selectTypeInit[i]+"</option>"
        }
        return html  ;
    }
    function del(_this){
        var y=confirm("是否确定删除")
        if(y==true){
         	$(_this).parents("tr").remove()
        }
           
    }
    function createTable(o,checked,pklen){
        var ck=checked||false
        var html="<tr><td>"+(ixx++)+"</td><td><input name='src' value='"+o.src+"' readonly/></td>" +
                "<td><input name='dst' value='"+o.dst+"' /></td>" +
                "<td><select name='type' onchange='selectchange(this)'>"+typeselect()+"</select></td>" +
                "<td><input name='len' value='"+(pklen||255)+"'/></td>" +
                (function(){
                    if(ck){
                        return "<td><select name='nullable'><option value='0'>是</option><option value='1' selected>否</option></select></td>"
                    }else{
                        return  "<td><select name='nullable' selected><option value='0'>是</option><option value='1' >否</option></select></td>"
                    }
                })()+"<td><input name='defaultvalue'/></td>" +
                (function(){
                    if(ck){
                        return "<td><select name='pk'><option value='0' selected>是</option><option value='1'>否</option></select></td>"
                    }else{
                        return  "<td><select name='pk'><option value='0'>是</option><option value='1' selected>否</option></select></td>"
                    }
                })()+
                "<td><input type='button' value='删除' onclick='del(this)'/></td></tr>"
        return html;
    }
    function addcloumn(){
        var html="<tr><td>"+(ixx++)+"</td>" +
        	"<td><input name='src' /></td>" +
                "<td><input name='dst'  /></td>" +
                "<td><select name='type' onchange='selectchange(this)'>"+typeselect()+"</select></td>" +
                "<td><input name='len' value='255'/></td>" +
                "<td><select name='nullable' selected><option value='0'>是</option><option value='1' >否</option></select></td>"+
                "<td><input name='defaultvalue'/></td>" +
                "<td><select name='pk'><option value='0'>是</option><option value='1' selected>否</option></select></td>"+
                "<td><input type='button' value='删除' onclick='del(this)'/></td></tr>"
        $("#tab").append(html)
    }

    function ll(){
    	 if($("#createdb").length>0){
        	$("#createdb").css("display","none")
        }
       // console.dir(document.getElementById("f1"))
        //console.dir(document.getElementById("f1").files)
        if(document.getElementById("f1").files.length==0){
            alert("未上传文件")
            return ;
        }
        var y=true;
        if($("#tab tr").length>0){
            y=confirm("是否重新生成")
        }
        if(y==true){

            var file =document.getElementById("f1").files[0];
            var fileReader=new FileReader();
            fileReader.readAsText(file);
            fileReader.onload=function(f){
                if(!/text/.test(file.type)){

                    alert("你传入的文件格式不对")
                    return ;
                }
                if(createtype=="1"){
  					addfields=[specfields["unid"],specfields["deptid"],specfields["createtime"]]
 				 }
  				fields=[]
  				for(var i in addfields){
  					fields.push(addfields[i].src)
  				}
  
  
                var filename=file.name.split(".")[0];
                $("input[name='tabzh']").val(filename.split(";")[0])
                $("input[name='tabdb']").val(filename.split(";")[1])
                var lett=this.result.replace(/[(（][^)）]+[）)]|[-:.]/g,"").replace(/1/g,"一").replace(/2/g,"二").replace(/3/g,"三").replace(/4/g,"四").replace(/5/g,"五").replace(/6/g,"六").replace(/7/g,"七").replace(/8/g,"八").replace(/9/g,"九").split("\\n")
               	fields=fields.concat(lett)
               	
                createHeader();
                var i=0;
                 var si= setInterval(function(){
                    trans2(lett[i])
                  i++;
                    if(i==lett.length){
                        clearInterval(si)
                    }
                },10)

            }
        }

    }

    function createMysql(o){
        var tabzh=o.tabzh
        var tabdb=o.tabdb
        var sql="create table "+tabdb+"\r\n";
        sql+="(\r\n";
        var columns=o.columns;
        $.each(columns,function(i){
            sql+=this.dst +" "+this.type+(function(_t){
                        if(_t.len==""||_t.len=="0"){
                            return ""
                        }else{
                            return "("+_t.len+")"
                        }
                    })(this)+" "+(function(_t){
                        if(_t.nullable=="1"||_t.pk=="0"){
                            return " not null "
                        }else{
                            return " "
                        }
                    })(this)+" "+" "+(function(_t){
                        if(_t.defaultvalue==""){
                            return ""
                        }else{
                            return "default '"+_t.defaultvalue+"' ";
                        }
                    })(this)+" "+(function(_t){
                     //   console.dir(_t)
                        if(_t.pk=="0"){
                            return " primary key  "
                        }else{
                            return " "
                        }
                    })(this)+"comment '"+this.src+"'";
            if(i<columns.length-1){
                sql+=","
            }
            sql+=" \r\n";
        })
        sql+=")comment '"+tabzh+"' ;";
        //console.dir(sql)
        return sql
    }
    function createOracle(o){
        var tabzh=o.tabzh
        var tabdb=o.tabdb
        var sql="create table "+tabdb+"\r\n";
        sql+="(\r\n";
        var columns=o.columns;
        $.each(columns,function(i){
            sql+=this.dst +" "+this.type+(function(_t){
                        if(_t.len==""||_t.len=="0"){
                            return ""
                        }else{
                            return "("+_t.len+")"
                        }
                    })(this)+" "+(function(_t){
                        if(_t.pk=="0"){
                            return " primary key not null "
                        }else if(_t.nullable=="1"){
                            return " not null "
                        }else{
                            return " "
                        }
                    })(this)+" "+(function(_t){
                        if(_t.defaultvalue==""){
                            return " "
                        }else{
                            return " default '"+_t.defaultvalue+"' ";
                        }
                    })(this);
            if(i<columns.length-1){
                sql+=","
            }
            sql+="\r\n";
        })
        sql+=");\r\n";
        sql+="comment on table "+tabdb+" is '"+ tabzh+"';\r\n";
        $.each(columns,function(i){
            sql+="comment on column "+tabdb+"."+this.dst+" is '"+this.src+"';\r\n"
        })
    //    console.dir(sql)
        return sql
    }
    function exportd(){
    
    	var ch=["","a","b","c","d","e","f","g","h","i"]
    	
   		var fieldstmp={};
   		
   		for(i in fields){
   			try{
   				if($("[value='"+fields[i]+"']").length>0)
   				fieldstmp[fields[i]]=$("[value='"+fields[i]+"']").parents("tr").html().replace(/<td>[^<]+<\/td>/,"")
   			}catch(e){
   				console.dir(e)
   			}
   			
   		}
   		$("#tab tr:gt(0)").remove();
   		//console.dir(fieldstmp)
   		//console.dir(fields)
   		var j=1;
   		for(i in fieldstmp){
   			$("#tab").append("<tr><td>"+(j++)+"</td>"+fieldstmp[i]+"</tr>")
   		}
   		if($("#tab [name='dst']").length==0){
   			return;
   		}
   		var unqiue={}
   		$.each($("#tab [name='dst']"),function(){
   			var val=$(this).val()
   			var val2=""
   			//console.dir(val )
   			//console.dir(unqiue )
   			if(val in unqiue){
   				var num=unqiue[val].match(/.*(\d)$/)[1]
   				var num2=(parseInt(num)+1)
   				val2=val+num2+""
   				$(this).val(val+ch[num2].toUpperCase())
   			}else{
   				val2=val+"0"
   			}
   			unqiue[val]=val2;
   		})
   		
   		
        var sql=exportdsql();
        $("#showsql").html(sql.replace(/\r\n/g,"<br/>"))
        
        if($("#createdb").length>0){
        	$("#createdb").css("display","block")
        }
    }
    
    function exportdsql(){
        var tabinfo={}
        $.each($("#tabinfo [name]"),function(){
            var name=$(this).attr("name")
            var value=$(this).val()
            tabinfo[name]=value
        })
        var tables=$("form table")
        $.each(tables,function(){
            var trs=$(this).find("tr");
            var columns=[]
            for(var i=1;i<trs.length;i++){
                var nameElements=$(trs[i]).find("[name]")
                var columnObj={}
                for(var j=0;j<nameElements.length;j++){
                    var name=$(nameElements[j]).attr("name")
                    var value=$(nameElements[j]).val()
                    columnObj[name]=value
                }
                columns.push(columnObj)
            }
            tabinfo["columns"]=columns
        })
        
        
        
        var dbtype=$("#dbtype").val();
        var sql=""
        if(dbtype=="mysql"){
            sql=createMysql(tabinfo)
        }else if(dbtype=="oracle"){
            sql= createOracle(tabinfo)
        }
        return sql;
    }
    

    function dbselect(_this){
        var db=$(_this).val()
        if(db=="mysql"){
            selectTypeInit=Mysql;
        }else if(db=="oracle"){
            selectTypeInit=Oracle;
        }
    }
    
   $(document).on("change","[name]",function(){
    	if($(this).get(0).nodeName=="SELECT"){
    		var options=$(this).find("option")
    		for(var i=0;i<options.length;i++){
    			var option=options[i]
    			if($(option).attr("value")==$(this).val()){
    				$(option).attr("selected",true)
    			}else{
    				$(option).removeAttr("selected")
    			}
    		}
    	}else{
    	$(this).attr("value",$(this).val())
    	}
    })
</script>
<input type="file" id="f1"/>
字段还有下划线<input type="radio" name="have" value="0" checked />是<input type="radio" value="1" name="have" />否
数据库类型<select id="dbtype" onchange="dbselect(this)"><option>mysql</option><option>oracle</option></select>
<input type="button" value="转换" onclick="ll()"/>
<input type="button" value="导出" onclick="exportd()"/>
<input type="button" value="添加" onclick="addcloumn()"/>
<form action="#" method="post">
    <div id="tabinfo">
        表名<input type="" name="tabzh" />生成表名<input type="" name="tabdb" />
    </div>
    <table id="tab"></table>
</form>
<div id="showsql">

</div>
<div id="createdb"  style="display:none"></div>
	<script src="js/base.js"></script>
	<script src="js/dojs.js"></script>
	<script src="js/notdojs.js"></script>
	<script src="js/md5.js"></script>
