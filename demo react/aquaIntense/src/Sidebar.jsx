import React from "react";
import UploadFichier from "./UploadFichier";

function BarreLaterale({ modeSombre, toggleModeSombre, afficherDashboard, setAfficherDashboard, gererChangementFichier, setAfficherAlertes, setAfficherAlerteUtilisateurs }) {
  return (
    <div className="barre-laterale" style={{background: '#EAF6FF', borderRight: '3px solid #9CD5FF', minHeight: '100vh', color: '#1976D2', boxShadow: '2px 0 16px #9CD5FF'}}>
      <img src="/assets/logo.jpeg" alt="Logo" style={{width: 120, marginBottom: 24, borderRadius: 16, boxShadow: '0 2px 12px #9CD5FF'}} />
      <h2 style={{color: '#3A8DFF', fontWeight: 900, marginBottom: 32, fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: 1}}>Ministère de l’Eau</h2>
      <nav style={{width: '100%'}}>
        <ul style={{listStyle: 'none', padding: 0, margin: 0, fontWeight: 700, fontSize: '1.08em'}}>
          <li style={{marginBottom: 18}}><button className="btn-dashboard" onClick={() => { setAfficherDashboard(true); setAfficherAlertes(false); }} style={{width: '100%', background: '#3A8DFF', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '1.08em', padding: '0.7em 0', marginBottom: 6, boxShadow: '0 2px 8px #9CD5FF', border: 'none'}}>📊 TABLEAU DE BORD</button></li>
          <li style={{marginBottom: 18}}>
            <button
              className="btn-dashboard"
              onClick={() => {
                setAfficherAlerteUtilisateurs(true);
                setAfficherDashboard(false);
                setAfficherAlertes(false);
              }}
              style={{
                width: '100%',
                background: '#ffbdbd',
                color: '#d32f2f',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '1.08em',
                padding: '0.7em 0',
                marginBottom: 6,
                boxShadow: '0 2px 8px #ffbdbd',
                border: 'none'
              }}
            >
              🧑‍🤝‍🧑 Alertes riverains
            </button>
          </li>
        </ul>
      </nav>
      <div style={{margin: '32px 0 0 0'}}>
        <UploadFichier onFileChange={gererChangementFichier} />
      </div>
      <button className="btn-mode-sombre" onClick={toggleModeSombre} style={{marginTop: 32, background: 'none', color: '#3A8DFF', border: '2px solid #3A8DFF', borderRadius: 8, padding: '0.5em 1.2em', fontWeight: 700, fontSize: '1.08em', boxShadow: '0 2px 8px #9CD5FF', cursor: 'pointer'}}> {modeSombre ? '☀️ Mode clair' : '🌙 Mode sombre'} </button>
      <div style={{marginTop: 32}}>
        <span style={{fontSize: '0.95em', color: '#3A8DFF'}}>© Ministère de l’Eau</span>
      </div>
    </div>
  );
}

export default BarreLaterale; 