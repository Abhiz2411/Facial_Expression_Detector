// const deepai = require('deepai');
deepai.setApiKey('quickstart-QUdJIGlzIGNvbWluZy4uLi4K');
const video = document.getElementById("video");
const isScreenSmall = window.matchMedia("(max-width: 700px)");
const stbt = document.getElementById("Start");
let image_data_url;
var audio = document.getElementById("myAudio");

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
/****Loading the model ****/
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo());

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => (video.srcObject = stream),
        err => console.error(err)
    );
}

/****Fixing the video with based on size size  ****/
function screenResize(isScreenSmall) {
    if (isScreenSmall.matches) {
        video.style.width = "320px";
    } else {
        video.style.width = "500px";
    }
}

screenResize(isScreenSmall);
isScreenSmall.addListener(screenResize);

function takeASnap() {
    const canvas = document.createElement('canvas'); // create a canvas
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    image_data_url = canvas.toDataURL('image/jpeg');
    document.getElementById('cartoon').src=image_data_url;
    (async function () {
        var resp = await deepai.callStandardApi("toonify", {
            image: image_data_url,
        });
        console.log(resp);
    })()
}

// setInterval(takeASnap,10000);
/****Event Listeiner for the video****/
video.addEventListener("playing", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    let container = document.querySelector(".container");
    container.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        /****Drawing the detection box and landmarkes on canvas****/
        // faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        /****Setting values to the DOM****/
        if (resizedDetections && Object.keys(resizedDetections).length > 0) {
            const expressions = resizedDetections.expressions;
            const maxValue = Math.max(...Object.values(expressions));
            const emotion = Object.keys(expressions).filter(
                item => expressions[item] === maxValue
            );
            document.getElementById("emotion").innerText = `Emotion - ${emotion[0]}`;
            console.log(emotion[0]);
            // audio.pause();
            if(emotion[0]==="happy")
            {
                document.getElementById("cartoon").src='/img/happy.png';
                audio.src="/sound/happy.mp3"
                audio.play();
            }
            else if(emotion[0]==="disgusted")
            {
                document.getElementById("cartoon").src='/img/disgust.png';
                audio.src="/sound/sad.mp3"
                audio.play();
            }
            else if(emotion[0]==="fearful")
            {
                document.getElementById("cartoon").src='/img/nerd.png';
                audio.src="/sound/spin.mp3"
                audio.play();
            }
            else if(emotion[0]==="neutral")
            {
                document.getElementById("cartoon").src='/img/neutral.png';

            }
            else if(emotion[0]==="angry")
            {
                document.getElementById("cartoon").src='/img/angry.png';
                audio.src="/sound/scream.mp3"
                audio.play();
            }
            else if(emotion[0]==="sad")
            {
                document.getElementById("cartoon").src='/img/sad.png';
                audio.src="/sound/sad.mp3"
                audio.play();
            }
            else if(emotion[0]==="surprised")
            {
                document.getElementById("cartoon").src='/img/shocked.png';
                audio.src="/sound/surprise.mp3"
                audio.play();
            }  
            }
    }, 1000);
});