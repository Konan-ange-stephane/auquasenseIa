// aquaIntense/src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const imagesDemo = {
  "Eau claire 💧": "/assets/demo_eau_claire.jpg",
  "Eau polluée (algues) 🌿": "/assets/demo_algues.jpg",
  "Niveau d'eau bas 🌞": "/assets/demo_secheresse.jpg",
};

function LoaderSplash() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#f5fafd",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <img src="/assets/logo.jpeg" alt="Logo AquaSense" style={{ width: 120, marginBottom: 30, borderRadius: 16, boxShadow: "0 2px 8px #e5e5e5" }} />
      <div style={{ fontSize: "2em", color: "#007BFF", fontWeight: 700, marginBottom: 10 }}>AquaSense IA</div>
      <div style={{ color: "#1976d2", marginBottom: 30 }}>Surveillance intelligente de la qualité de l'eau</div>
      <div className="spinner-loader" style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          border: "6px solid #e3f2fd",
          borderTop: "6px solid #007BFF",
          borderRadius: "50%",
          width: 40,
          height: 40,
          animation: "spin 1s linear infinite"
        }} />
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Dashboard({ historique }) {
  // Statistiques clés (exemple)
  const total = historique.length;
  const nbClaires = historique.filter(a => a.diagnostic && a.diagnostic.includes('Eau claire')).length;
  const nbPolluees = historique.filter(a => a.diagnostic && a.diagnostic.includes('polluée')).length;
  const nbBas = historique.filter(a => a.diagnostic && a.diagnostic.includes("Niveau d'eau bas")).length;
  const pctBas = total > 0 ? Math.round((nbBas / total) * 100) : 0;

  // Données pour le graphique camembert
  const pieData = {
    labels: ['Eau claire', 'Polluée (algues)', "Niveau d'eau bas"],
    datasets: [
      {
        data: [nbClaires, nbPolluees, nbBas],
        backgroundColor: [
          '#42a5f5', // bleu clair
          '#ffd600', // jaune
          '#d32f2f'  // rouge
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Préparation des données pour le graphique d'évolution
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
      <h1 style={{ fontSize: '2.2em', color: '#1976d2', marginBottom: 10 }}>Tableau de bord</h1>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ background: '#e3f2fd', borderRadius: 10, padding: 18, minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{total}</div>
          <div>Analyses totales</div>
        </div>
        <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 18, minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{nbClaires}</div>
          <div>Eau claire</div>
        </div>
        <div style={{ background: '#fffde7', borderRadius: 10, padding: 18, minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{nbPolluees}</div>
          <div>Polluée (algues)</div>
        </div>
        <div style={{ background: '#fbe9e7', borderRadius: 10, padding: 18, minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#d32f2f' }}>{nbBas} <span style={{ fontSize: 18, color: '#d32f2f' }}>({pctBas}%)</span></div>
          <div>Niveau d'eau bas</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #e3f2fd' }}>
          <h2 style={{ color: '#1976d2', fontSize: '1.2em', marginBottom: 10 }}>Répartition des diagnostics</h2>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #e3f2fd' }}>
          <h2 style={{ color: '#1976d2', fontSize: '1.2em', marginBottom: 10 }}>Évolution dans le temps</h2>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #e3f2fd', marginBottom: 32 }}>
        <h2 style={{ color: '#1976d2', fontSize: '1.2em', marginBottom: 10 }}>Historique des analyses</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e3f2fd' }}>
              <th style={{ padding: 8, border: '1px solid #bbdefb' }}>Date</th>
              <th style={{ padding: 8, border: '1px solid #bbdefb' }}>Diagnostic</th>
              <th style={{ padding: 8, border: '1px solid #bbdefb' }}>Niveau d'eau</th>
              <th style={{ padding: 8, border: '1px solid #bbdefb' }}>Explication</th>
            </tr>
          </thead>
          <tbody>
            {historique.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 16, color: '#aaa' }}>Aucune analyse enregistrée</td></tr>
            )}
            {historique.map((a, i) => (
              <tr key={i}>
                <td style={{ padding: 8, border: '1px solid #e3f2fd' }}>{a.date || '-'}</td>
                <td style={{ padding: 8, border: '1px solid #e3f2fd' }}>{a.diagnostic || '-'}</td>
                <td style={{ padding: 8, border: '1px solid #e3f2fd', color: a.niveau_eau === 'Bas' ? '#d32f2f' : '#1976d2', fontWeight: 600 }}>{a.niveau_eau || '-'}</td>
                <td style={{ padding: 8, border: '1px solid #e3f2fd', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.explication || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #e3f2fd' }}>
        <h2 style={{ color: '#1976d2', fontSize: '1.2em', marginBottom: 10 }}>Mesures à prendre les plus fréquentes</h2>
        {/* Placeholder pour nuage de mots ou liste */}
        <div style={{ color: '#aaa', minHeight: 40 }}>[À venir]</div>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [choixDemo, setChoixDemo] = useState(Object.keys(imagesDemo)[0]);
  const [fichierImporte, setFichierImporte] = useState(null);
  const [srcImage, setSrcImage] = useState(imagesDemo[Object.keys(imagesDemo)[0]]);
  const [resultat, setResultat] = useState(null);
  const [modeSombre, setModeSombre] = useState(false);
  const refInputFichier = useRef();
  const [afficherDashboard, setAfficherDashboard] = useState(false);
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Gestion de l'import d'un fichier
  const gererChangementFichier = (e) => {
    const fichier = e.target.files[0];
    setFichierImporte(fichier);
    if (fichier) {
      const lecteur = new FileReader();
      lecteur.onload = (ev) => setSrcImage(ev.target.result);
      lecteur.readAsDataURL(fichier);
    }
  };

  // Gestion du choix d'une image de démonstration
  const gererChangementDemo = (e) => {
    setChoixDemo(e.target.value);
    setFichierImporte(null);
    setSrcImage(imagesDemo[e.target.value]);
    if (refInputFichier.current) refInputFichier.current.value = "";
  };

  // Je supprime la fonction analyserImage (analyse de l'image avec Canvas)

  // Fonction pour envoyer une image au backend et recevoir le résultat
  

  // Gestion du bouton d'analyse
  const gererAnalyse = async () => {
    let fileToSend = null;

    if (fichierImporte) {
      fileToSend = fichierImporte;
    } else if (srcImage && !srcImage.startsWith('data:')) {
      // Pour les images de démo
      const response = await fetch(srcImage);
      const blob = await response.blob();
      fileToSend = new File([blob], "demo.jpg", { type: blob.type });
    }

    if (fileToSend) {
      const formData = new FormData();
      formData.append('file', fileToSend);
      const response = await fetch('http://localhost:8000/analyser-image-et-explique/', {
        
        method: 'POST',
        body: formData,
      });
      const res = await response.json();
      setResultat([
        res.analyse,
        res.explication?.candidates?.[0]?.content?.parts?.[0]?.text || "",
        res.niveau_eau || ""
      ]);
      // Ajout à l'historique
      setHistorique(h => [
        ...h,
        {
          date: new Date().toLocaleString(),
          diagnostic: res.analyse,
          explication: res.explication?.candidates?.[0]?.content?.parts?.[0]?.text || "",
          niveau_eau: res.niveau_eau || ""
        }
      ]);
    } else {
      setResultat(["❓ Inconnu : Aucune image sélectionnée."]);
    }
  };

  // Fonction pour générer et télécharger le PDF
  const telechargerPDF = () => {
    const doc = new jsPDF();
    // Logo
    doc.addImage('/assets/logo.jpeg', 'JPEG', 15, 10, 25, 25);
    // Titre
    doc.setFontSize(20);
    doc.setTextColor('#007BFF');
    doc.text('AquaSense IA - Rapport d\'analyse', 45, 22);
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text('Surveillance intelligente de la qualité de l\'eau', 45, 30);
    doc.setDrawColor('#90caf9');
    doc.line(15, 38, 195, 38);
    // Diagnostic
    doc.setFontSize(16);
    doc.setTextColor('#1976d2');
    doc.text('Diagnostic :', 15, 50);
    doc.setFontSize(13);
    doc.setTextColor('#0d47a1');
    doc.text(resultat[0] ? resultat[0] : '', 15, 58);
    // Explication
    doc.setFontSize(15);
    doc.setTextColor('#1565c0');
    doc.text('Explication de Gemini :', 15, 75);
    doc.setFontSize(12);
    doc.setTextColor('#263238');
    doc.text(doc.splitTextToSize(resultat[1] ? resultat[1] : '', 180), 15, 83);
    // Date
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text(`Généré le : ${new Date().toLocaleString()}`, 15, 290);
    doc.save('rapport_aquasense.pdf');
  };

  // Fonction pour basculer le mode sombre
  const toggleModeSombre = () => setModeSombre((v) => !v);

  if (isLoading) {
    return <LoaderSplash />;
  }

  return (
    <div>
      {isLoading && <LoaderSplash />}
      {!isLoading && (
        <>
          {/* CSS personnalisé */}
          <style>{`
        body, #root {
          background-color: ${modeSombre ? '#181c24' : '#f5fafd'};
          font-family: 'Segoe UI', Arial, sans-serif;
          transition: background 0.3s;
        }
        .conteneur {
          display: flex;
          min-height: 100vh;
        }
        .barre-laterale {
          width: 280px;
          background: ${modeSombre ? '#232a36' : '#fff'};
          border-right: 1px solid ${modeSombre ? '#232a36' : '#e5e5e5'};
          padding: 2em 1.5em;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .barre-laterale img {
          width: 120px;
          margin-bottom: 1em;
        }
        .barre-laterale h2 {
          font-size: 1.2em;
          margin-bottom: 1em;
          color: ${modeSombre ? '#90caf9' : '#222'};
        }
        .barre-laterale select, .barre-laterale input[type="file"] {
          width: 100%;
          margin-bottom: 1em;
          background: ${modeSombre ? '#232a36' : '#fff'};
          color: ${modeSombre ? '#fff' : '#222'};
          border: 1px solid ${modeSombre ? '#333' : '#ccc'};
        }
        .contenu-principal {
          flex: 1;
          padding: 2em 3em;
          color: ${modeSombre ? '#e3f2fd' : '#222'};
        }
        .titre-style {
          font-size: 2.5em;
          font-weight: bold;
          color: ${modeSombre ? '#90caf9' : '#007BFF'};
        }
        .sous-titre-style {
          font-size: 1.5em;
          color: ${modeSombre ? '#b0bec5' : '#555'};
          margin-bottom: 1.5em;
        }
        .boite {
          padding: 1em;
          border-radius: 10px;
          margin-top: 20px;
          color: white;
          text-align: center;
        }
        .btn-analyse {
          background: ${modeSombre ? '#1976d2' : '#007BFF'};
          color: white;
          border: none;
          padding: 0.8em 2em;
          border-radius: 6px;
          font-size: 1.1em;
          cursor: pointer;
          margin-top: 1em;
        }
        .btn-analyse:hover {
          background: ${modeSombre ? '#1565c0' : '#0056b3'};
        }
        .btn-pdf {
          background: ${modeSombre ? '#232a36' : '#fff'};
          color: ${modeSombre ? '#90caf9' : '#007BFF'};
          border: 2px solid ${modeSombre ? '#90caf9' : '#007BFF'};
          padding: 0.7em 1.5em;
          border-radius: 6px;
          font-size: 1em;
          cursor: pointer;
          margin-top: 1.2em;
          margin-bottom: 0.5em;
          font-weight: 600;
          transition: background 0.2s, color 0.2s;
        }
        .btn-pdf:hover {
          background: ${modeSombre ? '#90caf9' : '#007BFF'};
          color: ${modeSombre ? '#232a36' : '#fff'};
        }
        .btn-mode-sombre {
          background: none;
          border: none;
          color: ${modeSombre ? '#90caf9' : '#007BFF'};
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1.5em;
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
        .btn-mode-sombre:hover {
          text-decoration: underline;
        }
        .pied-page {
          margin-top: 2em;
          color: ${modeSombre ? '#90caf9' : '#007BFF'};
          font-size: 1em;
          text-align: center;
        }
        .btn-dashboard {
          background: none;
          border: 2px solid #1976d2;
          color: #1976d2;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1.5em;
          border-radius: 6px;
          padding: 0.5em 1.2em;
          transition: background 0.2s, color 0.2s;
        }
        .btn-dashboard:hover {
          background: #1976d2;
          color: #fff;
        }
      `}</style>
          <div className="conteneur">
            {/* Barre latérale */}
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
                  {Object.keys(imagesDemo).map((cle) => (
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
            {/* Contenu principal */}
            <div className="contenu-principal">
              {afficherDashboard ? (
                <Dashboard historique={historique} />
              ) : (
                <>
                  <div className="titre-style">💧 AquaSense IA</div>
                  <div className="sous-titre-style">
                    Surveillance intelligente de la qualité de l'eau
                  </div>
                  <div style={{ marginBottom: "1.5em" }}>
                    Bienvenue sur <b>AquaSense IA</b>, votre assistant intelligent pour l’analyse de la qualité de l’eau à partir d’images.<br />
                    Téléchargez une photo ou utilisez une image de démonstration pour lancer l’analyse visuelle.
                  </div>
                  {srcImage && (
                    <div style={{ marginBottom: "1em" }}>
                      <img
                        src={srcImage}
                        alt="AquaSense"
                        style={{ maxWidth: "100%", maxHeight: 350, borderRadius: 10, boxShadow: modeSombre ? "0 2px 8px #232a36" : "0 2px 8px #e5e5e5" }}
                      />
                    </div>
                  )}
                  <button className="btn-analyse" onClick={gererAnalyse}>
                    🔍 Lancer l’analyse
                  </button>

                  {resultat && (
                    <>
                      <button className="btn-pdf" onClick={telechargerPDF}>
                        📄 Télécharger le rapport
                      </button>
                      <div
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
                  )}
                  <div className="pied-page">
                    🚀 Développé pour le Hackathon de Bingerville – Équipe AquaSense IA
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;