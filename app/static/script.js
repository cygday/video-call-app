const socket = io();

let localStream;
let peerConnection;

const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    document.getElementById("localVideo").srcObject = localStream;

    peerConnection = new RTCPeerConnection(config);

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = event => {
        document.getElementById("remoteVideo").srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("ice-candidate", event.candidate);
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("offer", offer);
}

socket.on("offer", async (offer) => {
    peerConnection = new RTCPeerConnection(config);

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = event => {
        document.getElementById("remoteVideo").srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("ice-candidate", event.candidate);
        }
    };

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answer", answer);
});

socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(answer);
});

socket.on("ice-candidate", async (candidate) => {
    if (peerConnection) {
        await peerConnection.addIceCandidate(candidate);
    }
});
