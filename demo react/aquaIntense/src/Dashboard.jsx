import React from "react";
import { Pie, Line } from 'react-chartjs-2';

function TableauDeBord({ historique, onRetour }) {
  // Statistiques clés
  const total = historique.length;
  const nbClaires = historique.filter(
    a => a.diagnostic && (
      a.diagnostic.includes('Eau claire') ||
      a.diagnostic.includes('Sûr') ||
      a.diagnostic.includes('💧')
    )
  ).length;
  const nbPolluees = historique.filter(
    a => a.diagnostic && (
      a.diagnostic.toLowerCase().includes('polluée') ||
      a.diagnostic.toLowerCase().includes('pollution') ||
      a.diagnostic.toLowerCase().includes('algue') ||
      a.diagnostic.toLowerCase().includes('déchet') ||
      a.diagnostic.toLowerCase().includes('danger')
    )
  ).length;
  const nbBas = historique.filter(a => a.diagnostic && a.diagnostic.includes("Niveau d'eau bas")).length;
  const tauxEauSaine = total > 0 ? Math.round((nbClaires / total) * 100) : '—';
  const nbSites = 12; // Valeur fictive

  // Préparation des données pour le diagramme en courbe
  const labels = historique.map(a => a.date);
  const dataClaires = historique.map(a => a.diagnostic && a.diagnostic.includes('Eau claire') ? 1 : 0);
  const dataPolluees = historique.map(a => a.diagnostic && (a.diagnostic.includes('polluée') || a.diagnostic.includes('Déchets')) ? 1 : 0);
  const dataBas = historique.map(a => a.diagnostic && a.diagnostic.includes("Niveau d'eau bas") ? 1 : 0);

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Eau claire',
        data: dataClaires,
        borderColor: '#3A8DFF',
        backgroundColor: '#9CD5FF',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Polluée/Déchets',
        data: dataPolluees,
        borderColor: '#d32f2f',
        backgroundColor: '#d32f2f',
        tension: 0.3,
        fill: false,
      },
      {
        label: "Niveau d'eau bas",
        data: dataBas,
        borderColor: '#388e3c',
        backgroundColor: '#388e3c',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        ticks: { precision: 0 },
        title: { display: true, text: 'Diagnostic (1 = présent)' }
      },
      x: {
        title: { display: true, text: 'Date' },
        ticks: { maxTicksLimit: 8 }
      }
    }
  };

  return (
    <div>
      {onRetour && (
        <button onClick={onRetour} style={{marginBottom: 18, background: '#3A8DFF', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7em 1.5em', fontWeight: 700, fontSize: '1.08em', boxShadow: '0 2px 8px #9CD5FF', cursor: 'pointer'}}>← Retour à l'accueil</button>
      )}
      <div style={{display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40, justifyContent: 'center'}}>
        <div style={{flex: 1, minWidth: 220, background: '#FFFFFF', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 4px 24px #9CD5FF', margin: 8}}>
          <div style={{fontSize: 48, color: '#3A8DFF', fontWeight: 900, marginBottom: 8}}>📊 {total}</div>
          <div style={{color: '#1976D2', fontWeight: 900, fontSize: '1.2em', letterSpacing: 1, textTransform: 'uppercase'}}>Analyses totales</div>
        </div>
        <div style={{flex: 1, minWidth: 220, background: '#EAF6FF', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 4px 24px #9CD5FF', margin: 8}}>
          <div style={{fontSize: 48, color: '#3A8DFF', fontWeight: 900, marginBottom: 8}}>🚨 {nbPolluees}</div>
          <div style={{color: '#1976D2', fontWeight: 900, fontSize: '1.2em', letterSpacing: 1, textTransform: 'uppercase'}}>Alertes pollution/déchets</div>
        </div>
        <div style={{flex: 1, minWidth: 220, background: '#FFFFFF', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 4px 24px #9CD5FF', margin: 8}}>
          <div style={{fontSize: 48, color: '#3A8DFF', fontWeight: 900, marginBottom: 8}}>💧 {tauxEauSaine}%</div>
          <div style={{color: '#1976D2', fontWeight: 900, fontSize: '1.2em', letterSpacing: 1, textTransform: 'uppercase'}}>Taux d’eau saine</div>
        </div>
        <div style={{flex: 1, minWidth: 220, background: '#EAF6FF', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 4px 24px #9CD5FF', margin: 8}}>
          <div style={{fontSize: 48, color: '#3A8DFF', fontWeight: 900, marginBottom: 8}}>🗺️ {nbSites}</div>
          <div style={{color: '#1976D2', fontWeight: 900, fontSize: '1.2em', letterSpacing: 1, textTransform: 'uppercase'}}>Sites surveillés</div>
        </div>
      </div>
      <hr style={{border: 'none', borderTop: '3px solid #3A8DFF', margin: '0 0 32px 0'}} />
      <h1 className="entete-tableau">Tableau de bord</h1>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #EAF6FF', margin: '32px 0', padding: 24 }}>
        <h2 style={{ color: '#3A8DFF', fontWeight: 900, fontSize: '1.3em', marginBottom: 16 }}>Évolution des diagnostics dans le temps</h2>
        <Line data={lineData} options={lineOptions} />
      </div>
      <div className="zone-historique">
        <h2 className="titre-graphique">Historique des analyses</h2>
        <table className="table-historique">
          <thead className="thead-historique">
            <tr>
              <th className="th-historique">Date</th>
              <th className="th-historique">Diagnostic</th>
              <th className="th-historique">Niveau d'eau</th>
              <th className="th-historique">Explication</th>
            </tr>
          </thead>
          <tbody>
            {historique.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 16, color: '#aaa' }}>Aucune analyse enregistrée</td></tr>
            )}
            {historique.map((a, i) => (
              <tr key={i}>
                <td className="td-historique">{a.date || '-'}</td>
                <td className="td-historique">{a.diagnostic || '-'}</td>
                <td className={`td-historique${a.niveau_eau === 'Bas' ? ' niveau-bas' : ''}`}>{a.niveau_eau || '-'}</td>
                <td className="td-historique explication-historique">{a.explication || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableauDeBord; 