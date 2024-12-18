const Orden = require('../models/Orden');  
// Crear una nueva orden
exports.crearOrden = async (req, res) => {
    try {
        const { idMesa, platillos } = req.body;

        // Validación de los campos obligatorios
        if (!idMesa || !platillos || platillos.length === 0) {
            return res.status(400).json({ message: 'El ID de la mesa y los platillos son obligatorios' });
        }

        // Crear y guardar la nueva orden
        const orden = new Orden({ idMesa, platillos });
        await orden.save();
        res.status(201).json({ success: true, orden });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener los detalles de una orden por ID de mesa
exports.obtenerOrdenPorIdMesa = async (req, res) => {
    try {
        // Cambiamos findOne por find para obtener todas las órdenes asociadas a la mesa
        const ordenes = await Orden.find({ idMesa: req.params.idMesa });
        if (ordenes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron órdenes para esta mesa' });
        }
        res.status(200).json(ordenes); // Devuelve un arreglo de órdenes
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar el estado de una orden
// Actualizar el estado de una orden y eliminar si es cancelado
exports.actualizarEstadoOrden = async (req, res) => {
    try {
        console.log("req.params.id:", req.params.id); // Depurar el ID recibido

        const { estado } = req.body;

        // Validar el estado
        if (!['pendiente', 'entregado', 'cancelado'].includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido. Los valores válidos son: pendiente, entregado, cancelado.' });
        }

        // Buscar la orden por _id
        const orden = await Orden.findById(req.params.id);
        console.log("Orden encontrada:", orden); // Depurar la búsqueda

        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Si el estado es "cancelado", eliminar la orden
        if (estado === 'cancelado') {
            await Orden.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: 'Orden cancelada y eliminada correctamente' });
        }

        // Si no es "cancelado", actualizar el estado de la orden
        orden.estado = estado;
        await orden.save();
        res.status(200).json(orden);
    } catch (err) {
        console.error("Error en la solicitud:", err);
        res.status(500).json({ error: err.message });
    }
};


// Eliminar una orden
exports.eliminarOrden = async (req, res) => {
    try {
        console.log("ID recibido para eliminación:", req.params.id);
        const ordenEliminada = await Orden.findByIdAndDelete(req.params.id);
        if (!ordenEliminada) {
            console.log("Orden no encontrada");
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        res.status(200).json({ message: "Orden eliminada correctamente" });
    } catch (err) {
        console.error("Error al eliminar la orden:", err);
        res.status(500).json({ error: err.message });
    }
};