(function(){
	'use strict';
	var catalog_scroll, scroll_top = 0;
	var image_dir = '/spn/images/products/sozai_catalog/';
	var SOZAI = [
		{
			id:1, name:'はとむぎ', x:74, y:90, z:0.58, type: 1,
			txt:'ビタミンB1、B2、\n良質のタンパク質が含まれており、\n美容と健康をサポートします。'
		},
		{
			id:9, name:'よもぎ', x:187, y:90, z:0.55, type: 3,
			txt:'シネオールなどの精油類やビタミン群などを含み、\n世界的にもかなり多くの種類があり、\nハーブなどとして利用されてきました。'
		},
		{
			id:2, name:'玄米', x:40, y:105, z:0.64, type: 1,
			txt:'ビタミンB群などが豊富に含まれており、\n炒った香りが気持ちをリラックスさせてくれます。'
		},
		{
			id:12, name:'明日葉',x:208, y:105, z:0.74, type: 3,
			txt:'ビタミンB12を豊富に含んでいるほか、\nフラボノイドのもとになる成分や、\n葉緑素を多く含んでいます。'
		},
		{
			id:3, name:'大麦', x:5, y:119, z:0.8, type: 1,
			txt:'食物繊維、カルシウム、鉄分、\nビタミンが含まれており、\n健康食として注目されています。'
		},
		{
			id:11, name:'大麦若葉', x:230, y:125, z:0.85, type: 3,
			txt:'緑黄色野菜などに比べて、\nビタミンやミネラル、\n酵素などが多く含まれており、\n健康素材として注目されています。'
		},
		{
			id:4, name:'なんばんきび', x:-10, y:158, z:0.92, type: 3,
			txt:'トウモロコシの別名。\n種子は、リンや鉄分、ビタミンB1、\nナイアシンなどを多く含み\nコーン茶などでも親しまれています。'
		},
		{
			id:10, name:'月見草', x:250, y:177, z:0.73, type: 2,
			txt:'アカバナ科に属するマツヨイグサや\nオオマツヨイグサなどの総称で、\n黄色やピンク色などの可憐な花を咲かせます。'
		},
		{
			id:5, name:'黒ゴマ', x:24, y:178, z:0.95, type: 4,
			txt:'たんぱく質、カルシウム、鉄、\nビタミン群などを含んだ栄養価の高い食品で、\nゴマに含まれる「ゴマリグナン」は、\n健康成分のひとつとして注目されています。'
		},
		{
			id:8, name:'チコリー', x:202, y:190, z:0.87, type: 5,
			txt:'鉄分、亜鉛、リンなどのミネラルやビタミン、\n食物繊維「イヌリン」が豊富に含まれています。\nカラダをリフレッシュさせたい時におすすめです。'
		},
		{
			id:6, name:'どくだみ', x:72, y:201, z:1, type: 2,
			txt:'精油成分やフラボノイドを含み、\n美容や健康のために、\n古くから愛飲されてきました。'
		},
		{
			id:7, name:'はぶ茶', x:150, y:190, z:1, type: 2,
			txt:'「エビスグサ」という植物の種が原料。\n健康茶のひとつとして注目されています。'
		}
	], SOZAI_LIST = {};



	//通常スクロール不可
	$(window).on('scroll',function(e){
		e.preventDefault();
		//if(!SKB_SP.flag.loginForm || !SKB_SP.flag.loginForm_alone){
		if(SKB_SP.flag.janrain === null){
			$('body, html').scrollTop(0);
		}
	});

	$('header').on('webkitTransitionEnd transitionend', function(e){
		//Androidのちらつき対策
		if(!SKB_SP.flag.globalNavi){
			$('#globalNavi').addClass('hidden');
		}
	});

	//初期化、スクロールの開始
	var initialize = function () {

		$('#cover').height($(window).height() - 50);

		var _canvas_translate = ($(window).height() - 270)/2 - 90;
		$('#cover div.canvas-wrap').css({
			mozTransform: 'translate(0, '+_canvas_translate+'px)',
			webkitTransform: 'translate(0, '+_canvas_translate+'px)',
			transform: 'translate(0, '+_canvas_translate+'px)'
		});

		//$('#cover').addClass('ready');
		$('#globalNavi').addClass('hidden');


		//iScroll実装
		catalog_scroll = SKB_SP.Scroll('iscrollWrapper',{
			useTransition: false,
			bounce: false,
			mouseWheel: true,
			scrollbars: true,
			click: true,
			snap: '.scroll-block'
		});
		catalog_scroll.on('scroll', materials.update);
		catalog_scroll.on('scrollEnd', materials.fire);

	};
	var preload_images = function () {
		var _preload = [image_dir +'photo_package.png'];
		for(var _index = 0, _length = SOZAI.length; _index < _length; _index++){
			SOZAI_LIST[SOZAI[_index].id] = SOZAI[_index];
			_preload.push(image_dir + 'image_sozai' + SOZAI[_index].id +'.png');
			//sozai_list[_index] = new Sozai_image(SOZAI[_index]);
		}

		SKB_SP.loadImages(_preload).done(initialize);
	};
	preload_images();

	//ループ
	var loopAnimation = function () {
		var _move = scroll_top - catalog_scroll.y;
		scroll_top = catalog_scroll.y;
	};


	//Android2 ログインフォーム対策
	SKB_SP.android_login = function() {
		var _tapped = $(this).attr('data-widget');
		if(typeof _tapped === 'undefined'){
			SKB_SP.flag.janrain_before = SKB_SP.flag.janrain;
			SKB_SP.flag.janrain = null;
		}else if(_tapped === SKB_SP.flag.janrain){
			SKB_SP.flag.janrain = null;
		}else{
			if(_tapped === SKB_SP.flag.janrain_before){
				SKB_SP.flag.janrain_before = null;
				return false;
			}
			SKB_SP.flag.janrain = _tapped;
		}
		var _container = $('#container');
		if(SKB_SP.flag.janrain !== null){
			if(typeof catalog_scroll !== 'undefined'){
				catalog_scroll.scrollTo(0,0);
				catalog_scroll.destroy();
			}
			$('#iscrollWrapper').hide();
			$('#janrainCaptureWidget').css({position: 'relative', top:0}).addClass('isolate');
			_container.css({height:'auto'});
			_container.find('header').addClass('relative');
			_container.find('.main-contents').hide();
			_container.find('footer').hide();
			$('#globalNavi').hide();
		}else{
			$('html, body').scrollTop(0);
			$('#iscrollWrapper').removeAttr('style');
			_container.find('header').removeClass('relative');
			_container.find('.main-contents').removeAttr('style');
			_container.find('footer').removeAttr('style');
			_container.removeAttr('style');
			$('#globalNavi').removeAttr('style');
			initialize();
		}
	};



	//素材テキスト演出
	var materials = (function () {
		var sozai_list = [];
		var flag = {
			ready: false
		}



		//文字オブジェクト
		var Char = function (c, type, position, order, line) {
			this.moji = c;
			order = order || 0; line = line || 0;
			this.position = position;

			this.init = function () {
				//最終位置は基本的に同じ
				this.pX = 0; this.pY = 0;			//現在地点
				this.dX = 20 + order * ((this.position === 'name')? 24 : 12);
				this.dY = 180 + ((this.position === 'name')? 0 : 30 + 16 * line);			//最終地点
				this.easing = 0;
				this.vX = 0; this.vY = 0;	//速度
				this.aX = 0; this.aY = 0;	//加速度
				this.alpha = 0;
				this.font = (position === 'name')? 'bold 24px serif' : 'normal 12px sans-serif';
				this.complete = false;

				switch(type){
					case 1://垂れる 円運動にイーズアウト
						this.t = 0;
						this.cX = 0; this.cY = 270;//回転の中心点
						this.r = Math.sqrt(Math.pow(this.dX - this.cX,2) + Math.pow(this.dY - this.cY,2)); //回転半径
						this.step = 0;
						this.easing = 0.03 + Math.random() * 0.01;
						this.dt = 180 - 180 * Math.atan((this.cY - this.dY)/ (this.dX -this.cX)) / Math.PI + 15;
						break;
					case 2://咲く 単純にイーズアウト
						this.pX = 70 + Math.random() * 2;
						this.pY = 220 + Math.random() * 2;
						this.distanceX = this.dX - this.pX;
						this.easing = 0.05;
						break;
					case 3://伸びる	数段階に分けてイーズアウト
						this.step = 1;//段階
						this.pX = this.dX; this.dY -= 80;	//位置は少し高め、X座標は変化させない
						this.distanceY = 240 + (Math.random() * 10);	//移動距離
						this.pY = this.dY + this.distanceY;			//開始位置は画面下
						this.easing = 0.07 + Math.random() * 0.01;
						break;
					case 4://降る
						this.pX = this.dX;
						this.pY = -5 - Math.random() * 200;	//画面上に配置
						this.aY = 0.1;
						this.coefficient = 0.2 + Math.random()*0.1;
						break;
					case 5://根を張る		Y座標は速度をsinで、X座標はY速度ゼロのときに横に広がる
						this.t = 0;
						this.step = 0;//段階
						this.pX = this.dX;
						this.pX = 140;	//X座標は中心から
						this.distanceX = this.dX - this.pX;
						this.vX = (this.dX - this.pX)/500;
						this.distanceY = 240 + Math.random() * 10;
						this.pY = this.dY - this.distanceY;
						this.easing = 0.06 + Math.random() * 0.02;
						break;
					default:
						this.vX = (this.dX - this.pX) / 100;
						this.vY = (this.dY - this.pY) / 100;
						break;
				}
			};
			this.init();



			//情報更新
			this.update = function () {
				if(this.complete) return false;
				this.vX += this.aX; this.vY += this.aY;
				this.alpha = (this.alpha >= 1)? 1 : this.alpha + 0.01;
				switch(type){
					case 1://垂れる
						if(this.dt - this.t >= 1){
							this.t += (this.dt - this.t) * this.easing;
							this.theta = (this.t - 180) * Math.PI/180;
							this.pX = this.cX + Math.cos(this.theta) * this.r;
							this.pY = this.cY + Math.sin(this.theta) * this.r;
						}else if(this.step === 0 && Math.abs(this.dt - this.t) < 1){
							this.step += 1;
							this.dt -= 15;
							this.easing = 0.03;
						}else if(Math.abs(this.dt - this.t) >= 1){
							this.t -= Math.abs(this.dt - this.t) * this.easing;
							this.theta = (this.t - 180) * Math.PI/180;
							this.pX = this.cX + Math.cos(this.theta) * this.r;
							this.pY = this.cY + Math.sin(this.theta) * this.r;
						}else{
							this.pX = this.dX;
							this.pY = this.dY;
							this.complete = true;
						}
						break;
					case 2://咲く
						this.pX += (this.dX - this.pX) * this.easing;
						var _proceed = (this.distanceX - (this.dX - this.pX)) / this.distanceX;	//進捗率 0->1
						this.pY += (this.dY - this.pY) * this.easing + Math.sin(Math.PI * _proceed) * (-2);
						break;
					case 3://伸びる
						this.pY += (this.dY + ((4 - this.step) * this.distanceY/4) - this.pY) * this.easing;
						if(Math.abs(this.dY + ((4 - this.step) * this.distanceY/4) - this.pY) < 0.5) this.step++;
						break;
					case 4://降る
						this.pY += this.vY;
						if(this.pY > this.dY){
							this.vY *= -1 * this.coefficient;
							this.pY -= Math.abs(this.dY - this.pY);
						}
						if(Math.abs(this.vY) < 0.1 && Math.abs(this.dY - this.pY) < 0.5){
							this.pX = this.dX; this.pY = this.dY;
							this.complete = true;
						}
						break;
					case 5://根を張る
						this.t += 1;
						this.pX += this.vX;
						if(this.t % 90 === 0 && Math.abs(this.dX - this.pX) > 1){
							this.step++;
						}
						/*
						else if(Math.abs(this.dX - this.pX) < 1){
							this.pX = this.pY;
							this.complete = true;
						}
						*/
						this.pX += (this.dX - ((3- this.step) * this.distanceX/3) - this.pX) * this.easing;
						if(Math.abs(this.dY - this.pY) > 1){
							this.vY = Math.abs(Math.sin(Math.PI * this.t/90)) * 1.5;
						}else{
							this.vY = 0;
						}
						this.pY += this.vY;
						break;
					default:
						this.pX += this.vX;
						this.pY += this.vY;
						break;
				}
				if(type !== 4 && type !== 1){
					if(Math.abs(this.dX - this.pX) < 1){
						this.pX = this.dX; this.vX = 0;
					}
					if(Math.abs(this.dY - this.pY) < 1){
						this.pY = this.dY; this.vY = 0;
					}
					if(this.pX === this.dX && this.pY === this.dY) {
						this.alpha = 1;
						this.complete = true;
					}
				}
			};
			//オブジェクトの描画
			this.draw = function (context) {
				context.translate(this.pX, this.pY);
				context.globalAlpha = this.alpha;
				context.font = this.font;
				context.shadowColor = '#000';
				context.shadowBlur = 5;
				context.fillText(this.moji, 0, 0);

				context.translate(- this.pX, - this.pY);
				context.globalAlpha = 1;
				context.shadowBlur = 1;

				//回転軸の描写
				/*
				context.beginPath();
				context.arc(this.cX,this.cY,2, 0, Math.PI*2,false);
				context.fill();
				*/
			};
		};// Char

		//素材オブジェクト
		var Material = function (index) {
			var _this = this;
			this.no = index + 1;
			this.dom = $('#sozaiList li').eq(index);
			this.dom.find('canvas').attr('id','sozai'+this.no);
			this.height = this.dom.height();
			this.txt = this.dom.find('div.text');
			this.image = this.dom.find('img').attr('src');
			this.df_offset = this.offset = this.dom.offset().top;

			var m = SOZAI_LIST[this.no];
			this.type = m.type;
			this.name = m.name;
			this.character = [];
			this.complete = false;
			this.stop = false;


			//名前を一文字ずつオブジェクトとして生成
			for(var _index = 0, _length = this.name.length; _index < _length; _index ++){
				this.character.push( new Char(this.name[_index], this.type, 'name', _index) );
			}
			var _txt_lines = m.txt.split('\n');
			for(_index = 0, _length = _txt_lines.length; _index < _length; _index ++){
				for(var _i = 0, _l = _txt_lines[_index].length; _i < _l; _i ++){
					this.character.push( new Char(_txt_lines[_index][_i], this.type, 'txt', _i, _index ) );
				}
			}
			var canvas = document.getElementById('sozai'+this.no);
			var context = canvas.getContext('2d');
			context.fillStyle = '#fff';

			//スクリーンの再上端に表示されているか
			this.isScreenTop = function () {
				if(this.offset < 50 + this.height/2 && this.offset > 50 - this.height/2) {
					return true;
				}else {
					return false;
				}
			};

			this.update = function (scroll_y) {
				this.offset = this.dom.offset().top;
				this.height = this.dom.height();
				this.txt.removeAttr('style');
				if(this.offset < 0){
					var _translate = - this.offset;
					_translate = Math.min(_translate, this.height - this.txt.height() - 20);
					this.txt.css({'-moz-transform':'translate(0,'+_translate+'px)','-webkit-transform':'translate(0,'+_translate+'px)','transform':'translate(0,'+_translate+'px)'});
				}
			};

			var loopAnimation = function () {
				if(_this.complete) return false;
				context.clearRect(0, 0, canvas.width, canvas.height);
				var _complete = 0;
				for(var _index = 0, _length = _this.character.length; _index < _length; _index++){
					_this.character[_index].update();
					_this.character[_index].draw(context);
					if(_this.character[_index].complete) _complete++;
				}
				if(_complete < _length && !_this.stop){
					requestAnimationFrame(loopAnimation);
				}else{
					_this.complete = true;
				}
			};

			this.begin = function () {
				this.stop = false;
				loopAnimation();
			}
			this.vanish = function () {
				context.clearRect(0, 0, canvas.width, canvas.height);
				this.stop = true;
				if(!this.complete) return false;
				for(var _index = 0, _length = _this.character.length; _index < _length; _index++){
					this.character[_index].init();
				}
				this.complete = false;
			}
		};// Material



		//初期化
		var _init = function () {
			var _preload = []
			$('#sozaiList li').each(function(index, element){
				//sozai_list[index] = new Sozai(index);
				sozai_list[index] = new Material(index);
				_preload.push(sozai_list[index].image);
			});
			SKB_SP.loadImages(_preload).done(function(){
				flag.ready = true;
			});
		}

		//テキスト表示領域の配置
		var update = function () {
			for(var index = 0, length = sozai_list.length; index < length; index++){
				sozai_list[index].update(this.y);
			}
			//requestAnimationFrame(loopAnimation);
		};

		var fire = function () {
			if(sozai_list[0].offset > 50 || sozai_list[sozai_list.length - 1].offset + sozai_list[sozai_list.length - 1].height < 50){
				return false;
			}
			//flag.lock = true;
			for(var index = 0, length = sozai_list.length; index < length; index++){
				if(sozai_list[index].isScreenTop()){
					sozai_list[index].begin();
				}else{
					sozai_list[index].vanish();
				}
			}
		};

		_init();

		return {
			update: update,
			fire: fire,
			flag: flag
		}
	})();


})();