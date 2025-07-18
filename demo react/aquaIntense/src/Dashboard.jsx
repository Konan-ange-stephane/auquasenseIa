import React from "react";
import { Pie, Line } from 'react-chartjs-2';

function TableauDeBord({ historique }) {
  const total = historique.length;
  const nbClaires = historique.filter(a => a.diagnostic && a.diagnostic.includes('Eau claire')).length;
  const nbPolluees = historique.filter(a => a.diagnostic && a.diagnostic.includes('polluée')).length;
  const nbBas = historique.filter(a => a.diagnostic && a.diagnostic.includes("Niveau d'eau bas")).length;
  const pctBas = total > 0 ? Math.round((nbBas / total) * 100) : 0;

  const pieData = {
    labels: ['Eau claire', 'Polluée (algues)', "Niveau d'eau bas"],
    datasets: [
      {
        data: [nbClaires, nbPolluees, nbBas],
        backgroundColor: [
          '#42a5f5',
          '#ffd600',
          '#d32f2f'
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const labels = historique.map(a => a.date);
  const dataClaires = historique.map(a => a.diagnostic && a.diagnostic.includes('Eau claire') ? 1 : 0);
  const dataPolluees = historique.map(a => a.diagnostic && a.diagnostic.includes('polluée') ? 1 : 0);
  const dataBas = historique.map(a => a.diagnostic && a.diagnostic.includes("Niveau d'eau bas") ? 1 : 0);

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Eau claire',
        data: dataClaires,
        borderColor: '#42a5f5',
        backgroundColor: '#42a5f5',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Polluée (algues)',
        data: dataPolluees,
        borderColor: '#ffd600',
        backgroundColor: '#ffd600',
        tension: 0.3,
        fill: false,
      },
      {
        label: "Niveau d'eau bas",
        data: dataBas,
        borderColor: '#d32f2f',
        backgroundColor: '#d32f2f',
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
      <h1 className="entete-tableau">Tableau de bord</h1>
      <div className="stats-tableau">
        <div className="carte-stat">
          <div className="valeur">{total}</div>
          <div>Analyses totales</div>
        </div>
        <div className="carte-stat eau-claire">
          <div className="valeur">{nbClaires}</div>
          <div>Eau claire</div>
        </div>
        <div className="carte-stat polluee">
          <div className="valeur">{nbPolluees}</div>
          <div>Polluée (algues)</div>
        </div>
        <div className="carte-stat niveau-bas">
          <div className="valeur">{nbBas} <span className="pourcentage">({pctBas}%)</span></div>
          <div>Niveau d'eau bas</div>
        </div>
      </div>
      <div className="graphiques-tableau">
        <div className="carte-graphique">
          <h2 className="titre-graphique">Répartition des diagnostics</h2>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div className="carte-graphique">
          <h2 className="titre-graphique">Évolution dans le temps</h2>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
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
      <div className="zone-mesures">
        <h2 className="titre-mesures">Mesures à prendre les plus fréquentes</h2>
        <div className="placeholder-mesures">[À venir]</div>
      </div>
    </div>
  );
}

export default TableauDeBord; 