function DoOrNot(){}


function inh(a){
	function fun(){}
	fun.prototype=a;
	return new fun();
}

function EXTEND(sub,sup){
	var prot=inh(sup.prototype)
	sub.prototype=prot
	sub.prototype.constructor=sup
}
/*********************************************************************************************/

DoOrNot.prototype.isExistDir=function(key){
	var ds=this.dirs||{}
	if(key in ds){
        return ds[key]
    }else{
        return null
    }
}




