const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');


router.post('/', categoriaController.crearCategoria);
router.get('/', categoriaController.obtenerCategorias);
router.put('/', categoriaController.actualizarCategoria);
router.delete('/', categoriaController.eliminarCategoria);

module.exports = router;