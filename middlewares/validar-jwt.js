const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async ( req = request, res = response, next) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(400).json({
            msg: 'No hay token en la peticion'
        });
    }

    try{

        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );
        
        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            });
        }

        // Verificar si el uid tiene estado en true
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado false'
            });
        }
        
        req.usuario = usuario;

        next()

    } catch( error ){
        console.log( error );
        res.status(400).json({
            msg: 'Token no válido'
        });
    }

}






module.exports = {
    validarJWT
}