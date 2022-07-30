import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useParams} from "react-router-dom";
import DeletePost from "./DeletePost";
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";

import Error from "./Error";
import {API} from "../blog_be";

import axios from "axios";

const ShowPost = () => {
    const [post, setPost] = useState({});
    const [count, setCount] = useState('');
    const [error, setError] = useState([]);
    let { id } = useParams();

    useEffect(() => {
        axios.get(`${API}/api/post/${id}/`, {
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                }
                })
                    .then(response => setPost(response.data))
                    .catch(error => setError(prevState => {
                        return [...prevState, [0, 'Network error']]
                    }));

        let count_tmp;

        axios.get(`${API}/api/view/${id}/`, {
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                }
                })
            .then(response => {
                count_tmp = parseInt(response.data.views);
                setCount(count_tmp);
            })
            .catch(error => setError(prevState => {
                return [...prevState, [0, 'Network error']]
            }))
    }, []);

    return (
        <Box sx={{"marginY": 2 }}>
            {/*Displaying post information*/}
            <Typography variant="h5" component="h2">
                {post.title}
            </Typography>
            <Typography variant="h5" component="h2">
                <VisibilityIcon /> {count}
            </Typography>
            <Typography variant="body1" component="p">
                {post.content}
            </Typography>
            <Box sx={{"marginY": 1 }}>
                <Typography variant="subtitle2">
                    Author: {post.author}
                </Typography>
                <Typography variant="subtitle2">
                    Data: {post.created?.slice(8,10)+post.created?.slice(4,8)+post.created?.slice(0,4)}
                </Typography>
            </Box>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button href={"#/edit/"+post.id}> Edit </Button>
                <DeletePost id={post.id} />
            </ButtonGroup>
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
        </Box>
)}

export default  ShowPost