import { useEffect, useRef } from "react";
import * as cv from "opencv.js";
const Capture = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const captureVideo = () => {
      const video = videoRef.current;
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
      });
    };
    captureVideo();
  }, []);

  const processFrame = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Aquí puedes procesar la imagen para detectar números
    // Por ejemplo, umbralizarla
    cv.threshold(gray, gray, 120, 255, cv.THRESH_BINARY);

    // Supón que detectaste un número aquí
    const detectedNumber = "123"; // Reemplázalo por el número real detectado
    saveNumber(detectedNumber);

    src.delete();
    gray.delete();
  };

  const saveNumber = (number) => {
    const data = { number };
    const jsonData = JSON.stringify(data);
    localStorage.setItem("numberData", jsonData);
    console.log("Número guardado:", jsonData);
  };
  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      <button onClick={processFrame}>Procesar y Guardar Número</button>
    </div>
  );
};

export default Capture;
