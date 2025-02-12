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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from "@mui/icons-material";
import debounce from "lodash/debounce";

interface Curso {
  id: number;
  name: string;
  maxStudents: number;
  description: string;
  category: string;
}

const API_URL = "http://localhost:4000/courses";

// Datos de cursos predefinidos
const data = [
  { name: "Matemáticas", estudiantes: 40 },
  { name: "Programacion", estudiantes: 30 },
  { name: "Ciencias", estudiantes: 35 },
  { name: "Tecnologia", estudiantes: 25 },
  { name: "Ingles", estudiantes: 45 },
];

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

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [open, setOpen] = useState(false);
  const [currentCurso, setCurrentCurso] = useState<Curso | null>(null);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCursos = async (search = "") => {
    setLoading(true);
    try {
      const url = search ? `${API_URL}/search/${search}` : API_URL;
      const response = await axios.get<Curso[]>(url);
      setCursos(response.data);
    } catch (error) {
      console.error("Error al cargar los cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => fetchCursos(searchTerm), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchName);
  }, [searchName, debouncedSearch]);

  const handleOpen = (curso: Curso | null = null) => {
    setCurrentCurso(curso || { id: 0, name: "", maxStudents: 0, description: "", category: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!currentCurso) return;

    try {
      setLoading(true);
      const { id, ...cursoData } = currentCurso;

      if (!id || Number(id) === 0) {
        const response = await axios.post(API_URL, cursoData);
        setCursos([...cursos, response.data]);
      } else {
        await axios.put(`${API_URL}/update/${id}`, cursoData);
        setCursos((prev) => prev.map((c) => (c.id === id ? { ...c, ...cursoData } : c)));
      }

      handleClose();
    } catch (error) {
      console.error("Error al guardar curso:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este curso?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setCursos(cursos.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar curso:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Cursos
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <StyledButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Agregar Curso
        </StyledButton>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Buscar curso"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            size="small"
          />
          <StyledButton variant="contained" color="primary" onClick={() => fetchCursos(searchName)} startIcon={<SearchIcon />}>
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
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell>Máx. Estudiantes</StyledTableCell>
                <StyledTableCell>Descripción</StyledTableCell>
                <StyledTableCell>Categoría</StyledTableCell>
                <StyledTableCell align="center">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cursos.map((curso) => (
                <StyledTableRow key={curso.id}>
                  <TableCell>{curso.id}</TableCell>
                  <TableCell>{curso.name}</TableCell>
                  <TableCell>{curso.maxStudents}</TableCell>
                  <TableCell>{curso.description}</TableCell>
                  <TableCell>
                    <StyledChip label={curso.category} />
                  </TableCell>
                  <TableCell align="center">
                    <StyledIconButton onClick={() => handleOpen(curso)} color="primary">
                      <EditIcon />
                    </StyledIconButton>
                    <StyledIconButton onClick={() => handleDelete(curso.id)} color="error">
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
        <DialogTitle>{currentCurso && currentCurso.id ? "Editar Curso" : "Agregar Curso"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="curso-name-label">Nombre del Curso</InputLabel>
            <Select
              labelId="curso-name-label"
              value={currentCurso?.name || ""}
              label="Nombre del Curso"
              onChange={(e) => setCurrentCurso({ ...currentCurso!, name: e.target.value })}
            >
              {data.map((curso) => (
                <MenuItem key={curso.name} value={curso.name}>
                  {curso.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Máx. Estudiantes"
            fullWidth
            type="number"
            value={currentCurso?.maxStudents || ""}
            onChange={(e) => setCurrentCurso({ ...currentCurso!, maxStudents: Number.parseInt(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={currentCurso?.description || ""}
            onChange={(e) => setCurrentCurso({ ...currentCurso!, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Categoría"
            fullWidth
            value={currentCurso?.category || ""}
            onChange={(e) => setCurrentCurso({ ...currentCurso!, category: e.target.value })}
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

export default Cursos;