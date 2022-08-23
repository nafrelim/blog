import React, {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {API} from "../blog_be";
import {useNavigate} from "react-router-dom";
import {Stack, TextareaAutosize} from "@mui/material";
import jwt_decode from "jwt-decode";

import Error from "./Error";
import Copyright from "./Copyright";
import TokenRefresh from "./TokenRefresh";
import Editor from "./Editor";
import ButtonGroup from "@mui/material/ButtonGroup";


const theme = createTheme();

const AddPost = () => {
    const [title, setPost_title] = useState("");
    const [content, setPost_content] = useState("");
    const [error, setError] = useState([]);
    let navigate = useNavigate();

    const handleEditor = (e) => {
        setPost_content(e)
    }


    useEffect(() => {
       if (localStorage.getItem('token') === null || localStorage.getItem('refresh') === null) {
            navigate('/login')
        }
        if (TokenRefresh()) {
            console.log('token refreshed in add post')
            location.reload()
        }
        console.log('add post')
    } ,[])

    async function handleSubmit (event) {
        event.preventDefault();
        // Save a post when fields are not empty
        if (title.length > 0 && content.length > 0) {
            await axios(`${API}/api/post/`, {
                method: 'POST',
                headers: {
                        'accept': 'application/json',
                        'content-Type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                data: {
                    'title': title,
                    'content': content,
                    'author': jwt_decode(localStorage.getItem('token')).username,
                }
            })
                .then(response => {setData(true)})
                .catch(error => setError(prevState => {
                    if (error.response.status == 401 || error.response.status == 403) {
                            navigate("/#", {replace: true});
                        }
                    return [...prevState, [0, 'Network error']]
                }));
            navigate("/post", { replace: true });
        }
        else {
            // Clearing error list
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
    // Display the post-entry form
       <Container maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PostAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Add post
          </Typography>
        </Box>
            <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
            >
                <Box sx={{ mb: 3}}>
                    <TextField
                        focused
                        required
                        placeholder="Post title"
                        name="title"
                        value= {title}
                        fullWidth
                        onChange={e => setPost_title(e.target.value)}
                    />
                    <Box sx={{ mt: 3 }}>
                        <Editor contents={""} onEditor={handleEditor}/>
                    </Box>
                <Box sx={{ mt: 1 }}>
                    {/*Displaying a possible list of errors*/}
                    {
                        error?.length > 0
                        &&
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Error error={error}/>
                        </Stack>
                    }
                    </Box>
                </Box>
                <Box
                  sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'raw',
                        alignItems: 'center',
                        mt: 1, mb: 2
                  }}
                  fullWidth
                >
                    <Button
                        type="submit"
                        variant="contained"
                        autoFocus
                        sx={{mr: 7, width: 100 }}
                        // sx={{ mt: 1, mb: 2, ml:28, mr: 7, width: 100 }}
                    >
                    Add
                    </Button>
                    <Button
                        sx={{width: 100 }}
                        // sx={{ mt: 1, mb: 2, width: 100 }}
                        onClick={() => navigate(`/`, {replace: true})}
                        variant="contained"
                    >
                       Cancel
                    </Button>
                </Box>
          </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}

export default AddPost;