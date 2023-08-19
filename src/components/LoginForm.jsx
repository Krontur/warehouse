import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import '../css/LoginForm.css';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {signIn} = UserAuth();

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    await signIn(email, password);
      // Usuario ha iniciado sesión exitosamente
      navigate("/");
    }

  return (
    <div className='login-form'>
      <h2>Anmelden</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          InputLabelProps={{
            style: { color: '#fff' },
          }}
          label="Benutzer"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
        InputLabelProps={{
            style: { color: '#fff' },
          }}
          label="Kennwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">Anmelden</Button>
      </form>
    </div>
  );
};

export default LoginForm;
