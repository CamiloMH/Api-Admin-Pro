const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { verify } = require('../helpers/google-verify');
const { getMenuFront } = require('../helpers/menu-front');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        /* -------------------------------------------------------------------------- */
        /*                             Verificar el email                             */
        /* -------------------------------------------------------------------------- */
        const usuarioDB = await Usuario.findOne({ email });
        email.toLowerCase();
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña y/o email no son validos'
            });
        }

        /* -------------------------------------------------------------------------- */
        /*                           Verificar la contraseña                          */
        /* -------------------------------------------------------------------------- */

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña y/ o email no son validos'
            });
        }

        /* -------------------------------------------------------------------------- */
        /*                           Generar un TOKEN - JWT                           */
        /* -------------------------------------------------------------------------- */

        const token = await generarJWT(usuarioDB.id);




        res.json({
            ok: true,
            token,
            menu: getMenuFront(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }

};

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await verify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            //Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            //Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = '@@@';
        }

        //Guardar en la BDD
        await usuario.save();

        //Generar Token
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            token,
            menu: getMenuFront(usuario.role)
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
    }


}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //Generar Token
    const token = await generarJWT(uid);

    /* ----------------------- Obtener el usuario por uid ----------------------- */

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFront(usuario.role)
    })
};




module.exports = {
    login,
    googleSignIn,
    renewToken,
};