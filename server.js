var arDrone = require('ar-drone');
var fs = require('fs');
var rimraf = require("rimraf");

// require('events').EventEmitter.prototype._maxListeners = 100;

var client  = arDrone.createClient();
// client.config('general:navdata_demo', 'FALSE');



let server = require('http').Server();
let io = require('socket.io')(server);
server.listen(3000);

var pngStream = arDrone.createClient().getPngStream();

var lastPng;
var videoBf;
  
var frameCounter = 0; 
var lastFrameTime = 0;
var navData = {};

 // access the head camera
client.config('video:video_channel', 0);

// access the bottom camera
  

io.on('connection', function(socket) {
    var data = {};
 
    // send control to the drone
    socket.on('chanel.drone-control', function (control) {         
       console.log(" new control triggered ", control);

        if(control.action == 'left') {
            console.log("left");
            client.counterClockwise(0.5);
        }       
        else if(control.action == 'right') {

            client.clockwise(0.5);
            console.log("right");
        }
        else if(control.action == 'down') {
            console.log("down");
            client.down(0.5)
        }
        else if(control.action == 'up') {
            console.log("up");
            client.up(0.5)
        }
        else if(control.action == 'back') {
            console.log("back");
            client.back(0.5)
        }
        else if(control.action == 'front') {
            console.log("front");

            client.front(0.5)
        }



        if(control.action == 'fly') {
            console.log(" fly");
        }
        else if(control.action == 'land') {
            console.log(" landing");
            client.land();
        }

 
        if(control.action == 'topvideo') { 
                client.config('video:video_channel', 0);
        } else if(control.action == 'bottomvideo') { 
            client.config('video:video_channel', 3);
        }
    });
 

    // send nav data
    client.on('navdata', (data)=>{
        navData = data;
            // socket.emit('chanel.drone-nav-data', data);
    });

    // send video to the monitoring app
    pngStream.on('data', function(videoBuffer) {
            data.videoBf = videoBuffer;
            data.navData = navData;

            var now = (new Date()).getTime(); 
                frameCounter++;

                lastFrameTime = now;

                // console.log('Saving frame');

                fs.writeFile('src/public/img/frame' + frameCounter + '.png', videoBuffer, function(err) {
                // fs.writeFile('src/public/img/frame.png', videoBuffer, function(err) {
                    if (err) {
                        console.log('Error saving PNG: ' + err);
                    } else {
                        // console.log('successfully saved image');
                    }
                });
            // }

            if(frameCounter % 5000 == 0) {
                // console.log(" preparing to delete the folder");

                setTimeout(function () {
                    rimraf("src/public/img/*", function () {
                        console.log("folder deleted");
                    });
                }, 2000)
            }

            data.frameCounter = frameCounter;

            socket.emit('chanel.drone-image-frame', data);
        });
});