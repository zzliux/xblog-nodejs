/* 代码高亮 */
hljs.initHighlightingOnLoad();

/* 新标签页打开的图标 */
addExternlIcon();

function addExternlIcon(){
	var articleTag = document.getElementsByTagName('article')[0];
	add(articleTag);
	function add(parent){
		if(!parent) return;
		var nodes = parent.childNodes;
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].tagName == 'a' || nodes[i].tagName == 'A'){
				nodes[i].setAttribute('target', '_blank');
				nodes[i].innerHTML = nodes[i].innerHTML + '&nbsp;<sup><i class="fa fa-external-link"></i></sup>';
			}else if(nodes[i].tagName == 'pre' || nodes[i].tagName == 'PRE'){
				return;
			}else{
				add(nodes[i]);
			}
		}
	}
}
