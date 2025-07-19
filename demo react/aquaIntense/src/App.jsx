// aquaIntense/src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import EcranChargement from "./LoaderSplash.jsx";
import TableauDeBord from "./Dashboard.jsx";
import BarreLaterale from "./Sidebar.jsx";
import ResultatDiagnostic from "./DiagnosticResult.jsx";
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
import AlertePage from "./AlertePage";
import AlerteUtilisateurs from "./AlerteUtilisateurs";


const imagesDemo = {
  "Eau claire 💧": "/assets/demo_eau_claire.jpg",
  "Eau polluée (algues) 🌿": "/assets/demo_algues.jpg",
  "Niveau d'eau bas 🌞": "/assets/demo_secheresse.jpg",
};

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
  const [loadingAnalyse, setLoadingAnalyse] = useState(false);
  const [afficherAlertes, setAfficherAlertes] = useState(false);
  const [afficherAlerteUtilisateurs, setAfficherAlerteUtilisateurs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('mode-sombre', modeSombre);
  }, [modeSombre]);

  useEffect(() => {
    const histo = localStorage.getItem('historique');
    if (histo) setHistorique(JSON.parse(histo));
  }, []);

  useEffect(() => {
    localStorage.setItem('historique', JSON.stringify(historique));
  }, [historique]);

  const gererChangementFichier = (e) => {
    const fichier = e.target.files[0];
    setFichierImporte(fichier);
    if (fichier) {
      const lecteur = new FileReader();
      lecteur.onload = (ev) => setSrcImage(ev.target.result);
      lecteur.readAsDataURL(fichier);
    }
  };

  const gererChangementDemo = (e) => {
    setChoixDemo(e.target.value);
    setFichierImporte(null);
    setSrcImage(imagesDemo[e.target.value]);
    if (refInputFichier.current) refInputFichier.current.value = "";
  };

  const gererAnalyse = async () => {
    setLoadingAnalyse(true);
    let fileToSend = null;
    if (fichierImporte) {
      fileToSend = fichierImporte;
    } else if (srcImage && !srcImage.startsWith('data:')) {
      const response = await fetch(srcImage);
      const blob = await response.blob();
      fileToSend = new File([blob], "demo.jpg", { type: blob.type });
    }
    if (fileToSend) {
      const formData = new FormData();
      formData.append('file', fileToSend);
      try {
      const response = await fetch('http://localhost:8000/analyser-image-et-explique/', {
        method: 'POST',
        body: formData,
      });
        if (!response.ok) {
          // Affiche une erreur utilisateur
          setResultat([`❌ Erreur serveur : ${response.status} ${response.statusText}`]);
          setLoadingAnalyse(false);
          return;
        }
      const res = await response.json();
      console.log(res); // Ajoute cette ligne
      let explication = "";
      if (typeof res.explication === "string") {
        explication = res.explication;
      } else {
        explication = res.explication?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
      setResultat([
        res.analyse,
        explication,
        res.niveau_eau || ""
      ]);
      setHistorique(h => [
        ...h,
        {
          date: new Date().toLocaleString(),
          diagnostic: res.analyse,
          explication: res.explication?.candidates?.[0]?.content?.parts?.[0]?.text || "",
          niveau_eau: res.niveau_eau || "",
          duree_seconde: res.duree_seconde
        }
      ]);
      } catch (err) {
        setResultat([`❌ Erreur réseau ou serveur : ${err.message}`]);
      }
    } else {
      setResultat(["❓ Inconnu : Aucune image sélectionnée."]);
    }
    setLoadingAnalyse(false);
  };

  const telechargerPDF = () => {
    const doc = new jsPDF();
    doc.addImage('/assets/logo.jpeg', 'JPEG', 15, 10, 25, 25);
    doc.setFontSize(20);
    doc.setTextColor('#007BFF');
    doc.text('AquaSense IA - Rapport d\'analyse', 45, 22);
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text('Surveillance intelligente de la qualité de l\'eau', 45, 30);
    doc.setDrawColor('#90caf9');
    doc.line(15, 38, 195, 38);
    doc.setFontSize(16);
    doc.setTextColor('#1976d2');
    doc.text('Diagnostic :', 15, 50);
    doc.setFontSize(13);
    doc.setTextColor('#0d47a1');
    doc.text(resultat[0] ? resultat[0] : '', 15, 58);
    doc.setFontSize(15);
    doc.setTextColor('#1565c0');
    doc.text('Explication de Gemini :', 15, 75);
    doc.setFontSize(12);
    doc.setTextColor('#263238');
    doc.text(doc.splitTextToSize(resultat[1] ? resultat[1] : '', 180), 15, 83);
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text(`Généré le : ${new Date().toLocaleString()}`, 15, 290);
    doc.save('rapport_aquasense.pdf');
  };

  const toggleModeSombre = () => setModeSombre((v) => !v);

  // Historique des alertes (on suppose que c'est le même que l'historique des analyses)
  const alertes = historique.map(a => ({
    image: a.image || null, // à adapter si tu stockes l'image
    diagnostic: a.diagnostic,
    recommandation: a.explication,
    date: a.date
  }));

  if (isLoading) {
    return <EcranChargement />;
  }

  return (
    <div>
      <header style={{background: '#3A8DFF', color: '#FFFFFF', padding: '1.2em 2em', display: 'flex', alignItems: 'center', boxShadow: '0 2px 12px #9CD5FF'}}>
        <img src="/assets/logo.jpeg" alt="Logo" style={{height: 64, borderRadius: 16, marginRight: 32, boxShadow: '0 2px 8px #9CD5FF'}} />
        <div>
          <div style={{fontSize: '2.2em', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase'}}>MINISTÈRE DE L’EAU & DE L’ENVIRONNEMENT</div>
          <div style={{fontSize: '1.1em', fontWeight: 400, marginTop: 4, color: '#9CD5FF'}}>Surveillance nationale de la qualité de l’eau</div>
        </div>
      </header>
      <div className="conteneur">
        <BarreLaterale
          modeSombre={modeSombre}
          toggleModeSombre={toggleModeSombre}
          afficherDashboard={afficherDashboard}
          setAfficherDashboard={setAfficherDashboard}
          choixDemo={choixDemo}
          gererChangementDemo={gererChangementDemo}
          refInputFichier={refInputFichier}
          gererChangementFichier={gererChangementFichier}
          setAfficherAlertes={setAfficherAlertes}
          setAfficherAlerteUtilisateurs={setAfficherAlerteUtilisateurs}
        />
        <div className="contenu-principal">
          {afficherAlerteUtilisateurs ? (
            <AlerteUtilisateurs />
          ) : afficherAlertes ? (
            <AlertePage alertes={alertes} onRetour={() => setAfficherAlertes(false)} />
          ) : afficherDashboard ? (
            <TableauDeBord historique={historique} />
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
              <button className="btn-analyse" onClick={gererAnalyse} disabled={loadingAnalyse}>
                {loadingAnalyse ? (
                  <span>
                    <span className="spinner-roue" style={{width: 20, height: 20, borderWidth: 3, marginRight: 8, verticalAlign: 'middle'}}></span>
                    Analyse en cours...
                  </span>
                ) : (
                  <>🔍 Lancer l’analyse</>
                )}
              </button>
              <ResultatDiagnostic modeSombre={modeSombre} resultat={resultat} telechargerPDF={telechargerPDF} />
              <div className="pied-page">
                🚀 – Équipe AquaSense IA
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;