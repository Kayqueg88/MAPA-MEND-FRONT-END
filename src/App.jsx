// 1. IMPORTAÇÕES: Adicionei o Drawer e o MenuIcon que estavam faltando nas suas importações
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu'; // Importação do ícone de hambúrguer
import { useEffect, useState } from "react";
import ClienteModal from "./components/ClienteModal";
import MapView from "./components/MapView";
import { geocodeEndereco } from "./services/geocode";


const API_URL = "http://localhost:5278";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [center, setCenter] = useState([-23.5505, -46.6333]);
  const [menuOpen, setMenuOpen] = useState(false); // Estado que controla o Menu Lateral

  useEffect(() => {
    fetch(`${API_URL}/api/mapa`)
      .then(r => r.json())
      .then(setClientes)
      .catch(err => console.error("Erro ao carregar dados:", err));
  }, []);

  async function salvarCliente(dadosDoModal) {
    try {
      const geo = await geocodeEndereco(dadosDoModal.endereco);
      const corpoRequisicao = {
        endereco: dadosDoModal.endereco,
        cliente: dadosDoModal.cliente,
        posto: dadosDoModal.posto,
        equipamento: dadosDoModal.equipamento,
        latitude: geo.lat,
        longitude: geo.lng
      };

      const res = await fetch(`${API_URL}/api/mapa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpoRequisicao)
      });

      if (!res.ok) throw new Error("Erro ao salvar no servidor");

      const novoPostoComId = await res.json();
      alert(`✅ Novo Posto Cadastrado!\nID Gerado: ${novoPostoComId.id}\nPosto: ${novoPostoComId.posto}`);

      setClientes(prev => [...prev, novoPostoComId]);
      setCenter([geo.lat, geo.lng]);
      setOpen(false);
    } catch (error) {
      console.error("Erro no processo de salvamento:", error);
      alert("Erro ao salvar posto. Verifique a conexão com o Back-end.");
    }
  }

  async function deletarCliente(id) {
    if (!confirm("Deseja excluir este posto?")) return;
    await fetch(`${API_URL}/api/mapa/${id}`, { method: "DELETE" });
    setClientes(prev => prev.filter(c => c.id !== id));
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#002e5c'}}>
        <Toolbar>
          <IconButton

            size="large"
            edge="start"
            color="inherit"
            aria-label="menu" 
            sx={{mr: 2,}} 
            onClick={() => setMenuOpen(true)} // Fecha o menu automaticamente ao clicar em qualquer opção
          >
            <MenuIcon /> 
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mend Telecom
           <img src="./assetsd" alt="" />
          </Typography>

        </Toolbar>
      </AppBar>
      {/* configs do menu suspenso*/}
      <Drawer 
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)} 
      >
        <div 
          style={{ width: 250 }}
          onClick={() => setMenuOpen(false)} // Fecha ao clicar em qualquer lugar do menu
        >  
           {/* Itens do menu*/}
          <List
            sx={{ mt: 2,}}>
            <ListItem button onClick={() => setOpen(true)}>
              <ListItemText primary="Cadastrar Novo Posto" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Funções futuras" />
            </ListItem>
          </List>
        </div>
      </Drawer>

      <MapView
        clientes={clientes}
        center={center}
        onDelete={deletarCliente}
      />

      <ClienteModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={salvarCliente}
      />
    </>
  );
}