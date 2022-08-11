import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useNavigate, useParams} from "react-router-dom";
import DeletePost from "./DeletePost";
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";

import axios from "axios";

import {API} from "../blog_be";
import Error from "./Error";
import Copyright from "./Copyright";
import TokenRefresh from "./TokenRefresh";
import CommentList from "./CommentList";

const ShowPost = () => {
    const [post, setPost] = useState({});
    const [count, setCount] = useState('');
    const [error, setError] = useState([]);
    const [author, setAuthor] = useState(false);

    let { id } = useParams();
    let navigate = useNavigate();

    TokenRefresh();

    useEffect(() => {
        axios(`${API}/api/post/${id}/`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
                })
                    .then(response => {
                        setPost(response.data)
                        if (response.data['author'] == localStorage.getItem('username') || localStorage.getItem('username') == 'admin') {
                            setAuthor(true)
                        }
                    })
                    .catch(error => setError(prevState => {
                        return [...prevState, [0, 'Network error']]
                    }));

        axios.get(`${API}/api/view/${id}/`, {
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                }
                })
            .then(response => {
                setCount(parseInt(response.data.views));
            })
            .catch(error => setError(prevState => {
                if (error.response.status == 401 || error.response.status == 403 || error.response.status == 404) {
                        navigate("/", {replace: true});
                    }
                return [...prevState, [0, 'Network error']]
            }))
        axios.get(`${API}/api/post_comments/${id}/`, {
            mode: 'same-origin',
            headers: {
                'accept': 'application/json',
                'content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        })
            .then(response => {
                setComments(response.data.results)
            })
            .catch(error => setError(prevState => {
                return [...prevState, [0, 'Network error']]
            }));
    }, []);

    return (
        <Box sx={{"marginY": 2 }}>
            {/*Displaying post information*/}
            <Typography variant="h4" component="h2">
                {post.title}
            </Typography>
            <Typography variant="h6" component="h2">
                <VisibilityIcon fontSize={"small"}/> {count}
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
            {
                author
                &&
                <ButtonGroup>
                    <Button
                        href={"#/edit/" + post.id }
                        sx={{ mt: 1, mb: 1, mr: 1, width: 100 }}
                        variant="contained"
                        autoFocus
                    >
                        Edit
                    </Button>
                    <DeletePost id={post.id}/>
                </ButtonGroup>
            }

            <CommentList post_id={id}/>

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
)}

export default  ShowPost