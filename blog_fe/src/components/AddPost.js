import React, {useState} from 'react';
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

import Error from "./Error";
import Copyright from "./Copyright";
import TokenRefresh from "./TokenRefresh";

const theme = createTheme();

const AddPost = () => {
    const [title, setPost_title] = useState("");
    const [content, setPost_content] = useState("");
    const [error, setError] = useState([]);
    let navigate = useNavigate();

    TokenRefresh();

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
                    'author': localStorage.getItem('username'),
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
            <PostAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Add post
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            focused
                            required
                            placeholder="Post title"
                            name="title"
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
                            name="content"
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
                    variant="contained"
                    sx={{ mt: 1, mb: 2, ml:8, mr: 7, width: 100 }}
                >
                Submit
                </Button>
                <Button
                    sx={{ mt: 1, mb: 2, width: 100 }}
                    onClick={() => navigate(`/`, {replace: true})}
                    autoFocus
                    variant="contained"
                >
                    Cancel
                </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default AddPost;