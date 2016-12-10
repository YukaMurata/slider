var SKBTweetTicker = function(p){
	var self = this;

	self.stage = $(p.id);
	self.interval = p.interval ? p.interval : 3000;

	var list = self.stage.find('li');

	var baseSize  = list.width() + parseInt(list.css('paddingLeft')) +  parseInt(list.css('paddingRight'));
	var stageSize = baseSize * list.length;
    self.stage.width(stageSize);

	for(var i=0,j=list.length; i<j; i++){
		var txt = list.eq(i).text();

		if(txt.length > 110) txt = txt.substring(0,110);
		list.eq(i).html(getLink(txt));
	}

	var animateProp = {
		left : - baseSize + 'px'
	};

	function getLink(text){
		text=' '+text;
		text = text.replace(/((https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
		text = text.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
		//text = text.replace(/([#＃]+[A-Za-z0-9-_ぁ-ヶ亜-黑]+)/gm,'<a href="http://twitter.com/search?q=%23$2" target="_blank">$1</a>');
		return text;
	}

	function endAnimate(){
		self.stage.css({left : 0});
		self.stage.find('li').eq(0).appendTo(self.stage);
	}

	function slide(){
		self.stage.animate(animateProp, 800, endAnimate);
	}

	setInterval(slide, self.interval);
}