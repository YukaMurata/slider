var SKB_SP = (function(){
	'use strict';
	var dom = {}, iscroll;
	var flag = {
		globalNavi: false,
		loginForm: false,
		loginForm_alone:false,
		janrain: null,
		janrain_before: null
	};
	$(function(){
		dom = {
			container: $('#container'),
			header: $('header'),
			loginForm: $('#loginForm'),
			globalNavi: $('#globalNavi'),
			bg: $('#mainVisualOuter')
		};
		$('body').addClass('domcontentloaded');
		dom.header.on('transitionend webkitTransitionEnd', _onOpenGlobalNavi);
		dom.globalNavi.on('touchmove mousemove scroll mousewheel', function(e){
			e.preventDefault();
		});


		dom.container.on('click', 'a.btn', _bindBtn);
		dom.container.on('click', 'a.btn-ancher', _bindAncher);
		dom.container.on('click', function(e){
			if(flag.globalNavi && !$(e.target).hasClass('menu')){
				e.preventDefault();
				dom.header.find('a.btn.menu').click();
			}
		});



		//Android フォーム対策
		//if(window.navigator.userAgent.toLowerCase().indexOf('android') != -1){
			dom.header.on('click', '.cc-member-btn', function(e){
				SKB_SP.android_login.apply(this);
			});
			$(document).on('click', '#janrainCaptureWidget a.cc-member-close', function(e){
				SKB_SP.android_login.apply(this);
			});
		/*
		} else if (dom.container.hasClass('top') || dom.container.hasClass('sozai_catalog')) {
			dom.header.on('click', '.cc-member-btn', function(e){
				$('#janrainCaptureWidget').addClass('fix-height');
			});
		}
		*/

		//液面の推移対策
		if(dom.bg.size() > 0 && window.navigator.userAgent.toLowerCase().indexOf('iphone') != -1){
			dom.bg.height(window.innerHeight);
			$(window).on('resize scroll', function (e) {
				dom.bg.height(window.innerHeight);
			});
		}

		var _ticker = [];
		$('.js-twitter-ticker').each(function(i,el){
			var _place = $(el).attr('data-place');
			_ticker[i] = SKB_SP.Ticker(el, Number(_place));
		});

		if(location.hash && $(location.hash).length){
			$('html, body').animate({scrollTop: $(location.hash).offset().top - 55});
		}


		//iPhoneバグ対策
		if(window.navigator.userAgent.toLowerCase().indexOf('iphone') != -1){
			dom.container.find('footer').addClass('lower');
		}

		//ログイン失敗時
		if($('#gaid').text() == '' && location.search.match('login=1')){
			dom.header.find('a.btn.login').click();
		}

		//ランダムバナー
		if($('img.random-banner').size() > 0){
			$('img.random-banner').each(function(i, img){
				var _number = Math.floor(Math.random() * Number($(img).attr('data-num'))) + 1;
				var _type = ($(img).attr('data-type'))? $(img).attr('data-num') : 'png';
				var _src = '/spn/images/' + $(img).attr('data-img') + '_' + _number + '.' + _type;
				$(img).attr({src: _src});
			});
		}

	});

	var _bindBtn = function (e) {
		e.preventDefault();
		var _action = $(this).attr('data-btn');
		switch(_action){
			case 'open-global-navi':
				if(flag.globalNavi){
					dom.globalNavi.removeClass('open');
					dom.container.removeClass('open-navi');

				}else{
					if($('#janrainCaptureWidget').css('display') === 'block'){
						$('#janrainCaptureWidget').find('.cc-member').each(function(index, el){
							if( $(el).css('display') === 'block'){
								var _class_name = $(el).attr('class');
								$(el).find('a.cc-member-close').get(0).click();
								return false;
							}
						});
					}
					dom.container.addClass('open-navi');
					dom.globalNavi.removeClass('hidden');
					if(flag.loginForm){
						dom.loginForm.removeClass('open');
						dom.header.find('a.login').removeClass('current');
						dom.container.removeClass('abs');
						dom.globalNavi.removeClass('abs');
					}
				}
				flag.globalNavi = !flag.globalNavi;
				break;
			case 'open-login-form':
				if(flag.loginForm){
					_hideYoutube();
					dom.loginForm.removeClass('open');
					dom.container.find('div.shade').remove('open');
					dom.header.find('a.login').removeClass('current');
					dom.container.removeClass('abs');
					dom.globalNavi.removeClass('abs');
				}else{
					if(flag.globalNavi){return false;}
					_hideYoutube();
					if(flag.loginForm_alone){
						if(typeof SKB_SP.android2_login != 'undefined'){
							SKB_SP.android2_login('open');
						}
						dom.globalNavi.addClass('abs');
						dom.container.addClass('abs');
						dom.loginForm.css({top: $(window).scrollTop() + 60});
					}
					dom.loginForm.addClass('ready');
					dom.header.find('a.login').addClass('current');
					setTimeout(function(){
						dom.loginForm.addClass('open');
					},50);
				}
				flag.loginForm = !flag.loginForm;
				break;
			case 'close-login-form':
				_hideYoutube();
				dom.loginForm.removeClass('open');
				dom.container.find('div.shade').remove('open');
				dom.header.find('a.login').removeClass('current');
				dom.container.removeClass('abs');
				dom.globalNavi.removeClass('abs');
				if(typeof SKB_SP.android2_login != 'undefined'){
					SKB_SP.android2_login();
				}
				flag.loginForm = !flag.loginForm;
				break;

			case 'soudanshitsu-about':
				SKB_SP.Soudanshitsu.showAbout();
				break;
			case 'soudanshitsu-character':
				SKB_SP.Soudanshitsu.showCharacter();
				break;
			case 'soudanshitsu-superviser':
				SKB_SP.Soudanshitsu.showSuperviser();
				break;
			case 'soudanshitsu-tweet':
				var tweet_text = '「' + $(this).attr('data-answer') + '」って答えてもらった。そんな悩みの内容は？⇒';
				window.open('http://twitter.com/share?url=' + encodeURIComponent($(this).attr('data-url')) + '&text=' + encodeURIComponent(tweet_text) + '&hashtags=' + encodeURIComponent('爽健美茶,Twitter相談室'));
				break;
			case 'soudanshitsu-back':
				$('#AdviceResult').removeClass('ready');
				$('html, body').animate({scrollTop: 0});
				$('#soudanshitsu form').removeClass('focus').find('input[type=text]').val('');
				break;
			default:
				break;
		}
	};

	//ページ内アンカー
	var _bindAncher = function(e){
		e.preventDefault();
		var _ancher = $(this).attr('href');
		var _offset = $(_ancher).offset().top - dom.header.height();
		$('html, body').animate({scrollTop: _offset });
	};

	//グローバルナビ開閉完了時
	var _onOpenGlobalNavi = function (e) {
		if(flag.globalNavi){
			dom.globalNavi.addClass('open');
		}else{
			dom.globalNavi.addClass('hidden');
		}
		if(!flag.loginForm){
			dom.loginForm.removeClass('ready');
			dom.container.find('div.shade').removeClass('ready');
		}
	};


	//Android バグ対応
	var _hideYoutube = function () {
		if(window.navigator.userAgent.toLowerCase().indexOf('android 2') == -1) return false;
		if(flag.loginForm){
			$('div.set-movie').removeAttr('style');
		}else{
			$('div.set-movie').css({visibility: 'hidden'});
		}
	}

	var loadImages = function (imgs) {
		var _deferred = $.Deferred();
		var _images = [], _length = imgs.length, _loaded_image = 0;
		var _loaded = function () {
			_loaded_image++;
			if(_loaded_image >= _length){
				_deferred.resolve();
			}
		};
		for(var i = 0; i < _length; i++) {
			_images[i] = new Image();
			_images[i].onload = _images[i].onerror = _loaded;
			_images[i].src = imgs[i];
		}
		return _deferred.promise();
	}

	var android_login = function() {
		var _tapped = $(this).attr('data-widget');
		if(typeof _tapped === 'undefined'){
			flag.janrain_before = flag.janrain;
			flag.janrain = null;
		}else if(_tapped === flag.janrain){
			flag.janrain = null;
		}else{
			if(_tapped === flag.janrain_before){
				flag.janrain_before = null;
				return false;
			}
			flag.janrain = _tapped;
		}
		if(flag.janrain !== null){
			$('#janrainCaptureWidget').css({position: 'relative', top:0}).addClass('isolate');
			dom.container.css({'padding-top':0});
			dom.container.find('header').addClass('relative');
			dom.container.find('.main-contents').hide();
			dom.container.find('.background').hide();
			dom.container.find('footer').hide();
			$('#globalNavi').hide();
            $('body').addClass('form-open');
		}else{
			$('html, body').scrollTop(0);
			dom.container.removeAttr('style');
			dom.container.find('header').removeClass('relative');
			dom.container.find('.main-contents').removeAttr('style');
			dom.container.find('.background').removeAttr('style');
			dom.container.find('footer').removeAttr('style');
			$('#globalNavi').removeAttr('style');
            $('body').removeClass('form-open');
		}
	};

	var Ticker


	return {
		dom: dom,
		flag: flag,
		loadImages: loadImages,
		android_login: android_login
	};
})();

