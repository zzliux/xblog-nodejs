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
		$('.id-post-title').each(function(){
			arr.push(this.getAttribute('cid'));
		});
		return arr.join(',');
	}

	/* 添加加载更多按钮的监听 */
	$('#id-btn-more').bind('click',getAndSetMore);
	function getAndSetMore(){
		$('#id-btn-more')[0].innerHTML = '<h4><i class="fa fa-circle-o-notch fa-spin"></h4></i>';
		$('#id-btn-more')[0].className = 'panel panel-default id-post-more disabled';
		$('#id-btn-more').unbind();
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
					$('#id-btn-more')[0].innerHTML = '<h4>'+dataATC.msg+'</h4>';
					$('#id-btn-more')[0].className = 'panel panel-default id-post-more disabled';
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
						$.each(dataATC,function(){
							addStr = '<div class="panel panel-default id-post">\n\t<div class="id-post-title" cid="33">\n\t<h3><a href="/article/'+this.cid+'">'+this.title+'</a></h3>\n\t</div>\n\t<div class="id-post-detail"> | <i class="fa fa-user"></i> <a href="/search/user/'+this.name+'">'+this.name+'</a> | <i class="fa fa-calendar"></i> '+this.date+' | <i class="fa fa-comments-o"></i> <span id="cmt_'+this.cid+'">'+this.comments+'</span> |</div><div class="id-post-content">'+this.content+'</div>\n\t</div>\n\n' + addStr;
						});
						$('#id-post')[0].innerHTML += addStr;
						$('#id-btn-more')[0].className = 'panel panel-default id-post-more';
						$('#id-btn-more')[0].innerHTML = '<h4>加载更多</h4>';
						$('#id-btn-more').bind('click',getAndSetMore);
						page_start += 5;
					},
					error: function(){
						$('#id-btn-more')[0].className = 'panel panel-default id-post-more';
						$('#id-btn-more')[0].innerHTML = '<h4>加载失败,点击重试</h4>';
						$('#id-btn-more').bind('click',getAndSetMore);
					},
				});
			},
			error: function(){
				$('#id-btn-more')[0].className = 'panel panel-default id-post-more';
				$('#id-btn-more')[0].innerHTML = '<h4>加载失败,点击重试</h4>';
				$('#id-btn-more').bind('click',getAndSetMore);
			},
		});
	}
})();
