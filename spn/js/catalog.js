(function(){
	'use strict';
	var catalog_scroll, scroll_top = 0;
	var image_dir = '/spn/images/products/sozai_catalog/';
	var SOZAI = [
		{
			id:1, name:'�͂Ƃނ�', x:74, y:90, z:0.58, type: 1,
			txt:'�r�^�~��B1�AB2�A\n�ǎ��̃^���p�N�����܂܂�Ă���A\n���e�ƌ��N���T�|�[�g���܂��B'
		},
		{
			id:9, name:'�����', x:187, y:90, z:0.55, type: 3,
			txt:'�V�l�I�[���Ȃǂ̐����ނ�r�^�~���Q�Ȃǂ��܂݁A\n���E�I�ɂ����Ȃ葽���̎�ނ�����A\n�n�[�u�ȂǂƂ��ė��p����Ă��܂����B'
		},
		{
			id:2, name:'����', x:40, y:105, z:0.64, type: 1,
			txt:'�r�^�~��B�Q�Ȃǂ��L�x�Ɋ܂܂�Ă���A\n�u�������肪�C�����������b�N�X�����Ă���܂��B'
		},
		{
			id:12, name:'�����t',x:208, y:105, z:0.74, type: 3,
			txt:'�r�^�~��B12��L�x�Ɋ܂�ł���ق��A\n�t���{�m�C�h�̂��ƂɂȂ鐬����A\n�t�Αf�𑽂��܂�ł��܂��B'
		},
		{
			id:3, name:'�唞', x:5, y:119, z:0.8, type: 1,
			txt:'�H���@�ہA�J���V�E���A�S���A\n�r�^�~�����܂܂�Ă���A\n���N�H�Ƃ��Ē��ڂ���Ă��܂��B'
		},
		{
			id:11, name:'�唞��t', x:230, y:125, z:0.85, type: 3,
			txt:'�Ή��F��؂Ȃǂɔ�ׂāA\n�r�^�~����~�l�����A\n�y�f�Ȃǂ������܂܂�Ă���A\n���N�f�ނƂ��Ē��ڂ���Ă��܂��B'
		},
		{
			id:4, name:'�Ȃ�΂񂫂�', x:-10, y:158, z:0.92, type: 3,
			txt:'�g�E�����R�V�̕ʖ��B\n��q�́A������S���A�r�^�~��B1�A\n�i�C�A�V���Ȃǂ𑽂��܂�\n�R�[�����Ȃǂł��e���܂�Ă��܂��B'
		},
		{
			id:10, name:'������', x:250, y:177, z:0.73, type: 2,
			txt:'�A�J�o�i�Ȃɑ�����}�c���C�O�T��\n�I�I�}�c���C�O�T�Ȃǂ̑��̂ŁA\n���F��s���N�F�Ȃǂ̉��ȉԂ��炩���܂��B'
		},
		{
			id:5, name:'���S�}', x:24, y:178, z:0.95, type: 4,
			txt:'����ς����A�J���V�E���A�S�A\n�r�^�~���Q�Ȃǂ��܂񂾉h�{���̍����H�i�ŁA\n�S�}�Ɋ܂܂��u�S�}���O�i���v�́A\n���N�����̂ЂƂƂ��Ē��ڂ���Ă��܂��B'
		},
		{
			id:8, name:'�`�R���[', x:202, y:190, z:0.87, type: 5,
			txt:'�S���A�����A�����Ȃǂ̃~�l������r�^�~���A\n�H���@�ہu�C�k�����v���L�x�Ɋ܂܂�Ă��܂��B\n�J���_�����t���b�V�������������ɂ������߂ł��B'
		},
		{
			id:6, name:'�ǂ�����', x:72, y:201, z:1, type: 2,
			txt:'����������t���{�m�C�h���܂݁A\n���e�⌒�N�̂��߂ɁA\n�Â����爤������Ă��܂����B'
		},
		{
			id:7, name:'�͂Ԓ�', x:150, y:190, z:1, type: 2,
			txt:'�u�G�r�X�O�T�v�Ƃ����A���̎킪�����B\n���N���̂ЂƂƂ��Ē��ڂ���Ă��܂��B'
		}
	], SOZAI_LIST = {};



	//�ʏ�X�N���[���s��
	$(window).on('scroll',function(e){
		e.preventDefault();
		//if(!SKB_SP.flag.loginForm || !SKB_SP.flag.loginForm_alone){
		if(SKB_SP.flag.janrain === null){
			$('body, html').scrollTop(0);
		}
	});

	$('header').on('webkitTransitionEnd transitionend', function(e){
		//Android�̂�����΍�
		if(!SKB_SP.flag.globalNavi){
			$('#globalNavi').addClass('hidden');
		}
	});

	//�������A�X�N���[���̊J�n
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


		//iScroll����
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

	//���[�v
	var loopAnimation = function () {
		var _move = scroll_top - catalog_scroll.y;
		scroll_top = catalog_scroll.y;
	};


	//Android2 ���O�C���t�H�[���΍�
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



	//�f�ރe�L�X�g���o
	var materials = (function () {
		var sozai_list = [];
		var flag = {
			ready: false
		}



		//�����I�u�W�F�N�g
		var Char = function (c, type, position, order, line) {
			this.moji = c;
			order = order || 0; line = line || 0;
			this.position = position;

			this.init = function () {
				//�ŏI�ʒu�͊�{�I�ɓ���
				this.pX = 0; this.pY = 0;			//���ݒn�_
				this.dX = 20 + order * ((this.position === 'name')? 24 : 12);
				this.dY = 180 + ((this.position === 'name')? 0 : 30 + 16 * line);			//�ŏI�n�_
				this.easing = 0;
				this.vX = 0; this.vY = 0;	//���x
				this.aX = 0; this.aY = 0;	//�����x
				this.alpha = 0;
				this.font = (position === 'name')? 'bold 24px serif' : 'normal 12px sans-serif';
				this.complete = false;

				switch(type){
					case 1://����� �~�^���ɃC�[�Y�A�E�g
						this.t = 0;
						this.cX = 0; this.cY = 270;//��]�̒��S�_
						this.r = Math.sqrt(Math.pow(this.dX - this.cX,2) + Math.pow(this.dY - this.cY,2)); //��]���a
						this.step = 0;
						this.easing = 0.03 + Math.random() * 0.01;
						this.dt = 180 - 180 * Math.atan((this.cY - this.dY)/ (this.dX -this.cX)) / Math.PI + 15;
						break;
					case 2://�炭 �P���ɃC�[�Y�A�E�g
						this.pX = 70 + Math.random() * 2;
						this.pY = 220 + Math.random() * 2;
						this.distanceX = this.dX - this.pX;
						this.easing = 0.05;
						break;
					case 3://�L�т�	���i�K�ɕ����ăC�[�Y�A�E�g
						this.step = 1;//�i�K
						this.pX = this.dX; this.dY -= 80;	//�ʒu�͏������߁AX���W�͕ω������Ȃ�
						this.distanceY = 240 + (Math.random() * 10);	//�ړ�����
						this.pY = this.dY + this.distanceY;			//�J�n�ʒu�͉�ʉ�
						this.easing = 0.07 + Math.random() * 0.01;
						break;
					case 4://�~��
						this.pX = this.dX;
						this.pY = -5 - Math.random() * 200;	//��ʏ�ɔz�u
						this.aY = 0.1;
						this.coefficient = 0.2 + Math.random()*0.1;
						break;
					case 5://���𒣂�		Y���W�͑��x��sin�ŁAX���W��Y���x�[���̂Ƃ��ɉ��ɍL����
						this.t = 0;
						this.step = 0;//�i�K
						this.pX = this.dX;
						this.pX = 140;	//X���W�͒��S����
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



			//���X�V
			this.update = function () {
				if(this.complete) return false;
				this.vX += this.aX; this.vY += this.aY;
				this.alpha = (this.alpha >= 1)? 1 : this.alpha + 0.01;
				switch(type){
					case 1://�����
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
					case 2://�炭
						this.pX += (this.dX - this.pX) * this.easing;
						var _proceed = (this.distanceX - (this.dX - this.pX)) / this.distanceX;	//�i���� 0->1
						this.pY += (this.dY - this.pY) * this.easing + Math.sin(Math.PI * _proceed) * (-2);
						break;
					case 3://�L�т�
						this.pY += (this.dY + ((4 - this.step) * this.distanceY/4) - this.pY) * this.easing;
						if(Math.abs(this.dY + ((4 - this.step) * this.distanceY/4) - this.pY) < 0.5) this.step++;
						break;
					case 4://�~��
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
					case 5://���𒣂�
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
			//�I�u�W�F�N�g�̕`��
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

				//��]���̕`��
				/*
				context.beginPath();
				context.arc(this.cX,this.cY,2, 0, Math.PI*2,false);
				context.fill();
				*/
			};
		};// Char

		//�f�ރI�u�W�F�N�g
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


			//���O���ꕶ�����I�u�W�F�N�g�Ƃ��Đ���
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

			//�X�N���[���̍ď�[�ɕ\������Ă��邩
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



		//������
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

		//�e�L�X�g�\���̈�̔z�u
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