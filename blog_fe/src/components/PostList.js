import React, {useEffect, useState} from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {Stack} from "@mui/material";
import Grid from "@mui/material/Grid";

import axios from "axios";
import {useNavigate} from "react-router-dom";

import {API} from "../blog_be";
import Error from "./Error";
import Copyright from "./Copyright";

const PostList = () => {
    let navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState([]);

    if (localStorage.getItem('username') === '') {
        return (
            <div>
                <p> Witaj i zaloguj się </p>
            </div>
        )
    }

    // aading the list of posts only when mounting a component
    useEffect(() => {
            axios.get(`${API}/api/post/`, {
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                    // 'token': localStorage.getItem('token')
                },
            })
                .then(response => setPosts(response.data.results))
                .catch(error => setError(prevState => {
                    navigate("/#", {replace: true});
                    return [...prevState, [0, 'Network error']]
                }))
        });

    return (
        <Box>
            {/* Displaying a list of posts */}
           {
               posts.map((post) =>
                    <Accordion key={post.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                        >
                            <Typography variant="h5" component="h2">{post.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1" component="p">
                                {/*Display the first 200 characters of the post*/}
                                {post.content.slice(0,200)+ ' ...'}
                                <Button href={"#/post/"+post.id}> Show me </Button>
                            </Typography>
                            <Box sx={{"marginY": 1 }}>
                                <Typography variant="subtitle2">
                                    Author: {post.author}
                                </Typography>
                                <Typography variant="subtitle2">
                                    Data: {post?.created.slice(8,10)+post?.created.slice(4,8)+post?.created.slice(0,4)}
                                </Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
               )
           }
            {/*Displaying a possible list of errors*/}
            <Grid item xs={12}>
                {
                    error.length > 0
                    &&
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Error error={error}/>
                    </Stack>
                }
            </Grid>
            <Copyright sx={{mt: 8, mb: 4}}/>
        </Box>
    );
};

export default PostList;