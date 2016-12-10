// Stop chrome's autocomplete from making your input fields that nasty yellow. Yuck.
if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
	$(window).load(function(){
		$('input:-webkit-autofill').each(function(){
			var text = $(this).val();
			var name = $(this).attr('name');
			$(this).after(this.outerHTML).remove();
			$('input[name=' + name + ']').val(text);
		});
	});
}


//==========================================
//
//	Drop Down
//
//==========================================
$(function(){
	$("#loginBefore").hide();
	$("#header_login_btn, .loginBoxClose").click(function (e) {
		if ($("#loginBefore").is(":hidden")) {
			
			e.preventDefault();
			$("#loginBefore").slideDown("fast");
			
		} else {
			
			e.preventDefault();
			$("#loginBefore").slideUp("fast");
			
		}
	});
		
});


//==========================================
//
//	Icon ON-OFF
//
//==========================================
$(function(){
	$("img[src*='_off.']").hover(
		function(){this.src=this.src.replace("_off.","_on.")},
		function(){this.src=this.src.replace("_on.","_off.")}
	)
});


//==========================================
//
//	contents background-image
//
//==========================================
/*function resizeImg(){
	var marginTop = - (parseInt($('.bgWrapper img').css('height'), 10) / 2);
	$('.bgWrapper img').css('marginTop', marginTop);
	
	var windowW = $(window).width();
	if(windowW > 960){
		$('.bgWrapper img').css('left', 0);
	}else{
		$('.bgWrapper img').css('left', -((960 / 2) - (windowW / 2)));
	}
}

$(function(){
	if($('.bgWrapper img').length){
		resizeImg();
		$('.bgWrapper img').show();
	}
});

$(window).resize(function(){
    if($('.bgWrapper img').length){
		resizeImg();
	}
});*/


//==========================================
//
//	pageTop
//
//==========================================

//ウィンドウサイズ小さいときはコンテンツの横に配置
function resizePageTop_left(){
	var pagetopMarginLeft = 20;
	var pagetopWidthAddLeft = $('.articlebgTop').offset().left + parseInt($('.articlebgTop').css('width')) + pagetopMarginLeft;
	var resizeLeft = $(window).width() - 64 - pagetopMarginLeft;
	var pNewLeft = 0;
	
	if(pagetopWidthAddLeft < resizeLeft){
		pNewLeft = resizeLeft;
	}else{
		pNewLeft = pagetopWidthAddLeft;
	}
	$("#pagetop").css({left: pNewLeft});
}
function resizePageTop_top(){
	var pagetop = $("#pagetop");
	var pagetopTop = $(window).height() - parseInt(pagetop.css('height')) - 20;
	//var bgContBtm = $("#g_bg_contents_btm");
	
	var pOffset = $(window).scrollTop() + pagetopTop;
	var pagetopHeightAddTop = pOffset + parseInt(pagetop.css('height'));
	var pContentsHeight = parseInt($('#contents').css('height')) + 30 + 308;	//308 = フッター＋フッター上マージン
	var pNewTop = 0;
	//var pNewTopBg = 0;
	
	if(pagetopHeightAddTop > pContentsHeight){
		pNewTop = pagetopTop - (pagetopHeightAddTop - pContentsHeight);
		//pNewTopBg = pNewTop - (parseInt(bgContBtm.css('height')) - parseInt(pagetop.css('height'))) + 30;
	}else{
		pNewTop = pagetopTop;
		//pNewTopBg = $(window).height() - parseInt(bgContBtm.css('height'));
	}
	pagetop.css({top: pNewTop});
	//bgContBtm.css({top: pNewTopBg});

}

$(function(){
	 //ページ上部へ戻る
	$("#pagetop").click(function () {
		$('html,body').animate({ scrollTop: 0 }, 2000,'easeOutExpo');
		return false;
	});
	
	if($("#pagetop").length){
		var pagetop = $("#pagetop");
		var pagetopTop = $(window).height() - 61 - 20;
		pagetop.css({top: pagetopTop});
		resizePageTop_left();
		
		//スクロール時のイベント処理
		//フッターにかぶらないよう調整
		$(window).scroll(function(){
			resizePageTop_top();
		});
		
		//ウィンドウサイズ小さいときはコンテンツの横に配置
		$(window).resize(function(){
			resizePageTop_left();
			resizePageTop_top();
		});
		
		resizePageTop_top();
	}
});

//==========================================
//
//	twitter ticker from api
//
//==========================================
$(function () {
    var $ticker = $('#tweetTickerStage');
    var place = $ticker.data('place');
    if($ticker && place){
        $.getJSON('/rest/wapi_sns/getTwitterTweet/?place=' + place, function (data) {
            var tweets = data.tweets;
            var html = '';
            $.each(tweets, function (index, element) {
                html += '<a href="https://twitter.com/'+ element.user_screen_name+ '/status/'+ element.tweet_id +'" target="_blank"><li>@'+ element.user_screen_name + ' ' + element.tweet_text + '</li></a>'
            });
           $ticker.html(html);
        });
    }
});
//==========================================
//
//	Header dynamic opacity
//
//==========================================
$(function () {
// スクロールに応じてヘッダーの背景画像の透明度を調整
    // var $headerBg = $('#header .bg');
    // var headerOpacity = 0.8;
    // if($headerBg){
    //     $(window).on('scroll load', function () {
    //         var top = $(window).scrollTop();
    //         if(top < 100) {
    //             $headerBg.css('opacity', headerOpacity = 0.8 + 0.002 * top);
    //         } else if (headerOpacity !== 1) {
    //             $headerBg.css('opacity', headerOpacity = 1);
    //         }
    //     });
    // }
});
//==========================================
//
//	Random background image
//
//==========================================
$(function () {
    /*var $backgroundImage = $('.bgWrapper img');
    if($backgroundImage && location.pathname !== '/'){
        $backgroundImage.attr('src', '/common/images/bg_main_m_' + (Math.floor(Math.random() * 9) + 1) + '.jpg');
    }*/
});

//==========================================
//
//	Random botanical banner
//
//==========================================
$(function () {
    var $bnrBotanical = $('.bnr_botanical img');
    if($bnrBotanical){
        $bnrBotanical.each(function(){
			$(this).attr('src', '/common/images/bnr_story_' + (Math.floor(Math.random() * 12) + 1) + '.png');
		});
    }
});

//==========================================
//
//	Random botanical banner L
//
//==========================================
$(function () {
    var $bnrBotanicalL = $('.bnr_botanical_l img');
    if($bnrBotanicalL){
        $bnrBotanicalL.each(function(){
			$(this).attr('src', '/common/images/bnr_story_l_' + (Math.floor(Math.random() * 12) + 1) + '.png');
		});
    }
});


//==========================================
//
//	contents background-image-btm
//
//==========================================
function resizeContentsBtm(){
	var windowW = $(window).width();
	if(windowW > 1024){
		$('#g_bg_contents_btm').css({
			'left': 0,
			'marginLeft': 0
		});
		$('#g_bg_contents_btm img').css('width', '100%');
	}else{
		$('#g_bg_contents_btm').css({
			'left': '50%',
			'marginLeft': -512
		});
		$('#g_bg_contents_btm img').css('width', 1024);
	}
}

$(function(){
	if($('#g_bg_contents_btm img').length){
		resizeContentsBtm();
	}
});

$(window).resize(function(){
    if($('#g_bg_contents_btm img').length){
		resizeContentsBtm();
	}
});