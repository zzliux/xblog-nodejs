var exec = require('child_process').exec;
exec('test', function(err, stdout, stderr){
	console.log(stdout);
});