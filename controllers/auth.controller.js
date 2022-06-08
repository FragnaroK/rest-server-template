const bcryptjs = require('bcryptjs');
const { response, request } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');

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








module.exports = {
    login
}