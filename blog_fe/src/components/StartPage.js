import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import Container from '@mui/material/Container';
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";

import axios from "axios";

import Error from "./Error";
import {API} from "../blog_be";
import Copyright from "./Copyright";
import TokenRefresh from "./TokenRefresh";
import {useNavigate} from "react-router-dom";

const StartPage = () => {
    let navigate = useNavigate();
    const [error, setError] = useState([]);
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        if (TokenRefresh()) {
             console.log('token refreshed in post list')
             location.reload()
        }
        if (localStorage.getItem('token') === null || localStorage.getItem('refresh') === null) {
            navigate('/')
        }

        console.log('start page')

        axios(`${API}/api/post/`, {
            method: "HEAD",
            mode: 'same-origin',
            headers: {
                'accept': 'application/json',
                'content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        })
            .then(response => {
                setLogged(true);
            })
            .catch(e => {
                if (e?.response?.status === 403) {
                    setError(prevState => {
                        return ([...prevState, [0, e.response.data.detail]])
                    })
                }
                if (error?.response?.status === 500) {
                    setError('Network error: ' + error.message)
                }
            })
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
                    Blog - represents the ability to combine: <br/>
                    Python, Django, DRF, JWT, JavaScript, React... <br />technologies
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                    <br/>
                    The purpose of this task is to prepare an E2E experience of a Blog.<br/><br/>
                    The application includes three main components:<br/>
                    1. Frontend application<br/>
                    2. Backend application<br/>
                    3. Database<br/><br/>
                    <Link href="https://github.com/nafrelim/blog"> {"Source code of the project, description of functionalities and a list of technologies used."}</Link>
                </Typography>
            </Container>
            {
                !logged
                &&
                <Container sx={{mt: 1, mb: 2}} maxWidth="sm">
                    <Typography variant="h5" color="inherit" paragraph>
                        <Link href="#/login">
                            {"Sign in"}
                        </Link>
                        <br/>
                        - username: admin, author1, author2, author4, author4<br/>
                        - password: !234567890<br/>
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
            <Copyright sx={{mt: 8, mb: 4}}/>
        </Box>
    )
}

export default StartPage
