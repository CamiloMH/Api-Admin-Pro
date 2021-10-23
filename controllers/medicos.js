const { response } = require("express");
const Medico = require('../models/medico');


const getMedicos = async (req, res = response) => {
    const medicos = await Medico.find().populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');
    try {

        res.json({
            ok: true,
            medicos
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

const getMedicosById = async (req, res = response) => {
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id).populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Médico no encontrado'
        });
    }

};

const crearMedicos = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({ usuario: uid, ...req.body })


    try {

        const medicoDB = await medico.save();


        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        req.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }




};
const actualizarMedicos = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el medico con esa id'
            });
        }

        const cambioMedico = {
            ...req.body,
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambioMedico, { new: true });



        res.json({
            ok: true,
            msg: 'Medico actualizado',
            medico: medicoActualizado


        });
    } catch (error) {
        console.log(error);
        req.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }


};
const borrarMedicos = async (req, res = response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe medico con esa id'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico Borrado',

        });
    } catch (error) {
        console.log(error);
        req.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }


};



module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos,
    getMedicosById,
};