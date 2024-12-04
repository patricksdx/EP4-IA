const express = require('express')
const conectarDB = require('./config/db')
const config = require('./config/global')
const cors = require('cors')

const app = express()

conectarDB()

app.use(cors())
app.use(express.json())

app.use('/api/categorias', require('./routes/categoria'));
app.use('/api/meseros', require('./routes/mesero'));
app.use('/api/platillos', require('./routes/platillo')); 
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/ordenes', require('./routes/orden'));

app.listen(config.port, () => {
    console.log('El servidor corriendo por el puerto 3000')
})