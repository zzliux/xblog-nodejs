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
				console.log($('#cmt_'+this.thread_key)[0]);
				$('#cmt_'+this.thread_key)[0].innerHTML = this.comments;
			});
		},
	});
	function getAllCid(){
		var arr = [];
		$('.t_by_cid').each(function(){
			arr.push(this.getAttribute('cid'));
		});
		return arr.join(',');
	}
})()
