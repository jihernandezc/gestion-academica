"use client"

import type React from "react"
import { Typography, Grid, Paper, Box, Card, CardContent, CardHeader, Avatar } from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
} from "@mui/icons-material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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

const data = [
  { name: "Matemáticas", estudiantes: 40 },
  { name: "Literatura", estudiantes: 30 },
  { name: "Ciencias", estudiantes: 35 },
  { name: "Historia", estudiantes: 25 },
  { name: "Inglés", estudiantes: 45 },
]

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <PeopleIcon />
                </Avatar>
              }
              title="Total Estudiantes"
            />
            <CardContent>
              <Typography variant="h4">150</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <SchoolIcon />
                </Avatar>
              }
              title="Total Cursos"
            />
            <CardContent>
              <Typography variant="h4">15</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "error.main" }}>
                  <AssignmentIcon />
                </Avatar>
              }
              title="Matrículas Activas"
            />
            <CardContent>
              <Typography variant="h4">120</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <GradeIcon />
                </Avatar>
              }
              title="Promedio General"
            />
            <CardContent>
              <Typography variant="h4">8.5</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Estudiantes por Curso
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
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

export default Dashboard