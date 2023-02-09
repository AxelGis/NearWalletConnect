import React from 'react';
import { LoginForm } from './components/Login';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import './App.css';

function App() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <LoginForm />
      </Box>
    </Container>
  );
}

export default App;
