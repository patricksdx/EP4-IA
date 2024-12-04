// routes/mesero.js
const express = require('express');
const router = express.Router();
const meseroController = require('../controllers/meseroController');


router.post('/', meseroController.crearMesero);

router.get('/', meseroController.obtenerMeseros);

router.put('/:id', meseroController.actualizarMesero);

router.delete('/:id', meseroController.eliminarMesero);

module.exports = router;
