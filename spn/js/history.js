//ヒストリー
(function(){
	'use strict';
	var dom = {
		navi: $('#history div.select-navi')
	};
	var flag = {
		year_list: false,
		locak: false
	};

	$('a.btn').on('click', function(e){
		e.preventDefault();
		var type = $(this).attr('data-btn');
		var _year;
		switch(type){
			case 'select-year':
				flag.year_list = true;
				dom.navi.addClass('ready');
				setTimeout(function(){ dom.navi.addClass('open') },100);
				break;
			case 'close-year-navi':
				flag.year_list = false;
				dom.navi.removeClass('open');
				break;
			case 'select-year-prev':
				history.prevYear();
				flag.year_list = false;
				dom.navi.removeClass('open');
				break;
			case 'select-year-next':
				history.nextYear();
				flag.year_list = false;
				dom.navi.removeClass('open');
				break;
			case 'choice-year':
				_year = $(this).attr('data-year');
				history.goYear(_year);
				flag.year_list = false;
				dom.navi.removeClass('open');
				break;
		}
	});

	dom.navi.on('transitionend webkitTransitionEnd', function (e) {
		e.stopPropagation();
		if(!flag.year_list){
			dom.navi.removeClass('ready');
		}
	});

	if(window.navigator.userAgent.toLowerCase().indexOf('android 2') != -1){
		$('div.pull-down').addClass('ready');
		var pullDown = SKB_SP.Scroll('pull-down-scroll',{
			bounce: false,
			mouseWheel: true,
			scrollbars: true,
			click: true
		});
		$('div.pull-down').removeClass('ready');
	}


	var history = (function(){
		var current = 1994;
		var article_list = {};
		//記事オブジェクト
		var Article = function (year) {
			var _this = this;
			this.dom = $('#year' + year);
			this.year = Number(year);
			this.height = function () {
				return $('#year' + _this.year).height();
			}

		};

		$('#history article').each(function(i,el){
			var _year = $(el).attr('id').replace('year','');
			article_list[_year] = new Article(_year);
		});
		$('#history div.article-area').height(article_list[current].height());
		$('#history div.article-area').on('transitionend webkitTransitionEnd', function(e){
			e.stopPropagation();
			if(!$(e.target).hasClass('current')){return false}
			$(this).height(article_list[current].height());
			$(this).addClass('fix');
			$('#history article').removeClass('show');
			for(var year in article_list){
				article_list[year].dom.removeClass('show');
				if(year < current){
					article_list[year].dom.addClass('past');
				}else{
					article_list[year].dom.removeClass('past');
				}
			};
			setTimeout(resetArrow,300);
		});

		var goYear = function (year) {
			if(year == current || flag.lock) return false;
			flag.lock = true;

			$('#history div.article-area').removeClass('fix');
			article_list[year].dom.find('div.fb-post-wait').addClass('fb-post').removeClass('fb-post-wait');
			FB.XFBML.parse();

			setTimeout(function(){
				if(year > current){
					article_list[year].dom.removeClass('past').addClass('show');
					var _current = 'past show';
				}else if(year < current){
					article_list[year].dom.addClass('past').addClass('show');
					var _current = 'show';
				}

				var _height = Math.max(article_list[year].height(), article_list[current].height());
				$('#history article-area').height(_height);
				setTimeout(function(){
					article_list[current].dom.addClass(_current).removeClass('current');
					article_list[year].dom.addClass('current').removeClass('past');
					current = article_list[year].year;
				},100);
			}, 100);
		};

		var nextYear = function () {
			if(typeof article_list[current+1] !== 'undefined'){
				goYear(current+1);
			}
		};
		var prevYear = function () {
			if(typeof article_list[current-1] !== 'undefined'){
				goYear(current-1);
			}
		};

		var resetArrow = function () {
			$('#history a.arrow').removeClass('out');
			if(typeof article_list[current+1] === 'undefined'){
				$('#history a.arrow.next').addClass('out');
			}else if(typeof article_list[current-1] === 'undefined'){
				$('#history a.arrow.prev').addClass('out');
			}
			flag.lock = false;
		};
		resetArrow();


		return {
			goYear: goYear,
			nextYear: nextYear,
			prevYear: prevYear
		};
	})();

})();