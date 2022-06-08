const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try{
        
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si el usuario esta activo en mi BBDD
        if ( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })

    } catch (error){
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}


const googleSignIn = async( req, res = response) => {

    const { id_token } = req.body;

    try{

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );

            userSaved = await usuario.save();
        }

        // Si el usuario esta en la DB
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
        
    } catch (error){
        console.log(error);
        return res.status(400).json({
            msg: 'El Token de Google no es válido'
        })
    }

}




module.exports = {
    login,
    googleSignIn
}