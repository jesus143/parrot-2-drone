var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.config('general:navdata_demo', 'FALSE');

console.log(" starting ");
 
// client
//     .after(5000, function() {
//         this.clockwise(0.5);
//     })
//     .after(3000, function() {
//         this.stop();
//         this.land();
//     });
 
let server = require('http').Server();
//
let io = require('socket.io')(server);
//
server.listen(3000);






 // var navData = client.on('navdata', console.log);


// console.log(" ------------------------------------------------------ ");
// console.log(" nav data ", navData.demo);
//

// io.emit('chanel.drone-nav-data', {test:''});
//
io.on('connection', function(socket) {

    console.log(" connected");

    client.on('navdata', (data)=>{

        socket.emit('chanel.drone-nav-data', {navdata: data});

        // console.log(" new data arrived ");

    });




    //  socket.emit('chanel.drone-nav-data', {navdata: navData});



   //  socket.on('chanel.drone-generate-location', function(data) {
 		// console.log(" data ", data);        
   //  });

 
    //
    // io.emit('chanel.drone-nav-data', console.log);
});











// // var arDrone = require('..');
// var http    = require('http');

// //var pngStream = arDrone.createClient().getPngStream();
// var client = arDrone.createClient();
// client.disableEmergency();

// console.log('Connecting png stream ...');
// var pngStream = client.getPngStream();

// var lastPng;
// pngStream
//     .on('error', console.log)
//     .on('data', function(pngBuffer) {
//         lastPng = pngBuffer;
//     });

// var server = http.createServer(function(req, res) {
//     if (!lastPng) {
//         res.writeHead(503);
//         res.end('Did not receive any png data yet.');
//         return;
//     }
//
//     res.writeHead(200, {'Content-Type': 'image/png'});
//     res.end(lastPng);
// });

// Connection established
// server.listen(8080, function() {
//     console.log('Serving latest png on port 8080 ...');
//
//
//
//








//     client.takeoff();

//     client
//         .after(5000, function() {
//             this.clockwise(0.5);
//         })
//         .after(5000, function() {
//             this.stop();
//         })
//         .after(5000, function() {
//             this.clockwise(0.5);
//         })
//         .after(5000, function() {
//             this.stop();
//         })
//         .after(5000, function() {
//             this.clockwise(0.5);
//         })
//         .after(5000, function() {
//             this.stop();
//         })
//         .after(5000, function() {
//             this.clockwise(-0.5);
//         })
//         .after(5000, function() {
//             this.stop();
//         })
//         .after(5000, function() {
//             this.clockwise(-0.5);
//         })
//         .after(5000, function() {
//             this.stop();
//         })
//         .after(5000, function() {
//             this.clockwise(-0.5);
//         })
//         .after(5000, function() {
//             this.stop();
//         })
//         .after(1000, function() {
//             this.stop();
//             this.land();
//         });
// });