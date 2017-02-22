function Dojs(){
	this.dburl="jdbc:mysql://192.168.2.202:4315/hysjzh_new1?characterEncoding=UTF-8&amp;useOldAliasMetadataBehavior=true"
}
var datatmp;
$.ajax({
	url:"js/columnmap.js",
	dataType:"json",
	async:false,
	success:function(d){
		datatmp=d
	}
})

EXTEND(Dojs,DoOrNot)
Dojs.prototype.createdb=function(){
	return this.basecreate(exportdsql())
}
Dojs.prototype.createalldb=function(){
	
	var sql=exportdsql2(datatmp);
	
	return this.basecreate(sql);
}
/*
 * 
 */
Dojs.prototype.basecreate=function(sql){
	var issuccess=true;
	var _thi=this;
	var  column=this.getSrcDst()
	//console.dir(column)
	for(x in column){
		var src=column[x]["src"]
		var dst=column[x]["dst"]
		try{
			_thi.dirs[src]=dst
			_thi.dirsf[dst]=src
		}catch(e){
			console.dir(e)
			}
	}
	
	var objstr=JSON.stringify(column);
	$.ajax({
		url:"createtable.jsp",
		data:{sql:sql,fields:objstr,dburl:_thi.dburl},
		type:"post",
		dataType:"json",
		async:false,
		success:function(d){
			if(d.exists=="true"){
				alert("表已存在")
				issuccess=false;
			}else
				if(d.success=="false"){
					alert("创建未成功")
					issuccess=false;
				}
			/*console.dir(d)
			if(d.success=="true"){
				for(x in column){
					var src=column[x]["src"]
					var dst=column[x]["dst"]
					_thi.dirs[src]=dst
				}
			}else{
				alert("生成失败")
			}*/
		}
	})
	return issuccess
}



Dojs.prototype.init=function(){
	var _thi=this;
	$.ajax({
		url:"dic.jsp",
		dataType:"json",
		data:{dburl:_thi.dburl},
		success:function(d){
			_thi.dirs=d
		}
	})
	$.ajax({
		url:"dic2.jsp",
		dataType:"json",
		data:{dburl:_thi.dburl},
		success:function(d){
			_thi.dirsf=d
		}
	})
	$("#createdb").append(' <input type="button" value="创建表"  onclick="doornot.createdb()"/>')
}

Dojs.prototype.getSrcDst=function(){
		var srcdst=[]
		var tmp={}
		var src=$("#tabinfo [name='tabzh']").val()
		var dst=$("#tabinfo [name='tabdb']").val()
		tmp["src"]=src
		tmp["dst"]=dst
		tmp["srctype"]="table"
		srcdst.push(tmp)
        var tables=$("form table")
        $.each(tables,function(){
            var trs=$(this).find("tr");
            var columns=[]
            for(var i=1;i<trs.length;i++){
            	var tmp={}
                var e1=$(trs[i]).find("[name='src']").val()
                tmp["src"]=e1
                var e2=$(trs[i]).find("[name='dst']").val()
                tmp["dst"]=e2
                tmp["srctype"]="column"
                srcdst.push(tmp)
            }
        })
        return  srcdst
}

Dojs.prototype.intable=function(key){
	var success=false;
	
	var _thi=this;
	$.ajax({
		url:"intable.jsp",
		data:{field:key,dburl:_thi.dburl},
		dataType:"json",
		async:false,
		success:function(d){
			success=d.success
		}
	})
	return success;
}
