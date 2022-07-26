import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Stack, TextareaAutosize} from "@mui/material";
import {useParams, useNavigate} from "react-router-dom";

import axios from "axios";

import {API} from "../blog_be";
import Error from "./Error";

const theme = createTheme();

const EditPost = () => {
    const [title, setPost_title] = useState("");
    const [content, setPost_content] = useState("");
    const [error, setError] = useState([]);
    const [data, setData] = useState(false);
    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {axios(`${API}/api/post/${id}/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setPost_title(response.data.title);
                setPost_content(response.data.content);
            })
            .catch(error => setError(prevState => {
                return [...prevState, [0, 'Network error']]
            }))
        },
        []);

    async function handleSubmit (event) {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);

        // Save a post when fields are not empty
        if (title.length > 0 && content.length > 0) {
            setError([])
            await axios(`${API}/api/post/${id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'accept': 'application/json',
                        'content-Type': 'application/json',
                        'authorization': 'token ' + localStorage.getItem('token'),
                    },
                    data: {
                        title: title,
                        content: content,
                    },
                })
                .then(response => {setData(true)})
                .catch(error => setError(prevState => {
                    return ([...prevState, [0, 'Network error: ' + error.message +
                    '. If the error persists - there is a network or server error.']])
                }));
            navigate("/post", { replace: true });
        }
        else {
            // Clearing the list of errors only before the next field validation
            setError([])
            if (title.length ===0) {
                setError(prevState => {
                    return [...prevState, [1, "Post title cannot be empty"]]}
                );
            }}
            if (content.length ===0) {
                setError(prevState => {
                    return [...prevState, [1, "Post content cannot be empty"]]}
                );
            }
        }

    return (
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
                    <Typography component="h1" variant="h5">
                        Edit post
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    placeholder="Post title"
                                    name="post_title"
                                    value= {title}
                                    style={{ width: 400 }}
                                    onChange={e => setPost_title(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    required
                                    minRows={10}
                                    placeholder="Post content"
                                    value= {content}
                                    style={{ width: 400 }}
                                    onChange={e => setPost_content(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {/*Displaying a possible list of errors*/}
                                {
                                    error.length > 0
                                    &&
                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Error error={error}/>
                                    </Stack>
                                }
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
            </Container>
        </ThemeProvider>
    );
};

export default EditPost;