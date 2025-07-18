import React from "react";

function ResultatDiagnostic({ modeSombre, resultat, telechargerPDF }) {
  if (!resultat) return null;
  return (
    <>
      <button className="btn-pdf" onClick={telechargerPDF}>
        📄 Télécharger le rapport
      </button>
      <div
        className="boite-resultat"
        style={{
          background: modeSombre ? "linear-gradient(135deg, #232a36 60%, #263238 100%)" : "linear-gradient(135deg, #e3f2fd 60%, #bbdefb 100%)",
          borderRadius: 18,
          boxShadow: modeSombre ? "0 4px 16px #181c24" : "0 4px 16px rgba(0,0,0,0.10)",
          padding: "2.2em 2em",
          margin: "2.5em auto",
          maxWidth: 650,
          border: `2px solid ${modeSombre ? '#90caf9' : '#90caf9'}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: modeSombre ? "#e3f2fd" : "#0d47a1"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: "2em" }}>{resultat[0].slice(0, 2)}</span>
          <h2 style={{ margin: 0, fontWeight: 700, letterSpacing: 1, color: modeSombre ? "#90caf9" : "#1976d2" }}>Diagnostic</h2>
        </div>
        <p style={{
          fontSize: "1.35em",
          color: modeSombre ? "#e3f2fd" : "#0d47a1",
          marginBottom: 28,
          textAlign: "center",
          fontWeight: 500,
          background: modeSombre ? "#232a36" : "#fff",
          borderRadius: 10,
          padding: "1em 1.5em",
          boxShadow: modeSombre ? "0 2px 8px #181c24" : "0 2px 8px #e3f2fd"
        }}>
          {resultat[0].slice(2).trim()}
        </p>
        {resultat[2] && (
          <p style={{fontWeight: 600, color: '#1976d2', fontSize: '1.1em'}}>
            Niveau d’eau : {resultat[2]}
          </p>
        )}
        {resultat[1] && (
          <div style={{
            width: "100%",
            background: modeSombre ? "#232a36" : "#fff",
            borderRadius: 10,
            padding: "1.2em",
            color: modeSombre ? "#b0bec5" : "#263238",
            fontSize: "1.15em",
            boxShadow: modeSombre ? "0 2px 8px #181c24" : "0 2px 8px #e3f2fd",
            textAlign: "left",
            fontFamily: "Segoe UI, Arial, sans-serif",
            lineHeight: 1.6,
            marginBottom: 0
          }}>
            <h3 style={{ color: modeSombre ? "#90caf9" : "#1565c0", marginBottom: 8, fontWeight: 600 }}>Explication de Gemini</h3>
            <div>{resultat[1]}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default ResultatDiagnostic; 