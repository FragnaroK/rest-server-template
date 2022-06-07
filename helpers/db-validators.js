const Role = require('../models/rol');
const Usuario = require('../models/usuario');

const isValidRole = async (rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ){
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const existEmail = async ( correo = '') => {

    const emailExist = await Usuario.findOne({ correo });
    if( emailExist ){
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existUserById = async ( id = '') => {

    const idExist = await Usuario.findById(id);
    if( !idExist ){
        throw new Error(`El id: ${ id }, no existe`);
    }
}


module.exports = {
    isValidRole,
    existEmail,
    existUserById
}