<html>
<head>
    <title>
        Drone monitoring
    </title>

    <link rel="stylesheet" href="/css/bootstrap.min.css">

    <style>




        .room {
            border: 1px solid green;


        }
    </style>
</head>

<body>
<div class="container" id="app">
    <div class="row" style="padding: 22px;">
        <div class="col-md-6 room"  >
            This is the map
        </div>

        <div class="col-md-6 room">
            Camera
            <img :src="video_png" />
        </div>
        <div class="col-md-6 room"  >
                    <pre>
                        @{{ navData }}
                    </pre>
        </div>

        <div class="col-md-6 room">
            <br><br>

            <button class="btn btn-info" v-on:click=greet("fly") > Fly</button>
            <button class="btn btn-danger" v-on:click=greet("land") > Land</button>

            <hr>

            <div class="container">
                <div class="col-md-6">

                </div>

            </div>


            <button class="btn btn-success" v-on:click=greet("up")> up</button>
            <button class="btn btn-success" v-on:click=greet("left")> left</button>
            <button class="btn btn-success" v-on:click=greet("right")>right</button>
            <button class="btn btn-success" v-on:click=greet("down")> down</button>
            <bbutton class="btn btn-success" v-on:click=greet("front")> forward</bbutton>
            <bbutton class="btn btn-success" v-on:click=greet("back")> backward</bbutton>

            <hr>

            <button class="btn btn-success" v-on:click=greet("topvideo")>top video</button>
            <button class="btn btn-success" v-on:click=greet("bottomvideo")>bottom video</button>


            <!-- <button class="btn btn-success" v-on:click=greet("top video")> Top Video</button>  -->
            <!-- <button class="btn btn-success" v-on:click=greet("bottom video")> Bottom Video</button> -->
        </div>
    </div>
</div>

<script src="/js/bootstrap.min.js"></script>
<script src="/js/vue.js"></script>
<script src="/js/socket.io.js"></script>

<script>
    var socket = io.connect('http://192.168.1.2:3000');

    var app = new Vue({
        el: '#app',
        data: {
            navData: {},
            video_png:'img/frame.png',
        },

        mounted() {
            let _this = this;

            // mao ni ang ga accept sa server activity, katong gi pasa gikan sa socket io code: socket.emit('chanel.drone-nav-data', data);
            socket.on('chanel.drone-image-frame', function (data) {
                // gi pasa ang image path to a variable
                _this.video_png = '/drone/img/frame-' + data.frameCounter + '.png';

                _this.navData = data.navData;

                // console.log(data.navdata);

                // force update client side para ma update ang ui sa website or mobile
                _this.$forceUpdate();
            });
        },

        methods: {
            greet: function(action) {

                let isFly = false;

                // console.log("|te" + control);
                let control = {
                    'action' : action
                }

                if(action == 'fly') {
                    isFly = confirm("ARE YOU SURE, YOU WANT TO FLY THIS DRONE?");

                    if(isFly) {
                        socket.emit('chanel.drone-control', control);
                    }
                } else {
                    // alert(" send socket");
                    socket.emit('chanel.drone-control', control);
                }
            }
        }
    });
</script>
</body>
</html>