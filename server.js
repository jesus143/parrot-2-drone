var arDrone = require('ar-drone');
var fs = require('fs');
var rimraf = require("rimraf");

require('events').EventEmitter.prototype._maxListeners = 100;

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
 


 // access the head camera
client.config('video:video_channel', 0);

// access the bottom camera
  

io.on('connection', function(socket) {
    var data = {};
 
    // send control to the drone
    socket.on('chanel.drone-control', function (control) {         
       console.log(" new control triggered ", control);

        if(control.action == 'left') { 
            console.log(" go left");
        }       
        else if(control.action == 'right') { 
            console.log("go right");
        }       
        else if(control.action == 'right') { 
            console.log("go right");
        }       
        else if(control.action == 'bottom') { 
            console.log("go bottom");
        }       
        else if(control.action == 'forward') { 
            console.log("go forward");
        }     

 
        if(control.action == 'topvideo') { 
                client.config('video:video_channel', 0);
        } else if(control.action == 'bottomvideo') { 
            client.config('video:video_channel', 3);
        }
    });
 

    // send nav data
    client.on('navdata', (data)=>{ 
            socket.emit('chanel.drone-nav-data', data);
    });




  
    // send video to the monitoring app
    pngStream.on('data', function(videoBuffer) {
            data.videoBf = videoBuffer;

            var now = (new Date()).getTime(); 
                frameCounter++;

                lastFrameTime = now;

                // console.log('Saving frame');

                fs.writeFile('src/public/img/frame' + frameCounter + '.png', videoBuffer, function(err) {
                // fs.writeFile('src/public/img/frame.png', videoBuffer, function(err) {
                    if (err) {
                        // console.log('Error saving PNG: ' + err);
                    }
                });
            // }

            if(frameCounter % 1000 == 0) {
                // console.log(" preparing to delete the folder");

                setTimeout(function () {
                    rimraf("src/public/img", function () {
                        console.log("folder deleted");
                    });
                }, 2000)
            }

            data.frameCounter = frameCounter;

            socket.emit('chanel.drone-image-frame', data);
        });
});