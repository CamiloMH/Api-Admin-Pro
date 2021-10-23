const { response } = require('express')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuario');

/* -------------------------------------------------------------------------- */
/*                              Obtener usuarios                              */
/* -------------------------------------------------------------------------- */

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img').skip(desde).limit(5),
        Usuario.countDocuments(),
    ]);


    res.json({
        ok: true,
        usuarios,
        total
    });

};

/* -------------------------------------------------------------------------- */
/*                                Crear usuario                               */
/* -------------------------------------------------------------------------- */

const crearUsuarios = async (req, res = response) => {

    const { email, password } = req.body;



    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            });
        }
        const usuario = new Usuario(req.body);

        /* -------------------------------------------------------------------------- */
        /*                            Encriptar contraseña                            */
        /* -------------------------------------------------------------------------- */

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        /* -------------------------------------------------------------------------- */
        /*                               Guardar usuario                              */
        /* -------------------------------------------------------------------------- */

        await usuario.save();

        /* -------------------------------------------------------------------------- */
        /*                           Generar un TOKEN - JWT                           */
        /* -------------------------------------------------------------------------- */

        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const actualizarUsuario = async (req, res = response) => {

    /* -------------------------------------------------------------------------- */
    /*          TODO: Validar token y comprobar si es el usuario correcto         */
    /* -------------------------------------------------------------------------- */

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con esa id'
            });
        }

        /* -------------------------------------------------------------------------- */
        /*                               Actualizaciones                              */
        /* -------------------------------------------------------------------------- */

        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if (!usuarioDB.google) {

            campos.email = email.toLowerCase();
        } else if (usuarioDB.google !== email) {
            res.json({
                ok: true,
                msg: 'Usuario de google no pueden cambiar su correo '
            });
        }


        const usuarioActulizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActulizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'El email ya esta ocupado',
        });
    }

};

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con esa id'
            });
        }

        await Usuario.findOneAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al borrar el usuario'
        });
    }

};




module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
};