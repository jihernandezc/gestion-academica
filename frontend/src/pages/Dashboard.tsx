"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Typography, Grid, Paper, Box, Card, CardContent, CardHeader, Avatar } from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
} from "@mui/icons-material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const API_COURSES_COUNT = "http://localhost:4000/count/courses"
const API_STUDENTS_COUNT = "http://localhost:4000/count/students"
const API_COURSES = "http://localhost:4000/courses"
const API_COURSES_ASSIGNED = "http://localhost:4000/courses/assigned/count"
const API_UNASSIGNED_STUDENTS = "http://localhost:4000/unassigned/students"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "100%",
}))

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}))

interface Course {
  id: number
  name: string
}

interface AssignedCourse {
  courseId: number
  count: number
}

interface UnassignedStudent {
  courseId: number
  count: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    totalEstudiantes: number
    totalCursos: number
    matriculasActivas: number
    solicitudesCupo: number
    cursosConMasEstudiantes: { name: string; count: number }[]
  }>({
    totalEstudiantes: 0,
    totalCursos: 0,
    matriculasActivas: 0,
    solicitudesCupo: 0,
    cursosConMasEstudiantes: [],
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          studentsResponse,
          coursesResponse,
          allCoursesResponse,
          assignedCoursesResponse,
          unassignedStudentsResponse,
        ] = await Promise.all([
          axios.get<number>(API_STUDENTS_COUNT),
          axios.get<number>(API_COURSES_COUNT),
          axios.get<Course[]>(API_COURSES),
          axios.get<AssignedCourse[]>(API_COURSES_ASSIGNED),
          axios.get<UnassignedStudent[]>(API_UNASSIGNED_STUDENTS),
        ])

        const courses = allCoursesResponse.data
        const assignedCourses = assignedCoursesResponse.data
        const unassignedStudents = unassignedStudentsResponse.data

        // Mapeo de IDs a nombres de cursos
        const courseMap = new Map<number, string>()
        courses.forEach(course => {
          courseMap.set(course.id, course.name)
        })

        // Combinar datos de estudiantes inscritos con nombres de cursos
        const formattedCourses = assignedCourses
          .map(({ courseId, count }) => ({
            name: courseMap.get(courseId) || `Curso ${courseId}`,
            count,
          }))
          .sort((a, b) => b.count - a.count) // Ordenar de mayor a menor

        // Sumar todas las solicitudes de cupo
        const totalSolicitudesCupo = unassignedStudents.reduce((acc, curr) => acc + curr.count, 0)

        setStats({
          totalEstudiantes: studentsResponse.data,
          totalCursos: coursesResponse.data,
          matriculasActivas: assignedCourses.reduce((acc, curr) => acc + curr.count, 0),
          solicitudesCupo: totalSolicitudesCupo,
          cursosConMasEstudiantes: formattedCourses.slice(0, 5), // Tomar los 5 cursos con más estudiantes
        })
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: "primary.main" }}><PeopleIcon /></Avatar>}
              title="Total Estudiantes"
            />
            <CardContent>
              <Typography variant="h4">{stats.totalEstudiantes}</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: "secondary.main" }}><SchoolIcon /></Avatar>}
              title="Total Cursos"
            />
            <CardContent>
              <Typography variant="h4">{stats.totalCursos}</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: "error.main" }}><AssignmentIcon /></Avatar>}
              title="Matrículas Activas"
            />
            <CardContent>
              <Typography variant="h4">{stats.matriculasActivas}</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: "warning.main" }}><GradeIcon /></Avatar>}
              title="Solicitudes de Cupo"
            />
            <CardContent>
              <Typography variant="h4">{stats.solicitudesCupo}</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Cursos con Más Estudiantes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.cursosConMasEstudiantes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
