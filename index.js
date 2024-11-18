const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
// const corsOptions = {
//     origin: ['*','http://localhost:3000'],
//   };
// app.use(cors(corsOptions))
// app.options('*', cors());
app.use(cors())
app.use(bodyParser.json())
const port = 4000;
const rutas = require('./rutas/rutas');
const rutas_alumnos = require('./rutas/alumnos');
const maestros = require('./rutas/maestros')
const carreras = require('./rutas/carreras')
const cursos = require('./rutas/cursos')
const asistencia = require('./rutas/asistencia')


app.use ('/',rutas);
app.use('/alumnos', rutas_alumnos);
app.use('/maestros',maestros);
app.use('/carreras',carreras)
app.use('/cursos',cursos)
app.use('/asistencia',asistencia)

app.listen(port, ()=> console.log(`El servidor esta corriendo en el puerto ${port}`));
