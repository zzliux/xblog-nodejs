(function(){
	/* 先加速上滚，再减速上滚 */
	$('.to-top-btn').bind('click',function(){
		var mid = document.body.scrollTop/2;
		var unit = 1;
		scrollToTop();
		function scrollToTop(){
			setTimeout(function(){
				if(document.body.scrollTop > mid) unit += 1;
				else unit -= 1;
				if(unit < 1) unit = 1;
				document.body.scrollTop -= unit;
				if(document.body.scrollTop > 1)
					scrollToTop();
			},5);
		}
	});

	/* 右边栏的标签大小设置以及a的src和target */
	var _t = $('#id-tags')[0] ? $('#id-tags')[0].childNodes : [];
	for(var i=0; i<_t.length; i++){
		if(_t[i].tagName === 'A'){
			_t[i].setAttribute('href', '/search/tag/' + _t[i].innerHTML);
			_t[i].setAttribute('target', '_blank');
			_t[i].style.cssText = 'font-size:'+_t[i].getAttribute('s') + 'px';
		}
	}
})()
