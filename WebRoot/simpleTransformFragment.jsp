<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
  	 	<script src="js/jquery.js"></script>
  	 	<script>
  	 		  var doornot;
   //默认字段数
   var specfields={unid:{src:"原主键","dst":"z_oldunid",pk:false,len:40},
   	unid1:{src:"主键","dst":"unid",pk:true,len:40},
   	z_id:{src:"主键","dst":"z_id",pk:true,len:40},
   	deptid:{src:"部门id","dst":"deptid",pk:false,len:255},
   	z_deptid:{src:"部门id","dst":"z_deptid",pk:false,len:255},
   	createtime:{src:"创建时间","dst":"createtime",pk:false,len:255},
   	z_createtime:{src:"创建时间","dst":"z_createtime",pk:false,len:255},
   	updatetimeStamp:{src:"更新时间戳","dst":"updatetimeStamp",pk:false,len:255},
   	z_updatetimeStamp:{src:"更新时间戳","dst":"z_updatetimeStamp",pk:false,len:255},
   	bloodKinshipId:{src:"血缘ID","dst":"bloodKinshipId",pk:false,len:255},
   	z_bloodKinshipId:{src:"血缘ID","dst":"z_bloodKinshipId",pk:false,len:255},
   	tableSource:{src:"字段来源","dst":"tableSource",pk:false,len:255},
   	z_tableSource:{src:"z字段来源","dst":"z_tableSource",pk:false,len:255},
   	
   	
   	zz_id:{src:"z主键","dst":"z_id",pk:true,len:40},
   	zz_status:{src:"z数据状态","dst":"z_status",pk:false,len:255},
   	zz_updatetimeStamp:{src:"z更新时间戳","dst":"z_updatetimeStamp",pk:false,len:255},
   	zz_bloodKinshipId:{src:"z血缘ID","dst":"z_bloodKinshipId",pk:false,len:255},
   	zz_unid:{src:"主键","dst":"z_oldunid",pk:false,len:40},   	
   	zz_createtime:{src:"z创建时间","dst":"z_createtime",pk:false,len:255},
   	zz_deptid:{src:"z部门id","dst":"z_deptid",pk:false,len:255},
   	zz_tableSource:{src:"z字段来源","dst":"z_tableSource",pk:false,len:255}
   	}

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
  	 	</script>
<script src="js/csfmain.js"></script>
<input type="file" id="f1"/>
字段还有下划线<input type="radio" name="have" value="0" checked />是<input type="radio" value="1" name="have" />否
数据库类型<select id="dbtype" onchange="dbselect(this)"><option>mysql</option><option>oracle</option></select>
<input type="button" value="转换" onclick="ll()" />
<input type="button" value="导出" onclick="exportd()"/>
<input type="button" value="添加" onclick="addcloumn()"/>
<input type="button" value="全部生成表" onclick="createmoretable()"/>
<form action="#" method="post">
    <div id="tabinfo">
        表名<input type="" name="tabzh" />生成表名<input type="" name="tabdb" />
    </div>
    <table id="tab"></table>
</form>
<div id="showsql">

</div>
<div id="createdb"  style="display:none"></div>
	<script src="js/filter.js"></script>
	<script src="js/base.js"></script>
	<script src="js/dojs.js"></script>
	<script src="js/notdojs.js"></script>
	<script src="js/md5.js"></script>
