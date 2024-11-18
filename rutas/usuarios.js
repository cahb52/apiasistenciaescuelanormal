const express = require('express')
const router = express.Router()
const mysql = require('../config/mysql')
const jwt = require('../config/jwt')

router.get('/',(req, res)=>{
    res.json({
        message: 'Welcome to the API'
    })
})


module.exports = router;

