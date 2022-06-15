
const{ Router } = require('express');
const{ check } = require('express-validator');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos.controller');

const { existCategory, existProducto } = require('../helpers/db-validators');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();

// {{url}}/api/v1/productos

// Obtener todas las productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existProducto ),
    validarCampos
], obtenerProducto );

// Crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo').isMongoId(),
    check('categoria').custom( existCategory ),
    validarCampos
], crearProducto ); 

// Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    // check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existProducto ),
    validarCampos
], actualizarProducto );

// Borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existProducto ),
    validarCampos
], borrarProducto );



module.exports = router;