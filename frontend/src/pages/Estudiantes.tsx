import * as React from "react";
import { useState, useEffect } from "react";
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

interface Estudiante {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  career: string;
}

const API_URL = "http://localhost:4000/students";

const Estudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [open, setOpen] = useState(false);
  const [currentEstudiante, setCurrentEstudiante] = useState<Estudiante | null>(null);
  const [searchName, setSearchName] = useState("");

  // Cargar estudiantes desde la API
  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get<Estudiante[]>(API_URL);
      setEstudiantes(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    }
  };

  const handleOpen = (estudiante: Estudiante | null = null) => {
    setCurrentEstudiante(estudiante || { id: 0, name: "", lastName: "", email: "", phone: "", career: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (currentEstudiante) {
      try {
        let estudianteData = {
          ...currentEstudiante,
          id: Number(currentEstudiante.id), // Ensure id is a number
        };

        console.log("Datos que se envían al backend:", estudianteData); // Agrega este console.log

        if (estudianteData.id === 0) {
          // Crear nuevo estudiante
          const { id, ...dataWithoutId } = estudianteData; // Eliminar el id del objeto
          const response = await axios.post(API_URL, dataWithoutId);
          setEstudiantes([...estudiantes, response.data]);
        } else {
          // Editar estudiante existente
          await axios.put(`${API_URL}/${estudianteData.id}`, estudianteData);
          setEstudiantes(estudiantes.map((e) => (e.id === estudianteData.id ? estudianteData : e)));
        }
        handleClose();
      } catch (error) {
        console.error("Error al guardar estudiante:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este estudiante?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setEstudiantes(estudiantes.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      alert("Por favor, ingresa un nombre o apellido válido");
      return;
    }
  
    try {
      const response = await axios.get<Estudiante[]>(`${API_URL}/search/${searchName}`);
  
      if (response.data.length > 0) {
        setEstudiantes(response.data);
      } else {
        alert("Estudiante no encontrado");
      }
    } catch (error: any) {
      alert("Ocurrió un error al buscar el estudiante");
      console.error("Error al buscar estudiante:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Estudiantes
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginBottom: "20px" }}>
        Agregar Estudiante
      </Button>
      <TextField
        label="Buscar por Nombre"
        variant="outlined"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
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
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Carrera</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes.map((estudiante) => (
              <TableRow key={estudiante.id}>
                <TableCell>{estudiante.id}</TableCell>
                <TableCell>{`${estudiante.name} ${estudiante.lastName}`}</TableCell>
                <TableCell>{estudiante.email}</TableCell>
                <TableCell>{estudiante.phone}</TableCell>
                <TableCell>{estudiante.career}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(estudiante)}>Editar</Button>
                  <Button color="secondary" onClick={() => handleDelete(estudiante.id)}>
                    Borrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentEstudiante && currentEstudiante.id ? "Editar Estudiante" : "Agregar Estudiante"}
        </DialogTitle>
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
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Estudiantes;