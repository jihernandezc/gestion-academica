"use client";

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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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
  maxStudents: number;
  description: string;
  category: string;
}

// URL del API Gateway
const API_GATEWAY_URL = "http://localhost:4000";

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

const Enrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCoursesWithAvailableSeats();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Enrollment[]>(`${API_GATEWAY_URL}/enrollments`);
      setEnrollments(response.data);
    } catch (error) {
      console.error("Error al cargar las matrículas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get<Student[]>(`${API_GATEWAY_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error al cargar los estudiantes:", error);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
        const response = await axios.get<Course[]>(`${API_GATEWAY_URL}/courses/assigned-counts`);
        const allCourses = response.data;
    
        // Filtrar solo los cursos con cupos disponibles
        const availableCourses = allCourses.filter(course => course.maxStudents > (course as any).enrolledStudents);
        
        setCourses(availableCourses);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      }
    };

  const handleOpen = () => {
    setSelectedStudent(null);
    setSelectedCourse(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (selectedStudent && selectedCourse) {
      try {
        setLoading(true);
        const enrollmentData = {
          studentId: selectedStudent,
          courseId: selectedCourse,
          isAssigned: true,
        };
        const response = await axios.post(`${API_GATEWAY_URL}/enrollments`, enrollmentData);
        setEnrollments([...enrollments, response.data]);
        handleClose();
      } catch (error) {
        console.error("Error al guardar la matrícula:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
        Matrículas
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: "20px" }}>
        Matricular Estudiante
      </Button>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Estudiante ID</StyledTableCell>
                <StyledTableCell>Curso ID</StyledTableCell>
                <StyledTableCell>Nota Final</StyledTableCell>
                <StyledTableCell>Asignado</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => (
                <StyledTableRow key={enrollment.id}>
                  <TableCell>{enrollment.id}</TableCell>
                  <TableCell>{enrollment.studentId}</TableCell>
                  <TableCell>{enrollment.courseId}</TableCell>
                  <TableCell>{enrollment.finalGrade ?? "N/A"}</TableCell>
                  <TableCell>{enrollment.isAssigned ? "Sí" : "No"}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Matricular Estudiante</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Estudiante</InputLabel>
            <Select
              value={selectedStudent ?? ""}
              onChange={(e) => setSelectedStudent(Number(e.target.value))}
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
              value={selectedCourse ?? ""}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
              label="Curso"
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Enrollments;
