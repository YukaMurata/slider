(function(){
	'use strict';
	var dom = {}, key_visual;
	var flag = {
		twitter: false,
		facebook: false,
		set_voice: false,
		image: false,
		intro: false
	};
	var param = {
		intro: 3000
	};

	var puyoList = {};

	//ソーシャルボイスデータの読み込み（API通信）
	var voice = [];
	//APIからソーシャルボイスを取得
	SKB_SP.api('getFbPhotos',5).done(function(d){
		flag.facebook = true;
		var _voice = {};
		//d.photos.sort(function(){ return Math.random() -0.5; });
		for(var _index = 0, _length = 2; _index < _length; _index++){
			_voice = {
				sns: 'facebook',
				type: 'photo',
				post_photo: d.photos[_index].picture,
				url: 'https://www.facebook.com/photo.php?fbid='+d.photos[_index].id
			}
			voice.push(_voice);
		}
		checkReady();
	});

	//関連画像の読み込み完了後描画
	var checkReady = function (){
		if(!flag.facebook){ return false; }
		if(flag.image){
			setSocialVoice();
			//if(document.cookie.indexOf('intro_view_spn=1') == -1){
			//	setTimeout(startIndex, param.intro);
			//	var _date = new Date();
			//	_date.setDate( _date.getDate() + 1 );
			//	_date.setHours(0); _date.setMinutes(0); _date.setSeconds(0);
			//	document.cookie = 'intro_view_spn=1; path=/spn/; expires=' + _date.toGMTString();
			//}else{
			//	startIndex();
			//}
			startIndex();
		}
	};


	//トップページの開始
	var startIndex = function () {
		if(!flag.image || !flag.facebook){ return false; }
		dom.container.removeClass('ready');
		dom.bg.addClass('normal');
		//setKeyVisual();

		//余計な縦幅を作らない
		//$('#mainVisualOuter').css({height: $(window).height()+'px'});

		//キーヴィジュアル
		puyoList['keyVisual'] = new SKB_SP.Puyo('canvas-keyVisual');

		//素材
		var _html, _images, _delay;
		var materials = [1,2,3,4,5,6,7,8,9,10,11,12];
		materials.sort(function(){ return Math.random() - 0.5;});
		for(var i = 0; i < 1; i++){
			_html = '<li class="material no'+ (i+1) +'"><a href="/spn/products/sozai_catalog.html"><canvas id="canvas-material'+ i +'" width="300" height="240" data-img="photo_material'+ materials[i] +'.jpg"></canvas></a></li>';
			$('#elementContents').append(_html);
			puyoList['material'+i] = new SKB_SP.Puyo('canvas-material'+i);
		}

		//メニュー
		$('#elementContents li.contents').each(function(index, element){
			//ボタニカルストーリーはランダム画像
			if($(element).hasClass('botanical')){
				var _image = 'image_botanical_story_' + (Math.floor(Math.random() * 12) + 1) + '.jpg';
				$(element).find('canvas').attr({'data-img': _image});
			}
			puyoList['contents_'+index] = new SKB_SP.Puyo($(element).find('canvas')[0]);
		});

		$('#elementSocial li').each(function(index, element){
			console.log('sns poyo');
			puyoList['social_'+index] = new SKB_SP.Puyo($(element).find('canvas')[0]);
		});

		loopAnimation();
	};

	var setKeyVisual = function () {
		key_visual = SKB_SP.Scroll('iscrollWrapper',{
			useTransition: false,
			bounce: false,
			mouseWheel: true,
			scrollbars: true,
			click: true,
			momentum: false
		});
		if(window.navigator.userAgent.toLowerCase().indexOf('android') != -1){
			//Android
			key_visual.on('scrollEnd', _onScroll);
		}else{
			key_visual.onScroll(_onScroll);
		}
	};

	var setSocialVoice = function () {
		var _html = '', _no = 1, _delay,
		order = {facebook:{photo:0}, twitter:{photo:0,text:0}},
		_prev = {sns:null, type:null};
		for(var _index = 0, _length = voice.length; _index < _length; _index++){
			order[voice[_index].sns][voice[_index].type]++;
			_no = order[voice[_index].sns][voice[_index].type];
			_delay = 1 + Math.floor(Math.random() * 4);
			_html += '<li class="'+voice[_index].sns+' '+voice[_index].type+' no'+_no+' delay'+_delay+'">';
			_html += '<a href="'+voice[_index].url+'" target="_blank">';
			_html += '<canvas width="140" height="110"></canvas>';
			if(voice[_index].type === 'photo'){
				_html += '<img src="'+voice[_index].post_photo+'" width="100">';
			}else if(voice[_index].type === 'text'){
				_html += '<p>'+voice[_index].tweet+'<span class="screen-name">'+voice[_index].screen_name+'</span></p>';
			}
			_html += '</a>';
			_html += '</li>';
			_prev.sns = voice[_index].sns;
			_prev.type = voice[_index].type;
		}
		dom.socialVoice.empty().html(_html);
	};


	//iScroll上でのスクロール発生
	var before_scroll;
	var _onScroll = function () {
		var _translate = {
			'transform':'translate(0,'+this.y+'px)',
			'-webkit-transform':'translate(0,'+this.y+'px)',
			'-moz-transform':'translate(0,'+this.y+'px)'
		};
		$('#mainVisualOuter li').css(_translate);
		$('#elementLeaf').css(_translate);
	};

	var loopAnimation = function () {
		for(var cv in puyoList){
			puyoList[cv].update();
		}
		if(typeof requestAnimationFrame !== 'undefined'){
			requestAnimationFrame(loopAnimation);
		}
	}


	$(function(){
		dom = {
			container: $('#container'),
			header: $('header'),
			loginForm: $('#loginForm'),
			globalNavi: $('#globalNavi'),
			//socialVoice: $('ul.main-visual.element-social')
			socialVoice: $('#elementSocial'),
			bg: $('#mainVisualOuter')
		};

		$('body, html').scrollTop(0);
		//イントロ時にはスクロールさせない
		dom.container.on('mousewheel touchmove', function(e){
			if(flag.intro){
				$(this).off('mousewheel touchmove');
			}else{
				e.preventDefault();
				$('body, html').scrollTop(0);
			}
		});
		dom.container.on('transitionend webkitTransitionEnd', function(e){
			e.stopPropagation();
			if(!$(this).hasClass('ready')){
				$(this).addClass('normal');
			}
		});

		//ヘッダー部分でスクロール不能にする
		$('div.fb-like-box, div.tw-box').on('touchmove mousewheel scroll', function(e){
			e.preventDefault();
		});

		$(window).on('scroll', function(e){
			if(!flag.intro){
				e.preventDefault();
				$('html, body').scrollTop(0);
			}
			//Androidのフォーム展開時はscroll許可
			if(SKB_SP.flag.janrain === null){
				//$('html, body').scrollTop(0);
			}
		});

		//イントロ完了後にフラグを立てる
		dom.header.on('webkitTransitionEnd transitionend', function(e){
			e.stopPropagation();
			flag.intro = true;
			//Androidのちらつき対策
			if(!SKB_SP.flag.globalNavi){
				dom.globalNavi.addClass('hidden');
			}
		});
		dom.globalNavi.addClass('hidden');

		//背景画像を読込んだ後、指定秒数後にイントロ終了
		//var _bg_image = $('#mainVisualOuter').attr('class').replace(/bg([0-9]+)/,'bg_mainVisual$1.jpg');
		//_bg_image = '/spn/images/index/' + _bg_image;

		//if(document.cookie.indexOf('intro_view_spn=1') == -1){
		//	var _bg_image = ['/spn/images/index/bg_bottle01.png', '/spn/images/common/bg_bottom01.png', '/spn/images/common/bg_main01.png'];
		//	SKB_SP.loadImages(_bg_image).done(function(){
		//		flag.image = true;
		//		checkReady();
		//	});
		//}else{
		//	dom.container.addClass('no-intro');
		//	flag.image = true;
		//	checkReady();
		//}

		dom.container.addClass('no-intro');
		flag.image = true;
		checkReady();
	});

	//Android2バグのための ログインフォーム対策
	//全デバイスで適用
	var header_contents, globalNavi_contents;
	SKB_SP.android_login = function () {
		var _tapped = $(this).attr('data-widget');
		//閉じるボタン
		if(typeof _tapped === 'undefined'){
			SKB_SP.flag.janrain_before = flag.janrain;
			SKB_SP.flag.janrain = null;
		//今開いているボタン
		}else if(_tapped === SKB_SP.flag.janrain){
			SKB_SP.flag.janrain = null;
		}else{
			if(_tapped === SKB_SP.flag.janrain_before){
				SKB_SP.flag.janrain_before = null;
				return false;
			}
			SKB_SP.flag.janrain = _tapped;
		}

		if(SKB_SP.flag.janrain !== null){
			/*
			if(typeof key_visual !== 'undefined'){
				key_visual.scrollTo(0,0);
				key_visual.destroy();
			}
			*/
			$('#iscrollWrapper').hide();
			$('#mainVisualOuter').hide();

			$('#janrainCaptureWidget').css({position: 'relative', top:0}).addClass('isolate');
			$('#mainVisualOuter').hide();
			dom.container.css({height:'auto'});
			dom.container.find('header').addClass('relative');
			dom.container.find('.main-contents').hide();
			dom.container.find('footer').hide();
			$('#globalNavi').hide();

			$('body').addClass('form-open');
		}else{
			$('html, body').scrollTop(0);
			$('#iscrollWrapper').removeAttr('style');
			$('#mainVisualOuter').show();
			dom.container.find('.main-contents').removeAttr('style');
			dom.container.find('header').removeClass('relative');
			dom.container.find('footer').removeAttr('style');
			dom.container.removeAttr('style');
			$('#globalNavi').removeAttr('style');
			$('body').removeClass('form-open');
		}

	};

})();

