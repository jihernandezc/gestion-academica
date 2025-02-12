"use client"

import * as React from "react";
import { useState } from "react"
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
} from "@mui/material"
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

interface Estudiante {
  id: number
  name: string
  lastName: string
  email: string
  phone: string
  career: string
  // cursos?: { id: number; name: string; finalGrade: number }[];
}

const Estudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  useEffect(() => {
    axios.get("http://localhost:4000/students")
      .then((response) => {
        setEstudiantes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener estudiantes:", error);
      });
  }, []);

  const [open, setOpen] = useState(false)
  const [currentEstudiante, setCurrentEstudiante] = useState<Estudiante | null>(null)
  const [searchId, setSearchId] = useState("")

  const handleOpen = (estudiante: Estudiante | null = null) => {
    setCurrentEstudiante(estudiante || { id: 0, name: "", lastName: "", email: "", phone: "", career: "" })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    if (currentEstudiante) {
      if (currentEstudiante.id === 0) {
        // Add new estudiante
        setEstudiantes([...estudiantes, { ...currentEstudiante, id: estudiantes.length + 1 }])
      } else {
        // Update existing estudiante
        setEstudiantes(estudiantes.map((e) => (e.id === currentEstudiante.id ? currentEstudiante : e)))
      }
    }
    handleClose()
  }

  const handleDelete = (id: number) => {
    setEstudiantes(estudiantes.filter((e) => e.id !== id))
  }

  const handleSearch = () => {
    const id = Number.parseInt(searchId)
    const estudiante = estudiantes.find((e) => e.id === id)
    if (estudiante) {
      handleOpen(estudiante)
    } else {
      alert("Estudiante no encontrado")
    }
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Estudiantes
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginBottom: "20px" }}>
        Agregar Estudiante
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
              <TableCell>Apellido</TableCell>
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
                <TableCell>{estudiante.name}</TableCell>
                <TableCell>{estudiante.lastName}</TableCell>
                <TableCell>{estudiante.email}</TableCell>
                <TableCell>{estudiante.phone}</TableCell>
                <TableCell>{estudiante.career}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(estudiante)}>Editar</Button>
                  <Button onClick={() => handleDelete(estudiante.id)}>Borrar</Button>
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
  )
}

export default Estudiantes

