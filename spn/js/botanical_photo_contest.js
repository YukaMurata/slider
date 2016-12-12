$(function(){
	var _$mainPhoto = $("#botanical");
	var _photoGallery = PhotoGallery({
		$wrapper: _$mainPhoto,
		$itemCommonArr: _$mainPhoto.find('.itemCommon'),
		$itemSpecialArr: _$mainPhoto.find('.itemSpecial'),
		range: 187,
		delay: 7000,
		director: '/spn/images/botanical/photo_contest/photo/',
		callback: function(){$('#fbShareArea').removeClass('fb_share2').addClass('fb_share1');}
	});
	var _photoContestIntro = PhotoContestIntro({
		$wrapper: $("#introArea"),
		$target: $("#botanical"),
		$target2: $("#twitterArea"),
		$target3: $("#linkBotanical"),
		induration: 1000,
		outduration: 1000,
		delay: 2000,
		delay2: 5000,
		isDev: false,//true: no intro VS false: intro
		callback:
		function() {
			$('.bxslider').bxSlider({
				pager: false,
				touchEnabled: false,
				auto: false
			});
			_photoGallery.init();
			TweetCuration();
		}
	});
	_photoContestIntro.init();
	var _modalWindow = ModalWindow({
		$source: _$mainPhoto.find('.itemCommon'),
		$temp: $('#modalCommon'),
		width: 245,
		height: 490,
		type: 1,
		callback: _photoGallery.clearTimer,
		callback2: _photoGallery.setTimer
	});
	_modalWindow.init();

	var _modalWindow2 = ModalWindow({
		$source: _$mainPhoto.find('.itemDetail'),
		$temp: $('#modalDetail'),
		width: 300,
		height: 720,
		type: 2,
		callback: _photoGallery.clearTimer,
		callback2: _photoGallery.setTimer
	});
	_modalWindow2.init();
	var _modalWindow3 = ModalWindow({
		$source: _$mainPhoto.find('.itemSpecial'),
		$temp: $('#modalSpecial'),
		width: 300,
		height: 764,
		type: 3,
		callback: _photoGallery.clearTimer,
		callback2: _photoGallery.setTimer
	});
	_modalWindow3.init();
	/* module */

	/* アクセス冒頭 */
	function PhotoContestIntro(params){
		var _$wrapper = params["$wrapper"];
		var _$target = params["$target"];
		var _$target2 = params["$target2"];
		var _$target3 = params["$target3"];
		var _$el01 =  _$wrapper.find('.item01_0' + _random(1, 5));
		var _$el02 =  _$wrapper.find('.item02');
		var _induration = params["induration"] || 2000;
		var _outduration = params["outduration"] || 1000;
		var _delay = params["delay"] || 3000;
		var _delay2 = params["delay2"] || 5000;
		var _callback = params["callback"] || false;
		var _isDev = params["isDev"] || false;
		var _isTeaser = _$wrapper.hasClass('teaser');
		var _loadManager = Preloader();

		return {
			init: init
		};
		function _random(n, m){
			var c = m-n+1;
			return Math.floor(Math.random() * c + n);
		}
		function init(){
			var _arr = [_$el01.find('img').attr('src'),_$el02.find('img').attr('src')];
			if(_isDev){
				_$wrapper.remove();
				_$target.show();
				_$target2.show();
				_$target3.show();
				if(_callback !== false){
					_callback();
				}
			} else {
				if(_isTeaser == true){
					_loadManager.loadImage(_arr[1]).done(function(){
						_$el02.fadeIn(_induration, function() {
							setTimeout(function (){
								_starter();
							}, _delay2);
						});
					});
				} else {

					_loadManager.loadArray(_arr).done(function(){
						_$el01.fadeIn(_induration, function(){
							setTimeout(function (){
								_$el01.fadeOut(_outduration);
								_$el02.fadeIn(_induration, function() {
									setTimeout(function (){
										_starter();
									}, _delay2);
								});
							}, _delay);
						});
					});
				}

			}
		}

		function _starter(){
			_$el02.fadeOut(_outduration, function (){
				_$wrapper.remove();
			});
			_$target.fadeIn(_induration, function(){
				if(_callback !== false){
					_$target2.fadeIn();
					_$target3.fadeIn();
					_callback();
				}
			});

		}
	}

	/* Photo Shuffle */
	function PhotoGallery(params){
		var _$wrapper = params["$wrapper"];
		var _$itemCommonArr = params["$itemCommonArr"];
		var _$itemSpecialArr = params["$itemSpecialArr"];
		var _range = params["range"];
		var _length = _$itemCommonArr.length;
		var _imgArr = [];
		var _timer = null;
		var _director = params["director"];
		var _delay = params["delay"] || 7000;
		var counter = 1;
		var _shouldClear = false;
		var _loaderManger = Preloader();
		var _isLoading = true;
		var _isTeaser = _$wrapper.hasClass('teaser');
		var _cb = params["callback"] || null;
		return {
			init: init,
			setTimer: setTimer,
			clearTimer: clearTimer,
			getIsLoading: getIsLoading
		};
		function init(){
			if(_isTeaser) {
				_isLoading = false;
				return;
			} else {
				if(_cb !== null){
					_cb();
				}
				if(_range < _length){
					_selectPhoto(_length);
				} else {
					_selectPhoto(_range);
				}
			}
		}
		function setTimer(){
			if(_isTeaser) return;
			if(_timer !== null){
				clearTimer();
			}
			_shouldClear = false;
			_timer = setTimeout(function(){
				_shufflePhoto(_imgArr);
				//console.log(_imgArr)
				_rewritePhoto(_imgArr);
			}, _delay);

		}
		function clearTimer(){
			if(_isTeaser) return;
			_shouldClear = true;
			clearTimeout(_timer);
			_timer = null;
		}
		function _selectPhoto(count){

			_generatePhotoArr(_imgArr, count);
			_shufflePhoto(_imgArr);
			_rewritePhoto(_imgArr);
		}

		/* 画像を切り替え */
		function _rewritePhoto(imgArr){
			//console.log(_shouldClear);
			if(_shouldClear){
				return;
			}
			for (var i = 0; i < _length; i++) {
				(function(i) {
					var _src, _$img, _temp;
					_src = imgArr[i];
					_$img = _$itemCommonArr.eq(i).find('img');
					_temp = _director + _src;
					_loaderManger.loadImage(_temp).done(function(){
						setTimeout(function(){
							_$img.fadeOut(300, function(){
								_$img
								.attr('src', _temp)
								.css('display', 'none').
								fadeIn(200);
							});
							if(!_shouldClear && i == _length - 1){
								setTimer();
								_isLoading = false;
							} else if(_shouldClear && i == _length - 1){
								clearTimer();
								_isLoading = false;
							}
						}, i * 100);
					});
				})(i);

			}
		}
		function getIsLoading(){
			return _isLoading;
		}
		function _generatePhotoArr(arr, count){
			for (var i = 1; i <= count; i++) {
				if(i < 10){
					arr.push('000' + i + '_thumb.jpg');
				} else if(i < 100){
					arr.push('00' + i + '_thumb.jpg');
				} else if(i < 1000){
					arr.push('0' + i + '_thumb.jpg');
				} else if(i < 10000){
					arr.push(i + '_thumb.jpg');
				}
			}
		}
		function _shufflePhoto(arr){
			arr.sort(function (){
				return (Math.random() - 0.5);
			});
		}
	}

	/* modal window */
	function ModalWindow(params){
		var _$source = params["$source"];
		var _$temp = params["$temp"];
		var _width = params["width"] || 245;
		var _height = params["height"] || 490;
		var _$body = $("body");
		var _isLoaded = false;
		var _$moduleBlock = _$temp;
		var _$cont = _$moduleBlock.find('.modal_contents');
		var _$win = $(window);
		var _callback = params["callback"] || false;
		var _callback2 = params["callback2"] || false;
		var _isTeaser = (_$source.eq(0).parents('.teaser').length !== 0);
		var _loadManager = Preloader();
		var _$doc = $(document);
		var _$loader = _$temp.find('#modalLoad');
		var _type = params["type"];
		var _isTeaser = (_$source.eq(0).parents('.teaser').length !== 0);
		return {
			init: init
		};
		function init(){

			// 開く
			if(_type == 1){
				if(_isTeaser) return;
				registerHandler();
			} else if(_type == 2){
				registerHandler2();
			} else if(_type == 3){
				registerHandler3();
			}
			//閉じる
			//$modalBtnClose.on('click', _setCloseHanlder);
			_$moduleBlock.on('click.modalwindow', _setOverlayHanlder);
			function _setOverlayHanlder(e){
				e.preventDefault();
				var $target = $(e.target);
				if($target.hasClass('modal_contents') || ($target.parents('.modal_contents').length !== 0 && $target.parents('.modal_btn_close').length == 0)){
					return;
				}
				if( _callback2 !== null){
					_callback2();
				}
				_$cont.hide(0, function() {
					//_$moduleBlock.off('click.modalwindow', _setOverlayHanlder);
					_$moduleBlock.hide();
				});
			}
		}
		function registerHandler(){
			_$source.on('click', function(e){
				e.preventDefault();
				if(_photoGallery.getIsLoading()) return;
				if(_callback !== null){
					_callback();
				}
				_$loader.show();
				var _$this = $(this);
				var _src = _$this.find('img').attr('src');
				_src = _src.replace('thumb', 'large');
				_$moduleBlock.find('.photo_area img').attr('src', _src);
				_$moduleBlock.css({
					display: 'block',
					height: _$doc.height()
				});
				_loadManager.loadImage(_src).done(function(){
					_$loader.hide();
					_setLayout();
				});
			});
		}
		function registerHandler2(){
			_$source.on('click', function(e){
				e.preventDefault();
				var $iframe = _$moduleBlock.find('iframe');
				if(_photoGallery.getIsLoading()) return;
				if(_callback !== null){
					_callback();
				}
				_$loader.show();
				_$moduleBlock.css({
					display: 'block',
					height: _$doc.height()
				});
				$iframe.css({
					width: _width,
					height: _height
				});
				_$loader.hide();
				_setLayout();
			});
		}
		function registerHandler3(){
			_$source.on('click', function(e){
				e.preventDefault();

				var $iframe = _$moduleBlock.find('iframe');
				var dataUrl = $(this).attr('data-url');
				if(_photoGallery.getIsLoading()) return;
				if(_callback !== null){
					_callback();
				}
				_$loader.show();
				_$moduleBlock.css({
					display: 'block',
					height: _$doc.height()
				});
				if($iframe.attr('src') == dataUrl){
					_$loader.hide();
					_setLayout();
				} else {
					$iframe.css({
						width: _width,
						height: _height
					}).attr('src', dataUrl).load(function(){
						_$loader.hide();
						_setLayout();
					});
				}
			});
		}
		function _setLayout(){
			var contWidth = _width;
			var contHeight = _height;
			var width = _$win.width();
			var height = _$win.height();
			_$cont
			.css({
				display: 'none',
				position: 'relative',
				top: _$win.scrollTop(),
			});
			_$cont.fadeIn(600);

		}
	}

// 最新Twt情報を取得
	function TweetCuration(){
		$.ajax({
			url: "/rest/wapi_botanical_sns/getTwitterBotanicalTweet/",
			data: {
				place: 3
			}
		}).success(
		function (data) {
			var _userId,
				_twtId,
				_mediaUrl,
				_$photoList = $(".twitter_photo_list"),
				_elements = _$photoList.find("li").nextAll(),
				_count = _elements.length+1;

			data.BotanicalTweet.sort(
				function() {
					return Math.random() - 0.5;
				}
			);

			_$photoList.find("li").each(function(index) {
				var img = new Image();
				_userId = data.BotanicalTweet[index].user_id;
				_twtId = data.BotanicalTweet[index].tweet_id;
				_mediaUrl = data.BotanicalTweet[index].tweet_media_url;
				$(this).html('<a class="photoList" href="https://twitter.com/' + _userId + '/status/' + _twtId + '/' + '" target="_blank"><img src="' + _mediaUrl + '" alt="" /></a>');
				img.onload = function (){
					if (!--_count) {
						setPosTwtPhoto(_$photoList, 135, 135);
					}
				};
				img.src = _mediaUrl;
			});
		});

		// 画像の縮小、positionを指定
		function setPosTwtPhoto($target, val, val2) {
			var cnt = 1;
			$target.fadeIn(1000, "swing");
			$target.find("li").each(function(index) {
				var originWidth = $(this).find(".photoList img").width();
				var originHeight = $(this).find(".photoList img").height();
				if ( originWidth > originHeight ) {
					var left = Math.floor(val2 * originWidth / originHeight);
					$(this).find(".photoList img").css({
						position: "absolute",
						bottom: "0px",
						left: -((left - val)/2) + "px",
						width: Math.floor(val2 * originWidth / originHeight) + "px",
						height: val2
					});
				} else {
					var bottom = Math.floor(val * originHeight / originWidth);
					$(this).find(".photoList img").css({
						position: "absolute",
						bottom: -((bottom - val2)/2) + "px",
						left: "0px",
						width: val,
						height: Math.floor(val * originHeight / originWidth) + "px"
					});
				}
				cnt++;
			});
		}
	}

	/**
	* image preloader
	* @returns {{loadArray: Function, loadImage: Function}}
	* @constructor
	*/
	function Preloader() {
		var loadImageCache = {};

		function loadArray(imgArr, callback){
			var length = imgArr.length;
			var counter = 0;
			var df = $.Deferred();
			for(i = 0; i < length; i++){
				loadImage(imgArr[i]).done(function (para){
					counter++;
					if(callback){
						callback(para);
					}
					if(counter == length) {
						df.resolve(loadImageCache);
					}
				});
			}
			return df;
		}

		function loadImage(imageSrc,callback) {
			if (typeof loadImageCache[imageSrc] === "undefined") {
				var deferred = $.Deferred();

				var preloader= new Image();
				preloader.onload  = function() {
					deferred.resolve(this.src) ;
					if(callback) callback();
				};
				preloader.onerror = function() {
					deferred.reject(this.src);
				};
				preloader.src= imageSrc;
				loadImageCache[imageSrc] = deferred;
			}

			return loadImageCache[imageSrc];
		}

		return {
			loadArray: loadArray,
			loadImage: loadImage
		};
	}
});