(function(){
	'use strict';
	var STORY = (function(){
		var dom = {};
		var flag = {
			lock: false,
			sozai: 0,//���ݕ\�����̑f�� 0�͕\��
			check: new Array(12),//�f�ނ��{���ς݂��ǂ���
			challenge: false,//�N�C�Y�ɒ���\���ǂ���
			modal: false,//�N�C�Y���[�_�����J���Ă��邩�ǂ���
			quiz: null//�����f���őI�΂ꂽ�N�C�Y�̔ԍ�
		};
		var sozai_list = [
			'�͂Ƃނ�', '����', '�唞', '�Ȃ�΂񂫂�', '���S�}', '�ǂ�����', '�͂Ԓ�', '�`�R���[', '�����', '������', '�唞��t', '�����t'
		];
		var sozai_num = sozai_list.length;

		var quiz_list = [
			{
				name: 'hatomugi',
				question: '���E�O������̈�l�Ə̂����k�M�܂����p���Ă����ƌ����Ă���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [0,7,8],
				answer: 0,
				ex: '�~�l�����ނ�A����ς������܂܂�Ă���A���e�ƌ��N���T�|�[�g���Ă����͂Ƃނ��B���E�O������̈�l�Ə̂����A���̗k�M�܂��A���p���Ă����ƌ����Ă��܂��B',
				txt: '���E�O������̈�l�Ə̂����k�M�܂́A�͂Ƃނ������p���Ă����B'
			},
			{
				name: 'genmai',
				question: '��������ɂ́g�������h�Ƃ��ėp������قǐ����Ɍ������Ȃ��A���������A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [10,1,5],
				answer: 1,
				ex: '�r�^�~��B�Q�Ȃǂ��L�x�ŁA�u�������肪�C�����������b�N�X�����Ă���錺�āB��������ɂ́A�g�������h�Ƃ��ėp������قǁA�����Ɍ������Ȃ��A���ł����B',
				txt: '�Â����琶�����x����͂��������āB��������ɂ́A�g�����h�Ƃ��ėp�����Ă����B'
			},
			{
				name: 'oomugi',
				question: '75�˂܂Œ�������������ƍN���D��H�ׂĂ����ƌ����Ă���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [11,7,2],
				answer: 2,
				ex: '�H���@�ہA�J���V�E���A�S���A�r�^�~�����܂܂�Ă���A���N�H�Ƃ��Ă����ڂ����唞�B75�˂܂Œ�������������ƍN���A�唞���D��ŐH�ׂĂ����ƌ����Ă��܂��B',
				txt: '75�˂܂Ő���������ƍN�́A�唞���D��ŐH�ׂĂ����B'
			},
			{
				name: 'nanbankibi',
				question: '���x�ȕ�����z�����Ñ�}�������̐l�X����H�ɂ��Ă����ƌ����Ă���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [3,8,10],
				answer: 3,
				ex: '�Ȃ�΂񂫂т́A�g�E�����R�V�̕ʖ��B<br>��q�́A������S���A�r�^�~��B1���܂݁A���x�ȕ�����z�����Ñ�}�������̐l�X���A�Ȃ�΂񂫂т���H�ɂ��Ă����ƌ����Ă��܂��B',
				txt: '�Ñ�ɍ��x�ŗ͋���������z�����}�������̐l�X�́A�Ȃ�΂񂫂т���H�Ƃ��Ă����B'
			},
			{
				name: 'kurogoma',
				question: '���E�O������̈�l�Ə̂����N���I�p�g�������p���Ă����ƌ����Ă���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [5,4,11],
				answer: 4,
				ex: '���E�O������̈�l�Ə̂����A�N���I�p�g�������p���Ă����ƌ�����S�}�B<br>�S�}�Ɋ܂܂��u�S�}���O�i���v�́A���N�����̂ЂƂƂ��Ē��ڂ���Ă��܂��B',
				txt: '���E�O������̈�l�Ə̂����A�N���I�p�g�����S�}�����p���Ă����B'
			},
			{
				name: 'dokudami',
				question: '�ɐB�͂������A���ԂƂ������͂����邱�Ƃ���u�V�u�g���v�Ƃ��Ă΂�Ă���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [6,10,5],
				answer: 5,
				ex: '����������t���{�m�C�h���܂݁A�Â����爤������Ă����A�ǂ����݁B<br>�ɐB�͂������A���ԂƂ������͂����邱�Ƃ���A�u�V�u�g���v�Ƃ��Ă΂�܂��B',
				txt: '�ǂ����݂́A���ԂƂ������͂����邱�Ƃ���A�u�V�u�g���v�Ƃ��Ă΂�Ă���B'
			},
			{
				name: 'habucha',
				question: '��������́w�{���a���x�Ɍ��N�f�ނƂ��ďЉ���قǗ��j�̐[���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [3,9,6],
				answer: 6,
				ex: '�ߔN�A���N���̂ЂƂƂ��Ē��ڂ���Ă���͂Ԓ��B<br>���́A��������́w�{���a���x�Ɍ��N�f�ނƂ��ďЉ���قǁA���j�̐[���A���ł��B',
				txt: '���N���Ƃ��Ē��ڂ���Ă���͂Ԓ��́A��������́w�{���a���x�ɂ����N�f�ނƂ��ďЉ��Ă���B'
			},
			{
				name: 'chikori',
				question: '25�˂ɂ��ăC�M���X�����ɌN�Ղ����G���U�x�X�P�����d�󂵂Ă����ƌ����Ă���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [7,4,3],
				answer: 7,
				ex: '�~�l������r�^�~���A�H���@�ۂ́u�C�k�����v���܂܂�Ă���`�R���[�B<br>25�˂ɂ��ăC�M���X�����ɌN�Ղ����G���U�x�X1�����A�`�R���[���d�󂵂Ă����ƌ����Ă��܂��B',
				txt: '25�˂ɂ��ăC�M���X�����ɌN�Ղ����G���U�x�X�P���́A�`�R���[���d�󂵂Ă����B'
			},
			{
				name: 'yomogi',
				question: '�s�v�c�ȗ͂�����ƐM�����A���[���b�p��A�W�A�𒆐S�ɖ������̑��Ƃ��ďd�󂳂�Ă����A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [0,9,8],
				answer: 8,
				ex: '���[���b�p�A�����A���{�ȂǂŖ������̑��Ƃ��ďd�󂳂�Ă����A�����<br>�r�^�~��B�Q�Ȃǂ��܂݁A���݂ł����E���Ńn�[�u�Ȃǂɗ��p����Ă��܂��B',
				txt: '�s�v�c�ȗ͂�����ƐM����ꂽ������́A���[���b�p��A�W�A�𒆐S�ɖ������̑��Ƃ��ďd�󂳂�Ă����B'
			},
			{
				name: 'tsukimisou',
				question: '�厩�R�̒������܂���������l�C�e�B�u�A�����J�������܂��܂ȗp�r�ŏd�󂵂Ă����A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [9,5,7],
				answer: 9,
				ex: '���F��s���N�̉Ԃ��炩����_��I�Ȍ������B�厩�R�̒������܂���������l�C�e�B�u�A�����J�����A���܂��܂ȗp�r�Ō��������d�󂵂Ă��܂����B',
				txt: '�����܂���������l�C�e�B�u�A�����J���́A���������d�󂵂Ă����B'
			},
			{
				name: 'oomugiwakaba',
				question: '���߂Γ��ނقǂ�苭���������鐶���͂����邱�Ƃ���A�͔|���Ɂu���ӂ݁v���s����A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [2,10,6],
				answer: 10,
				ex: '�Ή��F��؂Ȃǂɔ�ׂāA�r�^�~����~�l�����A�y�f�Ȃǂ������܂܂�Ă���唞��t�B���߂Γ��ނقǁA��苭���������鐶���͂����邱�Ƃ���A�͔|���Ɂu���ӂ݁v���s���܂��B',
				txt: '�u���ӂ݁v������̂́A�唞��t�ɁA���߂Γ��ނقǂ�苭��������͂����邩��B'
			},
			{
				name: 'ashitaba',
				question: '�u����E��ł��A�����̒��ɂ͐V����o�������͂�����v���Ƃ��疼�O�������Ƃ����Ă���A�u�������̑f�ނ͎��̂����ǂ�H',
				select: [8,11,4],
				answer: 11,
				ex: '�r�^�~��C��L�x�Ɋ܂�ł��閾���t�B�u����E��ł��A�����̒��ɂ͐V����o�������͂�����v���Ƃ���A�g�����t�h�Ƃ������O�������Ƃ����Ă��܂��B',
				txt: '�����t�̖��O�́A�u����E��ł��A�����̒��ɂ͐V����o���v�Ƃ��������͂̋�������t����ꂽ�B'
			}
		];

		//������
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

		//�X�g�[���[�̐i�s
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
					dom.quiz_a.find('p.caution.success').text('300�p�[�NG���Q�b�g�I');
					var _parkG = parseInt($('#globalNavi p.parkG').text().replace(',',''), 10);
					_parkG += 300;
					cnsole.log(_parkG);
					$('#globalNavi p.parkG').text(d.coca_g);
				}).fail(function(code){
					if(code == 4){
						dom.quiz_a.find('p.caution.success').html('�����̓p�[�NG��t�^�ς݂ł��B<br>�܂������`�������W���Ă��������I');
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
			var txt = quiz_list[sozai - 1].txt + ' 12�̃{�^�j�J���X�g�[���[�b�u�������i��������т���j';
			var url;
			switch(type){
				case 'line':
					url = 'http://line.naver.jp/R/msg/text/' + encodeURIComponent(txt + ' ' + share_url);
					break;
				case 'facebook':
					url = 'http://www.facebook.com/share.php?u=' + share_url;
					break;
				case 'twitter':
					url = 'http://twitter.com/share?url=' + encodeURIComponent(share_url) +'&text=' + encodeURIComponent(txt) + '&hashtags=' + encodeURIComponent('�u������,�{�^�j�J���錾,' + quiz_list[sozai - 1].name);
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

	//���X�g�����̃c�C�[�g�擾
	var getTweetRestaurant = function () {
		var dom = {
			tweet: $('#tweet'),
			gallery: $('#tweetGallery')
		};
		var flag = {tweet:0, gallery:0};
		var num = {tweet:0, gallery:0};

		//�c�C�[�g�̕\��
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

		//�t�H�g�M�������[�̕\��
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
		//�{�^�j�J���X�g�[���[
		if($('#story').size() > 0){
			STORY.init();

		//LINE�X�^���v
		}else if($('#line').size() > 0){
			CHARACTERS.init();
		}else if($('#restaurant').size() > 0){
			getTweetRestaurant();
		}
	});
})();