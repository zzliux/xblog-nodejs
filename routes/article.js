Date.prototype.format = require('../common/dateFormater');
var express           = require('express');
var router            = express.Router();
var conn              = require('../common/dbConnection');
var md                = require('marked');

router.get('/:cid', function(req, res, next) {
  if(!req.params.cid.match(/\d+/)){
    return res.status(404).render('404',{
      siteTitle : '404 | zzliux\'s blog',
      reqTime: req.requestTime
    });
  }
  var flag = '`status` = 1 AND ';
  if(req.session.user && req.session.user.id){
    flag = '';
  }
  conn.query('SELECT `xblog_userinfo`.`uid`,`xblog_userinfo`.`name`,`xblog_userinfo`.`email`,`xblog_userinfo`.`password`,`xblog_userinfo`.`url`,`xblog_userinfo`.`registered`,`cid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority` FROM `xblog_userinfo` INNER JOIN  `xblog_articles` ON `xblog_userinfo`.`uid` = `xblog_articles`.`uid` WHERE ' + flag + '`cid` = ?', [parseInt(req.params.cid)], function(err, rows, fields){
    if(err) {
      console.log(err.message);
      return res.status(500).send('err 500');
    }
    if(rows.length > 0){
      var atc = {
        title: rows[0].title + (rows[0].status ? '' : '(草稿)'),
        name: '<a href="/search/user/' + rows[0].name + '">' + rows[0].name+ '</a>',
        content: md(rows[0].content),
        tagsMeta: rows[0].tags,
        cid: rows[0].cid,
        status: rows[0].status ? true : false
      };
      /* 将tags加上链接 */
      var t = rows[0].tags.split(',');
      for(var i=0;i<t.length;i++){
        t[i] = '<a href="/search/tag/'+ t[i] +'">' + t[i] + '</a>'
      }
      atc.tags = t.join(', ');

      /* 将categories加上链接 */
      t = rows[0].categories.split(',');
      for(var i=0;i<t.length;i++){
        t[i] = '<a href="/search/category/' + t[i] + '">' + t[i] + '</a>'
      }
      atc.categories = t.join(', ');

      /* 设置日期 */
      var dt = new Date();
      dt.setTime(rows[0].date * 1000);
      atc.date = dt.format('yyyy-MM-dd hh:mm:ss');

      /* 渲染模版 */
      res.render('article',{
        siteTitle: atc.title + ' | zzliux\'s blog',
        article: atc,
        reqTime: req.requestTime
      });
    }else{
      res.status(404).render('404',{
        siteTitle : '404 | zzliux\'s blog',
        reqTime: req.requestTime
      });
    }
  });
});

module.exports = router;
