import React from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Popup, Circle } from "react-leaflet";
import { Button } from "@mui/material";
import { radioIcon } from "../radioIcon";


const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MapView({ clientes, center, onDelete }) {
  
  
  const verificarInvasao = (clienteAtual) => {
    return clientes.some((outro) => {
      if (outro.id === clienteAtual.id) return false;

      const distancia = calcularDistancia(
        clienteAtual.latitude,
        clienteAtual.longitude,
        outro.latitude,
        outro.longitude
      );

      return distancia < 2;
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "calc(100vh - 64px)", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {clientes.map((c) => {
        const estaInvadindo = verificarInvasao(c);

        return (
          <React.Fragment key={c.id}>
            
            <Circle
              center={[c.latitude, c.longitude]}
              radius={2000}
              pathOptions={{
                fillColor: estaInvadindo ? 'red' : '#1976d2',
                color: estaInvadindo ? 'red' : '#1976d2',
                weight: 2,
                opacity: 0.5,
                fillOpacity: 0.2
              }}
            />

            <Marker position={[c.latitude, c.longitude]} icon={radioIcon}>
              
             
              {estaInvadindo && (
                <Tooltip
                  permanent
                  direction="right"
                  offset={[20, 0]}
                  opacity={1}
                >
                  <div style={{
                    background: "#ff1744",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "11px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    border: "1px solid white",
                    textAlign: "center"
                  }}>
                    ATENÇÃO VOCE ESTA ENVADINDO UM RAIO <br/> DE OUTRA FREQUENCIA
                  </div>
                </Tooltip>
              )}

              {/* Nome do Cliente */}
              <Tooltip permanent direction="top" offset={[0, -25]} opacity={1}>
                <span style={{ fontWeight: "bold", fontSize: "12px", background: "white", padding: "4px 8px", borderRadius: "8px" }}>
                  {c.nomeCliente}
                </span>
              </Tooltip>

              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong>{c.nomeCliente}</strong><br />
                  <Button color="error" size="small" variant="contained" sx={{ mt: 1 }} onClick={() => onDelete(c.id)}>
                    Excluir cliente
                  </Button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}