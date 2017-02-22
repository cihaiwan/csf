 
	var converover=true
	var count=0;
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
    function trans2(query,converquery){
    	//console.dir(query)
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
            //console.dir(data1)
            	var data=[]
                //var src=data1.trans_result[0]["src"]
                var src=converquery
                var dstt=data1.trans_result[0]["dst"].toLowerCase()
            	
                if(dstt in filtermap){
                
                	dstt=filtermap[dstt];
                }
                var dst=dstt.replace(/(.*)(the)?number\s+of(.*)/ig,"$1$3 No").replace(/(^|\s+)(of|the|for|to|in|at|on|and|or)(\s+|$)/ig,"").replace(/[.,-/]/g,"").replace(/'[^\s]+/,"")
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

    /*
     * _obj必须有result属性 该属性的值必须是 翻译字段1\n翻译字段2
     */
    function loopconver(_obj,filename,converafter){
    	count++;
    	console.dir(count)
    	//console.dir(_obj)
    		if(createtype=="1"){
				addfields=[specfields["unid1"],specfields["deptid"],specfields["createtime"],specfields["updatetimeStamp"],specfields["bloodKinshipId"]]
			 }else if(createtype=="2"){
			 	addfields=[specfields["z_id"],specfields["z_deptid"],specfields["z_createtime"],specfields["z_updatetimeStamp"],specfields["z_bloodKinshipId"],specfields["z_tableSource"],specfields["unid"]]
			 }else if(createtype=="3"){
			 	addfields=[specfields["zz_id"],specfields["zz_updatetimeStamp"],specfields["zz_bloodKinshipId"],specfields["zz_unid"],specfields["zz_createtime"],specfields["zz_deptid"],specfields["zz_tableSource"]]
			 }
			fields=[]
			for(var i in addfields){
				fields.push(addfields[i].src)
			}
      //   var filename=file.name.split(".")[0];
         $("input[name='tabzh']").val(filename.split(";")[0])
         $("input[name='tabdb']").val(filename.split(";")[1])
         var lett=_obj.result.split("\\n")
        fields=fields.concat(lett)
         createHeader();
         var i=0;
          var si= setInterval(function(){
        	 if(lett[i]!=undefined&&lett[i]!="")
             trans2(lett[i].replace("无意义的","").replace("/","").replace(/[(（][^)）]+[）)]|[-:._"“”]/g,"").replace(/1/g,"一").replace(/2/g,"二").replace(/3/g,"三").replace(/4/g,"四").replace(/5/g,"五").replace(/6/g,"六").replace(/7/g,"七").replace(/8/g,"八").replace(/9/g,"九").replace(/是否/,"is "),lett[i])
             i++;
             if(i==lett.length){
            	 clearInterval(si)
            	 if(converafter!=undefined){
            		 setTimeout(function(){
            			 converafter()
            		 },1000)
            	 }
                 
             }
         },10)
    	
    }
    function ll(){
    	 if($("#createdb").length>0){
        	$("#createdb").css("display","none")
        }
    	 $("#tabinfo").css("display","block")
     	$("#tab").css("display","block")
     	$("#showsql").css("display","block")
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
                
                loopconver(this,file.name.split(".")[0]);
            }
        }

    }
    
    /*
     * 自动产生
     */
    function createmoretable(){
    	converover=true
    	if($("#createdb").length>0){
        	$("#createdb").css("display","none")
        }
    	$("#tabinfo").css("display","none")
    	$("#tab").css("display","none")
    	$("#showsql").css("display","none")
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
                var results=this.result.split("__")
                var i=0;
                var mysi=setInterval(function(){
                	if(i<results.length){
                		if(converover){
                			converover=false
                			loopconver({result:results[i].split("\.")[1]},results[i].split("\.")[0],function(){
                        		exportd()
                        		if($("#createdb").length>0){
                                	$("#createdb").css("display","none")
                                }
                        		var iss=doornot.createalldb()
                        		var y=true;
                        		if(iss==false){
                        			y=confirm("是否继续")
                        	        if(y==true){
                        	        	iss=true;
                        	        }else{
                        	        	clearInterval(mysi)
                        	        	return ;
                        	        }
                        		}
                        		converover=iss;
                        		if(i==results.length){
                        			alert("全部生成完成")
                        		}
                        	});
                			i++;
                			
                		}
                	}else{
                		clearInterval(mysi)
                	}
            	},2000)
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
    
    function findIntable(unqiue,_th,val,val1,dn,ind,ch){
    	
    			if(dn.intable(val1)==false){
    			var val2=""
   				if(val in unqiue){
   					var num=unqiue[val].match(/.*(\d)$/)[1]
   					var num2=(parseInt(num)+1)
   					val2=val+num2+""
   					//console.dir(val+ch[num2].toUpperCase())
   					$(_th).parents("tr").find("[name='dst']").val(val+ch[num2].toUpperCase())
   				}else{
   					val2=val+"0"
   				}
   				unqiue[val]=val2;
    			}else{
    				if(val in unqiue){
       					var num=unqiue[val].match(/.*(\d)$/)[1]
       					var num2=(parseInt(num)+1)
       					var val2=""
       					val2=val+num2+""
       					//console.dir(val+ch[num2].toUpperCase())
       					$(_th).parents("tr").find("[name='dst']").val(val+ch[num2].toUpperCase())
       					unqiue[val]=val2;
       				}else{
       					unqiue[val]=val+ind
        				var ind1=(++ind)
        				findIntable(unqiue,_th,val,val+ch[ind1].toUpperCase(),dn,ind1,ch)
       				}
    			}
    }
    function exportd(){
    	 var have=$("input[name='have']:checked").val();
    	 var ch=[];
    	 if(have=="0"){
    	 	ch=["","a","b","c","d","e","f","g","h","i"]
    	 }else{
    		ch=["","_a","_b","_c","_d","_e","_f","_g","_h","_i"]
    	 }
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
   		$.each($("#tab [name='src']"),function(){
   			var src=$(this).val()
   			 var isExist=doornot.isExistDir(src);
			var val=$(this).parents("tr").find("[name='dst']").val()
   			 if(isExist==null){
   			 	if("intable" in doornot){
   			 		findIntable(unqiue,this,val,val,doornot,0,ch);
   			 	}
   			 }
   		})
   		
   		
        var sql=exportdsql();
        $("#showsql").html(sql.replace(/\r\n/g,"<br/>"))
        
        if($("#createdb").length>0){
        	$("#createdb").css("display","block")
        }
    }
    
    function exportdsql(){
        var tabinfo={}
        /*
         * 表名
         */
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
    function exportdsql2(defaults2){
    	var tabinfo={}
    	$.each($("#tabinfo [name]"),function(){
    		var name=$(this).attr("name")
    		var value=$(this).val()
    		tabinfo[name]=value
    	})
    	var defaults=defaults2[tabinfo["tabdb"]]
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
    	
    	for(var cs in tabinfo["columns"]){
    		var key=tabinfo["columns"][cs]["src"]
    	//	cs["defaultvalue"]=defaults[key][""]
    	//	cs["dst"]=defaults[key]
    		//console.dir(key in defaults)
    		if(!(key in defaults)){
    			continue;
    		}
    		//console.dir(defaults[key]["characterLength"]+":"+defaults[key]["isNull"]+":"+defaults[key]["isNull"]+":"+defaults[key]["columnKey"]+":"+defaults[key]["dataType"])
    		tabinfo["columns"][cs]["len"]=defaults[key]["characterLength"]||""
    		tabinfo["columns"][cs]["nullable"]=defaults[key]["isNull"]=="NO"?"1":"0"
    			tabinfo["columns"][cs]["pk"]=defaults[key]["columnKey"]=="PRI"?"0":"1"
//    		tabinfo["columns"]["src"]=defaults[key][""]||
    		tabinfo["columns"][cs]["type"]=defaults[key]["dataType"]
    	}
    	//console.dir(tabinfo)
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
    
    //shqycompanyinfo