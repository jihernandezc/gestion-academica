import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Students from './components/Students';

const App: React.FC = () => {
  return (
    <Container>
      <CssBaseline />
      <Students />
    </Container>
  );
};

export default App;