SKB_SP.Puyo = function(id){
	'use strict';
	var that = this;
	var canvas, context, pattern, mask, base, line, image;
	var image_dir = '/spn/images/index/';


	var init = function() {
		image = new Image();
		//画像の読み込み
		image.onload = function() {
			pattern = context.createPattern(image, 'repeat');
			that.draw();
		};


		if(typeof id === 'string'){
			canvas = document.getElementById(id);
		} else {
			canvas = id;
		}

		context = canvas.getContext('2d');
		base = new octagon(canvas, 1);
		line = new octagon(canvas, 1);

		//背景画像の指定があるかどうか
		var _pattern_image = $(canvas).attr('data-img');
		if(_pattern_image){
			mask = new octagon(canvas, 0.98);
			//image.src = image_dir + $('#' + id).attr('data-img');
			image.src = image_dir + $(canvas).attr('data-img');
			//console.log(id, image.src);
		}else{
			that.draw();
		}
	};

	//頂点オブジェクト
	var point = function (canvas, x, y) {

		//基本位置 base
		this.bX = x;
		this.bY = y;
		//早さ velocity
		this.vX = 0;
		this.vY = 0;

		//位置 position
		var _capacity = 0.03
		this.pX = this.bX + canvas.width * _capacity/2 - Math.random() * canvas.width * _capacity;
		this.pY = this.bY + canvas.width * _capacity/2 - Math.random() * canvas.height * _capacity;

		//
		this.thetaX = 0;
		this.thetaY = 0;
		this.increaseThetaX = Math.PI * Math.random()/100;
		this.increaseThetaY = Math.PI * Math.random()/100;

		this.move = function () {
			this.thetaX += this.increaseThetaX;
			this.thetaY += this.increaseThetaY;

			this.pX = this.bX + Math.sin(this.thetaX) * 3;
			this.pY = this.bY + Math.sin(this.thetaY) * 3;
		};
	};

	//八角形オブジェクト
	var octagon = function (canvas, scale) {
		var _this = this;
		var _scale = scale || 0.9;
		var _aspect = canvas.width / canvas.height;
		var _x, _y, _h;
		//制御点、頂点
		this.controls = [], this.apexes = [{}];

		//制御点から頂点を指定
		this.setApex = function () {
			var _length = this.controls.length;
			for(var index = 0; index < _length; index++){
				if(index > 0){
					_h = (Math.pow(this.controls[index-1].pX,2) + Math.pow(this.controls[index-1].pY,2)) / (Math.pow(this.controls[index-1].pX,2) + Math.pow(this.controls[index-1].pY,2) + Math.pow(this.controls[index].pX,2) + Math.pow(this.controls[index].pY,2));

					this.apexes[index] = {};
					this.apexes[index].pX = this.controls[index-1].pX + (this.controls[index].pX - this.controls[index-1].pX) * _h;
					this.apexes[index].pY = this.controls[index-1].pY + (this.controls[index].pY - this.controls[index-1].pY) * _h;
				}
			}
			this.apexes[0].pX = this.controls[index-1].pX + (this.controls[0].pX - this.controls[index-1].pX) * _h;
			this.apexes[0].pY = this.controls[index-1].pY + (this.controls[0].pY - this.controls[index-1].pY) * _h;
		};

		this.drawPath = function (context) {
			var _length = _this.controls.length;

			context.moveTo(_this.apexes[0].pX, _this.apexes[0].pY);
			for(var index = 0; index < _length; index++){
				if(index+1 < _length){
					context.quadraticCurveTo(_this.controls[index].pX, _this.controls[index].pY, _this.apexes[index+1].pX, _this.apexes[index+1].pY);
				}else{
					context.quadraticCurveTo(_this.controls[index].pX, _this.controls[index].pY, _this.apexes[0].pX, _this.apexes[0].pY);
				}
			}
		};


		for(var index = 0; index < 8; index++){
			_x = Math.cos(index * Math.PI/4 + Math.PI/8) * canvas.width/2 * _scale;
			_y = Math.sin(index * Math.PI/4 + Math.PI/8) * canvas.height/2 * _scale;
			if(index === 1 || index === 6) {
				_x += canvas.width * _scale * 0.1;
			}else if(index === 2 || index === 5) {
				_x -= canvas.width * _scale * 0.1;
			}
			this.controls[index] = new point(canvas, _x, _y);
		}

		this.setApex.apply(this);

	};

	//描画
	this.draw = function () {
		context.clearRect(0,0, canvas.width, canvas.height);

		if(typeof mask !== 'undefined'){
			context.translate(canvas.width/2-5, canvas.height/2-5);
			context.fillStyle = pattern;
			context.translate(5, 5);

			context.beginPath();
			mask.drawPath(context);
			context.closePath();
			context.translate(-canvas.width/2, -canvas.height/2);

			if(id === 'canvas-keyVisual'){
				context.translate(0,-45);
			}
			context.fill();

			if(id === 'canvas-keyVisual'){
				context.translate(0,45);
			}
		}


		context.globalCompositeOperation = 'destination-over';
		context.translate(canvas.width/2, canvas.height/2);
		context.fillStyle = 'rgba(225,225,225,0.7)';
		//context.fillStyle = 'rgba(255,255,255,0.7)';
		context.beginPath();
		base.drawPath(context);
		context.closePath();
		context.fill();
		context.translate(-canvas.width/2, -canvas.height/2);


		context.globalCompositeOperation = 'source-over';
		context.translate(canvas.width/2, canvas.height/2);
		context.fillStyle = '';
		context.strokeStyle = 'rgba(255,255,255,0.9)';
		context.beginPath();
		line.drawPath(context);
		context.closePath();
		context.stroke();
		context.translate(-canvas.width/2, -canvas.height/2);

	};

	this.update = function () {

		var _length = base.controls.length;
		for(var index = 0; index < _length; index++){
			if(typeof mask !== 'undefined') mask.controls[index].move();
			base.controls[index].move();
			line.controls[index].move();
		}
		if(typeof mask !== 'undefined') mask.setApex();
		base.setApex();
		line.setApex();

		this.draw();
	};
	init();
};

