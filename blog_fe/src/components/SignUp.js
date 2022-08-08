import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {API} from "../blog_be";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Stack} from "@mui/material";

import Error from "./Error";
import Copyright from "./Copyright";

const theme = createTheme();

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState([]);
  const [data, setData] = useState(false);
  let navigate = useNavigate();

  async function handleSubmit (event) {
      event.preventDefault();
      setError([])
      if (firstname.length > 0 && lastname.length > 0 && username.length > 0 && password.length > 0
          && password === password2) {
              await axios(`${API}/auth/register/`, {
                  method: 'POST',
                  mode: 'same-origin',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                  },
                  data: {
                      'username': username,
                      'first_name': firstname,
                      'last_name': lastname,
                      'email': email,
                      'password': password,
                      'password2': password2,
                  }
              })
                  .then(response => {
                      setData(true)
                      console.log(response.data)
                      localStorage.setItem('token', response.data.access)
                      localStorage.setItem('refresh', response.data.refresh)
                      localStorage.setItem('username', username)
                      navigate("/login", {replace: true});
                  })
                  .catch(e => {
                      if (e.response.status === 401 || e.response.status === 403) {
                          setError(prevState => {
                              return ([...prevState, [0, e.response.data.detail]])
                          })
                      }
                      if (e.response.status === 400) {
                          if (e.response.data['username']) {
                              setError(prevState => {
                                  return ([...prevState, [1, e.response.data['username']]])
                              })
                          }
                          if (e.response.data['email']) {
                              setError(prevState => {
                                  return ([...prevState, [1, e.response.data['email']]])
                              })
                          }
                          if (e.response.data['password']) {
                              setError(prevState => {
                                  return ([...prevState, [1, e.response.data['password']]])
                              })
                          }
                      }
                      if (e.response.status === 500) {
                          setError(prevState => {
                              return ([...prevState, [0, 'Network error: ' + e.response.data.detail +
                              '. Try to login again. If the error persists - there is a network or server error.']])
                          })
                      }
                  })
      } else {
          if (username < 1) {
              setError(prevState => {
                  return ([...prevState, [1, "Username cannot be empty."]])
              })
          }
          if (firstname < 1) {
              setError(prevState => {
                  return ([...prevState, [1, "First name cannot be empty."]])
              })
          }
          if (lastname < 1) {
              setError(prevState => {
                  return ([...prevState, [1, "Last name cannot be empty."]])
              })
          }
          if (email < 1) {
              setError(prevState => {
                  return ([...prevState, [1, "Email cannot be empty."]])
              })
          }
          if (password < 1) {
              setError(prevState => {
                  return ([...prevState, [1, "Password cannot be empty."]])
              })
          }
          if (password !== password2) {
              setError(prevState => {
                  return ([...prevState, [1, "Passwords do not match."]])
              })
          }
      }
  }

  return (
    // Display the user datata form
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AppRegistrationIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  onChange={e => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={e => setFirstname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  // autoComplete="family-name"
                  onChange={e => setLastname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  // autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  // autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Repeat password"
                  type="password"
                  id="password2"
                  // autoComplete="new-password"
                  onChange={e => setPassword2(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
          <Grid item xs={12}>
             {
                error.length > 0
                &&
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Error error={error}/>
                </Stack>
            }
          </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}