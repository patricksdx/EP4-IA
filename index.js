const express = require('express')
const conectarDB = require('./config/db')
const config = require('./config/global')
const cors = require('cors')

const app = express()

conectarDB()

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/auth'));
app.use('/chat', require('./routes/chat'));
app.use('/messages', require('./routes/message'));

app.use('/api/categorias', require('./routes/categoria'));
app.use('/api/meseros', require('./routes/mesero'));
app.use('/api/platillos', require('./routes/platillo')); 
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/ordenes', require('./routes/orden'));

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

app.use((req, res) => {
  res.status(404).send('Recurso no encontrado');
});

app.listen(config.port, () => {
    console.log('El servidor corriendo por el puerto 3000')
})