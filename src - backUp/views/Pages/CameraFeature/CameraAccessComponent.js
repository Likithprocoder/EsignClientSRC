import React, { useState, useEffect,useRef } from "react";
import Webcam from 'react-webcam';
import { FaCameraRotate } from 'react-icons/fa6';


function CameraAccessComponent() {
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [captureData, setCaptureData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [facingMode, setFacingMode] = useState('user');

  useEffect(() => {
    // Detect if the device is mobile based on the user agent string
    const checkIsMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


    setIsMobile(checkIsMobile);
    // alert("isMobile: " + checkIsMobile)
  }, []);

  const handleSwitchCamera = (e) => {
    e.preventDefault();
    // Toggle between 'user' and 'environment' for front and rear view camera respectively
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
  };

  return (
    <div>
      <h1>Camera Access Example in React</h1>

      {isMobile ? (
        <div>
          <FaCameraRotate onClick={(e) => handleSwitchCamera(e)} style={{ marginBottom: "2%", fontSize: "200%", color: "#007bff" }} />

        </div>
      ) : (
        <></>
      )}
      <Webcam videoConstraints={{
        facingMode: facingMode,
        autoFocus: true, // Use the autofocus state
      }}
        screenshotFormat="image/png" screenshotQuality={1} ref={navigator.mediaDevices.getUserMedia({ video: true })} className="Webcam" >
        {({ getScreenshot }) => (
          <button type="button" class="btn btn-success rounded-pill"
            style={{ marginTop: "2%" }}
            onClick={(e) => {
              e.preventDefault();
              // Check if getScreenshot is available
              if (getScreenshot) {
                const imageSrc = getScreenshot();
                setCapturedImage(imageSrc);
              } else {
                console.error("getScreenshot is not available.");
              }
            }}
          >
            Capture
          </button>
        )}



      </Webcam>
      <br></br>
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}

    </div>
  )
}
export default CameraAccessComponent;