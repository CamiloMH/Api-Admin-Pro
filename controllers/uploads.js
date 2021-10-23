const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4, } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");



const uploadArchivo = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    /* -------------------------------------------------------------------------- */
    /*                                validar tipo                                */
    /* -------------------------------------------------------------------------- */
    const tiposPermitidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital'
        });
    }

    /* -------------------------------------------------------------------------- */
    /*                        Validar que exista un archivo                       */
    /* -------------------------------------------------------------------------- */

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No existe ningun archivo'
        });
    }

    /* -------------------------------------------------------------------------- */
    /*                             Procesar la imagen                             */
    /* -------------------------------------------------------------------------- */
    const file = req.files.imagen;

    const nombreCut = file.name.split('.'); // wolverine.1.3.jpg
    const extensionArchivo = nombreCut[nombreCut.length - 1]; //jpg 

    /* -------------------------------------------------------------------------- */
    /*                              Validar extension                             */
    /* -------------------------------------------------------------------------- */
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión valida'
        });
    }

    /* -------------------------------------------------------------------------- */
    /*                     Generar el nombre del archivo unico                    */
    /* -------------------------------------------------------------------------- */
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    /* -------------------------------------------------------------------------- */
    /*                         Path para guardar la imagen                        */
    /* -------------------------------------------------------------------------- */
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    /* -------------------------------------------------------------------------- */
    /*                               Mover la imagen                              */
    /* -------------------------------------------------------------------------- */
    // Use the mv() method to place the file somewhere on your server

    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });

        }

        /* -------------------------------------------------------------------------- */
        /*                               Actualizar BDD                               */
        /* -------------------------------------------------------------------------- */
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });




};

const mostrarFoto = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    /* --------------------------- Imagen por defecto --------------------------- */
    const imgNoExiste = path.join(__dirname, `../uploads/no-img.jpg`);

    if (fs.existsSync(pathImg)) {

        res.sendFile(pathImg);
    } else {
        res.sendFile(imgNoExiste);

    }


};



module.exports = {
    uploadArchivo,
    mostrarFoto
};