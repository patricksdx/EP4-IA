const express = require('express');
const conectarDB = require('./config/db');
const config = require('./config/global');
const cors = require('cors');

const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app); // Servidor HTTP para Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Permite conexiones desde React
        methods: ["GET", "POST"]
    }
});

// Conexión a la base de datos
conectarDB();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/categorias', require('./routes/categoria'));
app.use('/api/meseros', require('./routes/mesero'));
app.use('/api/platillos', require('./routes/platillo'));
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/ordenes', require('./routes/orden'));

// Ruta de inicio de la API
app.use('/api', (req, res) => {
    res.send(`
      <html>
        <body>
          <h1>Inicio de la API</h1>
          <p>Accede a las rutas de la API aquí:</p>
          <ul>
            <li><a href="/api/categorias">Categorías API</a></li>
            <li><a href="/api/meseros">Meseros API</a></li>
            <li><a href="/api/platillos">Platillos API</a></li>
            <li><a href="/api/clientes">Clientes API</a></li>
            <li><a href="/api/ordenes/1">Órdenes API</a></li>
          </ul>
        </body>
      </html>
    `);
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Recurso no encontrado');
});

const chatNamespace = io.of('/chat');
const clientes = {};  // Almacena los sockets de los clientes
const admins = {};    // Almacena los sockets de los admins

chatNamespace.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Identificar el rol del cliente o admin
  socket.on('identificarRol', (rol) => {
    console.log(`${socket.id} se ha identificado como: ${rol}`);
    if (rol === 'Cliente') {
      clientes[socket.id] = socket;  // Guardar el socket del cliente
    } else if (rol === 'Admin') {
      admins[socket.id] = socket;    // Guardar el socket del admin
    }
  });

  // Recibir mensaje del cliente
  socket.on('mensajeCliente', (data) => {
    console.log('Mensaje del cliente:', data);
    // Emitir mensaje al admin correspondiente
    Object.values(admins).forEach(adminSocket => {
      adminSocket.emit('mensajeCliente', { msg: data.msg, from: 'Cliente' });
    });
  });

  // Recibir mensaje del admin
  socket.on('mensajeAdmin', (data) => {
    console.log('Mensaje del admin:', data);
    // Emitir mensaje al cliente correspondiente
    Object.values(clientes).forEach(clienteSocket => {
      clienteSocket.emit('mensajeAdmin', { msg: data.msg, from: 'Admin' });
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    delete clientes[socket.id];
    delete admins[socket.id];
  });
});

// Cambia `app.listen` por `server.listen` para que Socket.IO funcione
server.listen(config.port, () => {
  console.log(`El servidor corriendo por el puerto ${config.port}`);
});