require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const {
    dbConnection
} = require('./database/config');



//Crear el servidor de express
const app = express();

//Configurar cors
app.use(cors());

//Lectura y parseo del Body
app.use(express.json());

//Base de datos
dbConnection();

//Directorio publico
app.use(express.static('public'));



//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

//Comodin
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});




//inicializar el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});