var mysql = require('mysql');
var pool = mysql.createPool(require('../config/db'));

var conn = {};

conn.query = function(sql, arr, func){
	pool.getConnection(function(err, con){
		if(err) {
			console.log(err.message);
		}
		con.query(sql, arr, func);
		con.release();
	});
};

module.exports = conn;