import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/nafrelim/blog">
        Blog
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
            console.log(response.data)
            localStorage.setItem('token', response.data.access)
            localStorage.setItem('refresh', response.data.refresh)
            localStorage.setItem('username', username)
            navigate("/post", {replace: true});
          })
          .catch(error => setError(prevState => {
                return ([...prevState, [0, 'Network error: ' + error.message +
                '. Try to login again. If the error persists - there is a network or server error.']])
                }));
    } else {
      // Clearing the list of errors only before the next field validation
      //     setError([])
          if (username.length <= 2 && password.length <= 4) {
            setError(["username cannot be empty", "password cannot be empty"]);
          } else if (username.length <= 2) {
            setError(["username cannot be empty"]);
          } else {
            setError(["password cannot be empty"]);
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
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
                <Container component="main" sx={{mt: 8, mb: 2}} maxWidth="sm">
                <Grid item xs={12}>
                    {
                        error.length > 0
                        &&
                        <Stack sx={{width: '100%'}} spacing={2}>
                            <Error error={error}/>
                        </Stack>
                    }
                </Grid>
              </Container>
              </Box>
              <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
          </ThemeProvider>
      );
    }
}
