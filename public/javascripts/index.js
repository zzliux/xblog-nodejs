/* 多说js */
var duoshuoQuery = {short_name:"zzliux"};
(function() {
	var ds = document.createElement('script');
	ds.type = 'text/javascript';ds.async = true;
	ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
	ds.charset = 'UTF-8';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
})();

var page_start = 5;
var page_length = 5;
(function(){
	/* 获取文章评论数 */
	$.ajax({
		url:(document.location.protocol == 'https:' ? 'https:' : 'http:') + '//api.duoshuo.com/threads/counts.jsonp',
		type:'get',
		dataType: 'jsonp',
		data: {
			short_name: 'zzliux',
			threads: getAllCid(),
		},
		success: function(data){
			$.each(data.response,function(){
				$('#cmt_'+this.thread_key)[0].innerHTML = this.comments;
			});
		},
	});
	function getAllCid(){
		var arr = [];
		$('.cmt_t').each(function(){
			arr.push(this.getAttribute('cid'));
		});
		return arr.join(',');
	}

	/* 添加加载更多按钮的监听 */
	$('#id-btn-more').bind('click',getAndSetMore);
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
				/* 请求新加载下来的文章的评论数 */
				$.ajax({
					url:(document.location.protocol == 'https:' ? 'https:' : 'http:') + '//api.duoshuo.com/threads/counts.jsonp',
					type:'get',
					dataType: 'jsonp',
					data: {
						short_name: 'zzliux',
						threads: cidArr.join(','),
					},
					success: function(dataCMT){
						$.each(dataCMT.response,function(){
							dataATC[this.thread_key].comments = this.comments;
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
										<div class="id-item">\
											<i class="fa fa-comments-o"></i>\
											<span class="cmt_t" cid="' + this.cid + '" id="cmt_' + this.cid + '">' + this.comments + '</span>\
										</div>\
									</div>\
									' + this.content + '\
									</div>\
								<hr>';
							(function(i,str){
								setTimeout(function(){
									$('#id-post').append(str);
								},i*100);
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
			},
			error: function(){
				$('#id-btn-more').html('加载失败,点击重试');
				$('#id-btn-more').bind('click',getAndSetMore);
			},
		});
	}
})();
