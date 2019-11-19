var arDrone       = require('ar-drone');
var fs            = require('fs');
var rimraf        = require("rimraf");
let server        = require('http').Server();
let io            = require('socket.io')(server);

var pngStream     = arDrone.createClient().getPngStream();
var frameCounter  = 0;
var lastFrameTime = 0;

io.on('connection', function(socket) {
    var data = {};

    pngStream.on('data', function(videoBuffer) {
            data.videoBf = videoBuffer;

            var now = (new Date()).getTime();
                frameCounter++;

                lastFrameTime = now;

                fs.writeFile('src/public/img/frame' + frameCounter + '.png', videoBuffer, function(err) {
                    if (err) {
                         console.log('Error saving PNG: ' + err);
                    }
                });

            if(frameCounter % 1000 == 0) {
                setTimeout(function () {
                    rimraf("src/public/img", function () {
                        console.log("folder deleted");
                    });
                }, 2000)
            }

            data.frameCounter = frameCounter;

            socket.emit('chanel.drone-nav-data', data);
        });
});

server.listen(3000);