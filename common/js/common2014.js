/* SWFObject v2.1 <http://code.google.com/p/swfobject/> Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> */
if(swfobject == undefined){
	var swfobject=function(){var b="undefined",Q="object",n="Shockwave Flash",p="ShockwaveFlash.ShockwaveFlash",P="application/x-shockwave-flash",m="SWFObjectExprInst",j=window,K=document,T=navigator,o=[],N=[],i=[],d=[],J,Z=null,M=null,l=null,e=false,A=false;var h=function(){var v=typeof K.getElementById!=b&&typeof K.getElementsByTagName!=b&&typeof K.createElement!=b,AC=[0,0,0],x=null;if(typeof T.plugins!=b&&typeof T.plugins[n]==Q){x=T.plugins[n].description;if(x&&!(typeof T.mimeTypes!=b&&T.mimeTypes[P]&&!T.mimeTypes[P].enabledPlugin)){x=x.replace(/^.*\s+(\S+\s+\S+$)/,"$1");AC[0]=parseInt(x.replace(/^(.*)\..*$/,"$1"),10);AC[1]=parseInt(x.replace(/^.*\.(.*)\s.*$/,"$1"),10);AC[2]=/r/.test(x)?parseInt(x.replace(/^.*r(.*)$/,"$1"),10):0}}else{if(typeof j.ActiveXObject!=b){var y=null,AB=false;try{y=new ActiveXObject(p+".7")}catch(t){try{y=new ActiveXObject(p+".6");AC=[6,0,21];y.AllowScriptAccess="always"}catch(t){if(AC[0]==6){AB=true}}if(!AB){try{y=new ActiveXObject(p)}catch(t){}}}if(!AB&&y){try{x=y.GetVariable("$version");if(x){x=x.split(" ")[1].split(",");AC=[parseInt(x[0],10),parseInt(x[1],10),parseInt(x[2],10)]}}catch(t){}}}}var AD=T.userAgent.toLowerCase(),r=T.platform.toLowerCase(),AA=/webkit/.test(AD)?parseFloat(AD.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,q=false,z=r?/win/.test(r):/win/.test(AD),w=r?/mac/.test(r):/mac/.test(AD);/*@cc_on q=true;@if(@_win32)z=true;@elif(@_mac)w=true;@end@*/return{w3cdom:v,pv:AC,webkit:AA,ie:q,win:z,mac:w}}();var L=function(){if(!h.w3cdom){return }f(H);if(h.ie&&h.win){try{K.write("<script id=__ie_ondomload defer=true src=//:><\/script>");J=C("__ie_ondomload");if(J){I(J,"onreadystatechange",S)}}catch(q){}}if(h.webkit&&typeof K.readyState!=b){Z=setInterval(function(){if(/loaded|complete/.test(K.readyState)){E()}},10)}if(typeof K.addEventListener!=b){K.addEventListener("DOMContentLoaded",E,null)}R(E)}();function S(){if(J.readyState=="complete"){J.parentNode.removeChild(J);E()}}function E(){if(e){return }if(h.ie&&h.win){var v=a("span");try{var u=K.getElementsByTagName("body")[0].appendChild(v);u.parentNode.removeChild(u)}catch(w){return }}e=true;if(Z){clearInterval(Z);Z=null}var q=o.length;for(var r=0;r<q;r++){o[r]()}}function f(q){if(e){q()}else{o[o.length]=q}}function R(r){if(typeof j.addEventListener!=b){j.addEventListener("load",r,false)}else{if(typeof K.addEventListener!=b){K.addEventListener("load",r,false)}else{if(typeof j.attachEvent!=b){I(j,"onload",r)}else{if(typeof j.onload=="function"){var q=j.onload;j.onload=function(){q();r()}}else{j.onload=r}}}}}function H(){var t=N.length;for(var q=0;q<t;q++){var u=N[q].id;if(h.pv[0]>0){var r=C(u);if(r){N[q].width=r.getAttribute("width")?r.getAttribute("width"):"0";N[q].height=r.getAttribute("height")?r.getAttribute("height"):"0";if(c(N[q].swfVersion)){if(h.webkit&&h.webkit<312){Y(r)}W(u,true)}else{if(N[q].expressInstall&&!A&&c("6.0.65")&&(h.win||h.mac)){k(N[q])}else{O(r)}}}}else{W(u,true)}}}function Y(t){var q=t.getElementsByTagName(Q)[0];if(q){var w=a("embed"),y=q.attributes;if(y){var v=y.length;for(var u=0;u<v;u++){if(y[u].nodeName=="DATA"){w.setAttribute("src",y[u].nodeValue)}else{w.setAttribute(y[u].nodeName,y[u].nodeValue)}}}var x=q.childNodes;if(x){var z=x.length;for(var r=0;r<z;r++){if(x[r].nodeType==1&&x[r].nodeName=="PARAM"){w.setAttribute(x[r].getAttribute("name"),x[r].getAttribute("value"))}}}t.parentNode.replaceChild(w,t)}}function k(w){A=true;var u=C(w.id);if(u){if(w.altContentId){var y=C(w.altContentId);if(y){M=y;l=w.altContentId}}else{M=G(u)}if(!(/%$/.test(w.width))&&parseInt(w.width,10)<310){w.width="310"}if(!(/%$/.test(w.height))&&parseInt(w.height,10)<137){w.height="137"}K.title=K.title.slice(0,47)+" - Flash Player Installation";var z=h.ie&&h.win?"ActiveX":"PlugIn",q=K.title,r="MMredirectURL="+j.location+"&MMplayerType="+z+"&MMdoctitle="+q,x=w.id;if(h.ie&&h.win&&u.readyState!=4){var t=a("div");x+="SWFObjectNew";t.setAttribute("id",x);u.parentNode.insertBefore(t,u);u.style.display="none";var v=function(){u.parentNode.removeChild(u)};I(j,"onload",v)}U({data:w.expressInstall,id:m,width:w.width,height:w.height},{flashvars:r},x)}}function O(t){if(h.ie&&h.win&&t.readyState!=4){var r=a("div");t.parentNode.insertBefore(r,t);r.parentNode.replaceChild(G(t),r);t.style.display="none";var q=function(){t.parentNode.removeChild(t)};I(j,"onload",q)}else{t.parentNode.replaceChild(G(t),t)}}function G(v){var u=a("div");if(h.win&&h.ie){u.innerHTML=v.innerHTML}else{var r=v.getElementsByTagName(Q)[0];if(r){var w=r.childNodes;if(w){var q=w.length;for(var t=0;t<q;t++){if(!(w[t].nodeType==1&&w[t].nodeName=="PARAM")&&!(w[t].nodeType==8)){u.appendChild(w[t].cloneNode(true))}}}}}return u}function U(AG,AE,t){var q,v=C(t);if(v){if(typeof AG.id==b){AG.id=t}if(h.ie&&h.win){var AF="";for(var AB in AG){if(AG[AB]!=Object.prototype[AB]){if(AB.toLowerCase()=="data"){AE.movie=AG[AB]}else{if(AB.toLowerCase()=="styleclass"){AF+=' class="'+AG[AB]+'"'}else{if(AB.toLowerCase()!="classid"){AF+=" "+AB+'="'+AG[AB]+'"'}}}}}var AD="";for(var AA in AE){if(AE[AA]!=Object.prototype[AA]){AD+='<param name="'+AA+'" value="'+AE[AA]+'" />'}}v.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+AF+">"+AD+"</object>";i[i.length]=AG.id;q=C(AG.id)}else{if(h.webkit&&h.webkit<312){var AC=a("embed");AC.setAttribute("type",P);for(var z in AG){if(AG[z]!=Object.prototype[z]){if(z.toLowerCase()=="data"){AC.setAttribute("src",AG[z])}else{if(z.toLowerCase()=="styleclass"){AC.setAttribute("class",AG[z])}else{if(z.toLowerCase()!="classid"){AC.setAttribute(z,AG[z])}}}}}for(var y in AE){if(AE[y]!=Object.prototype[y]){if(y.toLowerCase()!="movie"){AC.setAttribute(y,AE[y])}}}v.parentNode.replaceChild(AC,v);q=AC}else{var u=a(Q);u.setAttribute("type",P);for(var x in AG){if(AG[x]!=Object.prototype[x]){if(x.toLowerCase()=="styleclass"){u.setAttribute("class",AG[x])}else{if(x.toLowerCase()!="classid"){u.setAttribute(x,AG[x])}}}}for(var w in AE){if(AE[w]!=Object.prototype[w]&&w.toLowerCase()!="movie"){F(u,w,AE[w])}}v.parentNode.replaceChild(u,v);q=u}}}return q}function F(t,q,r){var u=a("param");u.setAttribute("name",q);u.setAttribute("value",r);t.appendChild(u)}function X(r){var q=C(r);if(q&&(q.nodeName=="OBJECT"||q.nodeName=="EMBED")){if(h.ie&&h.win){if(q.readyState==4){B(r)}else{j.attachEvent("onload",function(){B(r)})}}else{q.parentNode.removeChild(q)}}}function B(t){var r=C(t);if(r){for(var q in r){if(typeof r[q]=="function"){r[q]=null}}r.parentNode.removeChild(r)}}function C(t){var q=null;try{q=K.getElementById(t)}catch(r){}return q}function a(q){return K.createElement(q)}function I(t,q,r){t.attachEvent(q,r);d[d.length]=[t,q,r]}function c(t){var r=h.pv,q=t.split(".");q[0]=parseInt(q[0],10);q[1]=parseInt(q[1],10)||0;q[2]=parseInt(q[2],10)||0;return(r[0]>q[0]||(r[0]==q[0]&&r[1]>q[1])||(r[0]==q[0]&&r[1]==q[1]&&r[2]>=q[2]))?true:false}function V(v,r){if(h.ie&&h.mac){return }var u=K.getElementsByTagName("head")[0],t=a("style");t.setAttribute("type","text/css");t.setAttribute("media","screen");if(!(h.ie&&h.win)&&typeof K.createTextNode!=b){t.appendChild(K.createTextNode(v+" {"+r+"}"))}u.appendChild(t);if(h.ie&&h.win&&typeof K.styleSheets!=b&&K.styleSheets.length>0){var q=K.styleSheets[K.styleSheets.length-1];if(typeof q.addRule==Q){q.addRule(v,r)}}}function W(t,q){var r=q?"visible":"hidden";if(e&&C(t)){C(t).style.visibility=r}else{V("#"+t,"visibility:"+r)}}function g(s){var r=/[\\\"<>\.;]/;var q=r.exec(s)!=null;return q?encodeURIComponent(s):s}var D=function(){if(h.ie&&h.win){window.attachEvent("onunload",function(){var w=d.length;for(var v=0;v<w;v++){d[v][0].detachEvent(d[v][1],d[v][2])}var t=i.length;for(var u=0;u<t;u++){X(i[u])}for(var r in h){h[r]=null}h=null;for(var q in swfobject){swfobject[q]=null}swfobject=null})}}();return{registerObject:function(u,q,t){if(!h.w3cdom||!u||!q){return }var r={};r.id=u;r.swfVersion=q;r.expressInstall=t?t:false;N[N.length]=r;W(u,false)},getObjectById:function(v){var q=null;if(h.w3cdom){var t=C(v);if(t){var u=t.getElementsByTagName(Q)[0];if(!u||(u&&typeof t.SetVariable!=b)){q=t}else{if(typeof u.SetVariable!=b){q=u}}}}return q},embedSWF:function(x,AE,AB,AD,q,w,r,z,AC){if(!h.w3cdom||!x||!AE||!AB||!AD||!q){return }AB+="";AD+="";if(c(q)){W(AE,false);var AA={};if(AC&&typeof AC===Q){for(var v in AC){if(AC[v]!=Object.prototype[v]){AA[v]=AC[v]}}}AA.data=x;AA.width=AB;AA.height=AD;var y={};if(z&&typeof z===Q){for(var u in z){if(z[u]!=Object.prototype[u]){y[u]=z[u]}}}if(r&&typeof r===Q){for(var t in r){if(r[t]!=Object.prototype[t]){if(typeof y.flashvars!=b){y.flashvars+="&"+t+"="+r[t]}else{y.flashvars=t+"="+r[t]}}}}f(function(){U(AA,y,AE);if(AA.id==AE){W(AE,true)}})}else{if(w&&!A&&c("6.0.65")&&(h.win||h.mac)){A=true;W(AE,false);f(function(){var AF={};AF.id=AF.altContentId=AE;AF.width=AB;AF.height=AD;AF.expressInstall=w;k(AF)})}}},getFlashPlayerVersion:function(){return{major:h.pv[0],minor:h.pv[1],release:h.pv[2]}},hasFlashPlayerVersion:c,createSWF:function(t,r,q){if(h.w3cdom){return U(t,r,q)}else{return undefined}},removeSWF:function(q){if(h.w3cdom){X(q)}},createCSS:function(r,q){if(h.w3cdom){V(r,q)}},addDomLoadEvent:f,addLoadEvent:R,getQueryParamValue:function(v){var u=K.location.search||K.location.hash;if(v==null){return g(u)}if(u){var t=u.substring(1).split("&");for(var r=0;r<t.length;r++){if(t[r].substring(0,t[r].indexOf("="))==v){return g(t[r].substring((t[r].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(A&&M){var q=C(m);if(q){q.parentNode.replaceChild(M,q);if(l){W(l,true);if(h.ie&&h.win){M.style.display="block"}}M=null;l=null;A=false}}}}}();
}


/***************************************************************************************
* @name :
* ビルドインオブジェクト拡張
*/
Array.prototype.inArray = function(val){
	for(var i=0;i<this.length;i++){
		if(this[i] == val) return true;
	}
	return false;
};

/***************************************************************************************
* @object : cs
*
*/

if(typeof cs == 'undefined'){
	var cs = new Object();


	//Bookmark用サイトタイトル
	cs.siteName = "Sokenbicha";

	cs.d = document;

	//UserAgent
	cs.ua = navigator.userAgent.toLowerCase();

	//browser
	cs.browser = new Object();

	cs.browser.isIE = function(){return /msie/.test(cs.ua);}

	cs.isPage = function(bodyid){return document.getElementById(bodyid);};

	//reference to getElementById
	cs.$ = function(id){return cs.d.getElementById(id);};

	//reference to getElementsByTagName
	cs.$$ = function(elm,tag){	return elm.getElementsByTagName(tag);};

	cs.addEventListener = function(elm,type,func,useCapture){
		if(!elm){return false;}
		if(!useCapture){
			useCapture = false;
		}
		if(elm.addEventListener){
			elm.addEventListener(type,func,false);
		}else if(elm.attachEvent){
			elm.attachEvent('on'+type,func);
		}else{
			return false;
		}
		return true;
	};

	cs.removeEventListener = function(elm,type,func,useCapture){
		if (!elm){return false;}
		if(! useCapture){
			useCapture = false;
		}

		if(elm.removeEventListener){
			elm.removeEventListener(type,func,false);
		}else if(elm.detachEvent){
			elm.detachEvent('on'+ type,func);
		}else{
			return false;
		}
		return true;
	};

	//ショートカット
	cs.AEL = cs.addEventListener;
	cs.REL = cs.removeEventListener;

	cs.setEventElms = function(elms,eventType,func){
		for(var i=0;i<elms.length;i++){
			cs.AEL(elms[i],eventType,func);
		}
	}

	//キャッシュ対策用関数
	cs.getNowDate = function(){
		return new Date().getTime();
	};

	/**
	* @name : getElementsByClass
	* 特定のエレメントから特定のクラス名をもつエレメントを返す
	*/

	cs.getElementsByClass = function(wrapElem,getElm,clName){
		var e = new Array();
		var elms = wrapElem.getElementsByTagName(getElm);
		for(var i=0;i<elms.length;i++){
			var classNames = elms[i].className.split(" ");
			if(classNames.inArray(clName)){
				e.push(elms[i]);
			};
		};
		return e.length == 0 ? null : e;
	};

	cs.target = function(evt){
		if(evt && evt.target){
			if(evt.target.nodeType == 3){
				return evt.target.parentNode;
			}else{
				return evt.target;
			}
		}else if(window.event && window.event.srcElement){
			return window.event.srcElement;
		}else{
			return null;
		}
	};

	cs.stopPropagation = function(evt){
		if(evt && evt.stopPropagation){
			evt.stopPropagation();
		}else if(window.event){
			window.event.cancelBubble = true;
		}
	};

	cs.preventDefault = function(evt){
		if(evt && evt.preventDefault){
			evt.preventDefault();
			evt.currentTarget['on' + evt.type] = function(){return false;};
		}else if(window.event){
			window.event.returnValue = false;
		}
	};

	cs.rollOverInit = function(img){
		var on = new Image();
		var off = new Image();
		off.src = img.src;
		var dot = img.src.lastIndexOf(".");
		on.src = img.src.substr(0,dot) + "_on" + img.src.substr(dot,img.src.length);
		cs.addEventListener(img,"mouseover",function(){if(img.src.indexOf("_on.")==-1){img.src = on.src;}});
		cs.addEventListener(img,"mouseout",function(){img.src = off.src});
	};

	cs.setRollOverByClassName = function(_cls){
		var imgs = cs.$$(document,"img");
		var inputs = cs.$$(document,"input");
		cs.setRollOver(imgs,_cls);
		cs.setRollOver(inputs,_cls);
	};

	cs.setRollOver = function(elms,_cls){
		for(var i=0;i<elms.length;i++){
			var eCls = elms[i].className;
			if(eCls === undefined || eCls === "") continue;
			var cls = eCls.split(" ");
			for(var y=0;y<cls.length;y++){
				if(_cls == cls[y]){
					cs.rollOverInit(elms[i]);
				}
			};
		};
	};

	cs.setRollOverByElms = function(elms){
		for(var i=0;i<elms.length;i++){
			cs.rollOverInit(elms[i]);
		};
	};

	cs.setOpe = function(img,ops){
		img.style.MsOpacity = ops;
		img.style.MozOpacity = ops;
		img.style.opacity = ops;
		img.style.filter = "alpha(opacity=" + ops*100 + ")";
	};

	cs.rollOverOpsInit = function(img){
		cs.addEventListener(img,"mouseover",function(){setOps(img,0.5);});
		cs.addEventListener(img,"mouseout",function(){setOps(img,1);});
	};

	cs.openWin = function(url,width,height,winname){
		newWin = window.open("",winname,"width=" + width +",height=" + height +",toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1");
		newWin.location.href = url;
		newWin.focus();
		return false;
	};

	cs.bookMark = function(e){
		cs.preventDefault(e);
		var anc = cs.target(e);
		anc = anc.nodeName.toUpperCase() == "IMG" ? anc.parentNode : anc;
		if(anc.nodeName.toUpperCase() != "A") return false;

		var uri = anc.href;
		if(window.sidebar){
			window.sidebar.addPanel(cs.siteName,uri,'');
		}else if(window.opera && window.print){
			return true;
		}else if(document.all){
			window.external.AddFavorite(uri,cs.siteName);
		}
		return false;
	};

	//DOM Content Load
	cs.setLoadFunction = function(fn){
		(function(){
			if(document.addEventListener){
				document.addEventListener("DOMContentLoaded",fn,false);
			}else if(cs.browser.isIE){
				try{
					document.documentElement.doScroll("left");
				}catch(e){
					setTimeout(arguments.callee,0);
					return;
				}
				fn();
			}else{
				window.onload = fn;
			}
		})();
	};

	/***************************************************************************************
	* クラス関係
	*/

	cs.addClass = function(elm,name){
		var def = elm.className;
		var defs = def.split(" ");
		defs.push(name);
		elm.className = defs.join(" ");
	};

	cs.removeClass = function(elm,name){
		var defs = elm.className.split(" ");
		var after = new Array();
		for(var i=0;i<defs.length;i++){

			if(defs[i]!=name){
				after.push(defs[i]);
			}
		}
		elm.className = after.join(" ");
	};

	cs.hasClass = function(elm,name){
		var defs = elm.className.split(" ");
		for(var i=0;i<defs.length;i++){
			if(defs[i]==name){
				return true;
			}
		}
		return false;
	};

	/***************************************************************************************
	* コールバック
	*/

	cs.CB = function(){}

	cs.CB.prototype = {
		_path : undefined,
		_method : undefined,

		setCallBack : function(path,method){
			this._path = path;
			this._method = method;
		},

		callCallBack : function(args){
			this._path[this._method](args);
		}
	};

	/***************************************************************************************
	* エフェクト
	*/

	cs.Effect = function(elm){
		if(elm) this.element = elm;
	};

	//メイン実行
	cs.Effect.prototype.START = function(){
		var myObj = this;
		this.settimer = setInterval(function(){myObj.LOOP()},myObj.fps);
	};

	//フレームレート
	cs.Effect.prototype.fps = 1000/30;

	cs.Effect.prototype.elementXY_Set = function(x,y){
		this.element.style.left = x + "px";
		this.element.style.top = y + "px";
	};

	/***************************************************************************************
	* @name : selectLink
	* セレクトメニューリンク
	*/
	cs.selectLink = function(elm){
		if(elm.nodeName.toUpperCase() != "SELECT") return false;
		cs.AEL(elm,"change",function(e){
			var tar = cs.target(e);
			if(tar.selectedIndex == 0 ) return false;
			location.href = tar.value;
		});
	};

	/***************************************************************************************
	* @name : setTab
	* タブ構築用
	*/
	cs.tabSet = function(_menuParent,_block){
		this.menuParent = "rankTab";
		this.block = "Block";

		if(_menuParent){
			this.menuParent = _menuParent;
		}
		if(_block){
			this.block = _block;
		}
	};

	cs.tabSet.prototype = {
		set : function(){
			this.tabs = cs.$$(cs.$(this.menuParent),"li");
			for(var i=0;i<this.tabs.length;i++){

				var o = this;

				cs.AEL(this.tabs[i],"click",function(e){
					cs.stopPropagation(e);
					cs.preventDefault(e);
					var tar = cs.target(e);
					var elm = tar.nodeName == "IMG" ? tar.parentNode.parentNode : tar.parentNode;
					o.clickHandle(elm,o);
					return false;
				});
			};
		},

		clickHandle : function(elm,obj){
			for(var i=0;i<obj.tabs.length;i++){
				obj.tabs[i].className = "";
				cs.$(obj.tabs[i].id + obj.block).style.display = "none";
			};
			elm.className = "current";
			cs.$(elm.id + obj.block).style.display = "block";
		}
	};

	/***************************************************************************************
	* @name :
	* 座標
	*/
	cs.getElementAbsPos = function(elm) {
		var obj = new Object();
		obj.x = elm.offsetLeft;
		obj.y = elm.offsetTop;
		while(elm.offsetParent) {
		   elm = elm.offsetParent;
		   obj.x += elm.offsetLeft;
		   obj.y += elm.offsetTop;
		}
		return obj;
	};

	cs.getMousePosition = function(e){
		var o = {};
		if(e){
			o.x = e.pageX;
			o.y = e.pageY;
		}else{
			o.x = event.x + document.body.scrollLeft;
			y.y = event.y + document.body.scrollTop;
		}
		return o;
	};

	cs.getElementPosition = function(elm){
		var o = {}
		var obj = cs.getElementAbsPos(elm);
		o.right = obj.x + elm.offsetWidth;
		o.left = obj.x;
		o.top = obj.y;
		o.bottom = obj.y + elm.offsetHeight;
		return o;
	};

	/***************************************************************************************
	* Movie Player
	*/

	cs.MP = new Object();
	cs.MP.swfPath = "/common/swf/player.swf";

	cs.MP.navis = ["navi_bb","navi_nb"];

	cs.MP.naviImg = {
		navi_bb : "/common/images/player/bb_btn_off.png",
		navi_bb_on : "/common/images/player/bb_btn_on.png",
		navi_nb : "/common/images/player/nb_btn_off.png",
		navi_nb_on : "/common/images/player/nb_btn_on.png"
	}

	cs.MP.tgt = "";

	cs.MP.flashvers = {
		MOVIE_PATH: "",
		MOVIE_WIDTH: "480",
		MOVIE_HEIGHT: "360",
		THUMBNAIL_PATH: "",
		AUTOPLAY: "true",
		LOOP: "false",
		SOUND: "true",
		VOLUME: "80",
		OVERLAY: "true",
		gaid: "",
		rule: ""
	}

	cs.MP.setGaid = function(_gaid){
		cs.MP.flashvers = _gaid;
	}

	cs.MP.embedMovie = function(_path,_target,_params){
		cs.MP.flashvers.MOVIE_PATH = _path;
		var flashvars = cs.MP.flashvers;
		var params = {base: ".",play: "true",loop: "false",menu: "false",quality: "best",wmode: "opaque",bgcolor:"#ffffff"};
		if(_params){
			for(var i in _params){
				params[i] = _params[i];
			};
		};

		var attributes = {};
		swfobject.embedSWF(cs.MP.swfPath,_target, "480", "390", "8.0.0", null, flashvars, params, attributes);
	};

	cs.MP.setImg = function(listId,imgElm){
		for(var i=0;i<cs.MP.navis.length;i++){
			cs.$(cs.MP.navis[i]).getElementsByTagName("IMG").item(0).src = cs.MP.naviImg[cs.MP.navis[i]];
		}
		imgElm.src = cs.MP.naviImg[listId + "_on"];
	};

	cs.MP.initMovieSwitch = function(_target){
		cs.MP.tgt = _target;
		var lists = cs.$$(cs.$("FMNavi"),"li");
		for(var i=0;i<lists.length;i++){
			cs.AEL(lists[i],"click",function(e){
				cs.preventDefault(e);
				var img = cs.target(e);
				var anc = img.parentNode;
				var list = anc.parentNode;
				cs.MP.setImg(list.id,img);
				cs.MP.embedMovie(anc.rel,cs.MP.tgt);
			});
		}
	};


	/***************************************************************************************
	* マウスオーバーでクラスをつける(nodelist)
	*
	*/
	cs.setMouseOverClass = function(_elms,_nodeName,_className,_filter){
		for(var i=0;i<_elms.length;i++){
			if(_filter && !cs.hasClass(_elms[i],_filter)) continue;

			if(_filter && cs.hasClass(_elms[i],_filter)){
				cs.AEL(_elms[i],"mouseover",function(e){
					var elm = cs.target(e);
					while((elm.nodeName.toUpperCase() != _nodeName) || (!cs.hasClass(elm,_filter))){
						elm = elm.parentNode;
					}
					cs.addClass(elm,_className);
				});

				cs.AEL(_elms[i],"mouseout",function(e){
					var elm = cs.target(e);
					while((elm.nodeName.toUpperCase() != _nodeName) || (!cs.hasClass(elm,_filter))){
						elm = elm.parentNode;
					}
					cs.removeClass(elm,_className);
				});
			}else{
				cs.AEL(_elms[i],"mouseover",function(e){
					var elm = cs.target(e);
					while(elm.nodeName.toUpperCase() != _nodeName){
						elm = elm.parentNode;
					}
					cs.addClass(elm,_className);
				});
				cs.AEL(_elms[i],"mouseout",function(e){
					var elm = cs.target(e);
					while(elm.nodeName.toUpperCase() != _nodeName){
						elm = elm.parentNode;
					}
					cs.removeClass(elm,_className);
				});
			}
		}
	}

	cs.navigationIdList = {
		global : ["taiken","soushoku","about","tvcm","fun"]
	}

	cs.setNavigationRollOver = function(){
		var gn = cs.$$(cs.$("nav"),"img");
		cs.setRollOverByElms(gn);
	}

	/***************************************************************************************
	* (それぞれのページで実行)
	*
	*/
	cs.setTopFlash = function(_target){
		var flashvars = {
			dataPath : ""
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			quality: "best",
			wmode: "transparent",
			bgcolor:"#FFFFFF"
		};
		var attributes = {id: "mainFlash"};

		swfobject.embedSWF("/swf/top.swf",_target, "600", "574", "8.0.0", null, flashvars, params, attributes);
	}

	cs.setTickerFlash = function(_target){
		var flashvars = {
			dataPath: "/xml/ticker.xml"
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			quality: "best",
			wmode: "transparent",
			bgcolor:"#ffffff"
		};
		var attributes = {id: _target};

		swfobject.embedSWF("/swf/ticker.swf", _target, "600", "25", "8.0.0", null, flashvars, params, attributes);
	}

	cs.setCmFlash = function(_target,_flvPath,_dataPath){
		var flashvars = {
			MOVIE_PATH: _flvPath,
			MOVIE_WIDTH: "176",
			MOVIE_HEIGHT: "132",
			THUMBNAIL_PATH: "",
			AUTOPLAY: "false",
			LOOP: "false",
			SOUND: "true",
			VOLUME: "80",
			OVERLAY: "true",
			LINK_PATH: _dataPath,
			LINK_TARGET: "_self"
		};

		var params = {
			base: ".",
			play: "true",
			loop: "false",
			menu: "false",
			quality: "best",
			wmode: "opaque",
			bgcolor:"#ffffff"
		};

		var attributes = {id: "contents"};

		swfobject.embedSWF("/common/swf/player_product.swf", _target,"176","132", "9.0.0", null, flashvars, params, attributes);
	};

	cs.setQuizFlash = function(_target,_gaid){
		var flashvars = {
			gaid : _gaid
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			wmode: "transparent",
			quality: "best"
		};
		var attributes = {id: _target};

		swfobject.embedSWF("/swf/fun/game/sozai_game.swf", _target, "570", "438", "9.0.0", null, flashvars, params, attributes);
	}

cs.setGameFlash = function(_target,_gaid){
		var flashvars = {
			gaid: _gaid
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			wmode: "window",
			bgcolor : "#ffffff",
			quality: "best"
		};
		var attributes = {id: _target};

		swfobject.embedSWF("/swf/fun/game/plant-bottle.swf", _target, "570", "480", "8.0.0", null, flashvars, params, attributes);
	};

	cs.setSlotFlash = function(_target,_gaid){
		var flashvars = {
			gaid: _gaid
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			wmode: "transparent",
			bgcolor : "#ffffff",
			quality: "best"
		};
		var attributes = {id: _target};
		swfobject.embedSWF("/swf/fun/slot_game/slot.swf", _target, "560", "354", "8.0.0", null, flashvars, params, attributes);
	}


	cs.setSlotRandomLinkFlash = function(_target,_gaid){
		var flashvars = {
			gaid: _gaid
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			wmode: "window",
			bgcolor : "#ffffff",
			quality: "best"
		};
		var attributes = {id: _target};
		swfobject.embedSWF("/swf/fun/slot_game/slot_randomLink.swf", _target, "570", "26", "9.0.0", null, flashvars, params, attributes);
	}


	cs.setKikouVoice = function(mealId){
		var flashvars = {
			sound_id: mealId
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			wmode: "window",
			bgcolor : "#ffffff",
			quality: "best"
		};
		var attributes = {id: "whisperBtnFlash"};

		swfobject.embedSWF("/swf/taiken/kikou/bgm.swf","whisperBtnFlash", "54", "13", "8.0.0", null, flashvars, params, attributes);
	};

	cs.setKikouVoice2 = function(mealId){
		var flashvars = {
			sound_id: mealId
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			wmode: "window",
			bgcolor : "#ffffff",
			quality: "best"
		};
		var attributes = {id: "whisperBtnFlash"};

		swfobject.embedSWF("/swf/taiken/kikou/bgm2.swf","whisperBtnFlash", "54", "13", "8.0.0", null, flashvars, params, attributes);
	};


	cs.setMobileMeloFlash = function(_target){
		var flashvars = {
			dataPath: ""
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			quality: "best",
			wmode: "opaque",
			bgcolor:"#ffffff"
		};
		var attributes = {id: _target};
		swfobject.embedSWF("/swf/mobile/tyakumero.swf", _target, "146", "43", "8.0.0", null, flashvars, params, attributes);
	};

	cs.decomeWinOpen = function(e){
		cs.preventDefault(e);
		var elm = cs.target(e);
		var url = elm.parentNode.href;
		cs.openWin(url,"956","450","decomeWin");
	};

	cs.setMobilePageInit = function(){
		cs.AEL(cs.$("openMobileDecomeWin"),"click",cs.decomeWinOpen);
	};

	cs.hideElement = function(elm){
		elm.style.display = "none";
	};

	cs.hideAttentionTxt = function(){
		if(document.body.id == "index"){
			cs.hideElement(cs.$("rightPBtlDesc"));
		};
	};

	cs.setSlideShowMini = function(_target,filepath){
		var flashvars = {
			xmlpath: filepath
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			quality: "best",
			wmode: "opaque",
			bgcolor:"#ffffff"
		};
		var attributes = {id: _target};
		swfobject.embedSWF("/common/swf/gallery_slide.swf", _target, "184", "150", "8.0.0", null, flashvars, params, attributes);
	};

	cs.setPhotoGallery = function(_target,_num,filepath){
		var flashvars = {
			xmlpath: filepath
		};
		var params = {
			play: "true",
			loop: "false",
			menu: "false",
			quality: "best",
			wmode: "opaque",
			bgcolor:"#ffffff"
		};
		var attributes = {id : _target};
		swfobject.embedSWF("/swf/soushoku/photocontest" + _num +"/gallery.swf", _target, "780", "553", "8.0.0", null, flashvars, params, attributes);

	};

	cs.setPhotoBookSlideShow1 = function(_target,_num,filepath){
		var params = {
			menu: "false",
			wmode: "window",
			bgcolor:"#FFFFFF"
		};
		var attributes = {id: "slideshow"};
		var flashvars = {xmlfile:"slide_list_01"};
		swfobject.embedSWF('../../../swf/taiken/photobook/slideshow.swf', attributes.id, '580', '175', '9.0.45', null, flashvars, params, attributes);

	};

	cs.setPhotoBookSlideShow2 = function(_target,_num,filepath){
		var params = {
			menu: "false",
			wmode: "window",
			bgcolor:"#FFFFFF"
		};
		var attributes = {id: "slideshow"};
		var flashvars = {xmlfile:"slide_list_02"};
		swfobject.embedSWF('../../../swf/taiken/photobook/slideshow.swf', attributes.id, '580', '175', '9.0.45', null, flashvars, params, attributes);

	};

	cs.setPhotoBookSlideShow3 = function(_target,_num,filepath){
		var params = {
			menu: "false",
			wmode: "window",
			bgcolor:"#FFFFFF"
		};
		var attributes = {id: "slideshow"};
		var flashvars = {xmlfile:"slide_list_03"};
		swfobject.embedSWF('../../../swf/taiken/photobook/slideshow.swf', attributes.id, '580', '175', '9.0.45', null, flashvars, params, attributes);

	};

	cs.setPhotoBookSlideShow4 = function(_target,_num,filepath){
		var params = {
			menu: "false",
			wmode: "window",
			bgcolor:"#FFFFFF"
		};
		var attributes = {id: "slideshow"};
		var flashvars = {xmlfile:"slide_list_04"};
		swfobject.embedSWF('../../../swf/taiken/photobook/slideshow.swf', attributes.id, '580', '175', '9.0.45', null, flashvars, params, attributes);

	};

	cs.setPhotoBookSlideShow5 = function(_target,_num,filepath){
		var params = {
			menu: "false",
			wmode: "window",
			bgcolor:"#FFFFFF"
		};
		var attributes = {id: "slideshow"};
		var flashvars = {xmlfile:"slide_list_05"};
		swfobject.embedSWF('../../../swf/taiken/photobook/slideshow.swf', attributes.id, '580', '175', '9.0.45', null, flashvars, params, attributes);

	};

	/*----------------------------------------
	* validates
	----------------------------------------*/
	cs.validate = {};

	cs.validate.delHtmlspecialchars = function(_str){
		_str = _str.replace(/</g,"");
		_str = _str.replace(/>/g,"");
		_str = _str.replace(/'/g,"");
		_str = _str.replace(/"/g,"");
		return _str;
	};

	/*----------------------------------------
	* -- ParamMatchPtns
	----------------------------------------*/
	cs.ParamMatchPtns = {};
	cs.ParamMatchPtns["id"] = /[?&](id=[0-9]+)/;

	/***************************************************************************************
	*
	* 	socialSettings
	*/

	/*----------------------------------------
	* Shareボタン、HappyボタンURLチェック用
	----------------------------------------*/
	cs.socialSettings = {};

	/*----------------------------------------
	* @name isIndexHtmPage
	* @description URLが/止のときに、index.htmをつける
	----------------------------------------*/
	cs.socialSettings.isIndexHtmPage = false;

	/*----------------------------------------
	*　@description URLに特定のパラメータをつける
	----------------------------------------*/
	cs.socialSettings.addParam = null;

	/*----------------------------------------
	*  @type String cs.ParamMatchPtnsのプロパティ名(idなど)
	*　@description マッチするパターン。
	----------------------------------------*/
	cs.socialSettings.ParamMatchPtn = null;


	/*----------------------------------------
	* @description デフォルトのMixiのデータキー・サービスキー
	----------------------------------------*/
	cs.socialSettings.mixiDataKey = "";
	cs.socialSettings.mixiServiceKey = "";

	/*----------------------------------------
	* @description デフォルトのタイトル
	----------------------------------------*/
	cs.socialSettings.ogTitle = "爽健美茶";

	/*----------------------------------------
	* @description デフォルトのデスクリプション
	----------------------------------------*/
	cs.socialSettings.ogDescription = "";

	/*----------------------------------------
	* @descriptoin デフォルトのイメージ
	----------------------------------------*/
	cs.socialSettings.ogImage = "";

	/*----------------------------------------
	* @descriptoin デフォルトのURL
	----------------------------------------*/
	cs.socialSettings.ogURL = "";

	/*----------------------------------------
	* open graphメタタグから内容をSocialSettingsにいれる
	----------------------------------------*/
	cs.socialSettings.setOgMetaData = function(){
		var d = document;

		var metas = d.getElementsByTagName("meta");
		for(var i=0;i<metas.length;i++){
			var p = (metas[i].getAttribute("property"));
			if(p == "og:title"){
				cs.socialSettings.ogTitle = metas[i].getAttribute("content")
			}else if(p == "og:description"){
				cs.socialSettings.ogDescription = metas[i].getAttribute("content")
			}else if(p == "og:image"){
				cs.socialSettings.ogImage = metas[i].getAttribute("content")
			}else if(p == "og:url"){
				cs.socialSettings.ogURL = metas[i].getAttribute("content");
			};
		};

		if(cs.socialSettings.ogTitle == ""){
			cs.socialSettings.ogTitle = d.title;
		};

		if(cs.socialSettings.ogURL == ""){
			cs.socialSettings.ogURL = cs.getRebuildUrl();
		};
		if(cs.socialSettings.ogDescription == ""){
			cs.socialSettings.ogDescription = "";
		};
	};

	/*----------------------------------------
	* @description ブラウザのブックマークをつける
	----------------------------------------*/
	cs.addBookmark = function(){
		var url = cs.socialSettings.ogURL;
		var ttl = cs.socialSettings.ogTitle;

		if(window.sidebar){
			window.sidebar.addPanel(ttl,url,'');
		}else if(window.opera && window.print){
			return true;
		}else if(document.all){
			window.external.AddFavorite(url,ttl);
		};
	};

	/*----------------------------------------
	* @descriptoin tweetボタンをdocument.writeで書き込む
	----------------------------------------*/
	cs.putTweetBtn = function(opt_obj){
		var title = cs.socialSettings.ogTitle;
		var url  = cs.socialSettings.ogURL;
		var description  = cs.socialSettings.ogDescription;

		if(typeof opt_obj == "string"){
			var imgPath = opt_obj;
		}else{
			var imgPath = opt_obj.imgPath;
			title = opt_obj.title ? opt_obj.title : title;
			url = opt_obj.url ? opt_obj.url : url;
			description = opt_obj.description ? opt_obj.description : description;
		};

		var txt = [];
		txt.push(description);
		txt.push(title);
		txt.push(" ");
		txt.push(url);

		var tag = [];
		tag.push('<a href="');
		tag.push('http://twitter.com/?status=');
		tag.push(encodeURIComponent(txt.join("")));
		tag.push('" target="_blank"><img src="');
		tag.push(imgPath);
		tag.push('" alt="Twitterに投稿する" title="Twitterに投稿する"></a>');

		document.write(tag.join(""));
	};

	/*----------------------------------------
	* @descriptoin tweetボタンをdocument.writeで書き込む
	----------------------------------------*/
	cs.putOfficialTweetBtn = function(opt_obj){
		var title = cs.socialSettings.ogTitle;

		if(opt_obj){
			title = opt_obj.title ? opt_obj.title : title;
		};

		var txt = [];
		txt.push(title);
		//txt.push(" ");
		//txt.push(cs.socialSettings.ogURL);

		var tag = [];
		tag.push('<a href="');
		tag.push('http://twitter.com/share');
		tag.push('" rel="twitter" target="_blank" data-lang="ja" data-text="');
		tag.push(txt.join(""));
		tag.push('" class="twitter-share-button" data-count="none" data-via="">ツイートする</a>');
		tag.push('<script type="text/javascript" src="http://platform.twitter.com/widgets.js" charset="utf-8"></script>');
		document.write(tag.join(""));
	};


	/*----------------------------------------
	* @descriptoin mixiボタンをdocument.writeで書き込む
	----------------------------------------*/
	cs.putMixiBtn = function(opt_datakey){
		var dataKey = opt_datakey ? opt_datakey : cs.socialSettings.mixiDataKey;

		document.write('<a href="http://mixi.jp/share.pl" class="mixi-check-button" data-button="button-1" rel="mixi" data-key="' + dataKey + '">Check</a><script type="text/javascript" src="http://static.mixi.jp/js/share.js"></script>');
	};

	cs.putMixiGoodBtn = function(opt_obj){
		var serviceKey = cs.socialSettings.mixiServiceKey;
		var url = cs.socialSettings.ogURL;


		if(opt_obj){
			if(typeof opt_obj == "string"){
				serviceKey = opt_obj;

			}else if(typeof opt_obj == "object"){
				serviceKey = opt_obj.serviceKey ? opt_obj.serviceKey : serviceKey;
				url = opt_obj.url ? opt_obj.url : url;
			};
		};

		document.write('<iframe scrolling="no" frameborder="0" allowTransparency="true" style="overflow:hidden; border:0; width:58px; height:20px" src="http://plugins.mixi.jp/favorite.pl?href=' + encodeURIComponent(url) + '&service_key=' + serviceKey + '&show_faces=false&width=58"></iframe>');
	};


	cs.putMixiCheckBtn = function(opt_obj){
		var serviceKey = cs.socialSettings.mixiServiceKey;
		var url = cs.socialSettings.ogURL;


		if(opt_obj){
			if(typeof opt_obj == "string"){
				serviceKey = opt_obj;

			}else if(typeof opt_obj == "object"){
				serviceKey = opt_obj.serviceKey ? opt_obj.serviceKey : serviceKey;
				url = opt_obj.url ? opt_obj.url : url;
			};
		};

		var myStr = '<a href="http://mixi.jp/share.pl?u=' + encodeURIComponent(url) + '&k=' + serviceKey + '" onclick="';
		myStr += "window.open('http://mixi.jp/share.pl?u=" + encodeURIComponent(url) + "&k=" + serviceKey + "','mixicheck','width=632,height=456,location=yes,resizable=yes,toolbar=no,menubar=no,scrollbars=no,status=no'); return false;";
		myStr += '"><img src="/common/images/btn_mixi_off.png" width="24" height="24" /></a>';
		document.write(myStr);
	};


	cs.putFBLikeBtn = function(opt_obj){
		var url = cs.socialSettings.ogURL;

		if(opt_obj){
			url = opt_obj.url ? opt_obj.url : url;
		};

		document.write("<iframe src='http://www.facebook.com/plugins/like.php?href="+ encodeURIComponent(url) +"&layout=button_count&show_faces=false&width=70&action=like&colorscheme=light&height=26' scrolling='no' frameborder='0' allowTransparency='true'></iframe>");
	};


	cs.putFBShareBtn = function(opt_obj){
		var url = cs.socialSettings.ogURL;

		if(opt_obj){
			url = opt_obj.url ? opt_obj.url : url;
		};

		var myStr = '<a href="http://www.facebook.com/share.php?u=' + encodeURIComponent(url) + '" onclick="';
		myStr += "window.open(this.href, 'window', 'width=800,height=600,personalbar=0,toolbar=0,scrollbars=1,resizable=1'); ";
		myStr += 'return false;"><img src="/common/images/btn_facebook_off.png" width="24" height="24" /></a>';
		document.write(myStr);
	};


	cs.putHappyBtn = function(opt_obj){
		var title = cs.socialSettings.ogTitle;
		var url = cs.socialSettings.ogURL;

		if(opt_obj){
			title = opt_obj.title ? opt_obj.title : title;
			url = opt_obj.url ? opt_obj.url : url;
		};

		document.write('<iframe scrolling="no" frameborder="0" allowTransparency="true" style="overflow:hidden; border:0; width:105px; height:44px" src="https://secure-c.cocacola.co.jp/happy/index.htm?page_title=' + encodeURIComponent(title) + '&page_url=' + encodeURIComponent(url) + '"></iframe>');
	};


	cs.putShareBtn = function(opt_obj){
		var title = cs.socialSettings.ogTitle;
		var url = cs.socialSettings.ogURL;
		var txt = '';


		if(opt_obj){
			var title = opt_obj.title ? opt_obj.title : title;
			var url = opt_obj.url ? opt_obj.url : url;
			var txt = opt_obj.txt ? opt_obj.txt : "";
		};

		document.write('<iframe scrolling="no" frameborder="0" allowTransparency="true" style="overflow:hidden; border:0; width:120px; height:44px" src="https://secure-c.cocacola.co.jp/share/index.htm?page_title=' + title + '&page_url=' + url + '&shrtxt='+ txt +'"></iframe>');
	};

	cs.addBookMarkEvent = function(opt_id){
		cs.addEventListener(cs.$(opt_id),"click",cs.addBookmark);
	};


	cs.hasFileName = function(){
		var str = location.href;
		if(str.match(/\/$/)){
			return false;
		}else{
			return true;
		}
	};

	cs.getFullUrl = function(){
		var str = location.href;
		str = cs.validate.delHtmlspecialchars(str);

		if(str.match(/\/$/)){
			if(cs.socialSettings.isIndexHtmPage){
				return str + "index.htm";
			}else{
				return str + "index.html";
			};
		}else{
			str = str.replace(location.hash,"");
			str = str.replace(location.search,"");

			if(str.match(/\/$/)){
				str = cs.socialSettings.isIndexHtmPage ? str + "index.htm" : str + "index.html";
			};
			return str;
		};
	};

	/*----------------------------------------
	* @description URLをフォーマットにそろえる
	----------------------------------------*/
	cs.getRebuildUrl = function(){
		var l = location;
		var s = l.search;
		var r = "";

		var lu = l.href;
		lu = cs.validate.delHtmlspecialchars(lu);

		if(r = lu.match(/(\#[^?]+)/)){
			lu = lu.replace(r[0],"");
		};

		if(r = lu.match(/\?.*/)){
			lu = lu.replace(r[0],"");
		};

		if(cs.ParamMatchPtns[cs.socialSettings.ParamMatchPtn] && (r = s.match(cs.ParamMatchPtns[cs.socialSettings.ParamMatchPtn]))){
			lu = lu + "?" + r[1];
			lu = lu.replace("/index.htm","/");
		}else if(lu.match(/\/$/)){

			lu = cs.socialSettings.addParam ? lu + cs.socialSettings.addParam : cs.socialSettings.isIndexHtmPage ? lu + "index.htm" : lu + "index.html";

		}else if(cs.socialSettings.addParam && lu.match(/\/index\.htm$/)){
			lu = lu.replace("/index.htm","/");
			lu = lu + cs.socialSettings.addParam;
		};
		return lu;
	};

	/***************************************************************************************
	* デフォルトの共通処理(全ページで実行)
	*
	*/

	cs.main = function(){
		/*if(cs.$("navBlock")){
			cs.setNavigationRollOver();
		}*/
		cs.setRollOverByClassName("ro");

		/*if(cs.$("pageTopBtn")){
			if(cs.$("contents").className.indexOf("wide") != -1){
				cs.$("pageTopBtn").innerHTML += '<div id="pageTopBG"><a href="#contents"><img src="/common/images/bg_pagetop_wide.gif" alt=""></a></div>';
			}else{
				cs.$("pageTopBtn").innerHTML += '<div id="pageTopBG"><a href="#contents"><img src="/common/images/bg_pagetop.gif" alt=""></a></div>';
			}
		}

		if(cs.$("infoBlock")){
			var tmpHgt = cs.$("navBlock").offsetHeight > cs.$("infoBlock").offsetHeight ? cs.$("navBlock").offsetHeight : cs.$("infoBlock").offsetHeight;
		}else{
			var tmpHgt = cs.$("navBlock").offsetHeight;
		}

		if((cs.$("contents").offsetHeight < tmpHgt) && cs.ua.indexOf("msie") != -1){
			cs.$("contents").style.height = tmpHgt + "px";
		}else if(cs.$("contents").offsetHeight < tmpHgt){
			cs.$("contents").style.minHeight = tmpHgt + "px";
		}else{
		}

		// IE6用ウィンドウサイズチェック
		if(cs.ua.indexOf("msie 6.0") != -1){
			cs.docHgt = cs.$("wrapper").offsetHeight + cs.$("ccCommonFooter").offsetHeight;
			cs.winHgt = document.documentElement.clientHeight;
			if(cs.docHgt < cs.winHgt){
				cs.ftHgt = cs.$("ccCommonFooter").offsetHeight;
				window.setInterval(chkWinSize, 16);
			}
		}*/
	};
	cs.AEL(window,"load",function(){cs.main();});
	//cs.setLoadFunction(function(){cs.main();});
};

function openWin(url,width,height,winname){
 newWin = window.open("",winname,"width=" + width +",height=" + height +",toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1");
 newWin.location.href = url;
 newWin.focus();
 return false;
};

function chkWinSize(){
	if(cs.$("ccCommonFooter")){
		cs.winHgt = document.documentElement.clientHeight;
		cs.$("ccCommonFooter").style.height = (cs.ftHgt - 30 + (cs.winHgt-cs.docHgt) + "px");
	}
}
