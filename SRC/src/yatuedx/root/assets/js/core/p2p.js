import {sysConstants, languageConstants} from '../core/sysConst.js'
import {credMan} from '../core/credential.js'
import {uiMan} from '../core/uiManager.js';

/**
	This class manages both login and sigup workflow
**/
class PeerTalk {
	#DEFAULT_CHANNEL;
	#credMan;
	#userName;
	#signaling_socket;
	#local_media_stream;
	#local_current_stream;
	#peer_media_elements;
	#local_media_tag;
	#local_audio_track;
	#local_video_track;
	#peers;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.init();
	}
	
	join_chat_channel(channel, userdata) {
		this.#signaling_socket.emit('join', {"channel": channel, "userdata": userdata}, res => {});
	}
	
	part_chat_channel(channel) {
		this.#signaling_socket.emit('part', channel);
	}
	
	/** 
		* When we join a group, our signaling server will send out 'addPeer' events to each pair
		* of users in the group (creating a fully-connected graph of users, ie if there are 6 people
		* in the channel you will connect directly to the other 5, so there will be a total of 15 
		* connections in the network). 
	*/
	onAddPeer(config) {
		const 
		= this;
		
		console.log('Signaling server said to add peer:', config);
		const peer_id = config.peer_id;
		if (peer_id in peers) {
			/* This could happen if the user joins multiple channels where the other peer is also in. */
			console.log("Already connected to peer ", peer_id);
			return;
		}
		const peer_connection = new RTCPeerConnection(
			{"iceServers": ICE_SERVERS},
			{"optional": [{"DtlsSrtpKeyAgreement": true}]} /* this will no longer be needed by chrome
															* eventually (supposedly), but is necessary 
															* for now to get firefox to talk to chrome */
		);
		peers[peer_id] = peer_connection;

		peer_connection.onicecandidate = function(event) {
			if (event.candidate) {
				signaling_socket.emit('relayICECandidate', {
					'peer_id': peer_id, 
					'ice_candidate': {
						'sdpMLineIndex': event.candidate.sdpMLineIndex,
						'candidate': event.candidate.candidate
					}
				});
			}
		}
		peer_connection.onaddstream = function(event) {
			console.log("onAddStream", event);
			var remote_media = document.getElementById(peer_id);
			if (remote_media == null) {
				remote_media = USE_VIDEO ? $("<video id='"+peer_id+"' autoplay playsinline>") : $("<audio>");
				remote_media.attr("autoplay", "autoplay");
				if (MUTE_AUDIO_BY_DEFAULT) {
					remote_media.attr("muted", "true");
				}
				remote_media.attr("controls", "");
				var remote_media_box = $("<div class='mediaBox'>");
				remote_media_box.append(remote_media);
				peer_media_elements[peer_id] = remote_media_box;
				$('body').append(remote_media_box);
				attachMediaStream(remote_media[0], event.stream);
			} else {
				attachMediaStream(remote_media, event.stream);
			}

		}

		/* Add our local stream */
		peer_connection.addStream(local_current_stream);

		/* Only one side of the peer connection should create the
		 * offer, the signaling server picks one to be the offerer. 
		 * The other user will get a 'sessionDescription' event and will
		 * create an offer, then send back an answer 'sessionDescription' to us
		 */
		if (config.should_create_offer) {
			console.log("Creating RTC offer to ", peer_id);
			peer_connection.createOffer(
				function (local_description) { 
					console.log("Local offer description is: ", local_description);
					peer_connection.setLocalDescription(local_description,
						function() { 
							signaling_socket.emit('relaySessionDescription', 
								{'peer_id': peer_id, 'session_description': local_description});
							console.log("Offer setLocalDescription succeeded", peer_id); 
						},
						function() { Alert("Offer setLocalDescription failed!"); }
					);
				},
				function (error) {
					console.log("Error sending offer: ", error);
				});
		}
	}

	init() {
		console.log("Connecting to signaling server");
        const token = localStorage.getItem("token");
		console.log('token ', token);

		 /* our socket.io connection to our webserver */
		this.#signaling_socket = io(SIGNALING_SERVER, {query:`token=${token}`});
		
		var local_media_stream = null; /* our own microphone / webcam */
		var local_current_stream = null; // 本地当前展示的视频流 摄像头或共享屏幕
        this.#peers = {};                /* keep track of our peer connections, indexed by peer_id (aka socket.io id) */
        this.#peer_media_elements = {};  /* keep track of our <video>/<audio> tags, indexed by peer_id */
            var local_media_tag = null;
            var local_audio_track = null;  // 本地录音音轨
            var local_video_track = null; // 本地录像视频轨
		// Polyfill in Firefox.
		// See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
		if (adapter.browserDetails.browser == 'firefox') {
			  adapter.browserShim.shimGetDisplayMedia(window, 'screen');
		}
             
        const url = decodeURI(window.location.href);
        const argsIndex = url .split("?group=");
        const group = argsIndex[1];
		if (group == null) {
			alert('参数错误，请重新进入');
			return;
		}
		console.log('group ', group);

        this.#DEFAULT_CHANNEL = group;
		
		const self t= this;
		this.#signaling_socket.on('connect', function() {
			console.log("Connected to signaling server");
			setup_local_media(function() {
				/* once the user has given us access to their
				 * microphone/camcorder, join the channel and start peering up */
				join_chat_channel(self.#DEFAULT_CHANNEL, {'whatever-you-want-here': 'stuff'});
			});
		});
                
		this.#signaling_socket.on('disconnect', function() {
			console.log("Disconnected from signaling server");
			/* Tear down all of our peer connections and remove all the
			 * media divs when we disconnect */
			for (peer_id in self.#peer_media_elements) {
				self.#peer_media_elements[peer_id].remove();
			}
			for (peer_id in self.#peers) {
				self.#peers[peer_id].close();
			}

			self.#peers = [];
			self.#peer_media_elements = [];
		});
		
		// handling peer joining the group
		signaling_socket.on('addPeer', this.onAddPeer.bind(this));

		
                /** 
                 * Peers exchange session descriptions which contains information
                 * about their audio / video settings and that sort of stuff. First
                 * the 'offerer' sends a description to the 'answerer' (with type
                 * "offer"), then the answerer sends one back (with type "answer").  
                 */
                signaling_socket.on('sessionDescription', function(config) {
                    console.log('Remote description received: ', config);
                    var peer_id = config.peer_id;
                    var peer = peers[peer_id];
                    var remote_description = config.session_description;
                    console.log(config.session_description);

                    var desc = new RTCSessionDescription(remote_description);
                    var stuff = peer.setRemoteDescription(desc, 
                        function() {
                            console.log("setRemoteDescription succeeded");
                            if (remote_description.type == "offer") {
                                console.log("Creating answer");
                                peer.createAnswer(
                                    function(local_description) {
                                        console.log("Answer description is: ", local_description);
                                        peer.setLocalDescription(local_description,
                                            function() { 
                                                signaling_socket.emit('relaySessionDescription', 
                                                    {'peer_id': peer_id, 'session_description': local_description});
                                                console.log("Answer setLocalDescription succeeded", peer_id);
                                            },
                                            function() { Alert("Answer setLocalDescription failed!"); }
                                        );
                                    },
                                    function(error) {
                                        console.log("Error creating answer: ", error);
                                        console.log(peer);
                                    });
                            }
                        },
                        function(error) {
                            console.log("setRemoteDescription error: ", error);
                        }
                    );
                    console.log("Description Object: ", desc);

                });

                /**
                 * The offerer will send a number of ICE Candidate blobs to the answerer so they 
                 * can begin trying to find the best path to one another on the net.
                 */
                signaling_socket.on('iceCandidate', function(config) {
                    var peer = peers[config.peer_id];
                    var ice_candidate = config.ice_candidate;
                    peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
                });


                /**
                 * When a user leaves a channel (or is disconnected from the
                 * signaling server) everyone will recieve a 'removePeer' message
                 * telling them to trash the media channels they have open for those
                 * that peer. If it was this client that left a channel, they'll also
                 * receive the removePeers. If this client was disconnected, they
                 * wont receive removePeers, but rather the
                 * signaling_socket.on('disconnect') code will kick in and tear down
                 * all the peer sessions.
                 */
                signaling_socket.on('removePeer', function(config) {
                    console.log('Signaling server said to remove peer:', config);
                    var peer_id = config.peer_id;
                    if (peer_id in peer_media_elements) {
                        peer_media_elements[peer_id].remove();
                    }
                    if (peer_id in peers) {
                        peers[peer_id].close();
                    }

                    delete peers[peer_id];
                    delete peer_media_elements[config.peer_id];
                });

                signaling_socket.on('message', function (message) {
                    console.log('Signaling server said: ', message);
                    alert(message);

                });
				
                signaling_socket.on('txtMsg', function (message) {
                    console.log('txtMsg: ', message);
                   $("#textbox").val($("#textbox").val()+message+'\n');

                });				
				
            }




            /***********************/
            /** Local media stuff **/
            /***********************/
            function setup_local_media(callback, errorback) {
                if (local_media_stream != null) {  /* ie, if we've already been initialized */
                    if (callback) callback();
                    return; 
                }
                /* Ask user for permission to use the computers microphone and/or camera, 
                 * attach it to an <audio> or <video> tag if they give us access. */
                console.log("Requesting access to local audio / video inputs");

/*
                navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia
					   );
*/
                attachMediaStream = function(element, stream) {
                    console.log('DEPRECATED, attachMediaStream will soon be removed.');
                    element.srcObject = stream;
                 };

                navigator.mediaDevices.getUserMedia({"audio":USE_AUDIO, "video":USE_VIDEO}).then(
                    function(stream) { /* user accepted access to a/v */
                        console.log("Access granted to audio/video");
                        local_media_stream = stream;
                        local_current_stream = local_media_stream;
                        local_audio_track = stream.getAudioTracks()[0];
                        local_video_track = stream.getVideoTracks()[0];
                        local_media_tag = USE_VIDEO ? $("<video autoplay playsinline>") : $("<audio>");
                        //local_media.attr("autoplay", "autoplay");
                        //local_media.attr("muted", "true"); /* always mute ourselves by default */
                        local_media_tag[0].muted = "muted";
                        local_media_tag.attr("controls", "");
                        var local_media_box = $("<div class='mediaBox'>");
                        local_media_box.append(local_media_tag);
                        local_media_box.append($("<input type='checkbox' checked onchange='mutedMyVideo(this.checked)'>开启视频</input>"));
                        local_media_box.append($("<input type='checkbox' checked onchange='join(this.checked)'>上线</input>"));
                        $('body').append(local_media_box);
                        attachMediaStream(local_media_tag[0], stream);

                        if (callback) callback();
                    }).catch(
                    function(e) { /* user denied access to a/v */
                        console.log("Access denied for audio/video"+e);
                        alert("You chose not to provide access to the camera/microphone, demo will not work.");
                        alert("some error occur "+e);
                        if (errorback) errorback();
                    });
            }
            
            function mutedMyVideo(muted) {
                console.log("checked: ", muted);
                var tracks = local_media_stream.getVideoTracks();
                for(i in tracks) {
                    tracks[i].enabled = muted;
                }
            }
            
            function join(joined) {
                console.log("joined: ", joined, DEFAULT_CHANNEL);
                if (!joined) {
                    signaling_socket.emit('part', DEFAULT_CHANNEL, res => {});
                } else {
                    signaling_socket.emit('join', {"channel": DEFAULT_CHANNEL, "userdata": {'whatever-you-want-here': 'stuff'}}, res => {});
                }
            }
			
			function sendMsg() {
				var msg = $("#tosend").val();
				if (msg=='') return;
				console.log("sendMsg: ", $("#tosend").val());
				signaling_socket.emit('txtMsg', msg);
				$("#tosend").val('');
            }


        </script>
    </head>
    <body onload='init()'>
        <!-- 
        the <video> and <audio> tags are all added and removed dynamically
        in 'onAddStream', 'setup_local_media', and 'removePeer'/'disconnect'
        -->
		<div>
			<textarea id="textbox"></textarea>
			<input id='tosend'></input>
			<button onclick='sendMsg();'>发送</button>
            <button id="startShareButton" disabled>共享</button>
			</div>
    </body>