SKB_SP.Ticker = function(dom, place) {
	var param = {
		current: 0,
		num: Number($(dom).find('li').size())
	};
	var flag = {wait:0, android:false};	//0:出現待ち、1:退場待ち、2:一つのみの準備待ち
	if($(dom).size() == 0) { return false; }

	$(dom).on('transitionend webkitTransitionEnd', function(e){
		e.stopPropagation();
		if(flag.wait === 0){
			if(!$(e.target).hasClass('current')) { return false;}
			var _width = $(e.target).find('p').width() + 50;
			var _second = _width * 10;
			var _transform = {
				transform: 'translate(-'+_width+'px,0)',
				webkitTransform: 'translate(-'+_width+'px,0)',
				mozTransform: 'translate(-'+_width+'px,0)'
			};
			if(flag.android2){
				_transform = {
					left: '-' + _width+'px'
				}
			}
			_transform.transitionDuration = _transform.webkitTransitionDuration = _transform.mozTransitionDuration = _second+'ms';
			setTimeout(function(){
				$(e.target).css(_transform);
				flag.wait = 1;
			}, 2000);
		}else if(flag.wait === 1){
			if(!$(e.target).hasClass('current')) { return false;}
			$(dom).find('li').eq(param.current).removeClass('current').removeAttr('style');
			if(param.num == 1){
				flag.wait = 2;
				$(dom).find('li').eq(param.current).css({
					transitionDuration: '100ms',
					webkitTransitionDuration: '100ms',
					mozTransitionDuration: '100ms'
				});
			}else{
				param.current = (param.current + 1 >= param.num)? 0 : param.current + 1;
				$(dom).find('li').eq(param.current).addClass('current');
				flag.wait = 0;
			}
		}else if(flag.wait === 2){
			$(dom).find('li').eq(param.current).removeAttr('style').addClass('current');
			flag.wait = 0;
		}
	});

	var begin = function(){
		var api_type = 'getTwitterTweet';
		if(place === 'soudan'){
			api_type = 'getAdviceTweet';
		}
		if(window.navigator.userAgent.toLowerCase().indexOf('android 2') != -1){
			evacuation();
		}
		SKB_SP.api(api_type, place).done(function(d){
			var _html = '';
			if(place === 'soudan'){
				if(typeof d.tweet == 'undefined' || d.tweet.length == 0){
					$('ul.soudan-ticker').addClass('hide');
					return false;
				}
				var _length = Math.min(3, d.tweet.length);
				for(var _index = 0; _index < _length; _index++){
					_html += '<li><p><a href="' + d.tweet[_index].url + '" target="_blank">@' +  d.tweet[_index].name + ' ' + d.tweet[_index].text +'</a></p></li>';
				}
				param.num = _index;
			}else{
				var _length = Math.min(3, d.tweets.length);
				for(var _index = 0; _index < _length; _index++){
					_html += '<li><p>' + d.tweets[_index].tweet_text +'</p></li>';
				}
				param.num = _index;
			}
			$(dom).empty().html(_html);
			setTimeout(function(){
				$(dom).find('li').eq(0).addClass('current');
			},100);
		});
	};

	//Android2 バグ用緊急避難策
	var evacuation = function () {
		$(dom).addClass('android2');
		flag.android2 = true;

	};

	begin();
};

