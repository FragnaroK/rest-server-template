const { response, request } = require('express');
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
            .populate('usuario','nombre')
            .limit(Number( limite ))
            .skip(Number( desde ))
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate
const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;
    
    const categoriaDB = await Categoria.findById( id ).populate('usuario','nombre');
    if( !categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } no existe`
        });
    }

    res.status(200).json( categoriaDB );
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true} );

    res.json( categoria );
}

// borrarCategoria - estado: false
const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false}, {new: true});

    res.json( categoria );
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}