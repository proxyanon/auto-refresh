/**
 * @author Daniel Victor Freire Feitosa
 * @version 0.0.1
 * @package main.js
 * @license MIT
 */

// node modules
const path = require('path');
const cors = require('cors');
const express = require('express');
const { readFileSync } = require('fs');
const chokidar = require('chokidar');
const { Server } = require('socket.io');
const { createServer } = require('https');

// auto-refresh config
const config = require('./config');

// instances of servers (socket and express)
const io = new Server(config.socket);
const app = express();

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended : true }));

// main function to start servers and set handlers
function main(){

    const connected_clients = []; // socket.io connected clients
    const serve = createServer(config.server.options, app); // SSL https server

    const scriptBuffer = Buffer.from(config.script.content).toString().replace('port', config.server.port); // string of file refresh.js

    // only route serving file refresh.js
    app.get('/refresh.js', (req, res) => {
        
        res.writeHead(200, {
            'Content-Length' : Buffer.byteLength(scriptBuffer),
            'Content-Type' : 'text/javascript'
        });

        res.end(scriptBuffer);

    });

    // handle socket.io connections
    io.on('connection', (socket) => {

        if(config.verbose) console.log('Socket connected', socket.id);        
    
        if(connected_clients.indexOf(socket.id) === -1){
            connected_clients.push(socket.id);
        }
    
        socket.on('disconnect', () => {
            if(config.verbose) console.log('Socket id', socket.id);
            delete connected_clients[connected_clients.indexOf(socket.id)];
        });
    
    });
    
    // UP servers
    io.listen(serve);
    serve.listen(config.server.port, () => {
        if(config.verbose) console.log('Auto-refresh on port', config.server.port);
    });
    
    // watcher of pathname listening on all events
    chokidar.watch(path.resolve(config.pathname))
            .on('all', (event, path) => {
                    
                    if(config.verbose) console.log('[refreshing]', event, path);
                    
                    if(connected_clients.length>0){ // check if exists any client connected
                        
                        // send new event to connected clients
                        connected_clients.forEach(sock_id => {
                            if(config.verbose) console.log('Sent event refresh to client', sock_id);
                            io.sockets.to(sock_id).emit('refresh'); // broadcasting event
                        });

                    }else{
                        if(config.verbose) console.warn('Not clients connected yet')
                    }
                });

}

main();