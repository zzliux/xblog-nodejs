var page_start = 5;
var page_length = 5;
(function(){
	function getAllCid(){
		var arr = [];
		$('.cmt_t').each(function(){
			arr.push(this.getAttribute('cid'));
		});
		return arr.join(',');
	}
	/* 添加加载更多按钮的监听 */
	$('#id-btn-more').bind('click',getAndSetMore);
	/* 自动加载 */
	if($(window).width()>1024){
		$(window).bind('scroll', scrollListener);
	}
	function scrollListener(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight == scrollHeight){
			getAndSetMore();
		}
	}
	function getAndSetMore(){
		$('#id-btn-more')[0].innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
		$('#id-btn-more')[0].className = 'panel panel-default id-post-more disabled';
		$('#id-btn-more').unbind();
		var lastHeight = $('#id-post').height();
		$.ajax({
			url:'/ajax',
			dataType: 'json',
			type: 'post',
			data:{
				type:'getPage',
				start:page_start,
				length:page_length,
			},
			success: function(dataATC){
				var cidArr = [];
				if(dataATC.errcode) {
					$('#id-btn-more').html(dataATC.msg);
					return;
				}
				$.each(dataATC,function(){
					cidArr.push(this.cid);
				});
				var addStr = '';
				var i=0;
				$.each(dataATC,function(){
					addStr = '\
						<div class="am-animation-slide-top">\
							<div class="id-title"><a href="/article/' + this.cid + '">' + this.title + '</a></div>\
							<div class="id-detail">\
								<div class="id-item">\
									<i class="fa fa-user"></i><a href="/search/user/' + this.name + '">' + this.name + '</a>\
								</div>\
								<div class="id-item">\
									<i class="fa fa-calendar"></i>' + this.date + '\
								</div>\
							</div>\
							' + this.content + '\
							</div>\
						<hr>';
					(function(i,str){
						setTimeout(function(){
							$('#id-post').append(str);
						},(5-i)*100);//逆序
					})(i, addStr);
					i++;
				});
				$('#id-btn-more').html('加载更多');
				$('#id-btn-more').bind('click',getAndSetMore);
				/* 向上滚动 */
				$('html,body').animate({scrollTop: (lastHeight + 50) + 'px'}, 700);
				page_start += 5;
			},
			error: function(){
				$('#id-btn-more').html('加载失败,点击重试');
				$('#id-btn-more').bind('click',getAndSetMore);
			},
		});
	}
})();
