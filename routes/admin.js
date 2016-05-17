Date.prototype.format = require('../common/dateFormater');
var express           = require('express');
var router            = express.Router();
var multer            = require('multer');
var upload            = multer({dest:'upload'});
var utils             = require('utility');
var conn              = require('../common/dbConnection');
var lwip              = require('node-lwip');
var cfg               = require('../config/site');
var fs                = require('fs');

router.use(function(req, res, next){
  if(!req.session.user){
    req.session.user = {};
  }
  next();
})

router.get('/', function(req, res, next){
  if(!req.session.user.id){
    res.redirect('/admin/login');
  }else{
    res.render('admin',{});
  }
});


/* 登录逻辑 */
router.get('/login', function(req, res, next){
  res.render('admin-login', {msg:''});
})
router.post('/login', function(req, res, next){
  req.session.user = {};  //清空登录状态防止出现别的问题
  if(req.body && req.body.email && req.body.password){
    req.body.password = utils.md5(req.body.password + cfg.pass_salt);
    conn.query('SELECT * FROM `xblog_userinfo` WHERE `email` = ? AND password = ?',[req.body.email, req.body.password],function(err, rows, fields){
      if(rows.length === 1){
        req.session.user.id = rows[0].uid;
        req.session.user.name = rows[0].name;
        req.session.user.email = rows[0].email;
        req.session.user.url = rows[0].url;
        res.redirect('/admin');
      }else{
        res.render('admin-login', {msg:'用户名或密码错误'})
      }
    });
  }else{
    res.status(500).send('err 500');
  }
})

/* 文章列表 */
router.get('/article', function(req, res, next){
  if(!req.session.user.id){
    res.redirect('/admin/login');
  }else{
    conn.query('SELECT *,? as `name` FROM `xblog_articles` WHERE `uid` = ? ORDER BY `cid` DESC', [req.session.user.name, parseInt(req.session.user.id)],function(err, rows, fields){
      var dt = new Date();
      for(var i=0;i<rows.length;i++){
        dt.setTime(rows[i].date * 1000);
        rows[i].date = dt.format('yyyy-mm-dd');
        rows[i].status = (parseInt(rows[i].status)===1) ? '已发布' : '草稿';
      }
      res.render('admin-article',{
        articles: rows
      });
    })
  }
})

/* 撰写文章 */
router.get('/article/edit', function(req, res, next){
  if(!req.session.user.id){
    res.redirect('/admin/login');
  }else{
    if(req.query.cid){
      conn.query('SELECT * FROM `xblog_articles` WHERE `cid` = ? AND `uid` = ? LIMIT 1',[parseInt(req.query.cid),parseInt(req.session.user.id)],function(err, rows, fields){
        if(rows.length > 0){
          res.render('admin-article-edit',{
            article: rows[0],
            btn: true
          });
        }else{
          res.status(500).send('err 500');
          btn: false
        }
      })
    }
    else{
      res.render('admin-article-edit',{article:{cid:req.query.cid,content:'',title:'',tags:'',categories:''}});
    }
  }
});
/* ajax接口 */
router.post('/article/ajax', function(req, res, next){
  if(!req.session.user.id){
    res.redirect('/admin/login');
  }else if(req.body && req.body.type && req.body.cid){
    req.body.cid = parseInt(req.body.cid);
    var sql,param;
    if(req.body.type === 'insert'){
      sql = 'INSERT INTO `xblog_articles`(`uid`,`title`,`content`,`tags`,`categories`,`date`,`status`,`commentstatus`,`priority`) VALUES(?,?,?,?,?,?,0,1,0)';
      param = [
        parseInt(req.session.user.id),
        req.body.title,
        req.body.content,
        req.body.tags,
        req.body.categories,
        ((new Date()).getTime())/1000,
      ];
    }else if(req.body.type === 'update'){
      sql = 'UPDATE `xblog_articles` SET `title` = ? , `content` = ? , `tags` = ? , `categories` = ? , `status` = 0 WHERE `cid` = ?';
      param = [
        req.body.title,
        req.body.content,
        req.body.tags,
        req.body.categories,
        parseInt(req.body.cid),
      ];
    }else if(req.body.type === 'publish'){
      sql = 'UPDATE `xblog_articles` SET `status` = 1 WHERE `cid` = ? AND `uid` = ?';
      param = [
        parseInt(req.body.cid),
        parseInt(req.session.user.id)
      ];
    }else if(req.body.type = 'delete'){
      sql = 'DELETE FROM `xblog_articles` WHERE `cid` = ? AND `uid` = ?';
      param = [
        parseInt(req.body.cid),
        parseInt(req.session.user.id)
      ];
    }else{
      res.status(500).send('err 500');
    }
    conn.query(sql, param, function(err, result){
      if(err) res.status(500).send('err 500');
      var out;
      if(req.body.type === 'insert'){
        out = {
          msg:'保存成功,请等待跳转',
          cid:result.insertId,
        };
      }else if(req.body.type === 'update'){
        out = {msg:'保存成功'}
      }else if(req.body.type === 'publish'){
        out = {msg:'发布成功'}
      }else if(req.body.type === 'delete'){
        out = {msg:'删除成功,请等待跳转'}
      }
      res.send(out);
    });
  }
})



router.get('/upload', function(req, res, next){
  if(!req.session.user.id){
    res.redirect('/admin/login');
  }else{
    fs.readdir('public/images/thumb', function(err, files){
      for(var i=0; i<files.length; i++){
        files[i] = '/images/thumb/' + files[i];
      }
      res.render('admin-upload',{imgs: files});
    })
  }
})


router.post('/upload/ajax', upload.single('fileToUpload'), function(req, res, next){
  if(!req.session.user.id){
    res.redirect('/admin/login');
  }else{
    var suffix = false;
    switch(req.file.mimetype){
      case 'image/png'  :
      case 'image/x-png': suffix = '.png'; break;
      case 'image/jpeg' :
      case 'image/pjpeg': suffix = '.jpg'; break;
      case 'image/gif'  : suffix = '.gif'; break;
      default: fs.unlink(req.file.path,function(err){res.status(500).send('err 500');});
    }
    if(suffix){
      var _t = fs.readFileSync(req.file.path); //_t是一个buffer，同步执行，io时后面被阻塞
      var fileName = utils.md5(_t) + suffix;   //文件名，buffer的md5
      var fileOriginPath = 'public/images/origin/' + fileName;
      var fileThumbPath = 'public/images/thumb/' + fileName;
      fs.writeFile(fileOriginPath, _t, {flag:'w+'}, function(err){
        fs.unlink(req.file.path, function(err){
          lwip.open(_t,suffix.substr(1), function(err, image){
            var height = image.height();
            var width = image.width();
            var scale;
            if(height > 200) scale = 200/height;
            else {scale = 1}
            image.scale(scale, function(err, image){
              image.toBuffer(suffix.substr(1),function(err, buffer){
                fs.writeFile(fileThumbPath, buffer, function(err){
                  res.send({errcode:0,msg:'上传成功'});
                })
              });
            })
          });
        });
      });
    }
  }
});


module.exports = router;

//  http://www.zzliux.com/static/image/origin/6c76f9e846bb3e456ac4d11a7a28e99a.gif