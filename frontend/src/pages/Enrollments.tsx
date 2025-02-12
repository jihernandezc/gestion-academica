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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from "@mui/icons-material";
import debounce from "lodash/debounce";

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  finalGrade?: number;
  isAssigned: boolean;
}

interface Student {
  id: number;
  name: string;
  lastName: string;
}

interface Course {
  id: number;
  name: string;
}

const API_URL = "http://localhost:4000";

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

const Enrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterAssigned, setFilterAssigned] = useState<string>("all");

  const fetchEnrollments = async (nameSearch = "", courseSearch = "", filter = "all") => {
    setLoading(true);
    try {
      const url = `${API_URL}/enrollments`;
      const response = await axios.get<Enrollment[]>(url);
      let data = response.data;

      if (filter !== "all") {
        data = data.filter((enrollment) => (filter === "assigned" ? enrollment.isAssigned : !enrollment.isAssigned));
      }

      if (nameSearch || courseSearch) {
        const lowercasedNameSearch = nameSearch.toLowerCase();
        const lowercasedCourseSearch = courseSearch.toLowerCase();
        data = data.filter((enrollment) => {
          const student = students.find((s) => s.id === enrollment.studentId);
          const course = courses.find((c) => c.id === enrollment.courseId);
          return (
            (student && `${student.name} ${student.lastName}`.toLowerCase().includes(lowercasedNameSearch)) &&
            (course && course.name.toLowerCase().includes(lowercasedCourseSearch))
          );
        });
      }

      setEnrollments(data);
    } catch (error) {
      console.error("Error al obtener matriculas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get<Student[]>(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get<Course[]>(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  const debouncedSearch = useCallback(
    debounce((nameSearchTerm: string, courseSearchTerm: string) => fetchEnrollments(nameSearchTerm, courseSearchTerm, filterAssigned), 300),
    [filterAssigned, students, courses]
  );

  useEffect(() => {
    debouncedSearch(searchName, searchCourse);
  }, [searchName, searchCourse, debouncedSearch]);

  useEffect(() => {
    fetchEnrollments(searchName, searchCourse, filterAssigned);
  }, [filterAssigned]);

  const handleOpen = (enrollment: Enrollment | null = null) => {
    setCurrentEnrollment(enrollment || { id: 0, studentId: 0, courseId: 0, isAssigned: false });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!currentEnrollment) return;

    try {
      setLoading(true);
      const { id, ...enrollmentData } = currentEnrollment;

      if (!id || Number(id) === 0) {
        const response = await axios.post(`${API_URL}/enrollments`, enrollmentData);
        setEnrollments([...enrollments, response.data]);
      } else {
        await axios.put(`${API_URL}/enrollments/update/${id}`, enrollmentData);
        setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, ...enrollmentData } : e)));
      }

      handleClose();
    } catch (error) {
      console.error("Error al guardar matricula:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta matricula?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/enrollments/${id}`);
      setEnrollments(enrollments.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar matricula:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Matrículas
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <StyledButton variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Agregar Matrícula
        </StyledButton>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Buscar por nombre de estudiante"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            size="small"
          />
          <TextField
            label="Buscar por nombre de curso"
            variant="outlined"
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
            size="small"
          />
          <FormControl variant="outlined" size="small">
            <InputLabel>Filtrar por asignación</InputLabel>
            <Select
              value={filterAssigned}
              onChange={(e) => setFilterAssigned(e.target.value)}
              label="Filtrar por asignación"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="assigned">Asignados</MenuItem>
              <MenuItem value="unassigned">No Asignados</MenuItem>
            </Select>
          </FormControl>
          <StyledButton variant="contained" color="primary" onClick={() => fetchEnrollments(searchName, searchCourse, filterAssigned)} startIcon={<SearchIcon />}>
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
                <StyledTableCell>Estudiante</StyledTableCell>
                <StyledTableCell>Curso</StyledTableCell>
                <StyledTableCell>Nota Final</StyledTableCell>
                <StyledTableCell>Asignado</StyledTableCell>
                <StyledTableCell align="center">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => {
                const student = students.find((s) => s.id === enrollment.studentId);
                const course = courses.find((c) => c.id === enrollment.courseId);
                return (
                  <StyledTableRow key={enrollment.id}>
                    <TableCell>{enrollment.id}</TableCell>
                    <TableCell>{student ? `${student.name} ${student.lastName}` : "N/A"}</TableCell>
                    <TableCell>{course ? course.name : "N/A"}</TableCell>
                    <TableCell>{enrollment.finalGrade ?? "N/A"}</TableCell>
                    <TableCell>
                      <StyledChip label={enrollment.isAssigned ? "Sí" : "No"} />
                    </TableCell>
                    <TableCell align="center">
                      <StyledIconButton onClick={() => handleOpen(enrollment)} color="primary">
                        <EditIcon />
                      </StyledIconButton>
                      <StyledIconButton onClick={() => handleDelete(enrollment.id)} color="error">
                        <DeleteIcon />
                      </StyledIconButton>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </AnimatedTableContainer>
      )}
      <StyledDialog open={open} onClose={handleClose}>
        <DialogTitle>{currentEnrollment && currentEnrollment.id ? "Editar Matrícula" : "Agregar Matrícula"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Estudiante</InputLabel>
            <Select
              value={currentEnrollment?.studentId ?? ""}
              onChange={(e) => setCurrentEnrollment({ ...currentEnrollment!, studentId: Number(e.target.value) })}
              label="Estudiante"
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {`${student.name} ${student.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Curso</InputLabel>
            <Select
              value={currentEnrollment?.courseId ?? ""}
              onChange={(e) => setCurrentEnrollment({ ...currentEnrollment!, courseId: Number(e.target.value) })}
              label="Curso"
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Nota Final"
            fullWidth
            type="number"
            value={currentEnrollment?.finalGrade ?? ""}
            onChange={(e) => setCurrentEnrollment({ ...currentEnrollment!, finalGrade: Number(e.target.value) })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Asignado</InputLabel>
            <Select
              value={currentEnrollment?.isAssigned ? "Sí" : "No"}
              onChange={(e) => setCurrentEnrollment({ ...currentEnrollment!, isAssigned: e.target.value === "Sí" })}
              label="Asignado"
            >
              <MenuItem value="Sí">Sí</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
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

export default Enrollments;