
main();





function main() {
    // setInterval(function(){
    var arDrone = require('ar-drone');
    var fs = require('fs');
    var rimraf = require("rimraf");

    // require('events').EventEmitter.prototype._maxListeners = 100;

    var client  = arDrone.createClient();
    // client.config('general:navdata_demo', 'FALSE');






    let server = require('http').Server();
    let io = require('socket.io')(server);


    // var pngStream = arDrone.createClient().getPngStream();

    var lastPng;
    var videoBf;



    var frameCounter = 0;
    var period = 10; // Save a frame every 5000 ms.
    var lastFrameTime = 0;
    var navData = {};
    var imgPath = 'C:/laragon/www/drone/parrot-2-drone/drone-master/public/drone/img';
     // access the head camera


    // console.log("try");
    //
    // setTimeinterval(function(){
    //     server.close();
        server.listen(3000);
    //
    //     init();
    //
    // }, );
    //
    var pngStopped = false;


    var pngStream = client.getPngStream();


    console.log(" init data");

    // access the bottom camera


    // deleteAllPngs();


    // turn on gps
        client.config('general:navdata_options', 777060865);

        var interval = 1000;


        var data = {};

    io.on('connection', function(socket) {


        initControl(socket, client);

        console.log(" connection started") ;

        var counter = 1;





        pngStream.on('data', function(videoBuffer) {

            console.log(" inside png") ;


            data.png = videoBuffer;
            data.navdata = '';
            counter++;

            console.log("pngvideo ", counter);


            socket.emit('chanel.drone-image-frame', data);


            clearTimeout(pngStopped);

            pngStopped = setTimeout(function(){
                console.log("video stoped, now restarting server");
                    server.close();
                    main();

            }, 1000);
        });

        //
        // var counter = 1;
        // client.on('navdata', (navdata)=>{
        //
        //     console.log(" counter ", counter);
        //
        //     counter++;
        //
        //
        //     data.navdata = navdata;
        //
        //
        //     socket.emit('chanel.drone-image-frame', data);
        //
        //
        // });


        // var data = {};
        //
        // console.log(" server connected again after 10mins")
        //
        // // client.config('video:video_channel', 0);
        //
        // // send control to the drone
        // initControl(socket, client);
        //
        //
        // // send nav data
        // // client.on('navdata', (data)=>{
        // //     navData = data;
        // //         // socket.emit('chanel.drone-nav-data', data);
        // // });
        //
        // // send video to the monitoring app
        //
        //
        // console.log(" interval started inteval ", interval);
        //
        // // setInterval(function(){
        //
        // // pngStream = client.getPngStream()
        //
        // console.log(" interval started inteval ", interval);
        //
        // var counter = 1;
        //
        // pngStream
        //     .on('error', console.log)
        //     .on('data', function(videoBuffer) {
        //
        //         data.png = videoBuffer;
        //
        //         socket.emit('chanel.drone-image-frame', data);
        //
        //
        //         console.log(counter);
        //
        //         counter++;
        //     });

        // pngStream
        //     .on('error', console.log)
        //     .on('data', function(videoBuffer) {
        //         data.videoBf = videoBuffer;
        //         data.navData = navData;
        //
        //         var now = (new Date()).getTime();
        //
        //         if (now - lastFrameTime > period) {
        //
        //             console.log(  now);
        //
        //         //
        //             frameCounter++;
        //
        //
        //             lastFrameTime = now;
        //
        //             // console.log('Saving frame');
        //
        //             fs.writeFile(imgPath + '/frame-' + now + '.png', videoBuffer, function(err) {
        //             // fs.writeFile('src/public/img/frame.png', videoBuffer, function(err) {
        //                 if (err) {
        //                     console.log('Error saving PNG: ' + err);
        //                 } else {
        //                     // console.log('successfully saved image');
        //                 }
        //             });
        //
        //             if(frameCounter % 5000 == 0) {
        //
        //                 // console.log(" preparing to delete the folder");
        //
        //                 // setTimeout(function () {
        //
        //
        //                 deleteAllPngs();
        //
        //                 // rimraf(imgPath + "/*", function () {
        //                 //     console.log("folder deleted");
        //                 // });
        //                 // }, 2000)
        //
        //
        //                 // frameCounter = 1;
        //             }
        //
        //
        //             // data.frameCounter = frameCounter;
        //             data.time = now;
        //
        //             console.log(frameCounter);
        //
        //             socket.emit('chanel.drone-image-frame', data);
        //         }
        //     }).on('end', function () {
        //         console.log(" png end");
        //         // pngStream = arDrone.createClient().getPngStream();
        //     }).on('stop', function () {
        //         console.log(" png stop");
        //         // pngStream = arDrone.createClient().getPngStream();
        //     }).on('drain', function () {
        //         console.log(" png drain");
        //         // pngStream = arDrone.createClient().getPngStream();
        //     }).on('exit', function () {
        //         console.log(" png exit");
        //         // pngStream = arDrone.createClient().getPngStream();
        //     }).on('connect', function () {
        //         console.log(" png connect");
        //         // pngStream = arDrone.createClient().getPngStream();
        //     }).on('timeout', function () {
        //         console.log(" png connect");
        //         // pngStream = arDrone.createClient().getPngStream();
        //     })

        // }, interval)



        client.on('event', data => { /* … */ });
        client.on('disconnect', () => { /* … */ });
    });



}



    function deleteAllPngs() {
        rimraf(imgPath + "/*", function () {
            console.log("folder deleted");
        });
    }

    function initControl(socket, client) {
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
                client.down(3)
            }
            else if(control.action == 'up') {
                console.log("up");
                client.up(3)
            }
            else if(control.action == 'back') {
                console.log("back");
                client.back(3)
            }
            else if(control.action == 'front') {
                console.log("front");

                client.front(3)
            }

            if(control.action == 'fly') {
                console.log(" fly");

                // client.takeoff();
            }
            else if(control.action == 'land') {
                console.log(" landing");
                client.stop();
                client.land();
            }

            if(control.action == 'topvideo') {

                console.log(" top video");
                client.config('video:video_channel', 0);
            } else if(control.action == 'bottomvideo') {

                console.log(" bottom video");

                client.config('video:video_channel', 3);
            }
        });


    }



// }, 10000)


