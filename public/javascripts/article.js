/* 代码高亮 */
hljs.initHighlightingOnLoad();

/* 新标签页打开的图标 */
addExternlIcon();

/* 多说 */
var duoshuoQuery = {short_name:"zzliux"};
(function() {
	var ds = document.createElement('script');
	ds.type = 'text/javascript';ds.async = true;
	ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
	ds.charset = 'UTF-8';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
})();

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
