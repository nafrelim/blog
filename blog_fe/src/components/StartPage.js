import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';

import Error from "./Error";
import {API} from "../blog_be";

import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";

const theme = createTheme();

const StartPage = () => {
    const [error, setError] = useState([]);
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        axios(`${API}/post/`, {
            method: "OPTIONS",
            mode: 'same-origin',
            headers: {
                'accept': 'application/json',
                'content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(logged)
                if (localStorage.getItem('username') !== null) {
                    setLogged(true);
                }
                console.log(logged)
            })
            .catch(error => setError(prevState => {
                return ([...prevState, [0, 'Network error: ' + error.message +
                '. Log in. If the error persists - there is a network or server error.']])
            }))
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <CssBaseline/>
            <Container sx={{mt: 8, mb: 2}} maxWidth="sm">
                <Typography variant="h4" component="h1">
                    Blog - this is what I can do ;-)
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                    <br/>
                    The purpose of this task is to prepare an E2E experience of a Blog.<br/><br/>
                    The application includes three main components:<br/>
                    1. Frontend application - blog_fe<br/>
                    2. Backend application - blog_be<br/>
                    3. Database<br/><br/>
                    The whole project on <Link href="https://github.com/nafrelim/cvt-blog"> {"github"}</Link>
                </Typography>
            </Container>
            {
                !logged
                &&
                <Container sx={{mt: 1, mb: 2}} maxWidth="sm">
                    <Typography variant="h5" color="inherit" paragraph>
                        <Link href="#/login/">
                            {"Sign in"}
                        </Link>
                        <br/>
                        - username: admin, author2, author2<br/>
                        - password:! 234567890<br/>
                    </Typography>
                </Container>
            }

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
    )
}

export default StartPage
