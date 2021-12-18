const router = require('express').Router();

router.get('/set',(req,res)=>{
    res.render('index');
})

module.exports=router