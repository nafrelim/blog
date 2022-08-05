import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {API} from "../blog_be";
import {Stack} from "@mui/material";

import Error from "./Error";
import Copyright from "./Copyright";


const theme = createTheme();

export default function signIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState([]);
  const [data, setData] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError([])
    if (username.length > 0 && password.length > 0) {
      axios(`${API}/auth/login/`, {
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          'username': username,
          'password': password,
        }
      })
          .then(response => {
            setData(true)
            localStorage.setItem('token', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)
            localStorage.setItem('username', username)
            navigate("/post", {replace: true});
          })
          .catch(e => {
              if (e.response.status === 401) {
                  setError(prevState => {
                      return ([...prevState, [0, e.response.data.detail]])
                  })
              }
              if (e.response.status === 500) {
                  setError(prevState => {
                      return ([...prevState, [0, 'Network error: ' + e.response.data.detail +
                      '. Try to login again. If the error persists - there is a network or server error.']])
                  })
              }
          });
    } else {
      // Clearing the list of errors only before the next field validation
          if (username.length < 1) {
              console.log("username cannot be empty")
              setError(prevState => {
                  return ([...prevState, [1, "username cannot be empty"]])
              })
          }
          if (password.length < 1) {
              console.log("password cannot be empty")
              setError(prevState => {
                  return ([...prevState, [1, "password cannot be empty"]])
              })
          }
    }
  }

  if (!data) {
      return (
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline/>
              <Box
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
              >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                  <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="User name"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      onChange={e => setUsername(e.target.value)}
                  />
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={e => setPassword(e.target.value)}
                  />
                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{mt: 3, mb: 2}}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      {/*<Link href="#" variant="body2">*/}
                      {/*  Forgot password?*/}
                      {/*</Link>*/}
                    </Grid>
                    <Grid item>
                      <Link href="#/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
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
              </Box>
              <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
          </ThemeProvider>
      );
    }
}
