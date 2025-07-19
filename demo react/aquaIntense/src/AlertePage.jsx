import React from "react";

function AlertePage({ alertes, onRetour }) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '1.5em 0.5em' }}>
      <button onClick={onRetour} style={{marginBottom: 18, background: '#3A8DFF', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7em 1.5em', fontWeight: 700, fontSize: '1.08em', boxShadow: '0 2px 8px #9CD5FF', cursor: 'pointer'}}>← Retour à l'accueil</button>
      <h1 style={{ color: '#3A8DFF', fontWeight: 900, fontSize: '2em', textAlign: 'center', marginBottom: 24, letterSpacing: 1 }}>Mes alertes</h1>
      {alertes && alertes.length > 0 ? (
        alertes.map((a, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #EAF6FF', marginBottom: 24, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {a.image && (
              <img src={a.image} alt="Alerte" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 12, border: '2px solid #9CD5FF' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#1976D2', fontSize: '1.1em', marginBottom: 4 }}>{a.diagnostic || 'Diagnostic inconnu'}</div>
              <div style={{ color: '#3A8DFF', fontSize: '0.98em', marginBottom: 8, whiteSpace: 'pre-line' }}>{a.recommandation || 'Aucune recommandation.'}</div>
              <div style={{ color: '#888', fontSize: '0.92em' }}>{a.date || ''}</div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: '#888', textAlign: 'center', marginTop: 48 }}>Aucune alerte enregistrée pour le moment.</div>
      )}
    </div>
  );
}

export default AlertePage; 