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
import TokenRefresh from "./TokenRefresh";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

const Report = () => {
    let navigate = useNavigate();

    const [report, setReport] = useState({});
    const [error, setError] = useState([]);
    const [top_5_viewed_posts, setTop_5_viewed_posts] = useState([]);
    const [last_5_viewed_posts, setLast_5_viewed_posts] = useState([]);
    const [top_5_commented_posts, setTop_5_commented_posts] = useState([]);
    const [last_5_commented_posts, setLast_5_commented_posts] = useState([]);
    const [max_sub_15, setMax_sub_15] = useState({});
    const [min_add_15, setMin_add_15] = useState({});
    const [authors, setAuthors] = useState({});

    useEffect(() => {
        if (TokenRefresh()) {
             console.log('token refreshed in post list')
             location.reload()
        }
        if (localStorage.getItem('token') === null || localStorage.getItem('refresh') === null) {
            navigate('/login')
        }

        console.log('reports')

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
                        setTop_5_viewed_posts(response.data[0].top_5_viewed_posts)
                        setLast_5_viewed_posts(response.data[0].last_5_viewed_posts)
                        setMax_sub_15(response.data[0].max_sub_15)
                        setMin_add_15(response.data[0].min_add_15)
                        setAuthors(response.data[0].number_of_posts_views_comments)
                        setTop_5_commented_posts(response.data[0].top_5_commented_posts)
                        setLast_5_commented_posts(response.data[0].last_5_commented_posts)
                    })
                    .catch(e => setError(prevState => {
                        if (e?.response?.status == 401) {
                         navigate("/login", {replace: true});
                        }
                        if (e?.response?.status === 500) {
                          setError(prevState => {
                              return ([...prevState, [0, 'Network error: ' + e.response.data.detail +
                              '. Try to login again. If the error persists - there is a network or server error.']])
                          })}
                    }));
    }, []);

    return (
        <Container
            maxWidth="900"
        >
        <Box sx={{"marginY": 2}}>
            {/*Displaying post information*/}
            <Box sx={{marginY: 2}}>
                <Typography variant="h6" >
                Basic post data:
                </Typography >
                <Typography variant="body2" sx={{marginX: 2, marginY: 1}}>
                    • Total number of posts: {report.number_of_posts}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, marginY: 2}}>
                    • Maximum number of views for the post: {report.max_views}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, marginY: 2}}>
                    • Minimum number of views for the post: {report.min_views}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, marginY: 2}}>
                    • Average number of views for the post: {report.avg_views}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, marginY: 2}}>
                    • The sum of all post views: {report.sum_views}
                </Typography>
                <Typography variant="body2" sx={{marginX: 2, marginY: 2}}>
                    • The sum of all post comments: {report.sum_comments}
                </Typography>
            </Box>
            <Divider color={"black"} sx = {{borderBottomWidth: 2, "mb": 2}}/>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Most viewed posts:
                </Typography >
                {
                    Array.from(top_5_viewed_posts).map(post => {
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                  }}
                            >
                                <Typography  key={post.id} variant="body2" sx={{marginX: 2}}>
                                    • "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                                </Typography>
                            </Box>
                        )
                    })
                }
            </Box>
            <Divider color={"black"} sx = {{borderBottomWidth: 2, "mb": 2}}/>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Least viewed posts:
                </Typography >
                {
                    Array.from(last_5_viewed_posts).map(post => {
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                  }}
                            >
                                <Typography  key={post.id} variant="body2" sx={{marginX: 2}}>
                                    • "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                                </Typography>
                            </Box>
                        )
                    })
                }
            </Box>
            <Divider color={"black"} sx = {{borderBottomWidth: 2, "mb": 2}}/>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Most commented posts:
                </Typography >
                {
                    Array.from(top_5_commented_posts).map(post => {
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                  }}
                            >
                                <Typography  key={post.id} variant="body2" sx={{marginX: 2}}>
                                    • "{post.title}", {post.num_comments} comments, <Button href={"#/post/"+post.id}> Show me </Button>
                                </Typography>
                            </Box>
                        )
                    })
                }
            </Box>
            <Divider color={"black"} sx = {{borderBottomWidth: 2, "mb": 2}}/>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Least commented posts:
                </Typography >
                {
                    Array.from(last_5_commented_posts).map(post => {
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                  }}
                            >
                                <Typography  key={post.id} variant="body2" sx={{marginX: 2}}>
                                    • "{post.title}", {post.num_comments} comments, <Button href={"#/post/"+post.id}> Show me </Button>
                                </Typography>
                            </Box>
                        )
                    })
                }
            </Box>
            <Divider color={"black"} sx = {{borderBottomWidth: 2, "mb": 2}}/>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Posts up to 15% less than the maximum number of views:
                </Typography >
                {
                    Array.from(max_sub_15).map(post => {
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                  }}
                            >
                                <Typography  key={post.id} variant="body2" sx={{marginX: 2}}>
                                    • "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                                </Typography>
                            </Box>
                        )
                    })
                }
            </Box>
            <Divider color={"black"} sx = {{borderBottomWidth: 2, "mb": 2}}/>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                Posts with views up to 15% above the minimum number of views:
                </Typography >
                {
                    Array.from(min_add_15).map(post => {
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                  }}
                            >
                                <Typography  key={post.id} variant="body2" sx={{marginX: 2}}>
                                    • "{post.title}", {post.views} views, <Button href={"#/post/"+post.id}> Show me </Button>
                                </Typography>
                            </Box>
                        )
                    })
                }
            </Box>
            <Divider textAlign="left" color={"black"} sx = {{borderBottomWidth: 2, "mb": 2}}/>
            <Box sx={{marginY: 2 }}>
                <Typography variant="h6" >
                According to the quantity
                </Typography >
                <Typography variant="body1" >
                Most posts:
                </Typography >
                    {
                        Array.from(authors).sort((a, b) => b.post_count - a.post_count).map(author => {
                            return (
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                    marginY: 2,
                                  }}
                                >
                                    <Typography  key={author.id} variant="body2" sx={{marginX: 2}}>
                                        • <b>{author.username}</b>: {author.post_count}
                                    </Typography>
                                </Box>
                            )
                        })
                    }
                <Divider color={"black"} sx = {{borderBottomWidth: 1, "mt": 2, "mb": 2}}/>
                <Typography variant="body1">
                    Most views:
                </Typography>
                    {
                        Array.from(authors).sort((a, b) => b.total_views - a.total_views).map(author => {
                            return (
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                    marginY: 2,
                                  }}
                                >
                                    <Typography  key={author.id} variant="body2" sx={{marginX: 2}}>
                                        • <b>{author.username}</b>: {author.total_views}
                                    </Typography>
                                </Box>
                            )
                        })
                    }
                <Divider color={"black"} sx = {{borderBottomWidth: 1, "mt": 2, "mb": 2}}/>
                <Typography variant="body1">
                    Most comments:
                </Typography>
                    {
                        Array.from(authors).sort((a, b) => b.total_comments - a.total_comments).map(author => {
                            return (
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                    marginY: 2,
                                  }}
                                >
                                    <Typography  key={author.id} variant="body2" sx={{marginX: 2}}>
                                        • <b>{author.username}</b>: {author.total_comments}
                                    </Typography>
                                </Box>
                            )
                        })
                    }
                <Divider color={"black"} sx = {{borderBottomWidth: 1, "mt": 2, "mb": 2}}/>
            </Box>

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
    </Container>
)}

export default  Report