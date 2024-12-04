const mongoose = require('mongoose')

const conectarDB = async () => {

    try{
         await mongoose.connect('mongodb://127.0.0.1:27017/usuario', {
            useNewUrlParser: true,
            useUnifiedTopology: true
         })


    }catch(error){
        console.log(error)
        process.exit(1)
    }

}

module.exports = conectarDB