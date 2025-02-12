import type React from "react"
import { Typography, Grid, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}))

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Item>
            <Typography variant="h6">Total Estudiantes</Typography>
            <Typography variant="h4">150</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Item>
            <Typography variant="h6">Total Cursos</Typography>
            <Typography variant="h4">15</Typography>
          </Item>
        </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard

