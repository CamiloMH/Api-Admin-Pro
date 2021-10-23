const { response } = require('express')

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

/* -------------------------------------------------------------------------- */
/*                              Obtener todo                             */
/* -------------------------------------------------------------------------- */

const getTodo = async (req, res) => {

    const busqueda = req.params.busqueda;
    const regexp = new RegExp(busqueda, 'i');

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regexp }),
        Medico.find({ nombre: regexp }),
        Hospital.find({ nombre: regexp }),
    ])




    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });

};
const getDocumentosColleccion = async (req, res) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regexp = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regexp }).populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img');

            break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regexp }).populate('usuario', 'nombre img');

            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regexp });

            break;

        default:
            return res.json({
                ok: false,
                msg: 'La busqueda debe ser por medicos/usuarios/hospitales'
            });


    }

    res.json({
        ok: true,
        resultado: data
    });

};

module.exports = {
    getTodo,
    getDocumentosColleccion
};