module.exports = {
	/* 博客标题 */
	siteTitle: 'ZZLIUX\'S BLOG',
	/* 博客描述，用于meta的description */
	siteDescription: '一个屌丝的博客',
	/* navbar上的相关，可以使用html */
	navbarList: [{
		href: '/article/9',
		title: 'ABOUT'
	},{
		href: '/feed',
		title: 'RSS　<i class="fa fa-rss"></i>'
	}],







	/* 公共盐，暂时不能改成别的 */
	pass_salt: 'this is a zha zha blog',
	/* 还没写，以后可能会写吧 */
	useQiniu: true,
	qiniu: {
		access_key: '',
		secret_key: '',
		bucket: ''
	}
};
