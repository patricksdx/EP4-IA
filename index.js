const express = require('express');
const conectarDB = require('./config/db');
const config = require('./config/global');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

conectarDB();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API (lo puedes dejar igual)
app.use('/api', (req, res) => {
  res.send('Bienvenido a la API');
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


server.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
});