import React from "react";

function EcranChargement() {
  return (
    <div className="ecran-chargement">
      <img src="/assets/logo.jpeg" alt="Logo AquaSense" className="logo-chargement" />
      <div className="titre-chargement">AquaSense IA</div>
      <div className="sous-titre-chargement">Surveillance intelligente de la qualité de l'eau</div>
      <div className="spinner-chargement">
        <div className="spinner-roue" />
      </div>
    </div>
  );
}

export default EcranChargement; 