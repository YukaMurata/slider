function isIPod(ua){return /ipod/.test(ua);}

function isIPad(ua){return /ipad/.test(ua);}

function isIPhone(ua){return /iphone/.test(ua);}

function isAndroid(ua){return /android/.test(ua);}

function isAndroidMobile(ua){return /android.*mobile/.test(ua);}

function isSmartPhone(){
	var ua = navigator.userAgent.toLowerCase();
	return (isIPod(ua) || isIPhone(ua) || isAndroidMobile(ua));
}

function spnRedirect(linkURL){
	if (isSmartPhone()){
		location.href="/spn" + linkURL;
	}
}

function spnRedirectForLine(){
	if (isSmartPhone()){
		location.href="http://pr.line.naver.jp/sokenbicha/";
	}
}
