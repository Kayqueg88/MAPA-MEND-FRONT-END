import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import Login from "./components/Login";
import ClienteModal from "./components/ClienteModal";
import MapView from "./components/MapView";
import { geocodeEndereco } from "./services/geocode";

const API_URL = "http://localhost:5278";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [center, setCenter] = useState([-23.5505, -46.6333]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Carregar clientes ao autenticar
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch(`${API_URL}/api/mapa`)
      .then(r => {
        if (!r.ok) throw new Error("Falha ao carregar dados");
        return r.json();
      })
      .then(setClientes)
      .catch(err => console.error("Erro ao carregar dados:", err));
  }, [isAuthenticated]);

  // Função de login
  async function handleLogin(email, password) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {  // <- CORRIGIDO
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const msg = await res.text();
      setLoginError(msg || "Erro no login");
      return;
    }

    setIsAuthenticated(true);
    setLoginError("");
  } catch (err) {
    console.error("Erro de login:", err);
    setLoginError("Erro ao conectar com o servidor");
  }
}


  // Salvar novo cliente
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

      const novoPosto = await res.json();
      setClientes(prev => [...prev, novoPosto]);
      setCenter([geo.lat, geo.lng]);
      setOpen(false);
    } catch {
      alert("Erro ao salvar posto");
    }
  }

  // Deletar cliente
  async function deletarCliente(id) {
    if (!confirm("Deseja excluir este posto?")) return;
    await fetch(`${API_URL}/api/mapa/${id}`, { method: "DELETE" });
    setClientes(prev => prev.filter(c => c.id !== id));
  }

  // Se não estiver logado, mostrar Login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} loginError={loginError} />;
  }

  // App principal
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#002e5c' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography sx={{ flexGrow: 1 }} />

          <img
            src="src/assets/Mendbranco.png"
            alt="Logo"
            style={{ width: 140 }}
          />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}
      //style lista drawer
         PaperProps={{
        sx: {
         backgroundColor: '#002e5c',
         color: '#fff',
         width: 260,
         display: 'flex',
        flexDirection: 'column'
       }  }}
            //itens da lista de menu
        >
        <List
        sx ={{ flexGrow:1 }}>
          <ListItem button onClick={() => setOpen(true)}>
            <ListItemText primary="Cadastrar Novo Posto" />
          </ListItem>

          <ListItem button onClick={() => setIsAuthenticated(false)}>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>
        <Box sx={{ p: 2, display:'flex', justifyContent:'center' }}>
        <img src="src/assets/Mendbranco.png" alt="Logo" style={{ width: 230 }} />
        </Box>

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
