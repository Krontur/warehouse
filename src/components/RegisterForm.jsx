import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const RegisterForm = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          updateProfile(user, {
            displayName: displayName,
          })
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // ..
        });
        alert('Usuario creado con éxito');
      // Usuario registrado exitosamente
      
    } catch (error) {
      console.error(error);
      // Maneja los errores aquí
    }
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
      <TextField
        label="Confirma Contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <TextField
      label="Benutzername"
      type="text"
      value={displayName}
      onChange={(e) => setDisplayName(e.target.value)}
    />
      <Button variant="contained" color="primary" type="submit">Registrarse</Button>
    </form>
  );
};

export default RegisterForm;
