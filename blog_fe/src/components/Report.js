import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";

import axios from "axios";

import Error from "./Error";
import Copyright from "./Copyright";
import {API} from "../blog_be";

const Report = () => {
    let navigate = useNavigate();

    const [report, setReport] = useState({});
    const [error, setError] = useState([]);
    const [top_5, setTop_5] = useState([]);
    const [last_5, setLast_5] = useState({});
    const [max_sub_15, setMax_sub_15] = useState({});
    const [min_add_15, setMin_add_15] = useState({});
    const [authors, setAuthors] = useState({});

    useEffect(() => {
        axios.get(`${API}/api/report/`, {
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                }
                })
                    .then(response => {
                        setReport(response.data[0])
                        setTop_5(response.data[0].top_5)
                        setLast_5(response.data[0].last_5)
                        setMax_sub_15(response.data[0].max_sub_15)
                        setMin_add_15(response.data[0].min_add_15)
                        setAuthors(response.data[0].number_of_posts_views)
                    })
                    .catch(error => setError(prevState => {
                        if (error.response.status == 401 || error.response.status == 403) {
                            navigate("/", {replace: true});
                        }
                        return [...prevState, [0, 'Network error']]
                    }));
    }, []);

    return (
        <Box sx={{"marginY": 2, "marginX": 3 }}>
            {/*Displaying post information*/}
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Basic post data:
                </Typography >
                <Typography variant="body2" sx={{marginX: 2, height: 18}}>
                    Total number of posts: {report.number_of_posts}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, height: 18}}>
                    Maximum number of views for the post: {report.max_views}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, height: 18}}>
                    Minimum number of views for the post: {report.min_views}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, height: 18}}>
                    Average number of views for the post: {report.avg_views}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, height: 18}}>
                    The sum of all post views: {report.sum_views}
                </Typography>
            </Box>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Most viewed posts:
                </Typography >
                {
                    Array.from(top_5).map(post => {
                        return (
                            <Typography  key={post.id} variant="body2" sx={{marginX: 2, height: 18}}>
                                "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                            </Typography>
                        )
                    })
                }
            </Box>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Least viewed posts:
                </Typography >
                {
                    Array.from(last_5).map(post => {
                        return (
                            <Typography  key={post.id} variant="body2" sx={{marginX: 2, height: 18}}>
                                "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                            </Typography>
                        )
                    })
                }
            </Box>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Posts up to 15% less than the maximum number of views:
                </Typography >
                {
                    Array.from(max_sub_15).map(post => {
                        return (
                            <Typography  key={post.id} variant="body2" sx={{marginX: 2, height: 18}}>
                                "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                            </Typography>
                        )
                    })
                }
            </Box>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Posts with views up to 15% above the minimum number of views:
                </Typography >
                {
                    Array.from(min_add_15).map(post => {
                        return (
                            <Typography  key={post.id} variant="body2" sx={{marginX: 2, height: 18}}>
                                "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                            </Typography>
                        )
                    })
                }
            </Box>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Basic data on the basis of individual authors:
                </Typography >
                {
                    Array.from(authors).map(author => {
                        return (
                            <Typography  key={author.id} variant="body2" sx={{marginX: 2, height: 18}}>
                                {author.username}: {author.post_count} posts, {author.total_views} views
                            </Typography>
                        )
                    })
                }
            </Box>

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

export default  Report