SKB_SP.Scroll = function (id, setting) {
	'use strict';
	setting.probeType = 3;

	var instance =  new IScroll('#' + id, setting);
	instance.onScroll = function (fn) {
		instance.on('scroll', fn);
	};


	return instance;
};


SKB_SP.Movie = (function () {
	'use strict';
	window.onYouTubePlayerAPIReady = function () {
		$('.set-youtube').each(function(_index, _element){
			var _id = $(_element).attr('id');
			if(typeof _id === 'undefined'){
				_id = 'youtube-' + (param.num + 1);
				$(_element).attr({'id':_id});
			}
			init(_id);
		});
	};
})();

SKB_SP.api = (function(){
	'use strict';
	var getAPI = function(cmd, param){
		var _deferred = $.Deferred();
		var _url = {
			playGame: SKB_SP.AP + '/rest/wapi_game_iw/playGame/',
			getTwitterTweet: '/rest/wapi_sns/getTwitterTweet/',
			getFbPhotos: '/rest/wapi_sns/getFbPhotos/',
			getAdviceResult: '/rest/wapi_tw_advice/getAdviceResult/',
			getAdviceLanding: '/rest/wapi_tw_advice/getAdviceLanding/',
			getAdviceTweet: '/rest/wapi_tw_advice/getTweet/',
			getTwitterBotanicalTweet: '/rest/wapi_botanical_sns/getTwitterBotanicalTweet/'
		}
		var _param = setParam(cmd, param);
		$.ajax({
			url: _url[cmd],
			data: _param,
			type: 'GET',
			dataType: (cmd === 'playGame')?'JSONP':'JSON'
		}).done(function(d){
			//console.log('done api',d);
			if(cmd === 'playGame'){
				if(typeof d[0] !== 'undefined'){
					_deferred.resolve(d);
				}else{
					_deferred.reject();
				}
				return true;
			}
			if(d.responseCode == 0){
				_deferred.resolve(d);
			}else{
				_deferred.reject(d);
			}
		}).fail(function(d,s){
			//console.log(d,s);
			console.error('API error: ' + cmd, d);
			_deferred.reject(d);
		});
		return _deferred.promise();
	}

	var setParam = function(cmd, param){
		var gaid = $('#gaid').attr('data-gaid'), _param = {};
		switch(cmd){
			case 'playGame':
				_param = {
					gaid: param.gaid,
					game_id: 36,
					judge: param.judge	//0:はずれ、1:あたり
				}
				break;
			case 'getTwitterTweet':
				_param['place'] = param;
				break;
			case 'getFbPhotos':
				_param['limit'] = param;
				break;
			case 'getAdviceResult':
				_param['text'] = param;
				break;
			case 'getAdviceLanding':
				_param['id'] = param;
		}
		return _param;
	}

	return getAPI;
})();


(function(){
	try{
		if( typeof requestAnimationFrame === 'undefined' ){
			if(typeof window.webkitRequestAnimationFrame !== 'undefined' ){
				window.requestAnimationFrame = window.webkitRequestAnimationFrame;
			} else if(typeof window.mozRequestAnimationFrame !== 'undefined' ){
				window.requestAnimationFrame = window.mozRequestAnimationFrame;
			} else {
				window.requestAnimationFrame = function (fn) {
					setTimeout(fn, 1000 / 50);
				}
			}
		}
	} catch (error) {
		//alert(error.name + ':' + error.message);
	}
})();
