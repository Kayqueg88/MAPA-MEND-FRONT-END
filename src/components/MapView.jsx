import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Circle } from "react-leaflet";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import L from "leaflet";



const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const criarIconeFoto = (urlFoto, estaInvadindo) => {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 55px;
        height: 55px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid ${estaInvadindo ? "#ff1744" : "#001A72"};
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <img 
          src="${urlFoto || "/HP5.png"}" 
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
        />
      </div>
    `,
    iconSize: [55, 55],
    iconAnchor: [27, 55]
  });
};

export default function MapView({ clientes, center, onDelete }) {

  const [clienteSelecionado, setClienteSelecionado] = useState(null);

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
    <>
   <MapContainer
  center={center}
  zoom={13}
  style={{
    height: "calc(100vh - 64px)",
    width: "100%",
    overflow: "hidden"
  }}
>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {clientes.map((c) => {
          const estaInvadindo = verificarInvasao(c);

          return (
            <React.Fragment key={c.id}>

              {/* Círculo de cobertura */}
              <Circle
                center={[c.latitude, c.longitude]}
                radius={2000}
                pathOptions={{
                  fillColor: estaInvadindo ? "red" : "#1976d2",
                  color: estaInvadindo ? "red" : "#1976d2",
                  weight: 2,
                  opacity: 0.5,
                  fillOpacity: 0.2
                }}
              />

              {/* Marker com imagem personalizada */}
              <Marker
                position={[c.latitude, c.longitude]}
                icon={criarIconeFoto(c.foto, estaInvadindo)}
                eventHandlers={{
                  click: () => setClienteSelecionado(c)
                }}
              >


              </Marker>

            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* MODAL DE INFORMAÇÕES */}
      <Dialog
        open={!!clienteSelecionado}
        onClose={() => setClienteSelecionado(null)}
        maxWidth="sm"
        fullWidth
      >
        {clienteSelecionado && (
          <>
            <DialogTitle>
              {clienteSelecionado.nomeCliente}
            </DialogTitle>

            <DialogContent dividers>
              <Typography sx={{ mb: 1 }}>
                <strong>Endereço:</strong> {clienteSelecionado.endereco}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Posto:</strong> {clienteSelecionado.posto}
              </Typography>

              <Typography>
                <strong>Equipamento:</strong> {clienteSelecionado.equipamento}
              </Typography>
            </DialogContent>

            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => setClienteSelecionado(null)}
              >
                Fechar
              </Button>

              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  onDelete(clienteSelecionado.id);
                  setClienteSelecionado(null);
                }}
              >
                Excluir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
