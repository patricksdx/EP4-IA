const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');  // Asegúrate de que la ruta sea correcta


router.post('/', ordenController.crearOrden);

router.get('/:idMesa', ordenController.obtenerOrdenPorIdMesa);

router.put('/:idMesa', ordenController.actualizarEstadoOrden);

router.delete('/:idMesa', ordenController.eliminarOrden);

module.exports = router;
