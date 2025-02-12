"use client"

import React, { useState, useEffect } from "react";
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
} from "@mui/material";

interface Curso {
  id: number;
  name: string;
  maxStudents: number;
  description: string;
  category: string;
}

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [open, setOpen] = useState(false);
  const [currentCurso, setCurrentCurso] = useState<Curso | null>(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4000/courses")
      .then((response) => {
        setCursos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener cursos:", error);
      });
  }, []);

  const handleOpen = (curso: Curso | null = null) => {
    setCurrentCurso(curso || { id: 0, name: "", maxStudents: 0, description: "", category: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (currentCurso) {
      if (currentCurso.id === 0) {
        axios.post("http://localhost:4000/courses", currentCurso)
          .then((response) => {
            setCursos([...cursos, response.data]);
          });
      } else {
        axios.put(`http://localhost:4000/courses/${currentCurso.id}`, currentCurso)
          .then(() => {
            setCursos(cursos.map((c) => (c.id === currentCurso.id ? currentCurso : c)));
          });
      }
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:4000/courses/${id}`)
      .then(() => {
        setCursos(cursos.filter((c) => c.id !== id));
      });
  };

  const handleSearch = () => {
    const id = Number.parseInt(searchId);
    const curso = cursos.find((c) => c.id === id);
    if (curso) {
      handleOpen(curso);
    } else {
      alert("Curso no encontrado");
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Cursos
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginBottom: "20px" }}>
        Agregar Curso
      </Button>
      <TextField
        label="Buscar por ID"
        variant="outlined"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{ marginLeft: "20px", marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginLeft: "20px", marginBottom: "20px" }}
      >
        Buscar
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Máx. Estudiantes</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id}>
                <TableCell>{curso.id}</TableCell>
                <TableCell>{curso.name}</TableCell>
                <TableCell>{curso.maxStudents}</TableCell>
                <TableCell>{curso.description}</TableCell>
                <TableCell>{curso.category}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(curso)}>Editar</Button>
                  <Button onClick={() => handleDelete(curso.id)}>Borrar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentCurso && currentCurso.id ? "Editar Curso" : "Agregar Curso"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentCurso?.name || ""}
            onChange={(e) => setCurrentCurso({ ...currentCurso!, name: e.target.value })}
          />
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
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cursos;