const express = require('express');
const router = express.Router();
const platilloController = require('../controllers/platilloController');

router.post('/', platilloController.crearPlatillo);

router.get('/', platilloController.obtenerPlatillos);

router.get('/:id', platilloController.obtenerPlatilloPorId);

router.put('/:id', platilloController.actualizarPlatillo);

router.delete('/:id', platilloController.eliminarPlatillo);

module.exports = router;
