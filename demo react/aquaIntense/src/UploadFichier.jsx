import React, { useRef, useState } from "react";
import "./upload-uiverse.css";

function UploadFichier({ onFileChange }) {
  const inputRef = useRef();
  const [nomFichier, setNomFichier] = useState("Aucun fichier sélectionné");

  const handleChange = (e) => {
    const file = e.target.files[0];
    setNomFichier(file ? file.name : "Aucun fichier sélectionné");
    if (onFileChange) onFileChange(e);
  };

  // Permet d'ouvrir le sélecteur de fichier en cliquant n'importe où sur le composant
  const handleContainerClick = (e) => {
    // On évite de déclencher deux fois si on clique sur l'input
    if (e.target.id !== 'file') {
      inputRef.current.click();
    }
  };

  return (
    <div className="container" onClick={handleContainerClick} style={{cursor: 'pointer'}}>
      <div className="header">
        <svg viewBox="0 0 24 24" fill="none"><path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <p>Browse File to upload!</p>
      </div>
      <label htmlFor="file" className="footer" style={{pointerEvents: 'none'}}>
        <svg fill="#000000" viewBox="0 0 32 32"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></svg>
        <p>{nomFichier}</p>
        <svg viewBox="0 0 24 24" fill="none"><path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000" strokeWidth="2"></path><path d="M19.5 5H4.5" stroke="#000" strokeWidth="2" strokeLinecap="round"></path><path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000" strokeWidth="2"></path></svg>
      </label>
      <input id="file" type="file" ref={inputRef} onChange={handleChange} style={{display: 'none'}} />
    </div>
  );
}

export default UploadFichier; 