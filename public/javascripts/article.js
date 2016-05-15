/* 代码高亮 */
hljs.initHighlightingOnLoad();

/* 代码行号 */
showLinenumbers('display:inline-block;vertical-align:top;text-align:right;margin-right:10px;color:#e6e1dc;font-size:100%;-webkit-user-select: none;');

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

/* 向百度自动推送 */
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();

function showLinenumbers(style){
	var preArr = document.getElementsByTagName('pre');
	for(var i=0;i<preArr.length;i++){
		if(preArr[i].innerHTML.match(/<code[^>]*>/)){
			var code = preArr[i].innerHTML.match(/<code[^>]*>([\s\S]+)<\/code>/);
			/* 判断最后一个是不是以\n结尾的 */
			if(code[1].substr(code[1].length-1, code[1].length) === '\n')
				code[1] = code[1].substr(0,code[1].length-1);
			var line = code[1].length - replaceAll(code[1],"\n",'').length + 1;
			var lineBar = '<div style="'+style+'">';
			for(var j=1;j<=line;j++){
				lineBar += '<span>'+ j + "|</span>\n";
			}
			lineBar += '</div>'
			preArr[i].innerHTML = lineBar + preArr[i].innerHTML;
		}
	}
}
function replaceAll(str, l, r){
	if(str.indexOf(l)>=0){
		return replaceAll(str.replace(l,r), l, r);
	}
	return str;
}
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