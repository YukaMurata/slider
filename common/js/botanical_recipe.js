(function($, win, doc){
	// instance
	$(function(){
		var recipeSize = (location.pathname).indexOf("/spn/") > -1 ? {width: 80, height: 80} : {width: 99, height: 99}
		var _recipeManager = RecipeManager({
			url: 'http://api.recipe.rakuten.co.jp/ext/search/recipe/',
			developerId: '16209cbddce58e3a6aedc314539ff92cc2c443e8',
			sort: 1,
			$wrapper: $('#botanicalRecipe'),
			txtlength: 16,
			imgSize: recipeSize
		});
		_recipeManager.init();

		var _modalRecipe = ModalRecipe({
			$trigger: $("#modalTrigger"),
			$overlay: $("#modalOverlay"),
			$modal: $("#modalRecipe")
		});
		_modalRecipe.init();
	});

	// module
	function RecipeManager(params){
		var _url = params["url"];
		var _devId = params["developerId"];
		var _sort =  params["sort"];
		var _txtlength = params["txtlength"];
		var _paras = '?developerId=' + _devId +'&sort=' + _sort;
		var _keywordArr = ['玄米', '黒ゴマ', 'ヨモギ', '大麦'];
		var _$wrapper = params["$wrapper"];
		var _imgSize = params["imgSize"];
		var _startMonth = _$wrapper.attr('data-duration');
		var _$recipeList = _$wrapper.find('li dl');
		var _checkResult;
		var _length = _$recipeList.length;
		var _resultArr=[];
		var _itemsPage = 10;
		var _pageObject;
		var _sumOfRecipe;

		return{
			init: init
		}
		/* public method */
		function init(){
			var _checkResult = _checkDate();
			//console.log(_checkResult);
			var _kw = encodeURI(_keywordArr[_checkResult.month]);
			_getSumOfRecipe(_paras + '&keyword=' + _kw, _kw, _checkResult);
		}

		function _getSumOfRecipe(paras, kw, checkResult){
			$.ajax({
				async: false,
				url: _url + paras,
				dataType: "jsonp",
				success: function (data) {
					_sumOfRecipe = data.header.count;
					//console.log(_sumOfRecipe)
					_pageObject = _calculatePage2(_length, _itemsPage, checkResult.date, _sumOfRecipe);
					//console.log(_keywordArr[checkResult.month])
					//console.log(_pageObject)
					if(_pageObject.endPage){
						var _paras1 = _paras + '&keyword=' + kw + '&p=' + _pageObject.startPage;
						var _paras2 = _paras + '&keyword=' + kw + '&p=' + _pageObject.endPage;
						//console.log(_paras1);
						//console.log(_paras2);
						_requestData(_paras1, _paras2);
					}
				}
			});
		}

		/* private method */

		function _calculatePage(listLength, itemsPage, date, isLoop){
			//console.log('retouch' + date);
			var _startIndex = (date == 1) ? 0 : listLength * (date - 1);
			var _endIndex = listLength * date - 1;
			/*console.log(_startIndex);
			console.log(_endIndex);*/
			var _startPage = (_startIndex < itemsPage) ? 1 : (Math.floor(_startIndex / itemsPage) + 1);
			var _endPage;
			var _offset = _startIndex - (_startPage - 1) * 10;
			if(_startIndex + listLength > _startPage * itemsPage && _startIndex + listLength <= (_startPage + 1) * itemsPage){
				_endPage = _startPage + 1;
			}
			return{
				startPage: _startPage,
				endPage: _endPage,
				offset: _offset
			}
		}
		function _calculatePage2(listLength, itemsPage, date, sumOfRecipe){
			// desert the ramnant of 12
			sumOfRecipe = sumOfRecipe - sumOfRecipe % listLength;
			var _cycle = sumOfRecipe / listLength;
			var _loop = false;
			if(date > _cycle){
				_loop = true;
			}
			/*console.log(sumOfRecipe);
			console.log(listLength);*/
			//console.log(_cycle);
			date = date % _cycle;
			var _result = _calculatePage(listLength, itemsPage, date, _loop);
			return _result;
		}
		function _checkDate(){
			var _month = _startMonth;
			var _nowTime = new Date();
			var _date = _nowTime.getDate();
			return{
				month: _month - 9,
				date: _date
			}
		}

		function _requestData(paras, paras2){
			$.ajax({
				async: false,
				url: _url + paras,
				dataType: "jsonp",
				success: function (data) {
					//_sumOfRecipe = data.header.count;
					var _result = data.result;
					$.each(_result, function(index, recipe) {
						_resultArr.push(recipe);
					});
					//if()
					$.ajax({
						async: false,
						url: _url + paras2,
						dataType: "jsonp",
						success: function (data) {
							var _result = data.result;
							//console.log(data)
							$.each(_result, function(index, recipe) {
								_resultArr.push(recipe);
							});
							_showData();
						},
						error: function () {
						}
					});
				},
				error: function () {
				}
			});

		}

		function _connect(paras){
			var _tmp = _url + paras;
			$.ajax({
				async: false,
				url: _tmp,
				dataType: "jsonp",
				success: function (data) {
					var _result = data.result;
					_resultArr = [];
					$.each(_result, function(index, recipe) {
						_resultArr.push(recipe);
					});
					_showData();
				},
				error: function () {
				}
			});
		}

		function _showData(){
			var _count = _length + 1;
			for(i = _pageObject.offset, j = 0; j < _length; j++,i++){
				var _$link = _$recipeList.eq(j).parents('a').eq(0);
				var _$img = _$recipeList.eq(j).find('dt');
				var _$txt = _$recipeList.eq(j).find('dd');
				var _imgSrc = _resultArr[i].food_image_path;
				var _recipeId = _resultArr[i].recipe_id;
				var _recipeUrl = 'http://recipe.rakuten.co.jp/recipe/' + _recipeId;
				var _recipeTtl = _resultArr[i].recipe_title;
				var _recipeTtl2 = _trim(_recipeTtl, _txtlength);
				var img = new Image();
				img.onload = function (){
					_count--;
					if (_count == 1) {
						setPosTwtPhoto(_$wrapper, _imgSize.width, _imgSize.height);
					}
				};
				img.src = _imgSrc;
				_$link.attr({
					href: _recipeUrl,
					target: '_blank'
				}).addClass('photoList');
				_$img.html('<img src="' + _imgSrc + '" alt="' + _recipeTtl + '"/><span></span>');
				_$txt.html(_recipeTtl2);
			}
		}
		function _trim(txt, number){
			var _result;
			var _length = txt.length;
			if(_length >= number){
				_result = txt.substr(0, number - 3) + '...';
			} else {
				_result = txt;
			}
			return _result;
		}
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

	function ModalRecipe(params){
		var _$trigger = params["$trigger"];
		var _$overlay = params["$overlay"];
		var _$modal = params["$modal"];
		var _$close = _$modal.find('.modal-close');
		var _$win = $(window);
		var _closeH = _$close.height() + 40;

		return {
			init: init
		}
		// public method
		function init(){
			_$trigger.on('click', function(event) {
				event.preventDefault();
				var _offset = _$win.scrollTop();
				var _dif = _$win.height() - _$modal.height();
				var _top =  _dif < 0 ? 0 : _dif / 2;
				_$overlay.show();
				_$modal.css({
					top: _top +_offset + _closeH
				}).fadeIn(1000);
			});
			_$close.on('click', function(event) {
				event.preventDefault();
				_close();
			});
			_$overlay.on('click', function(event) {
				event.preventDefault();
				_close();
			});
		}

		function _close(){
			_$modal.fadeOut(300);
			_$overlay.hide();
		}
	}

})(jQuery, window, document);