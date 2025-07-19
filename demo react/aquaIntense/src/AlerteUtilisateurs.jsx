import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import alerte1 from './assets/alerte/alerte1.jpg';
// Données de démo
const alertesDemo = [
  {
    nom: "Konan Ange Stephane",
    description: "Eau trouble et odeur désagréable près du pont.",
    // image: alerte1, // supprimé
    position: [5.350, -4.017],
  },
  {
    nom: "Oyetola Hamide",
    description: "Présence de déchets plastiques sur la berge.",
    // image: ...
    position: [5.355, -4.012],
  },
  {
    nom: "N'guessan Mikaël",
    description: "Niveau d'eau très bas, risque de sécheresse.",
    // image: ...
    position: [5.348, -4.020],
  },
];

// Icône rouge pour les marqueurs
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function AlerteUtilisateurs() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2em 1em' }}>
      <h1 style={{ color: '#d32f2f', fontWeight: 900, fontSize: '2em', textAlign: 'center', marginBottom: 24, letterSpacing: 1 }}>Alertes des riverains</h1>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Carte interactive */}
        <div style={{ width: 400, height: 300 }}>
          <MapContainer center={[5.35, -4.015]} zoom={13} style={{ width: "100%", height: "100%", borderRadius: 18 }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {alertesDemo.map((a, i) => (
              <Marker key={i} position={a.position} icon={redIcon}>
                <Popup>
                  <b>{a.nom}</b><br />
                  {a.description}<br />
                  <img src={a.image} alt={a.nom} style={{ width: 80, borderRadius: 8, marginTop: 6 }} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {/* Liste des noms et descriptions */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2 style={{ color: '#1976D2', fontWeight: 900, fontSize: '1.2em', marginBottom: 16 }}>Messages reçus</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {alertesDemo.map((a, i) => (
              <li key={i} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #EAF6FF', marginBottom: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 36, color: '#d32f2f' }}>🚨</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#d32f2f', fontSize: '1.1em', marginBottom: 4 }}>{a.nom}</div>
                  <div style={{ color: '#1976D2', fontSize: '0.98em', marginBottom: 4 }}>{a.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={() => window.location.reload()} style={{marginTop: 24, background: '#3A8DFF', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7em 1.5em', fontWeight: 700, fontSize: '1.08em', boxShadow: '0 2px 8px #9CD5FF', cursor: 'pointer'}}>← Retour</button>
    </div>
  );
}

export default AlerteUtilisateurs; 