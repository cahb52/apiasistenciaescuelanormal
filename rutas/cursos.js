const express = require('express')
const router = express.Router()
const connection = require('../config/mysql')
const {retornaDatos, authenticateToken} = require('../config/jwt')

router.get('/listar',authenticateToken,(req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    const datos = retornaDatos(token);
    
    const id = datos.data.id;
    // console.log(datos.data.id)
    const query = "select c.idcursos , c.nombrecurso ,c.periodosporsemana , c2.nombre, g.grado, g.seccion from cursos as c "
        + "inner join gradosysecciones g on g.idgradosysecciones  = c.idgradosysecciones "
        + "inner join carreras c2 on c2.idcarreras  = g.idcarreras "
        + "inner join asignacioncursosmaestros a on a.idcursos = c.idcursos "
        + "inner join maestros m on a.maestro = m.idmaestros "
        + "where m.idmaestros = ? order by c2.idcarreras, c2.nombre, g.grado, g.seccion ASC;"
        // console.log(query)
    const consulta =  connection.query(query,[id],(err,rows, fields)=>{
        if(err){
            res.json({status:500, message:err})
        } else {
            if(rows.length > 0) {
                res.json({
                    message: "datos consultados",
                    data: rows
                })
            } else {
                res.json({status:404, message:"No hay datos"})
            }
        }
    }) 
})


router.get('/',authenticateToken,(req,res)=>{

    const query = "select c.idcursos , c.nombrecurso ,c.periodosporsemana , c2.nombre, g.grado, g.seccion, concat(m.apellidos,', ', m.nombres) as maestro from cursos as c "
        + "inner join gradosysecciones g on g.idgradosysecciones  = c.idgradosysecciones "
        + "inner join carreras c2 on c2.idcarreras  = g.idcarreras "
        + "inner join asignacioncursosmaestros a on a.idcursos = c.idcursos "
        + "inner join maestros m on a.maestro = m.idmaestros order by c2.idcarreras, c2.nombre, g.grado, g.seccion ASC"
        // console.log(query)
    const consulta =  connection.query(query,(err,rows, fields)=>{
        if(err){
            res.json({status:500, message:err})
        } else {
            if(rows.length > 0) {
                res.json({
                    message: "datos consultados",
                    data: rows
                })
            } else {
                res.json({status:404, message:"No hay datos"})
            }
        }
    }) 
})

module.exports = router;