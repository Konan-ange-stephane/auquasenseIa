import React from "react";

function BarreLaterale({ modeSombre, toggleModeSombre, afficherDashboard, setAfficherDashboard, choixDemo, gererChangementDemo, refInputFichier, gererChangementFichier }) {
  return (
    <div className="barre-laterale">
      <img src="/assets/logo.jpeg" alt="Logo" />
      <button className="btn-mode-sombre" onClick={toggleModeSombre}>
        {modeSombre ? '☀️ Mode clair' : '🌙 Mode sombre'}
      </button>
      <button className="btn-dashboard" onClick={() => setAfficherDashboard(v => !v)}>
        {afficherDashboard ? '← Retour' : '📊 Tableau de bord'}
      </button>
      <h2>🔧 Options</h2>
      <label>
        📷 Choisir une image de démonstration
        <select value={choixDemo} onChange={gererChangementDemo}>
          {Object.keys(choixDemo ? { [choixDemo]: null } : {}).map((cle) => (
            <option key={cle} value={cle}>{cle}</option>
          ))}
        </select>
      </label>
      <label>
        📁 Importer une image
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={refInputFichier}
          onChange={gererChangementFichier}
        />
      </label>
    </div>
  );
}

export default BarreLaterale; 