(function(){
	'use strict';
	var STORY = (function(){
		var dom = {};
		var flag = {
			lock: false,
			sozai: 0,//現在表示中の素材 0は表紙
			check: new Array(12),//素材を閲覧済みかどうか
			challenge: false,//クイズに挑戦可能かどうか
			modal: false,//クイズモーダルが開いているかどうか
			quiz: null//ランデムで選ばれたクイズの番号
		};
		var sozai_list = [
			'はとむぎ', '玄米', '大麦', 'なんばんきび', '黒ゴマ', 'どくだみ', 'はぶ茶', 'チコリー', 'よもぎ', '月見草', '大麦若葉', '明日葉'
		];
		var sozai_num = sozai_list.length;

		var quiz_list = [
			{
				name: 'hatomugi',
				question: '世界三大美女の一人と称される楊貴妃が愛用していたと言われている、爽健美茶の素材は次のうちどれ？',
				select: [0,7,8],
				answer: 0,
				ex: 'ミネラル類や、たんぱく質が含まれており、美容と健康をサポートしてくれるはとむぎ。世界三大美女の一人と称される、あの楊貴妃も、愛用していたと言われています。',
				txt: '世界三大美女の一人と称される楊貴妃は、はとむぎを愛用していた。'
			},
			{
				name: 'genmai',
				question: '平時代安には“お給料”として用いられるほど生活に欠かせない植物だった、爽健美茶の素材は次のうちどれ？',
				select: [10,1,5],
				answer: 1,
				ex: 'ビタミンB群などが豊富で、炒った香りが気持ちをリラックスさせてくれる玄米。平安時代には、“お給料”として用いられるほど、生活に欠かせない植物でした。',
				txt: '古くから生活を支える力だった玄米。平安時代には、“給料”として用いられていた。'
			},
			{
				name: 'oomugi',
				question: '75才まで長生きした徳川家康も好ん食べていたと言われている、爽健美茶の素材は次のうちどれ？',
				select: [11,7,2],
				answer: 2,
				ex: '食物繊維、カルシウム、鉄分、ビタミンが含まれており、健康食としても注目される大麦。75才まで長生きした徳川家康も、大麦を好んで食べていたと言われています。',
				txt: '75才まで生きた徳川家康は、大麦を好んで食べていた。'
			},
			{
				name: 'nanbankibi',
				question: '高度な文明を築いた古代マヤ王国の人々も主食にしていたと言われている、爽健美茶の素材は次のうちどれ？',
				select: [3,8,10],
				answer: 3,
				ex: 'なんばんきびは、トウモロコシの別名。<br>種子は、リンや鉄分、ビタミンB1を含み、高度な文明を築いた古代マヤ王国の人々も、なんばんきびを主食にしていたと言われています。',
				txt: '古代に高度で力強い文明を築いたマヤ王国の人々は、なんばんきびを主食としていた。'
			},
			{
				name: 'kurogoma',
				question: '世界三大美女の一人と称されるクレオパトラも愛用していたと言われている、爽健美茶の素材は次のうちどれ？',
				select: [5,4,11],
				answer: 4,
				ex: '世界三大美女の一人と称される、クレオパトラも愛用していたと言われるゴマ。<br>ゴマに含まれる「ゴマリグナン」は、健康成分のひとつとして注目されています。',
				txt: '世界三大美女の一人と称される、クレオパトラもゴマを愛用していた。'
			},
			{
				name: 'dokudami',
				question: '繁殖力が強く、しぶとい生命力があることから「シブト草」とも呼ばれている、爽健美茶の素材は次のうちどれ？',
				select: [6,10,5],
				answer: 5,
				ex: '精油成分やフラボノイドを含み、古くから愛飲されてきた、どくだみ。<br>繁殖力が強く、しぶとい生命力があることから、「シブト草」とも呼ばれます。',
				txt: 'どくだみは、しぶとい生命力があることから、「シブト草」とも呼ばれている。'
			},
			{
				name: 'habucha',
				question: '平安時代の『本草和名』に健康素材として紹介されるほど歴史の深い、爽健美茶の素材は次のうちどれ？',
				select: [3,9,6],
				answer: 6,
				ex: '近年、健康茶のひとつとして注目されているはぶ茶。<br>じつは、平安時代の『本草和名』に健康素材として紹介されるほど、歴史の深い植物です。',
				txt: '健康茶として注目されているはぶ茶は、平安時代の『本草和名』にも健康素材として紹介されている。'
			},
			{
				name: 'chikori',
				question: '25才にしてイギリス女王に君臨したエリザベス１世も重宝していたと言われている、爽健美茶の素材は次のうちどれ？',
				select: [7,4,3],
				answer: 7,
				ex: 'ミネラルやビタミン、食物繊維の「イヌリン」が含まれているチコリー。<br>25才にしてイギリス女王に君臨したエリザベス1世も、チコリーを重宝していたと言われています。',
				txt: '25才にしてイギリス女王に君臨したエリザベス１世は、チコリーを重宝していた。'
			},
			{
				name: 'yomogi',
				question: '不思議な力があると信じられ、ヨーロッパやアジアを中心に魔除けの草として重宝されてきた、爽健美茶の素材は次のうちどれ？',
				select: [0,9,8],
				answer: 8,
				ex: 'ヨーロッパ、中国、日本などで魔除けの草として重宝されてきた、よもぎ<br>ビタミンB群などを含み、現在でも世界中でハーブなどに利用されています。',
				txt: '不思議な力があると信じられたよもぎは、ヨーロッパやアジアを中心に魔除けの草として重宝されてきた。'
			},
			{
				name: 'tsukimisou',
				question: '大自然の中たくましく生きるネイティブアメリカンもさまざまな用途で重宝していた、爽健美茶の素材は次のうちどれ？',
				select: [9,5,7],
				answer: 9,
				ex: '黄色やピンクの花を咲かせる神秘的な月見草。大自然の中たくましく生きるネイティブアメリカンも、さまざまな用途で月見草を重宝していました。',
				txt: 'たくましく生きるネイティブアメリカンは、月見草を重宝していた。'
			},
			{
				name: 'oomugiwakaba',
				question: '踏めば踏むほどより強く成長する生命力があることから、栽培時に「麦ふみ」が行われる、爽健美茶の素材は次のうちどれ？',
				select: [2,10,6],
				answer: 10,
				ex: '緑黄色野菜などに比べて、ビタミンやミネラル、酵素などが多く含まれている大麦若葉。踏めば踏むほど、より強く成長する生命力があることから、栽培時に「麦ふみ」が行われます。',
				txt: '「麦ふみ」をするのは、大麦若葉に、踏めば踏むほどより強く育つ生命力があるから。'
			},
			{
				name: 'ashitaba',
				question: '「若芽を摘んでも、明日の朝には新芽を出す成長力がある」ことから名前がついたといわれている、爽健美茶の素材は次のうちどれ？',
				select: [8,11,4],
				answer: 11,
				ex: 'ビタミンCを豊富に含んでいる明日葉。「若芽を摘んでも、明日の朝には新芽を出す成長力がある」ことから、“明日葉”という名前がついたといわれています。',
				txt: '明日葉の名前は、「若芽を摘んでも、明日の朝には新芽を出す」という成長力の強さから付けられた。'
			}
		];

		//初期化
		var init = function () {
			dom = {
				slide: $('#story section.main-area > div'),
				arrow: $('#story section.main-area a.arrow'),
				icons: $('#story section.btn-area ul.btn li'),
				sns_btn: $('#story ul.sns a'),
				quiz: $('#quiz'),
				quiz_q: $('#quiz div.question'),
				quiz_a: $('#quiz div.result')
			};
			$('#story').addClass('start');

			dom.slide.on('transitionend webkitTransitionEnd', _onTransitionQuiz);
			dom.arrow.on('click', function(e){
				e.preventDefault();
				goStory($(this).attr('data-turn'));
			});
			dom.icons.on('click', function(e){
				e.preventDefault();
				goStory(Number($(this).attr('data-sozai')));
			});
			dom.quiz.on('transitionend webkitTransitionEnd', _onTransitionQuiz);
			dom.quiz.on('click', 'ul.select li', _answerQuiz);
			dom.quiz_a.find('a.js-close').on('click', _closeQuiz);

			$('a.js-btn-quiz').on('click', startQuiz);
			dom.sns_btn.on('click', _sendSocial);
		};

		//ストーリーの進行
		var goStory = function (turn) {
			if(flag.lock){ return false; }
			flag.lock = true;
			if(turn === 'next'){
				if(flag.sozai >= sozai_num){ return false;}
				turn = flag.sozai + 1;
			}else if(turn === 'prev'){
				if(flag.sozai <= 0){ return false;}
				turn = flag.sozai - 1;
			}else{
				if(turn === flag.sozai){ return false;}
			}

			if(turn > flag.sozai){
				dom.slide.eq(flag.sozai).addClass('end');
				dom.slide.eq(turn).removeClass('end');
			}else{
				dom.slide.eq(turn).addClass('end');
			}
			dom.slide.eq(flag.sozai).removeClass('current');
			dom.icons.eq(flag.sozai - 1).removeClass('current');

			dom.slide.eq(turn).removeClass('end').addClass('current');
			dom.slide.eq(turn).prevAll('div').addClass('end');
			dom.slide.eq(turn).nextAll('div').removeClass('end');

			if(turn > 0){
				flag.check[turn - 1] = true;
				dom.icons.eq(turn - 1).addClass('check current');
			}

			$('#story').removeClass('start end');
			flag.challenge = false;
			if(turn <=0 ){
				$('#story').addClass('start');
			}else if(turn >= sozai_num){
				$('#story').addClass('end');
				//flag.challenge = true;
			}
			flag.sozai = turn;
			if(checkComp()){
				$('#story').addClass('comp');
				flag.challenge = true;
			}

		};

		var checkComp = function () {
			var _sum = 0;
			for(var i = 0, l = flag.check.length; i < l; i+=1){
				if(flag.check[i]){
					_sum += 1;
				}
			}
			if(_sum >= sozai_num){
				return true;
			}
			return false;
		};

		var startQuiz = function () {
			if(!flag.challenge){ return false; }
			dom.icons.removeClass('current');
			dom.quiz.addClass('ready');
			_setQuiz();
			setTimeout(function () {
				dom.quiz.addClass('open');
			}, 100);
		};

		var _closeQuiz = function () {
			dom.quiz.removeClass('open');
		};

		var _setQuiz = function () {
			dom.quiz.addClass('q').removeClass('a');
			flag.quiz = Math.floor( Math.random() *  quiz_list.length);
			var q = quiz_list[flag.quiz];
			$('#quizText').text(q.question);
			var select_html = '';
			for(var i = 0; i < 3; i++ ){
				select_html += '<li class="sozai' + (q.select[i] +1) + ((q.select[i]==q.answer)?' correct':'') +'" data-answer="' + q.select[i] + '">';

				select_html += (i+1) + '.<br><span>' + sozai_list[q.select[i]] + '</span></li>';
			}
			dom.quiz_q.find('ul.select').empty().html(select_html);
			$('#exText').html(q.ex);
			var answer_html = '<img src="/spn/images/botanical/story/img_answer'+ (quiz_list[flag.quiz].answer + 1) +'.png" width="200" height="70" alt="'+ sozai_list[quiz_list[flag.quiz].answer] +'">';
			dom.quiz_a.find('p.correct').html(answer_html);
			dom.quiz_a.removeClass('success fail');
		};

		var _answerQuiz = function (e) {
			e.preventDefault();
			var answer = $(this).attr('data-answer');
			if(quiz_list[flag.quiz].answer == answer){
				dom.quiz_a.addClass('success');
				_addParkG().done(function(d){
					dom.quiz_a.find('p.caution.success').text('300パークGをゲット！');
					var _parkG = parseInt($('#globalNavi p.parkG').text().replace(',',''), 10);
					_parkG += 300;
					cnsole.log(_parkG);
					$('#globalNavi p.parkG').text(d.coca_g);
				}).fail(function(code){
					if(code == 4){
						dom.quiz_a.find('p.caution.success').html('今日はパークGを付与済みです。<br>また明日チャレンジしてください！');
					}
				});
			}else{
				dom.quiz_a.addClass('fail');
			}

			dom.quiz.removeClass('q').addClass('a');
		};

		var _addParkG = function () {
			var _deferred = $.Deferred();
			if($('#gaid').size() <= 0){
				return _deferred.reject();
			}
			var _gaid = $('#gaid').attr('data-gaid');
			//console.log( 'aa',SKB_SP.AP + '/rest/wapi_acao_point/add_public/');
			$.ajax({
				url: SKB_SP.AP + '/rest/wapi_acao_point/add_public/rest/wapi_acao_point/add_public/',
				data: {gaid: _gaid, rule: 'skb_botanical_give'},
				type: 'GET',
				dataType: 'JSONP'
			}).done(function(d){
				if(d.response_code == 0){
					_deferred.resolve(d);
				}else{
					_deferred.reject(d.response_code);
				}
			}).fail(function(s,d){
				console.error(s,d);
				_deferred.reject();
			});
			return _deferred.promise();
		};
		function make_base_auth(user, password) {
			var tok = user + ':' + password;
			var hash = btoa(tok);
			return "Basic " + hash;
		}

		var _sendSocial = function (e) {
			e.preventDefault();
			var type = $(this).attr('class');
			var sozai = Number($(this).parents('ul.sns').attr('data-id'));
			var share_url = 'http://www.sokenbicha.jp' + '/botanical/story/sozai_' + quiz_list[sozai - 1].name +  '.html';
			var txt = quiz_list[sozai - 1].txt + ' 12のボタニカルストーリー｜爽健美茶（そうけんびちゃ）';
			var url;
			switch(type){
				case 'line':
					url = 'http://line.naver.jp/R/msg/text/' + encodeURIComponent(txt + ' ' + share_url);
					break;
				case 'facebook':
					url = 'http://www.facebook.com/share.php?u=' + share_url;
					break;
				case 'twitter':
					url = 'http://twitter.com/share?url=' + encodeURIComponent(share_url) +'&text=' + encodeURIComponent(txt) + '&hashtags=' + encodeURIComponent('爽健美茶,ボタニカル宣言,' + quiz_list[sozai - 1].name);
					break;
				default:
					return false;
					break;
			}
			window.open(url);
		};

		var _onTransitionQuiz = function (e) {
			var id = $(this).attr('id');
			if(id === 'quiz'){
				if($(this).hasClass('open')){
					dom.quiz.find('div.quiz-inner').addClass('open');
					flag.modal = true;
				}else{
					dom.quiz.removeClass('ready a q').find('div.quiz-inner').removeClass('open');
					flag.modal = false;
					flag.quiz = null;
				}
			}
			if($(e.target).parent('section').hasClass('main-area')){
				flag.lock = false;
			}
		};


		return {
			init: init
		};
	})();


	var CHARACTERS = (function () {
		var dom;
		var character_num = 0;
		var flag = {lock:false, chara:0};
		var init = function () {
			dom = {
				base: $('#characterIntroduction'),
				chara: $('#characterIntroduction ul li'),
				prev: $('a.js-arrow-character.prev'),
				next: $('a.js-arrow-character.next'),
				stamp: $('#stampList ul li')
			};
			character_num = dom.chara.size();

			dom.prev.on('click', function(e){
				e.preventDefault();
				var _turn = (flag.chara <= 0)? character_num - 1: flag.chara - 1;
				goCharacter(_turn);
			});
			dom.next.on('click', function(e){
				e.preventDefault();
				var _turn = (flag.chara + 1 >= character_num)? 0: flag.chara + 1;
				goCharacter(_turn);
			});
			dom.base.on('webkitTransitionEnd transitionend', _onTransitionEnd);

			dom.chara.eq(flag.chara).addClass('current');

			dom.stamp.on('click', clickStamp);
		};

		var goCharacter = function (turn) {
			if(turn == flag.chara || flag.lock){ return false; }
			flag.lock = true;
			if((turn > flag.chara && !(turn == character_num -1 && flag.chara == 0)) || (turn == 0 && flag.chara == character_num - 1)){
				dom.chara.eq(turn).addClass('next').removeClass('prev');
				var _current_turn = 'prev';
			}else{
				dom.chara.eq(turn).addClass('prev').removeClass('next');
				var _current_turn = 'next';
			}
			setTimeout(function(){
				dom.chara.eq(turn).addClass('current').removeClass('next prev');
				dom.chara.eq(flag.chara).addClass(_current_turn).removeClass('current');
				flag.chara = turn;
			},200);
		};
		var clickStamp = function (e) {
			e.preventDefault();
			var _offset = dom.base.offset().top;
			_offset -= $('header').height();
			$('body, html').animate({scrollTop: _offset});

			var _id = $(this).attr('data-chara');
			if(_id.indexOf(',') != -1){
				var _id_ary = _id.split(',');
				_id = _id_ary[ Math.floor(Math.random() * _id_ary.length) ];
			}else if(_id == ''){
				_id = Math.floor(Math.random() * character_num) + 1;
			}
			_id -= 1;
			goCharacter(_id);
		};
		var _onTransitionEnd = function(e){
			if($(e.target).hasClass('current')){
				dom.chara.removeClass('prev next');
				flag.lock = false;
			}
		};

		return {
			init :init
		}
	})();

	//レストランのツイート取得
	var getTweetRestaurant = function () {
		var dom = {
			tweet: $('#tweet'),
			gallery: $('#tweetGallery')
		};
		var flag = {tweet:0, gallery:0};
		var num = {tweet:0, gallery:0};

		//ツイートの表示
		var setTweet = function(data) {
			if(!data){
				dom.tweet.addClass('empty');
				return false;
			}

			num.tweet = data.BotanicalTweet.length;
			var _html = '',_url;
			for(var i = 0; i < num.tweet; i+=1){
				_url = 'https://twitter.com/' + data.BotanicalTweet[i].user_screen_name + '/status/' +data.BotanicalTweet[i].tweet_id;
				_html += '<li id="tweet' + i + '" data-id="' + data.BotanicalTweet[i].id + '"' + ((i==0)?' class="current"':'') + '><a href="' + _url + '" target="_blank">';
				if(data.BotanicalTweet[i].tweet_media_url){
					_html += '<div class="thum"><img src="' + data.BotanicalTweet[i].tweet_media_url + '"></div>';
				}
				_html += '<p class="username">' + data.BotanicalTweet[i].user_screen_name + '</p>';
				_html += '<p class="tweet">' + data.BotanicalTweet[i].tweet_text.substr(0, 40) + ((data.BotanicalTweet[i].tweet_text.length > 40)?'...':'') + '</p>';
				_html += '</a></li>';
			}
			dom.tweet.find('ul').empty().html(_html);

			if(num.tweet <= 1){
				return;
			}

			var goNext = function () {
				setTimeout(function(){
					var _next = (flag.tweet + 1 >= num.tweet)? 0 : flag.tweet + 1;
					dom.tweet.find('li').eq(flag.tweet).addClass('end').removeClass('current');
					dom.tweet.find('li').removeClass('current');
					dom.tweet.find('li').eq(_next).addClass('current');
				}, 3000);
			};
			goNext();

			dom.tweet.on('transitionend webkitTransitionEnd', function(e){
				if(e.originalEvent.propertyName !== 'opacity'){ return; }
				var _id = $(e.target).attr('id').replace('tweet','');
				if(_id == flag.tweet){
					dom.tweet.find('li').removeClass('end');
					setTimeout(function(){
						flag.tweet = (flag.tweet + 1 >= num.tweet)? 0 : flag.tweet + 1;
					}, 300);
					goNext();
				}
			});

		};

		//フォトギャラリーの表示
		var setGallery = function (data) {
			if(!data){
				dom.gallery.addClass('empty');
				return false;
			}
			num.gallery = data.BotanicalTweet.length;

			var _html = '',_url, _group, _order = 0, _head;
			for(var i = 0; i < num.tweet; i+=1){
				if(!data.BotanicalTweet[i].tweet_media_url){
					num.gallery -= 1;
					continue;
				}
				_group = Math.floor(_order / 4);
				_head = (_order % 4 === 0)? ' group-head':'';
				_url = 'https://twitter.com/' + data.BotanicalTweet[i].user_screen_name + '/status/' +data.BotanicalTweet[i].tweet_id;
				_html += '<li id="photo' + data.BotanicalTweet[i].id + '" class="group'+_group+_head +'" data-group="'+_group+'"><a href="' + _url + '" target="_blabk">';
				_html += '<img src="' + data.BotanicalTweet[i].tweet_media_url + '">';
				_html += '</a></li>';
				_order += 1;
			}

			dom.gallery.find('ul').empty().html(_html);
			setTimeout(function(){
				dom.gallery.find('li.group' + flag.gallery).addClass('current');

			}, 100);
			if(num.gallery <= 4){
				return;
			}

			dom.gallery.on('transitionend webkitTransitionEnd', function(e){
				if($(e.target).hasClass('group-head')){
					var _group = $(e.target).attr('data-group');
					var _next = (flag.gallery + 1 > Math.floor(num.gallery / 4) )? 0 : flag.gallery + 1;

					if($(e.target).hasClass('current')){
						setTimeout(function(){
							dom.gallery.find('li.group' + flag.gallery).removeClass('current');
						}, 5000);
					}else{
						if(_next == 0){
							dom.gallery.find('li').removeClass('out')
						}else{
							dom.gallery.find('li.group' + flag.gallery).addClass('out');
						}
						setTimeout(function(){
							dom.gallery.find('li.group' + _next).addClass('current');
							flag.gallery = _next;
						}, 100);

					}
				}
			});
		}

		SKB_SP.api('getTwitterBotanicalTweet', {place: 1, type: 1}).done(setTweet).fail(function(){
			setTweet(false);
		});
		SKB_SP.api('getTwitterBotanicalTweet', {place: 2}).done(setGallery).fail(function(){
			setGallery(false);
		});

	};

	$(function(){
		//ボタニカルストーリー
		if($('#story').size() > 0){
			STORY.init();

		//LINEスタンプ
		}else if($('#line').size() > 0){
			CHARACTERS.init();
		}else if($('#restaurant').size() > 0){
			getTweetRestaurant();
		}
	});
})();