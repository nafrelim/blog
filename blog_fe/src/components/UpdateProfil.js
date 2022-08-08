import React, {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {API} from "../blog_be";
import {useNavigate, useParams} from "react-router-dom";
import {Stack} from "@mui/material";

import Error from "./Error";
import Copyright from "./Copyright";
import TokenRefresh from "./TokenRefresh";

const theme = createTheme();

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState([]);
  let { user } = useParams();
  let navigate = useNavigate();

  useEffect(() => {

      TokenRefresh();

      axios(`${API}/auth/user/${user}/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setFirstname(response.data.first_name)
                setLastname(response.data.last_name)
                setUsername(response.data.username)
                setEmail(response.data.email)
            })
            .catch(error => setError(prevState => {
                if (error.response.status == 401 || error.response.status == 403 || error.response.status == 404) {
                    navigate("/", {replace: true});
                }
                return [...prevState, [0, 'Network error']]
            }))

  }, []);

  function handleSubmit (event) {
      event.preventDefault();
      setError([])
      if (firstname.length > 0 && lastname.length > 0 && username.length > 0) {
              axios(`${API}/auth/update_profile/${id}/`, {
                  method: 'PUT',
                  mode: 'same-origin',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  data: {
                      'username': username,
                      'first_name': firstname,
                      'last_name': lastname,
                      'email': email,
                  }
              })
                  .then(response => {
                      console.log(response.data)
                      navigate("/", {replace: true});
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
            <ModeEditIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit your profile
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
                  value={username}
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
                  value={firstname}
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
                  value={lastname}
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
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