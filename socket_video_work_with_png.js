var arDrone = require('ar-drone');
var fs = require('fs');
var rimraf = require("rimraf");


var client  = arDrone.createClient();
client.config('general:navdata_demo', 'FALSE');



let server = require('http').Server();
let io = require('socket.io')(server);
server.listen(3000);

var pngStream = arDrone.createClient().getPngStream();

var lastPng;
var videoBf;

// access the head camera
// client.config('video:video_channel', 2);


// var video = arDrone.createClient().getVideoStream();

// video.on('data', console.log);

 // console.log(" starting ");

// var frameCounter = 0;
//
//

// var pngStream = client.getPngStream();
var frameCounter = 0;
var period = 5000; // Save a frame every 5000 ms.
var lastFrameTime = 0;


io.on('connection', function(socket) {

    var data = {};

    // console.log(" connected");

    // nav data
    // client.on('navdata', (navdata)=>{
    //     data.navdata = navdata;
    //
    //     socket.emit('chanel.drone-nav-data', data);
    // });

    //
    // // last png
    // pngStream.on('error', console.log)
    //     .on('data', function(pngBuffer) {
    //         lastPng = pngBuffer;
    //
    //         data.lasPng = lastPng;
    //
    //         socket.emit('chanel.drone-nav-data', data);
    //     });



    //
    // pngStream
    //     .on('error', console.log)
    //     .on('data', function(pngBuffer) {
    //
    //
    //         console.log(" png stream test ");
    //
    //         // var now = (new Date()).getTime();
    //         // if (now - lastFrameTime > period) {
    //         //     frameCounter++;
    //         //     lastFrameTime = now;
    //         //     console.log('Saving frame');
    //         //
    //         //
    //         //     fs.writeFile('frame' + frameCounter + '.png', pngBuffer, function(err) {
    //         //         if (err) {
    //         //             console.log('Error saving PNG: ' + err);
    //         //         }
    //         //     });
    //         // }
    //     });





















    pngStream.on('data', function(videoBuffer) {


            data.videoBf = videoBuffer;


            var now = (new Date()).getTime();
            // if (now - lastFrameTime > period) {


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

            socket.emit('chanel.drone-nav-data', data);
        });
});