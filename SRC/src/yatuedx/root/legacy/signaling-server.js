/**************/
/*** CONFIG ***/
/**************/
var PORT = 8080;


/**************/
/*** SQL ***/
/**************/
const config = {
    user: 'sa',
    password: 'baVnms2er83wy',
    server: '8.135.100.85',
    database: 'YatuEdu',
}

/**************/
/*** redis ***/
/**************/
const redisConfig = {
    "host": "localhost",
    "password": "xTEkhnoWk4WcVUVG",
    "port": 6003
}

/*************/
/*** SETUP ***/
/*************/
const { promisify } = require("util");

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser')
var main = express()
var server = http.createServer(main)
var io  = require('socket.io')(server);
//io.set('log level', 2);

const redis = require("redis");
const redisClient = redis.createClient(redisConfig);
var redisGet = promisify(redisClient.get).bind(redisClient);

const sql = require('mssql');
const poolPromise = sql.connect(config);

redisClient.on("error", function(error) {
    console.error(error);
});

server.listen(PORT, null, function() {
    console.log("Listening on port " + PORT);
});
//main.use(express.bodyParser());

//main.get('/', function(req, res){ res.sendFile(__dirname + '/client.html'); });
main.get('/client.html', function(req, res){ res.sendFile(__dirname + '/client.html'); });
main.get('/group.html', function(req, res){ res.sendFile(__dirname + '/group.html'); });



/*************************/
/*** INTERESTING STUFF ***/
/*************************/
var channels = {};
var sockets = {};

/**
 * Users will connect to the signaling server, after which they'll issue a "join"
 * to join a particular channel. The signaling server keeps track of all sockets
 * who are in a channel, and on join will send out 'addPeer' events to each pair
 * of users in a channel. When clients receive the 'addPeer' even they'll begin
 * setting up an RTCPeerConnection with one another. During this process they'll
 * need to relay ICECandidate information to one another, as well as SessionDescription
 * information. After all of that happens, they'll finally be able to complete
 * the peer connection and will be streaming audio/video between eachother.
 */
io.sockets.on('connection', function (socket) {

    // connect handle
    var token = socket.handshake.query.token;
    console.log('token: ', token);
    if (!token) {
        socket.on('event', data => {});
        socket.on('disconnect', () => {});
        socket.emit('message', '请先登录');
        return;
    }

    redisGet(token).then(r => {
        if (r == null)
            throw 'no token found';
        return r;
    }).then(secToken => {
        socket.secToken = JSON.parse(secToken).id;
		console.log('secToken.id ', JSON.parse(secToken).id);
        //socket.secToken = '17812FFCE3D72468094A6C1AF58E6847F79E0801';

        socket.channels = {};


        console.log("["+ socket.id + "] connection accepted");

        socket.on('disconnect', function () {
            for (var channel in socket.channels) {
                part(socket, channel);
            }
            console.log("["+ socket.id + "] disconnected");
            delete sockets[socket.id];
        });

        socket.on('join', (data, cb) => {
            join(socket, data).then(
                () => {
                    sockets[socket.id] = socket;
                    if (cb) cb(replyMessage(0, 'joined'))
                }
            );
        });

        socket.on('part', (data, cb) => {
            part(socket, data).then(
                () => {
                    if(cb) cb(replyMessage(0, 'parted'))
                }
            );
        });

        socket.on('relayICECandidate', data => {relayICECandidate(socket, data)});

        socket.on('relaySessionDescription', data => {relaySessionDescription(socket, data)});

        socket.on('txtMsg', data => {
            txtMsg(socket, data);
        });

    }).catch(err => {
        console.log(err);
        socket.emit('message', err);
    });

});

function join(socket, config) {
    console.log("["+ socket.id + "] join ", config, "secToken: ", socket.secToken);
    var channel = config.channel;
    var userdata = config.userdata;

    return poolPromise.then(pool => {
        return pool.request()
            .input('usertToken', socket.secToken)
            .input('groupName', channel)
            .execute('app_chat_start_video_conf_now_MS');
    }).then(result => {
        console.dir(result)
        var rows = result.recordset;
        var errCode = rows[0].err_code;
        if (errCode != undefined && errCode != null && errCode != 0) {
            var errMsg = rows[0].err_msg;
            socket.emit('message', errMsg);
            return;
        }
        var sid = rows[0].session_id;
        socket.sid = sid;

        if (channel in socket.channels) {
            console.log("["+ socket.id + "] ERROR: already joined ", channel);
            return;
        }

        if (!(channel in channels)) {
            channels[channel] = {};
            channels[channel].users = {};
            channels[channel].connections = {};
        }

        for (id in channels[channel].connections) {
            channels[channel].connections[id].emit('addPeer', {'peer_id': socket.id, 'should_create_offer': false});
            socket.emit('addPeer', {'peer_id': id, 'should_create_offer': true});
        }

        channels[channel].connections[socket.id] = socket;
        channels[channel].users[socket.secToken] = socket.id;
        socket.channels[channel] = channel;

    });
}

