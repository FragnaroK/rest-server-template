const { response, request } = require('express');;
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    // --------------------------------------------------------------
    // APUNTES: 2 await - Independientes -> Promise

    // const usuarios = await Usuario.find({ estado: true })
    //     .limit(Number( limite ))
    //     .skip(Number( desde ));

    // const total = await Usuario.countDocuments({ estado: true });

    // Tenemos dos await, osea que se va a esperar a que se haga el primero y cuando
    // termine se espera a que se haga el segundo. En este caso, como uno no depende del otro
    // se pude mejorar mucho el tiempo de ejecución si juntamos los dos en una Promise, de este
    // modo se ejecutarán los de forma simultanea reduciendo así el tiempo de ejecución a la mitad
    // --------------------------------------------------------------

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .limit(Number( limite ))
            .skip(Number( desde ))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const { _id, password, google, correo, ...rest } = req.body;

    // TODO id contra base de datos
    if ( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, rest );


    res.json(usuario);
}

const usuariosDelete = async(req, res = response) => {
    
    const { id } = req.params;
    
    // Fisicamente lo borramos, NO RECOMENDABLE perdemos la integridad referencial
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false });

    res.json(usuario);
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}