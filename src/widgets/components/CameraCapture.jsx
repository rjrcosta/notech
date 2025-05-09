// import React, { useState } from "react";
// import Camera from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';

// export default function CameraCapture({ fieldId }) {
//     console.log('in camera file', fieldId)

//     const [dataUri, setDataUri] = useState('');
//     const [images, setImages] = useState([]);
//     const [uploading, setUploading] = useState(false);

//     const handleCapture = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         try {
//             console.log('Hello')

//             setDataUri(dataUri);
            
//             // Get location
//             navigator.geolocation.getCurrentPosition(async (pos) => {
//                 const { latitude, longitude } = pos.coords;

//                 const formData = new FormData();
//                 formData.append("images", file);
//                 formData.append("data[0][latitude]", latitude);
//                 formData.append("data[0][longitude]", longitude);
//                 formData.append("data[0][field_id]", fieldId);

//                 setUploading(true);
//                 await fetch("http://localhost:5000/photos/upload", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 setUploading(false);

//                 const confirmMore = window.confirm("Image uploaded. Take another?");
//                 if (confirmMore) {
//                     document.getElementById("cameraInput").click();
//                 } else {
//                     alert("All photos uploaded!");
//                 }
//             });
//         } catch (err) {
//             alert("Could not upload image: " + err.message);
//         }
//     };

//     return (

//         <Camera
//             onTakePhoto={(dataUri) => { handleCapture(dataUri); }}
//         />

//         // <div className="flex flex-col items-center gap-4">
//         //   <input
//         //     id="cameraInput"
//         //     type="file"
//         //     accept="image/*"
//         //     capture="environment"
//         //     style={{ display: "none" }}
//         //     onChange={handleCapture}
//         //   />
//         //   <button
//         //     className="px-4 py-2 bg-blue-600 text-white rounded"
//         //     onClick={() => document.getElementById("cameraInput").click()}
//         //     disabled={uploading}
//         //   >
//         //     {uploading ? "Uploading..." : "Take Photo"}
//         //   </button>
//         // </div>
//     );
// }


import React, { useState } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export default function CameraCapture({ fieldId }) {
    console.log('in camera file', fieldId)

    const [dataUri, setDataUri] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    function handleTakePhoto (dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
      }
    
      function handleTakePhotoAnimationDone (dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
      }
    
      function handleCameraError (error) {
        console.log('handleCameraError', error);
      }
    
      function handleCameraStart (stream) {
        console.log('handleCameraStart');
      }
    
      function handleCameraStop () {
        console.log('handleCameraStop');
      }
    
      return (
        <Camera
          onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
          onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
          onCameraError = { (error) => { handleCameraError(error); } }
          idealFacingMode = {FACING_MODES.ENVIRONMENT}
          idealResolution = {{width: 640, height: 480}}
          imageType = {IMAGE_TYPES.JPG}
          imageCompression = {0.97}
          isMaxResolution = {true}
          isImageMirror = {false}
          isSilentMode = {false}
          isDisplayStartCameraError = {true}
          isFullscreen = {false}
          sizeFactor = {1}
          onCameraStart = { (stream) => { handleCameraStart(stream); } }
          onCameraStop = { () => { handleCameraStop(); } }
        />
      );
  

     
}
