var arDrone       = require('ar-drone');
var fs            = require('fs');
var rimraf        = require("rimraf");
let server        = require('http').Server();
let io            = require('socket.io')(server);

var pngStream     = arDrone.createClient().getPngStream();
var frameCounter  = 0;
var lastFrameTime = 0;

// on load sa server meaning, mag run nato sa server via command line if successful ang connected then ready na atong server for drone activity monitoring
io.on('connection', function(socket) {
    var data = {};

    pngStream.on('data', function(videoBuffer) {
            data.videoBf = videoBuffer;

            // counter ni para lahi lahi ang name sa png
            frameCounter++;

            // e save mga png nga gi send gikan sa drone
            fs.writeFile('src/public/img/frame' + frameCounter + '.png', videoBuffer, function(err) {
                if (err) {
                     console.log('Error saving PNG: ' + err);
                }
            });

            // pag devisible nag 1000 ang frame need nato e delete ang mga images nga na save sa parrot-2-drone/src/public/img
            if(frameCounter % 1000 == 0) {
                setTimeout(function () {
                    rimraf("src/public/img/*", function () {
                        console.log("folder deleted");
                    });
                }, 2000)
            }

            // gi pasa nato sa variable para ma access daun ang data sa server / frontend side
            data.frameCounter = frameCounter;

            // send nato ang data sa frontend client like mobile or desktop para real time ang update sa data via socket io
            socket.emit('chanel.drone-nav-data', data);
        });
});

// listen sa port 3000 sa atong server
server.listen(3000);