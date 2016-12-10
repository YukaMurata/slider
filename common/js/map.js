/*=========================================
//
//	control google map
//
=========================================*/

// 初期設定
var objMap = new Object();

objMap.canvas = 'mapCanvas';
objMap.mapZoom = 13;

// 位置情報
objMap.datafile = "locdata.json";
objMap.locData = new Array();
objMap.locList = "locList";

objMap.marker = new Array();
objMap.markerData = new Array();

//最後に開いた情報ウィンドウを記憶
objMap.currentInfoWindow = null;

// 座標オブジェクトの作成
objMap.objMapPosition = new Object();
objMap.objMapPosition = function(){
	this.lat = 0;
	this.lng = 0;
}

// マーカーインスタンスの作成
objMap.objMarker = new Object();
objMap.objMarker = function(){
	this.position = new objMap.objMapPosition();
	this.name = "";
}


/*============================================
//
//	MAP表示処理
//
============================================*/

google.maps.event.addDomListener(window, 'load', function() {
	var mapData = location.pathname.substr(0, location.pathname.lastIndexOf("/")) + "/" + objMap.datafile;
	
	$.ajax({
		url: mapData,
		type: 'POST',
		dataType: 'JSON',
		success:function(req){
			objMap.locData = req;
		
			objMap.map = objMap.fncInitMap(objMap.map);
			objMap.fncSetMarker(objMap.locData);
	//		objMap.selectMarker(0);
		}
	});
	
	objMap.locList = cs.d.getElementById(objMap.locList).getElementsByTagName("li");
	
	for(var i = 0; i < objMap.locList.length; i++){
//		objMap.locList[i].getElementsByTagName("a").item(0).setAttribute("href", "#");
		objMap.locList[i].getElementsByTagName("a").item(0).setAttribute("onclick", "objMap.selectMarker(" + i + "); return false;");
	}
});

/*=========================
//	初期化
=========================*/

objMap.fncInitMap = function(vobjMap){
	var showMap = cs.d.getElementById(objMap.canvas);
	
	// 地図初期データ設定
	var myOptions = {
		zoom: objMap.mapZoom,
		center: new google.maps.LatLng(objMap.locData[0].Lat, objMap.locData[0].Lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scaleControl: true
	};

	// 地図描画
	vobjMap = new google.maps.Map(showMap, myOptions);
	
	return vobjMap;
}

/*=========================
//	地図操作関連イベント
=========================*/

objMap.fncSetMarker = function(vlocData){

	// マーカーの設定
	var aclsMarker = new Array();

	for(var i=0; i < vlocData.length; i++){
		aclsMarker[i] = new objMap.objMarker();
		aclsMarker[i].position.lat = vlocData[i].Lat;
		aclsMarker[i].position.lng = vlocData[i].Lng;
		aclsMarker[i].name = vlocData[i].LocName;
		aclsMarker[i].adress = vlocData[i].Address;
		aclsMarker[i].tel = vlocData[i].TEL;
		aclsMarker[i].uri = vlocData[i].URI;
		aclsMarker[i].image = vlocData[i].IMAGE;
	}
	
	// InfoWindow内の設定
	for(i=0; i<aclsMarker.length; i++){
		var tmpCont = '<img class="gmThumb" src="'+ aclsMarker[i].image +'" alt=""><dl><dt>' + aclsMarker[i].name + '</dt>\n<dd>' + aclsMarker[i].adress + '</dd>';
		tmpCont += aclsMarker[i].tel.length ? '<dd>' + aclsMarker[i].tel + '</dd>' : '';
		tmpCont += aclsMarker[i].uri.length ? '<dd><a href="' + aclsMarker[i].uri + '" target="_blank">' + aclsMarker[i].uri + '</a></dd>' : '';
		tmpCont += '</dl>';
		
		objMap.markerData[i] = ({
			position: new google.maps.LatLng(aclsMarker[i].position.lat,aclsMarker[i].position.lng),
			content: tmpCont
		});
	}
	
	// Markerのセット
	for(i=0; i<objMap.markerData.length; i++){
		var marker = new google.maps.Marker({
			position:objMap.markerData[i].position,
			map:objMap.map,
			title:aclsMarker[i].name,
			icon:"/common/images/kikou/map/gMarker_bottle.png",
			shadow:"/common/images/kikou/map/gMarker_bottle_shadow.png"
		});
		
		objMap.attachMarker(marker, objMap.markerData[i].content);
		objMap.marker[i] = marker;
	}

	return;
}

// マーカークリック
objMap.attachMarker = function(marker, msg){
	google.maps.event.addListener(marker, 'click', function() {
		objMap.map.panTo(marker.position);
		objMap.showInfoWindow(marker, msg);
	});
}

// リストクリック
objMap.selectMarker = function(num){
	objMap.map.panTo(objMap.marker[num].position);
	objMap.showInfoWindow(objMap.marker[num], objMap.markerData[num].content);
}

objMap.showInfoWindow = function( target, msg ){
	var infowindow = new google.maps.InfoWindow({ content:msg });
	
	infowindow.open(objMap.map, target);
	
	// close old and save new infowindow
	if(objMap.currentInfoWindow) objMap.currentInfoWindow.close();
	objMap.currentInfoWindow = infowindow;
}