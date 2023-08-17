import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const LoginForm = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
        console.log( userCredential.user.email + "se ha logueado" )
      // Usuario ha iniciado sesión exitosamente
      navigate("/");
    })
    .catch ((error) => {
      console.error(error);
      // Maneja los errores aquí
    });
    };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
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
      <Button variant="contained" color="primary" type="submit">Iniciar sesión</Button>
    </form>
  );
};

export default LoginForm;
