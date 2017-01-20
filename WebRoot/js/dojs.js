function Dojs(){
	
}
EXTEND(Dojs,DoOrNot)
Dojs.prototype.createdb=function(){
	var _thi=this;
	var  column=this.getSrcDst()
	console.dir(column)
	for(x in column){
		var src=column[x]["src"]
		var dst=column[x]["dst"]
		try{
		_thi.dirs[src]=dst
		_thi.dirsf[dst]=src
		}catch(e){console.dir(e)}
	}
	var sql=exportdsql();
	var objstr=JSON.stringify(column);
	$.ajax({
		url:"createtable.jsp",
		data:{sql:sql,fields:objstr},
		type:"post",
		dataType:"json",
		success:function(d){
			if(d.success=="false"){
				alert("创建未成功")
				
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
}



Dojs.prototype.init=function(){
	var _thi=this;
	$.ajax({
		url:"dic.jsp",
		dataType:"json",
		success:function(d){
			_thi.dirs=d
		}
	})
	$.ajax({
		url:"dic2.jsp",
		dataType:"json",
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
	$.ajax({
		url:"intable.jsp",
		data:{field:key},
		dataType:"json",
		async:false,
		success:function(d){
			success=d.success
		}
	})
	return success;
}
