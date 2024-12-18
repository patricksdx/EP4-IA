const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');


router.post('/', ordenController.crearOrden);

router.get('/:idMesa', ordenController.obtenerOrdenPorIdMesa);

router.put('/:id', ordenController.actualizarEstadoOrden);

router.delete('/:idMesa', ordenController.eliminarOrden);

module.exports = router;
