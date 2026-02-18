import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import LogoutIcon from "@mui/icons-material/Logout";

import { useEffect, useState } from "react";
import Login from "./components/Login";
import ClienteModal from "./components/ClienteModal";
import MapView from "./components/MapView";
import { geocodeEndereco } from "./services/geocode";
import Logo from "./assets/Mendbranco.png";
const API_URL = "http://localhost:5278";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [center, setCenter] = useState([-23.5505, -46.6333]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

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

  async function handleLogin(email, password) {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
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

  async function deletarCliente(id) {
    if (!confirm("Deseja excluir este posto?")) return;
    await fetch(`${API_URL}/api/mapa/${id}`, { method: "DELETE" });
    setClientes(prev => prev.filter(c => c.id !== id));
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} loginError={loginError} />;
  }

  return (
    <>
      {/* APPBAR */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #002e5c, #001f3f)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ color: "#fff", mr: 2 }}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            sx={{
              flexGrow: 1,
              fontFamily: "Inter",
              fontWeight: 600,
              letterSpacing: 1,
              fontSize: 18
            }}
          >
    
          </Typography>

          <img
            src="src/assets/Mendbranco.png"
            alt="Laogo"
            style={{ width: 130 }}
          />
        </Toolbar>
      </AppBar>


      <Drawer
  anchor="left"
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
  PaperProps={{
    sx: {
      width: 260,
      background: "linear-gradient(180deg, #002e5c 0%, #001f3f 100%)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter",
      overflowX: "hidden" // 🔥 impede scroll horizontal
    }
  }}
>
  {/* TÍTULO */}
  <Box sx={{ p: 3 }}>
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: 1
      }}
    >
      MEND TELECOMUNICAÇÕES
    </Typography>
  </Box>

  <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />

  {/* MENU */}
  <List sx={{ flexGrow: 1, mt: 2 }}>
    <ListItem
      onClick={() => {
        setOpen(true);
        setMenuOpen(false);
      }}
      sx={{
        cursor: "pointer",
        mx: 2,
        borderRadius: 2,
        mb: 2,
        backgroundColor: "#0d6efd",
        transition: "0.2s",
        "&:hover": {
          backgroundColor: "#0b5ed7",
          transform: "translateY(-2px)"
        }
      }}
    >
      <AddLocationAltIcon sx={{ mr: 2, color: "#fff" }} />
      <ListItemText
        primary="Cadastrar Novo Posto"
        primaryTypographyProps={{
          fontWeight: 600,
          fontSize: 15,
          color: "#fff",
          letterSpacing: 0.5
        }}
      />
    </ListItem>

    <ListItem
      onClick={() => setIsAuthenticated(false)}
      sx={{
        cursor: "pointer",
        mx: 2,
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.08)",
          transform: "translateX(4px)"
        }
      }}
    >
      <LogoutIcon sx={{ mr: 2 }} />
      <ListItemText
        primary="Sair"
        primaryTypographyProps={{
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: 0.5
        }}
      />
    </ListItem>
  </List>

  {/* LOGO INFERIOR */}
  <Box
    sx={{
      px: 3,
      pb: 3,
      display: "flex",
      justifyContent: "center",
      overflow: "hidden"
    }}
  >
    <img
      src="src/assets/Mendbranco.png"
      alt="Logo"
      style={{
        maxWidth: "100%", // 🔥 nunca ultrapassa
        height: "auto",
        opacity: 0.9
      }}
    />
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
