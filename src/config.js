/**
 * @author Daniel Victor Freire Feitosa
 * @version 0.0.1
 * @package main.js
 * @license MIT
 */

// node modules
const { resolve } = require('path');
const { readFileSync } = require('fs');

// Auto-refresh configs
module.exports = {

    isDev : true, // if dev mode
    sslServer: true, // if HTTPS server
    verbose: true, // verbosity
    pathname: 'C:\\Users\\daniel\\Desktop\\javascript\\dev\\psicoatendimento\\src', // path or file to watch

    server : {
        port : 8291, // ports to booth servers (socket, http)
        options : { // http server options (certificate and key)
            cert : readFileSync(resolve(__dirname, 'assets', 'cert.pem')),
            key : readFileSync(resolve(__dirname, 'assets', 'cert.key'))
        }
    },

    socket : { // socket.io configs
        cors : { // enable cors to all origins
            origin : '*', // origins allowed
            methods : ['GET', 'POST', 'DEL', 'PUT', 'OPTIONS'], // methods accepted
            credentials : false // require or not credentials
        }
    },

    script : {
        content: readFileSync(resolve(__dirname, 'refresh.js')),
        minify: false
    }

};