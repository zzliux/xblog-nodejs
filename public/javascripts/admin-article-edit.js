var editor;
$(function() {
	editor = editormd("editormd", {
		path : "/plugins/editormd/lib/",
		height : 650,
		onload : function(){
			var keyMap = {
				"Ctrl-S": function(cm) {
					check(0);
				},
			};
			this.addKeyMap(keyMap);
		}
	});
});
(function($) {
	$.extend({
		urlGet:function(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null) return unescape(r[2]); return null;
			return aGET;
		}
	})
})(jQuery);
function check(sfunc){
	switch(sfunc){
		case 0: subAll(); break;
		case 1: subPublish(); break;
		case 2: subDelete(); break;
	}
	function subAll(){
		$.ajax({
			url:'/admin/article/ajax',
			type:'post',
			cache:false,
			data: {
				type: $.urlGet('cid')?'update':'insert',
				cid: $.urlGet('cid')?$.urlGet('cid'):0,
				title: $('#title')[0].value,
				content: editor.getMarkdown(),
				tags: $('#tags')[0].value,
				categories: $('#categories')[0].value,
			},
			dataType: 'json',
			success: function(data){
				$('#msg')[0].innerHTML = '<div class="alert alert-info alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>'+data.msg+'</strong></div>';
				if(data.cid){
					setTimeout(function(){
						location.href = '/admin/article/edit?cid='+data.cid;
					},2000);
				}
			},
			error: function(){
				$('#msg')[0].innerHTML = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>请求失败,请检查网络后重试!</strong></div>';
			},
		});
	}
	function subPublish(){
		$.ajax({
			url:'/admin/article/ajax',
			type:'post',
			cache:false,
			data: {
				type: 'publish',
				cid: $.urlGet('cid'),
			},
			dataType: 'json',
			success: function(data){
				$('#msg')[0].innerHTML = '<div class="alert alert-info alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>'+data.msg+'</strong></div>';
			},
			error: function(){
				$('#msg')[0].innerHTML = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>请求失败,请检查网络后重试!</strong></div>';
			},
		});
	}
	function subDelete(){
		$.ajax({
			url:'/admin/article/ajax',
			type:'post',
			cache:false,
			data: {
				type: 'delete',
				cid: $.urlGet('cid'),
			},
			dataType: 'json',
			success: function(data){
				$('#msg')[0].innerHTML = '<div class="alert alert-info alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>'+data.msg+'</strong></div>';
				setTimeout(function(){
					location.href = '/admin/article';
				},2000);
			},
			error: function(){
				$('#msg')[0].innerHTML = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>请求失败,请检查网络后重试!</strong></div>';
			},
		});
	}
	return false;
}
