/**
* CodeX Meetup server-side application
*
* @uses express, socket.io
* @since 17.17.02
* @author CodeX Team https://ifmo.su
*/

var express = require('express');
var app     = express();

var server = require('http').Server(app); // create server
var io     = require('socket.io')(server); // create socket.io instance

var PORT = 3000;


/**
* Express js
*/

/** Start web server port listening */
server.listen(PORT, function(){
    console.log('Listening ' + PORT + '...');
});

/** Express's route for index page */
app.get('/', function( request , response ){
    response.sendFile( __dirname + '/index.html');
});

/**
* Route for delivering static files (JS, CSS, images)
* @see http://expressjs.com/en/starter/static-files.html
*/
app.use('/public', express.static('public'));



/**
* Socket.io
*/

/**
* Web socket connection's handler
* @param {Socket} socket - web-socket object
*/
io.on('connection', function( socket ){

    /**
    * 'user moved' message handler
    * @param {object} data passed with emit-event from client-side
    *                      contains user's {id, photo, x, y}
    */
    socket.on('user moved', function( data ){

        console.log('user moved', data);

        /** Say to all others connected sockets about someones moved */
        socket.broadcast.emit('someone moved', data);

    });

});


