const express =  require('express');
const router =  express.Router();
const connection = require('../config/mysql')
const {authenticateToken,retornaDatos} = require('../config/jwt')
const moment = require('moment')


//crear una asistencia
router.post('/crear', authenticateToken, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const datos = retornaDatos(token);
    const id = datos.data.id
    var mensaje = ""
    req.body.map((dato)=>{
        const consultarcursos = "select count(idcursos) as resultado from asignacioncursosmaestros"
    +" where maestro=? and idcursos = ?" 
    connection.query(consultarcursos,[id,dato.idcursos],(err,result,fields)=>{
        const {fecha,idalumnos, tipo_asistencia, idcursos} = dato
        if(err) throw err;
        // console.log(result)
        if(result[0].resultado > 0){
            const query = "insert into asistenciaalumnos (idalumnos, fecha, tipo_asistencia, idcursos) "
            + "values (?,?,?,?)"
            connection.query(query,[idalumnos,fecha,tipo_asistencia,idcursos],(err,resu,fields)=>{
                if(err) throw err;
                // console.log(resu)
                mensaje = "Asistencia registrada con exito"

            })
        }else {
            
        }
    })
    })

    res.json({
        message:"Los datos fueron procesados"
    })
    


})

//comprobar si la asistencia de un día específico fue creada o no
router.get('/comprobar/:fecha/:idcursos', authenticateToken, (req,res) =>{
    const fecha = req.params.fecha
    const idcursos = req.params.idcursos
    const query = "select count(*) as resultado from asistenciaalumnos "
    +" where fecha = ? and idcursos = ?"
    connection.query(query,[fecha,idcursos],(err,result,fields)=>{
        if(err) throw err;
        // console.log(result)
        if(result[0].resultado > 0){
            res.json({
                message:"La asistencia ya fue creada"
            })
        }else {
            res.json({
                message:"next"
            })
        }
        }) 

})

//mostrar la asistencia de todos los estudiantes de un día y un curso en específico
router.get('/mostrarasistencia/:fecha/:idcursos',(req,res)=>{
    const fecha = req.params.fecha
    const idcursos = req.params.idcursos
    const query = "select a.idalumnos, a.apellidos, a.nombres, a.sexo, a.codigo, a2.tipo_asistencia, "
    +"a2.fecha from alumnos as a "
    +"inner join asistenciaalumnos a2 ON a.idalumnos = a2.idalumnos "
    +"where a2.fecha = ? and a2.idcursos = ? order by a.apellidos, a.nombres ASC;"
    connection.query(query,[fecha,idcursos],(err,result,fields)=>{
        if(err) throw err;
        // console.log(result)
        res.json({
            message:"datos consultados, con éxito",
            data:result
        })
    })
    

})

//creamos la función para editar la asistencia
router.put('/editarasistencia/:idalumnos/:idcursos/:fecha/:tipoasistencia', authenticateToken, (req,res)=>{
        const {idalumnos, idcursos, fecha, tipoasistencia} = req.params;
        fecha_corregida = moment(fecha).format("YYYY-MM-DD")
        // console.log(req.params)
        const query = "update asistenciaalumnos set tipo_asistencia = ? "
        +"where idalumnos = ? and idcursos = ? and fecha = ?"
        connection.query(query,[tipoasistencia,idalumnos,idcursos,fecha_corregida],(err,result)=>{
            if(err) throw err;
            // console.log(result)
            if(result.affectedRows > 0){
            res.json({
                message:"ok"
                })
                }else{
                res.json({
                message:"no"
            })
        }
    })
})


//mostrar asistencia del mes consultado
router.get('/asistenciamensual/:idcursos/:mes', authenticateToken,(req,res)=>{
    const idcursos = req.params.idcursos
    const mes = req.params.mes
    const query = "select a2.idalumnos, c.nombrecurso, day(a2.fecha) as dia, a2.tipo_asistencia, "
        +" a.nombres, a.apellidos, m.apellidos as apemaestro, m.nombres as nommaestro "
        +"from asistenciaalumnos a2 "
        +"inner join alumnos a on a.idalumnos = a2.idalumnos "
        +"inner join cursos c on c.idcursos = a2.idcursos "
        +"inner join asignacioncursosmaestros acm on acm.idcursos = c.idcursos "
        +"inner join maestros m on m.idmaestros = acm.maestro "
        +"inner join gradosysecciones g on g.idgradosysecciones = c.idgradosysecciones "
        +"WHERE a2.idcursos = ? and MONTH (a2.fecha) = ? and YEAR(NOW())order by dia, apellidos, nombres ASC;"
    connection.query(query,[idcursos,mes], (err, result)=>{
        if(err) throw err;
        if(result.length > 0){
            // console.log(result)
            
              const asistenciaAgrupada = result.reduce((acc, item) => {
                // Verifica si el alumno ya está en el objeto acumulador
                if (!acc[item.idalumnos]) {
                  acc[item.idalumnos] = {
                    idalumnos: item.idalumnos,
                    nombres: item.nombres,
                    apellidos: item.apellidos,
                    apemaestro: item.apemaestro,
                    nommaestro: item.nommaestro,
                    nombrecurso: item.nombrecurso,
                    asistencia: []
                  };
                }
                
                // Agrega el día y tipo de asistencia al array de asistencia del alumno
                acc[item.idalumnos].asistencia.push({
                  dia: item.dia,
                  tipo_asistencia: item.tipo_asistencia
                });
              
                return acc;
              }, {});
              
              // Convierte el objeto resultante a un array si lo prefieres en formato de lista
            //   console.log(asistenciaAgrupada)
              const resultado = Object.values(asistenciaAgrupada);
            // console.log(resultado)
            res.json({
                message:"ok",
                data:resultado})
        } else {

            res.json(
                {
                    message:"no"
                }
            )
        }
    })

        
    })


module.exports = router;