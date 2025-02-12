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

const API_URL = "http://localhost:4000/dashboard"

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

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    totalCursos: 0,
    matriculasActivas: 0,
    promedioGeneral: 0,
    estudiantesPorCurso: [],
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(API_URL)
        setStats(response.data)
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
              avatar={<Avatar sx={{ bgcolor: "success.main" }}><GradeIcon /></Avatar>}
              title="Promedio General"
            />
            <CardContent>
              <Typography variant="h4">{stats.promedioGeneral}</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Estudiantes por Curso
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.estudiantesPorCurso}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="estudiantes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
