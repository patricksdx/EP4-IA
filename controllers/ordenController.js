const Orden = require('../models/Orden');  
// Crear una nueva orden
exports.crearOrden = async (req, res) => {
    try {
        const { idMesa, platillos, estado } = req.body;

        // Validación de los campos obligatorios
        if (!idMesa || !platillos || platillos.length === 0) {
            return res.status(400).json({ message: 'El ID de la mesa y los platillos son obligatorios' });
        }

        // Crear y guardar la nueva orden
        const orden = new Orden({ idMesa, platillos, estado });
        await orden.save();
        res.status(201).json({ success: true, orden });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener los detalles de una orden por ID de mesa
exports.obtenerOrdenPorIdMesa = async (req, res) => {
    try {
        const orden = await Orden.findOne({ idMesa: req.params.idMesa });
        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
        res.status(200).json(orden);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar el estado de una orden
exports.actualizarEstadoOrden = async (req, res) => {
    try {
        const { estado } = req.body;
        if (!['pendiente', 'entregado', 'cancelado'].includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido. Los valores válidos son: pendiente, entregado, cancelado.' });
        }
        const orden = await Orden.findOneAndUpdate(
            { idMesa: req.params.idMesa },
            { estado },
            { new: true }
        );
        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
        res.status(200).json(orden);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Eliminar una orden
exports.eliminarOrden = async (req, res) => {
    try {
        const orden = await Orden.findOneAndDelete({ idMesa: req.params.idMesa });
        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
        res.status(200).json({ message: 'Orden eliminada con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
