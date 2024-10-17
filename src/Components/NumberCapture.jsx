// NumberCapture.jsx
import React, { useEffect, useRef } from "react";
import Tesseract from 'tesseract.js';

const NumberCapture = () => {
    const videoRef = useRef(null);

    useEffect(() => {
      const captureVideo = () => {
        const video = videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            video.srcObject = stream;
          })
          .catch((err) => console.error("Error al acceder a la cámara: ", err));
      };
      captureVideo();
    }, []);
  
    const processFrame = () => {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Asegúrate de que OpenCV está disponible en el contexto global como "cv"
      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  
      // Aplicar umbralización para binarizar la imagen
      cv.threshold(gray, gray, 120, 255, cv.THRESH_BINARY);
  
      // Pasar la imagen procesada a Tesseract.js para extraer el número
      extractTextFromImage(canvas);
  
      // Liberar memoria
      src.delete();
      gray.delete();
    };
  
    const extractTextFromImage = (image) => {
      Tesseract.recognize(
        image,
        'eng',
        { logger: m => console.log(m) } // Progreso del OCR
      ).then(({ data: { text } }) => {
        console.log('Número detectado:', text.trim());
        saveNumber(text.trim());
      });
    };
  
    const saveNumber = (number) => {
      const data = { number };
      const jsonData = JSON.stringify(data);
      localStorage.setItem('numberData', jsonData);
      console.log('Número guardado:', jsonData);
    };
  

  return (
   <>
   <div>
      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }}></video>
      <button onClick={processFrame}>Procesar y Guardar Número</button>
    </div>
   </>
  );
};

export default NumberCapture;
