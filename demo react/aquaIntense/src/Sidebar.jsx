import React from "react";
import UploadFichier from "./UploadFichier";

function BarreLaterale({ modeSombre, toggleModeSombre, afficherDashboard, setAfficherDashboard, gererChangementFichier }) {
  return (
    <div className="barre-laterale">
      <img src="/assets/logo.jpeg" alt="Logo" />
      <button className="btn-mode-sombre" onClick={toggleModeSombre}>
        {modeSombre ? '☀️ Mode clair' : '🌙 Mode sombre'}
      </button>
      <button className="btn-dashboard" onClick={() => setAfficherDashboard(v => !v)}>
        {afficherDashboard ? '← Retour' : '📊 Tableau de bord'}
      </button>
      <div style={{marginTop: 16}}>
        <UploadFichier onFileChange={gererChangementFichier} />
      </div>
    </div>
  );
}

export default BarreLaterale; 