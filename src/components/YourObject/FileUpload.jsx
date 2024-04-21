import React, { useState } from 'react';
import NoObjectPreview from './NoObjectPreview.jsx'

const FileUpload = ({ onFileChange }) => {
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file);
    setFileUploaded(true);
  };

  const handleClearFile = () => {
    setFileUploaded(false);
    onFileChange(null);
    window.location.reload();
  };

  return (
    <div>
      {!fileUploaded && (
        <>
          <input type="file" accept=".glb,.gltf" onChange={handleFileChange} />
          <NoObjectPreview />
        </>
      )}
      {fileUploaded && (
        <button className="upload-button" onClick={handleClearFile}>Clear Workspace</button>
      )}
    </div>
  );
};

export default FileUpload;
