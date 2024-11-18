var express = require('express');
var router = express.Router();

//router.use(timeLog(req,res,next)=>{
//	console.log('tiempo');
//	next();
//})

router.get('/',(req,res) => {
	res.send('ruta alterna');
});
module.exports = router;
