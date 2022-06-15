
const{ Router } = require('express');
const{ check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existCategory } = require('../helpers/db-validators');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();

// {{url}}/api/v1/categorias

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categorias por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existCategory ),
    validarCampos
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria ); 

// Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existCategory ),
    validarCampos
],actualizarCategoria );

// Borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existCategory ),
    validarCampos
], borrarCategoria );



module.exports = router;