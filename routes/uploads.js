/*
    Ruta: /api/uploads/
*/

const { Router } = require('express');
const { uploadArchivo, mostrarFoto } = require('../controllers/uploads');
const fileUpload = require('express-fileupload');


const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(fileUpload());

router.put('/:tipo/:id', validarJWT, uploadArchivo);
router.get('/:tipo/:foto', mostrarFoto);



module.exports = router;