<script type="text/javascript">

    var local_shared_stream = null; // 本地屏幕共享视频流

    function handleShareSuccess(stream) {
        startShareButton.disabled = true;
        local_media_tag[0].srcObject = stream;

        // demonstrates how to detect that the user has stopped
        // sharing the screen via the browser UI.
        stream.getVideoTracks()[0].addEventListener('ended', () => {
            console.log('用户停止共享屏幕');
            startShareButton.disabled = false;
            switchStream(local_shared_stream, local_media_stream);
        });

        local_shared_stream = stream;
        local_shared_stream.addTrack(local_audio_track);
        switchStream(local_media_stream, local_shared_stream);
        //
        // local_shared_stream.addTrack(local_audio_track);
        //
        // for(var peer_id in peers) {
        //     var peer = peers[peer_id];
        //
        //     peer.removeStream(local_media_stream);
        //     peer.addStream(local_shared_stream);
        //
        //     peer.createOffer(
        //         function (local_description) {
        //             console.log("Local offer description is: ", local_description);
        //             peer.setLocalDescription(local_description,
        //                 function() {
        //                     signaling_socket.emit('relaySessionDescription',
        //                         {'peer_id': peer_id, 'session_description': local_description});
        //                     console.log("Offer setLocalDescription succeeded", peer_id);
        //                 },
        //                 function() {
        //                     Alert("Offer setLocalDescription failed!");
        //                 }
        //             );
        //         },
        //         function (error) {
        //             console.log("Error sending offer: ", error);
        //         });
        //
        // }
    }
    
    function switchStream(fromStream, toStream) {
        local_current_stream = toStream;
        local_media_tag[0].srcObject = toStream;
        for(var peer_id in peers) {
            var peer = peers[peer_id];

            peer.removeStream(fromStream);
            peer.addStream(toStream);

            peer.createOffer(
                function (local_description) {
                    console.log("Local offer description is: ", local_description);
                    peer.setLocalDescription(local_description,
                        function() {
                            this.#signaling_socket.emit('relaySessionDescription',
                                {'peer_id': peer_id, 'session_description': local_description});
                            console.log("Offer setLocalDescription succeeded", peer_id);
                        },
                        function(e) {
                         //   alert("Offer setLocalDescription failed!");
                            console.log("Offer setLocalDescription failed!", e);
                        }
                    );
                },
                function (error) {
                    console.log("Error sending offer: ", error);
                });
        }
    }

    function handleShareError(error) {
        console.log(`getDisplayMedia error: ${error.name}`, error);
    }

    const startShareButton = document.getElementById('startShareButton');
    startShareButton.addEventListener('click', () => {
        navigator.mediaDevices.getDisplayMedia({video: true})
            .then(handleShareSuccess, handleShareError);
    });

    if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
        startShareButton.disabled = false;
    } else {
    //    alert('getDisplayMedia is not supported');
    }