const Cliente = require('../models/Cliente');

// Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
    try {
        const { nombre, correo, telefono, dni } = req.body;

        // Validación de los campos obligatorios
        if (!nombre || !correo || !telefono || !dni) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear y guardar el nuevo cliente
        const cliente = new Cliente({ nombre, correo, telefono, dni });
        await cliente.save();
        res.status(201).json({ success: true, cliente });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        if (!clientes || clientes.length === 0) {
            return res.status(404).send({success: true , message : 'No se encontraron clientes'});
        }
        res.status(200).json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un cliente por su ID
exports.obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.status(200).json({ success: true, cliente });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un cliente por su ID
exports.actualizarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.status(200).json({ success: true, cliente });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un cliente por su ID
exports.eliminarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.status(200).json({ success: true, message: 'Cliente eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
