/**
* Client application
*/
var game = function(){

    /**
    * @var {Element} scene holder
    */
    var playground = document.getElementById('playground');

    /**
    * @var {object} current user's state
    */
    var currentUser = {
        id : null,
        photo : null
    };

    /**
    * Web-Sockets client provided via sockets.io
    */
    var socket = io.connect();

    /**
    * @public
    * Game initializer
    * @param {int} id           joined user's id
    * @param {string} photo     joined user's photo URL
    */
    function start ( id , photo ){

        /** Save joined user's data */
        currentUser.id = id;
        currentUser.photo = photo;

        /** Handle clicks on the scene */
        playground.addEventListener('click', playgroundClicked);

        /** Add joined user to the scene */
        addUser( currentUser.id , currentUser.photo );

    }

    /**
    * Callback for web-socket 'someone move' message
    * @param {object} data stores {id, photo, x, y}
    */
    socket.on("someone moved", function( data ){

        var user = document.getElementById(data.id);

        if (!user) {
            addUser(data.id, data.photo);
        }

        moveUser(data.id, data.x, data.y);

    });

    /**
    * Scene click handler
    * @param {Event} 'click' Event
    */
    function playgroundClicked (event){

        var x = event.layerX,
            y = event.layerY;

        moveUser(currentUser.id, x , y);

        /** Send move message to the server */
        socket.emit('user moved', {
            id    : currentUser.id,
            photo : currentUser.photo,
            x     : x,
            y     : y
        });

    }

    /**
    * Changes user's position
    */
    function moveUser ( id , x , y ) {

        var user = document.getElementById(id);

        user.style.left = x + 'px';
        user.style.top  = y + 'px';

    }

    /**
    * Adds new users photo to the scene
    */
    function addUser ( id , photo ){

        var user = document.createElement('IMG');

        user.classList.add('user');
        user.src = photo || 'http://www.irishcatholic.ie/sites/default/files/styles/image_50x50/public/main/articles/Trump.png?itok=WM4xSCXQ';
        user.id  = id;

        playground.appendChild(user);

    }

    /**
    * Public methods
    */
    return {
        start : start
    };

}();