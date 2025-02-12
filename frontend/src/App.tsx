import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Layout from "./components/Layout.tsx"
import Dashboard from "./pages/Dashboard"
import Estudiantes from "./pages/Estudiantes"
import Cursos from "./pages/Cursos"
import Enrollments from "./pages/Enrollments"

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/matriculas" element={<Enrollments />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App

