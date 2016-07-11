Date.prototype.format = require('../common/dateFormater');
var siteConfig        = require('../config/site');
var express           = require('express');
var router            = express.Router();
var conn              = require('../common/dbConnection');


router.get('/', function(req, res, next) {
  conn.query('SELECT `xblog_userinfo`.`uid`,`xblog_userinfo`.`name`,`xblog_userinfo`.`email`,`xblog_userinfo`.`password`,`xblog_userinfo`.`url`,`xblog_userinfo`.`registered`,`cid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority` FROM `xblog_userinfo` INNER JOIN  `xblog_articles` ON `xblog_userinfo`.`uid` = `xblog_articles`.`uid` WHERE `status` = 1 ORDER BY `cid` DESC LIMIT 0,5', function(err1, rows1, fields1){
    if(err1) {
      console.log(err1.message);
      res.status(500).send('err 500');
    }
    conn.query('SELECT `tags`,`categories` FROM `xblog_articles` WHERE `status` = 1  ORDER BY `cid` DESC', function(err2, rows2, fields2){
      if(err2){
        console.log(err2.message);
        res.status(500).send('err 500');
      }
      var date = new Date();
      var tags = {};
      var categories = {};
      for(var i=0;i<rows1.length;i++){
        //将时间格式化成yyyy-mm-dd的形式
        date.setTime(rows1[i].date * 1000);
        rows1[i].date = date.format('yyyy-MM-dd');

        //把内容省略化
        if(rows1[i].content.length > 100){
          rows1[i].content = rows1[i].content.substr(0,100).replace(/\n/g, ' ').replace(/[#*`]/g,'') + '...';
        }
      }
      for(var i=0;i<rows2.length;i++){
        /* 处理tags */
        var _t = rows2[i].tags.split(',');
        for(var j=0;j<_t.length;j++){
          if(_t[j])
            tags[_t[j]] = tags[_t[j]] ? tags[_t[j]] + 1 : 1;
        }

        /* 处理categories */
        _t = rows2[i].categories.split(',');
        for(var j=0;j<_t.length;j++){
          if(_t[j])
            categories[_t[j]] = categories[_t[j]] ? categories[_t[j]] + 1 : 1;
        }
      }
      res.render('index',{
        articles: rows1,
        siteTitle: 'zzliux\'s blog',
        siteConfig: siteConfig,
        tags: tags,
        categories: categories,
        reqTime: req.requestTime
      });
    })
  });
});

module.exports = router;
