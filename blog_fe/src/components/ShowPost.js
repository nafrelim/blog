import React, {useEffect, useState} from 'react';
import parse from "html-react-parser";
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
import jwt_decode from "jwt-decode";

const ShowPost = () => {
    const [post, setPost] = useState({});
    const [count, setCount] = useState('');
    const [error, setError] = useState([]);
    const [author, setAuthor] = useState(false);

    let { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        if (TokenRefresh()) {
             console.log('token refreshed in post list')
             location.reload()
        }
        if (localStorage.getItem('token') === null || localStorage.getItem('refresh') === null) {
            navigate('/login')
        }

        console.log('show post')

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
                        if (response.data['author'] == jwt_decode(localStorage.getItem('token')).username || jwt_decode(localStorage.getItem('token')).username == 'admin') {
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
            <Typography variant="body1" component="div">
                {parse(String(post.content))}
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
                    error?.length > 0
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