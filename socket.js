var arDrone = require('ar-drone');
var fs = require('fs');
var rimraf = require("rimraf");


var client  = arDrone.createClient();
client.config('general:navdata_demo', 'FALSE');

let server = require('http').Server();
let io = require('socket.io')(server);
server.listen(3000);

var videoStream = arDrone.createClient().getVideoStream();

io.on('connection', function(socket) {
    var data = {};
    
    videoStream
        .on('error', console.log)
        .on('data', function(videoBuffer) {
            console.log(" videoBuffer ", videoBuffer);
        });
});