const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../config/jwt')
const connection =  require('../config/mysql')

router.get('/',(req,res)=>{
    const query = "select * from carreras"
    const carreras = connection.query(query, (err, rows, fields)=>{
        if(err){
            res.json({status:500, message: "Error"})
        } else {
            if(rows.length >0){
                res.json({
                    message:"datos consultados",
                    data: rows
                })
            } else {
               res.json({message: "no hay resultados"})
            }
        }
    } )    
})

module.exports = router;