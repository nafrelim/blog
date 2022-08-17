import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {Stack, TextareaAutosize} from "@mui/material";
import {useParams, useNavigate} from "react-router-dom";

import axios from "axios";

import {API} from "../blog_be";
import Error from "./Error";
import Copyright from "./Copyright";
import TokenRefresh from "./TokenRefresh";
import Avatar from "@mui/material/Avatar";
import Editor from "./Editor";

const EditPost = () => {
    const [title, setPost_title] = useState("");
    const [content, setPost_content] = useState("");
    const [c, setC] = useState(content);
    const [error, setError] = useState([]);
    let { id } = useParams();
    let navigate = useNavigate();

    const handleEditor = (e) => {
        setPost_content(e)
    }

    useEffect(() => {
        if (TokenRefresh()) {
             console.log('token refreshed in post list')
             location.reload()
        }
        if (localStorage.getItem('token') === null || localStorage.getItem('refresh') === null) {
            navigate('/login')
        }

        console.log('edit post')

        axios(`${API}/api/post/${id}/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setPost_title(response.data.title);
                setPost_content(response.data.content);
                setC(response.data.content);

            })
            .catch(e => setError(prevState => {
                if (e?.response?.status === 403) {
                    setError(prevState => {
                        return ([...prevState, [0, e.response.data.detail]])
                    })
                }
                if (e?.response?.status === 500) {
                    setError(prevState => {
                            return ([...prevState, [0, 'Network error: ' + e.response.data.detail +
                            '. Try to login again. If the error persists - there is a network or server error.']])
                        })}
            }))
    },[]);

    async function handleSubmit (event) {
        event.preventDefault();

        // Save a post when fields are not empty
        if (title.length > 0 && content?.length > 0) {
            setError([])
            await axios(`${API}/api/post/${id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'accept': 'application/json',
                        'content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    data: {
                        title: title,
                        content: content,
                    },
                })
                .catch(error => setError(prevState => {
                    return ([...prevState, [0, 'Network error: ' + error.message +
                    '. If the error persists - there is a network or server error.']])
                }));
            navigate(`/post/${id}`, { replace: true });
        }
        else {
            // Clearing the list of errors only before the next field validation
            setError([])
            if (title?.length ===0) {
                setError(prevState => {
                    return [...prevState, [1, "Post title cannot be empty"]]}
                );
            }}
            if (content?.length ===0) {
                setError(prevState => {
                    return [...prevState, [1, "Post content cannot be empty"]]}
                );
            }
        }

    return (
        // Display the post-entry form
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
                  Edit post
              </Typography>
             <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    focused
                                    required
                                    placeholder="Post title"
                                    name="post_title"
                                    value= {title}
                                    style={{ width: 700 }}
                                    onChange={e => setPost_title(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Editor contents={c} onEditor={handleEditor}/>
                                {/*<TextareaAutosize*/}
                                {/*    required*/}
                                {/*    minRows={10}*/}
                                {/*    placeholder="Post content"*/}
                                {/*    value= {content}*/}
                                {/*    style={{ width: 400 }}*/}
                                {/*    onChange={e => setPost_content(e.target.value)}*/}
                                {/*/>*/}
                            </Grid>
                            <Grid item xs={12}>
                                {/*Displaying a possible list of errors*/}
                                {
                                    error?.length > 0
                                    &&
                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Error error={error}/>
                                    </Stack>
                                }
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            autoFocus
                            sx={{ mt: 1, mb: 2, ml:28, mr: 7, width: 100 }}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ mt: 1, mb: 2, width: 100 }}
                            onClick={() => navigate(`/post/${id}`, { replace: true })}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
    );
};

export default EditPost;