SKB_SP.Soudanshitsu = (function(){
	var dom = {};
	var flag = {
		lock: false,
		character: 1,
		character_active: Math.floor(Math.random() * 11)
	};
	var info = {
		character : {
			1: 'むぎばと',
			2: 'げんまいまい',
			3: '麦じい',
			4: 'なんばんばん',
			5: '黒田ゴマ夫',
			6: 'はぶちゃん',
			7: 'つきみみつき',
			8: 'したば',
			9: 'ダミー',
			10: 'チコ・リー',
			11: 'わかば',
			12: 'よもよもぎ'
		}
	};
	var chara_animation_timer;

	$(function(){
		dom = {
			base: $('#soudanshitsu'),
			result: ($('#AdviceResult').size() > 0)? $('#AdviceResult') : $('#soudanshitsu.play'),
			character_detail: $('#introCharacter div.character-detail li')
		}

		if(window.navigator.userAgent.toLowerCase().indexOf('android') != -1){
			dom.base.addClass('android');
		}

		$('#soudanshitsu form').on('submit', getAdviceResult);
		$('#soudanshitsu ul.characters li').on('click', showCharacter);
		$('#soudanshitsu h1.contents-title').on('click', showAbout);

		dom.character_detail.eq(flag.character - 1).addClass('current');
		dom.character_detail.on('transitionend webkitTransitionEnd', function(e){
			e.stopPropagation();
			flag.lock = false;
		});

		$('#introCharacter a.js-select-character').on('click', function(e){
			e.preventDefault();
			var character_id = Number($(this).attr('data-chara'));
			showCharacterDetail(character_id);
		});
		$('#introCharacter div.character-detail a.js-arrow-character').on('click', function(e){
			e.preventDefault();
			var arrow = $(this).attr('data-arrow');
			var new_chara;
			if(arrow == 'prev'){
				new_chara = (flag.character == 1)? 12 : flag.character - 1;
			}else{
				new_chara = (flag.character == 12)? 1 : flag.character + 1;
			}
			showCharacterDetail(new_chara, arrow);
		});
		//キャラクター紹介モーダル開閉時
		$('.intro-modal').on('webkitTransitionEnd transitionend', function(e){
			e.stopPropagation();
			if(!$(this).hasClass('open')){
				$(this).removeClass('ready');
				$('#soudanshitsu').removeAttr('style').removeClass('behind');;
			}
		});
		$('section.intro-modal').find('a.js-close-modal').on('click', function(e){
			e.preventDefault();
			$(this).parents('section.intro-modal').removeClass('open');
			$('html, body').animate({scrollTop: 0});
		});

		if(dom.base.hasClass('play')){
			getAdviceLanding();
		}else{
			//Tweet Ticker
			var ticker = SKB_SP.Ticker($('ul.soudan-ticker'), 'soudan');


			//フォーム制御
			var checkInput = function(){
				if(dom.base.find('input[type=text]').val().length > 0){
					$('#postSoudan').addClass('ready');
				}else{
					$('#postSoudan').removeClass('ready');
				}
			};
			dom.base.find('input[type=text]').on('change', checkInput);
			dom.base.find('input[type=text]').on('focus', function(){
				dom.base.find('form').addClass('focus');
			});
			checkInput();

			//キャラクターアニメーション
			setInterval(function(){
				clearInterval(chara_animation_timer);
				$('ul.characters li').removeClass('active');
				var next_chara = Math.floor(Math.random() * 11);
				if(next_chara == flag.character_active){
					next_chara = (flag.character_active == 10)? 0 : flag.character_active + 1;
				}
				setTimeout(function(){
					animationCharacter(next_chara);
					flag.character_active = next_chara;
				}, 1000);
			}, 6000);

			checkFirstVisit();
		}

	});

	//お悩み入力
	var getAdviceResult = function (e) {
		e.preventDefault();
		var text = $(this).find('input[type=text]').val();
		var $error = $(this).find('p.error');
		$error.text('');
		if(text.length > 0 && text.length <= 30){
			_gaq.push(['_trackEvent', 'soudanshitsu', 'btnclick', 'input']);
			SKB_SP.api('getAdviceResult', text).done(function(d){
				showAdviceResult(d);
			}).fail(function(d){
				console.error(d, '通信エラーが発生しました');
				//$error.text('通信エラーが発生しました。');
				showAdviceResult();
			});
		}else if(text.length > 30){
			$error.text('30文字以内で入力してください');
		}else{
			//$error.text('テキストを入力してください。');
		}
	};

	var showAdviceResult = function (data) {
		//取得データの表示
		dom.result.find('span.character-name').text(info.character[data.characterId]);
		$('#answerText1').text(data.answer.text1);
		$('#answerText2').text(data.answer.text2);

		if( data.ngWord == 0){
			dom.result.find('div.question p').text(data.question);
		} else {
			dom.result.find('div.question p').text('お悩みニョキっと解決！');
		}

		dom.result.find('div.character').html('<img src="/spn/images/fun/soudanshitsu/character/play'+ data.characterId + '.png" width="120" height="120" alt="">');
		dom.result.find('a.btn.tweet').attr({
			'data-url': data.linkUrl,
			'data-question': data.question,
			'data-answer': data.answer.text2
		});

		$('body, html').animate({scrollTop: 0});

		$('#AdviceResult').addClass('ready');
		$('#soudanshitsu').css({ height: $('#AdviceResult').height()}).addClass('behind');

		$('#AdviceResult').on('transitionend webkitTransitionEnd', function(e){
			if(e.target !== this){
				return false;
			}
			if($(this).hasClass('ready')){
				$(this).addClass('complete');
			}else{
				$(this).removeClass('complete');
				$('#soudanshitsu').removeAttr('style').removeClass('behind');;
				$(this).off('transitionend webkitTransitionEnd');
			}
		});
	};



	//キャラクター紹介
	var showCharacter = function (e) {
		if(e){e.preventDefault();}
		var _id = Number($(this).attr('data-character'));

		$('#introCharacter').addClass('ready');
		$('#soudanshitsu').css({ height: $('#introCharacter').height()}).addClass('behind');;

		window.setTimeout( function(){
			$('#introCharacter').addClass('open');
			if(_id){
				showCharacterDetail(_id);
			}
		}, 100);

	};
	var showCharacterDetail = function (id) {
		if(flag.lock) return false;
		flag.lock = true;
		//スクロール
		$('html, body').animate({scrollTop: $('#introCharacter div.character-detail').offset()['top'] - 50});

		var $new = dom.character_detail.eq(id - 1);
		var $current = dom.character_detail.eq(flag.character - 1);
		var turn = true;//true:進む
		$new.removeClass('next prev');
		if(id == flag.character) {
			flag.lock = false;
			return false;
		}else if(id > flag.character) {
			turn = true;
		}else if(id < flag.character){
			turn = false;
		}
		if(arguments[1] === 'prev'){
			turn = false;
		}else if(arguments[1] === 'next'){
			turn = true;
		}

		if(turn){
			$new.addClass('next');
		}else{
			$new.addClass('prev');
		}
		setTimeout(function(){
			$new.addClass('current').removeClass('next prev');
			$current.removeClass('current').addClass((turn)?'prev':'next');
			flag.character = id;
		},500);
	};

	//監修者
	var showSuperviser = function () {
		$('#introSuperviser').addClass('ready');
		$('#soudanshitsu').css({ height: $('#introSuperviser').height()}).addClass('behind');;

		window.setTimeout( function(){
			$('#introSuperviser').addClass('open');
		}, 100);
	};

	//企画紹介
	var showAbout = function () {
		$('#introAbout').addClass('ready');
		$('#soudanshitsu').css({ height: $('#introAbout').height()}).addClass('behind');;

		window.setTimeout(function(){
			$('#introAbout').addClass('open');
		}, 500);
	};

	//ランディングページ表示
	var getAdviceLanding = function () {
		var chara = Number($('#soudanshitsu').attr('data-chara'));
		$('#soudanshitsu span.character-name').text(info.character[chara]);
	};

	var animationCharacter = function (chara) {
		var chara_dom, active = false;
		if(chara == 0){
			chara_dom = $('ul.characters li.chara1');
		}else if(chara == 1){
			chara_dom = $('ul.characters li.chara2, ul.characters li.chara3');
		}else{
			chara_dom = $('ul.characters li.chara'+(chara + 2));
		}
		chara_animation_timer = setInterval(function(){
			if(active){
				chara_dom.removeClass('active');
				active = false;
			}else{
				chara_dom.addClass('active');
				active = true;
			}
		}, 800);
	};

	//初回訪問時に解説を表示
	var checkFirstVisit = function(){
		var visited = document.cookie.match('soudanshitsu_first_visit=1');

		if(!visited){
			showAbout();
			//Cookieのセット
			var exdate = new Date( new Date().getTime() + 60*60*24*1000*30).toUTCString();
			var set_visited = 'soudanshitsu_first_visit=1; path=/spn/; expires=' + exdate + ';';
			document.cookie = set_visited;
		}
	};

	return {
		getAdviceLanding: getAdviceLanding,
		showCharacter: showCharacter,
		showCharacterDetail: showCharacterDetail,
		showSuperviser: showSuperviser,
		showAbout: showAbout
	}
})();