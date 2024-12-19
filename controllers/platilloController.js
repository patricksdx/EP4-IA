const Platillo = require('../models/Platillo');

// Crear un nuevo platillo
exports.crearPlatillo = async (req, res) => {
    try {
        const { nombre, ingredientes, precio, imagenes } = req.body;

        if (!nombre || !ingredientes || !precio) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const platillo = new Platillo({ nombre, ingredientes, precio, imagenes });
        await platillo.save();
        res.status(201).json({ success: true, platillo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todos los platillos
exports.obtenerPlatillos = async (req, res) => {
    try {
        const platillos = await Platillo.find();

        if (!platillos || platillos.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron platillos' });
        }

        // Asegúrate de que todos los platillos tengan un campo ingredientes como array
        platillos.forEach(platillo => {
            if (!Array.isArray(platillo.ingredientes)) {
                platillo.ingredientes = [];
            }
        });

        res.status(200).json({ success: true, platillos });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Obtener un platillo por su ID
exports.obtenerPlatilloPorId = async (req, res) => {
    try {
        const platillo = await Platillo.findById(req.params.id);
        if (!platillo) return res.status(404).json({ error: 'Platillo no encontrado' });
        res.status(200).json({ success: true, platillo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un platillo por su ID
exports.actualizarPlatillo = async (req, res) => {
    try {
        const platillo = await Platillo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!platillo) return res.status(404).json({ error: 'Platillo no encontrado' });
        res.status(200).json({ success: true, platillo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un platillo por su ID
exports.eliminarPlatillo = async (req, res) => {
    try {
        const platillo = await Platillo.findByIdAndDelete(req.params.id);
        if (!platillo) return res.status(404).json({ error: 'Platillo no encontrado' });
        res.status(200).json({ success: true, message: 'Platillo eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};