function part(socket, channel) {
    console.log("["+ socket.id + "] part ");

    if (!(channel in socket.channels)) {
        console.log("["+ socket.id + "] ERROR: not in ", channel);
        return;
    }

    delete socket.channels[channel];
    delete channels[channel].connections[socket.id];
    delete channels[channel].users[socket.secToken];

    for (id in channels[channel].connections) {
        channels[channel].connections[id].emit('removePeer', {'peer_id': socket.id});
        socket.emit('removePeer', {'peer_id': id});
    }

    if ( Object.keys(channels[channel].connections).length == 0) {
        delete channels[channel];
    }
    delete sockets[socket.id];

    return poolPromise.then(pool => {
        return pool.request()
            .input('usertToken', socket.secToken)
            .input('sessionId', socket.sid)
            .execute('app_chat_leave_video_conf_now_MS');
    }).then(result => {
        console.dir(result)
        var rows = result.recordset;
        var errCode = rows[0].err_code;
        if (errCode != undefined && errCode != null && errCode != 0) {
            var errMsg = rows[0].err_msg;
            return;
        }
    });
}

function relayICECandidate(socket, config) {
    var peer_id = config.peer_id;
    var ice_candidate = config.ice_candidate;
    console.log("["+ socket.id + "] relaying ICE candidate to [" + peer_id + "] ", ice_candidate);

    if (peer_id in sockets) {
        sockets[peer_id].emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
    }
}

function relaySessionDescription(socket, config) {
    var peer_id = config.peer_id;
    var session_description = config.session_description;
    console.log("["+ socket.id + "] relaying session description to [" + peer_id + "] ", session_description);

    if (peer_id in sockets) {
        sockets[peer_id].emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
    }
}

function txtMsg(socket, data) {
    var socket_id = socket.id;
    var channels = socket.channels;
	for(var i in sockets) {
        sockets[i].emit('txtMsg', socket.id + ": " + data);
    }
}

main.use(bodyParser.json());
main.post('/myGroupGet', function (req, res) {
    var token = req.body.token;

    // token 转 secToken
    redisGet(token).then(r => {
        if (r == null)
            throw 'no token found';
        return r;
    }).then(secToken => {
        return poolPromise.then(pool => {
            return pool.request()
                .input('usertToken', secToken)
                .execute('app_chat_my_group_get_MS');
        });
    }).then(result => {
        console.dir(result)
        var rows = result.recordset;
        var errCode = rows[0].err_code;
        if (errCode != undefined && errCode != null && errCode != 0) {
            var errMsg = rows[0].err_msg;
            res.send(replyMessage(errCode, errMsg));
            return;
        }
        res.send(replyMessage(0, '', rows));
    }).catch(err => {
        console.log(err);
        res.send(replyMessage(-1, err, null));
    });

})

function replyMessage(code, msg, data) {
    return {"result": {"code": code, "msg": msg}, "data": data};
}

/**
 * test
 */
var test = false;

if(test) {
    var assert = require("assert");

    var signaling_socket = require('socket.io-client')('http://localhost:8080', {transports: ['websocket'], query:"token=2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"});

    signaling_socket.on('connect', function(){
        console.log('connect');
        signaling_socket.emit('join', {"channel": 'yatu', "userdata": {}}, res => {
            console.log('respond data:', res);
            assert(signaling_socket.id in sockets);
            assert('yatu' in channels);
            assert(signaling_socket.id in channels['yatu'].connections);
            var secToken = channels['yatu'].connections[signaling_socket.id].secToken;
            assert(secToken in channels['yatu'].users);

            signaling_socket.emit('part', 'yatu', res => {
                assert(!(signaling_socket.id in sockets));
                assert(!('yatu' in channels));
                assert(Object.keys(channels).length==0);
            });
        });
    });
    signaling_socket.on('event', function(data){
        console.log('event: ', data)
    });
    signaling_socket.on('message', function(data){
        console.log('message', data)
    });
    signaling_socket.on('disconnect', function(){
        console.log('disconnect')
    });
}
