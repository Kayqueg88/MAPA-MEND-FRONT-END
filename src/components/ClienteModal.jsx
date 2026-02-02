import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import { useState } from "react";

export default function ClienteModal({ open, onClose, onSave }) {
  // Estados para cada campo do formulário
  const [cliente, setCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [posto, setPosto] = useState("");
  const [equipamento, setEquipamento] = useState("");

  const handleSave = () => {
    // Envia todos os dados para a função salvarCliente no App.jsx
    onSave({ cliente, endereco, posto, equipamento });
    
    // Limpa os campos após salvar
    setCliente("");
    setEndereco("");
    setPosto("");
    setEquipamento("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo Posto de Cobertura</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nome do Cliente"
            fullWidth
            variant="outlined"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
          <TextField
            label="Endereço (Rua, Número, Cidade)"
            fullWidth
            variant="outlined"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
          <TextField
            label="Identificação do Posto (Ex: Torre Alpha)"
            fullWidth
            variant="outlined"
            value={posto}
            onChange={(e) => setPosto(e.target.value)}
          />
          <TextField
            label="Equipamento (Ex: Caltta PH600 / Hytera HP5)"
            fullWidth
            variant="outlined"
            value={equipamento}
            onChange={(e) => setEquipamento(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
}