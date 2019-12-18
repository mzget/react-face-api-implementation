import React from "react";
import * as faceapi from "face-api.js";
import $ from "jquery";

let forwardTimes: number[] = [];
export function FaceDetection() {
  const SSD_MOBILENETV1 = "ssd_mobilenetv1";
  const TINY_FACE_DETECTOR = "tiny_face_detector";
  let selectedFaceDetector = TINY_FACE_DETECTOR;
  // ssd_mobilenetv1 options
  let minConfidence = 0.5;
  // tiny_face_detector options
  let inputSize = 512;
  let scoreThreshold = 0.5;

  const getCurrentFaceDetectionNet = React.useCallback(() => {
    if (selectedFaceDetector === SSD_MOBILENETV1) {
      return faceapi.nets.ssdMobilenetv1;
    }
    if (selectedFaceDetector === TINY_FACE_DETECTOR) {
      return faceapi.nets.tinyFaceDetector;
    }
  }, [selectedFaceDetector]);

  const isFaceDetectionModelLoaded = React.useCallback(() => {
    const fdn = getCurrentFaceDetectionNet();
    let loaded = !!fdn?.params;
    return loaded;
  }, [getCurrentFaceDetectionNet]);

  const getFaceDetectorOptions = React.useCallback(() => {
    return selectedFaceDetector === SSD_MOBILENETV1
      ? new faceapi.SsdMobilenetv1Options({ minConfidence })
      : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
  }, [inputSize, minConfidence, scoreThreshold, selectedFaceDetector]);

  const updateTimeStats = React.useCallback((timeInMs: number) => {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
    const avgTimeInMs =
      forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
    $("#time").val(`${Math.round(avgTimeInMs)} ms`);
    $("#fps").val(`${faceapi.utils.round(1000 / avgTimeInMs)}`);
  }, []);

  const onPlay = React.useCallback(async () => {
    const videoEl = $("#inputVideo").get(0) as HTMLVideoElement;

    if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
      return setTimeout(() => onPlay());

    const options = getFaceDetectorOptions();

    const ts = Date.now();

    const result = await faceapi.detectSingleFace(videoEl, options);
    updateTimeStats(Date.now() - ts);

    if (result) {
      const canvas = $("#overlay").get(0) as HTMLCanvasElement;
      const dims = faceapi.matchDimensions(canvas, videoEl, true);
      faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims));
    }

    setTimeout(() => onPlay());
  }, [getFaceDetectorOptions, isFaceDetectionModelLoaded, updateTimeStats]);

  async function initFaceDetectionControls() {
    // const faceDetectorSelect = $("#selectFaceDetector");
    // faceDetectorSelect.val(selectedFaceDetector);
    // faceDetectorSelect.on("change", onSelectedFaceDetectorChanged);
    // faceDetectorSelect.material_select();
    // const inputSizeSelect = $("#inputSize");
    // inputSizeSelect.val(inputSize);
    // inputSizeSelect.on("change", onInputSizeChanged);
    // inputSizeSelect.material_select();

    await getCurrentFaceDetectionNet()?.loadFromUri("/weights");
  }
  async function run() {
    // try to access users webcam and stream the images
    // to the video element
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { min: 640 } }
    });
    const videoEl = $("#inputVideo").get(0) as HTMLVideoElement;
    videoEl.srcObject = stream;
  }

  React.useEffect(() => {
    console.log("init");
    initFaceDetectionControls();
    run();
  });

  return (
    <div style={{ position: "relative", maxWidth: "640px" }}>
      <video
        onLoadedMetadata={onPlay}
        id="inputVideo"
        autoPlay
        muted
        playsInline
      ></video>
      <canvas id="overlay" style={{ position: "absolute", top: 0, left: 0 }} />
      <div id="fps_meter" style={{ marginTop: 20 }}>
        <div>
          <label>Time:</label>
          <input disabled value="-" id="time" type="text" />
          <label>Estimated Fps:</label>
          <input disabled value="-" id="fps" type="text" />
        </div>
      </div>
    </div>
  );
}
