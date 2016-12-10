function enqCheck(){

	var shff = function(arr) {
		var i = arr.length;
		while(i){
			var j = Math.floor(Math.random()*i);
			var t = arr[--i];
			arr[i] = arr[j];
			arr[j] = t;
		}
	}
	var checkCookie = function (key,  tmp1, tmp2, xx1, xx2, xx3) {
		tmp1 = " " + document.cookie + ";";
		xx1 = xx2 = 0;
		len = tmp1.length;
		while (xx1 < len) {
			xx2 = tmp1.indexOf(";", xx1);
			tmp2 = tmp1.substring(xx1 + 1, xx2);
			xx3 = tmp2.indexOf("=");
			if (tmp2.substring(0, xx3) == key) {
				return(unescape(tmp2.substring(xx3 + 1, xx2 - xx1 - 1)));
			}
			xx1 = xx2 + 1;
		}
		return("");
	}
	var ckName="enqConfFlg_201610_spn"; 
	if(checkCookie(ckName) == ""){
		var arr=new Array();
		var hn=Math.floor(Math.random()*100);
		var ii=0;
		var yfl=false;
		for(ii=0;ii<100;ii++){
			arr[ii]=ii;
		}
		shff(arr);
		for(ii=0;ii<100;ii++){
			if(arr[ii] == hn){
				yfl=true;
				break;
			}
		}
		if(yfl){
			var dt=new Date();
			dt.setFullYear(2030);
			dt.setMonth(11);
			dt.setDate(31);
			dt.setHours(23);
			dt.setMinutes(59);
			dt.setSeconds(59);
			dt.setMilliseconds(999);
			var chDat = ckName+"=viewEnd; path=/; expires=" + dt.toGMTString();
			document.cookie = chDat;
			tb_show("", "/spn/enquete/enquete_confirm.html?keepThis=true&TB_iframe=true&height=170&width=280", "");
		}
	}
};


function enqClose(){
	tb_remove();
}

function manualEnqOpen(){
	tb_show("", "/spn/enquete/enquete_confirm.html?keepThis=true&TB_iframe=true&height=170&width=280", "");
}