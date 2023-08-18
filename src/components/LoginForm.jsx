import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {signIn, user} = UserAuth();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    await signIn(email, password);
    console.log( user.email + "se ha logueado" );
      // Usuario ha iniciado sesión exitosamente
      navigate("/");
    }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" type="submit">Anmelden</Button>
    </form>
  );
};

export default LoginForm;
