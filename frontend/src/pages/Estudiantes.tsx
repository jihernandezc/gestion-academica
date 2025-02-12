"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from "@mui/icons-material";
import debounce from "lodash/debounce";

interface Estudiante {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  career: string;
}

const API_URL = "http://localhost:4000/students";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.3s ease",
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AnimatedTableContainer = styled(TableContainer)`
  animation: ${fadeIn} 0.5s ease-out;
`;

const StyledChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: theme.palette.primary.contrastText,
  fontWeight: "bold",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  },
}));

const StyledButton = styled(Button)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StyledIconButton = styled(IconButton)`
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    animation: ${fadeIn} 0.3s ease-out;
  }
`;

const Estudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [open, setOpen] = useState(false);
  const [currentEstudiante, setCurrentEstudiante] = useState<Estudiante | null>(null);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEstudiantes = async (search = "") => {
    setLoading(true);
    try {
      const url = search ? `${API_URL}/search/${search}` : API_URL;
      const response = await axios.get<Estudiante[]>(url);
      setEstudiantes(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => fetchEstudiantes(searchTerm), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchName);
  }, [searchName, debouncedSearch]);

  const handleOpen = (estudiante: Estudiante | null = null) => {
    setCurrentEstudiante(estudiante || { id: 0, name: "", lastName: "", email: "", phone: "", career: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!currentEstudiante) return;

    try {
      setLoading(true);
      const { id, ...estudianteData } = currentEstudiante;

      if (!id || Number(id) === 0) {
        const response = await axios.post(API_URL, estudianteData);
        setEstudiantes([...estudiantes, response.data]);
      } else {
        await axios.put(`${API_URL}/update/${id}`, estudianteData);
        setEstudiantes((prev) => prev.map((e) => (e.id === id ? { ...e, ...estudianteData } : e)));
      }

      handleClose();
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este estudiante?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setEstudiantes(estudiantes.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Estudiantes
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <StyledButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Agregar Estudiante
        </StyledButton>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Buscar estudiante"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            size="small"
          />
          <StyledButton variant="contained" color="primary" onClick={() => fetchEstudiantes(searchName)} startIcon={<SearchIcon />}>
            Buscar
          </StyledButton>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AnimatedTableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Nombre Completo</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Teléfono</StyledTableCell>
                <StyledTableCell>Carrera</StyledTableCell>
                <StyledTableCell align="center">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estudiantes.map((estudiante) => (
                <StyledTableRow key={estudiante.id}>
                  <TableCell>{estudiante.id}</TableCell>
                  <TableCell>{`${estudiante.name} ${estudiante.lastName}`}</TableCell>
                  <TableCell>{estudiante.email}</TableCell>
                  <TableCell>{estudiante.phone}</TableCell>
                  <TableCell>
                    <StyledChip label={estudiante.career} />
                  </TableCell>
                  <TableCell align="center">
                    <StyledIconButton onClick={() => handleOpen(estudiante)} color="primary">
                      <EditIcon />
                    </StyledIconButton>
                    <StyledIconButton onClick={() => handleDelete(estudiante.id)} color="error">
                      <DeleteIcon />
                    </StyledIconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </AnimatedTableContainer>
      )}
      <StyledDialog open={open} onClose={handleClose}>
        <DialogTitle>{currentEstudiante && currentEstudiante.id ? "Editar Estudiante" : "Agregar Estudiante"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentEstudiante?.name || ""}
            onChange={(e) => setCurrentEstudiante({ ...currentEstudiante!, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Apellido"
            fullWidth
            value={currentEstudiante?.lastName || ""}
            onChange={(e) => setCurrentEstudiante({ ...currentEstudiante!, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={currentEstudiante?.email || ""}
            onChange={(e) => setCurrentEstudiante({ ...currentEstudiante!, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={currentEstudiante?.phone || ""}
            onChange={(e) => setCurrentEstudiante({ ...currentEstudiante!, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Carrera"
            fullWidth
            value={currentEstudiante?.career || ""}
            onChange={(e) => setCurrentEstudiante({ ...currentEstudiante!, career: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <StyledButton onClick={handleSave} variant="contained" color="primary">
            Guardar
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default Estudiantes;