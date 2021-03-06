var editor;
var path;
$(function() {
	editor = editormd("editormd", {
		path : "/plugins/editormd/lib/",
		height : 650,
		watch : false,
		toolbar : false,
		codeFold : true,
		searchReplace : true,
		placeholder : "Enjoy coding!",
		theme : "default",
		mode : "text",
		onload : function(){
			var keyMap = {
				"Ctrl-S": function(cm) {
					save();
				},
			};
			this.addKeyMap(keyMap);
		}
	});
	$('#tplfls').bind('click', function(event){
		if(event.target.tagName === 'A'){
			path = event.target.innerHTML;
			var _t = $('#tplfls>.panel-body>ul')[0].childNodes;
			for(var i=0;i<_t.length;i++){
				if(_t[i].tagName === 'LI')
					_t[i].childNodes[0].style.color = '#333';
			}
			event.target.style.color = '#f00';
			$('#readModal').modal();
			$.ajax({
				url:'/admin/template/ajax',
				type:'post',
				dataType:'json',
				cache:false,
				data:{
					type:'read',
					data:path
				},
				success:function(data){
					$('#readModal').modal('hide');
					editor.setValue(data.fileContent);
					editor.focus();
				},
				error:function(){
					$('#readModal').modal('hide');
					alert('请求失败');
				}

			});
		}
	});
});
function save(){
	$.ajax({
		url:'/admin/template/ajax',
		type:'post',
		dataType:'json',
		cache:false,
		data:{
			type:'write',
			path: path,
			data:editor.getValue()
		},
		success:function(data){
			$('#saveModal').modal();
			$('#saveModal').modal('hide');
			$('#saveSuccessModal').modal();
		},
		error:function(){
			alert('请求失败');
		}
	});
}
