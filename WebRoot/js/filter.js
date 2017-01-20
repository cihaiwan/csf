var filterfield=[
                 "all",
                 "by",
                 "concat",
                 "end",
                 "explain",
                 "from",
                 "group",
                 "index",
                 "left",
                 "limit",
                 "of",
                 "order",
                 "right",
                 "start",
                 "static",
                 "table",
                 "test",
                 "union",
                 "where"
                 ]
var filtermap=(function(){
		var f={}
		for(var ff in filterfield){
			f[filterfield[ff]]=filterfield[ff]+"z"
		}
		return f;
})()
