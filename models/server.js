const express = require('express')
var cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.apiV1 = '/api/v1';
        this.authPath = '/api/v1/auth';

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares(){
        
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use(express.static('public'));
        
        
    }

    routes(){

        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.apiV1, require('../routes/user.routes'));
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;