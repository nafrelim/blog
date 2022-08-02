import React, {useEffect, useState} from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


import axios from "axios";
import {useNavigate} from "react-router-dom";

import {API} from "../blog_be";
import Error from "./Error";
import Copyright from "./Copyright";
import CssBaseline from "@mui/material/CssBaseline";

const ordering = [
  {
    value: '-created',
    label: 'creation date (newest first)',
  },
  {
    value: 'created',
    label: 'creation date (oldest first)',
  },
  {
    value: '-updated',
    label: 'update date (newest first)',
  },
  {
    value: 'updated',
    label: 'update date (oldest first)',
  },
  {
    value: 'username',
    label: 'author',
  }
];

const PostList = () => {
    let navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [number_of_posts, setNumber_of_posts] = useState(0);
    const [error, setError] = useState([]);
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState('-created');
    const [posts_on_page, setPosts_on_page] = useState(0);
    const [page, setPage] = React.useState(1);
    const [authors, setAuthors] = useState({})
    const [author, setAuthor] = useState('all');

    if (localStorage.getItem('username') === '') {
        return (
            <div>
                <p> Witaj i zaloguj się </p>
            </div>
        )
    }
    const handleChangePage = (event, value) => {
        console.log('vaule: ', value);
        setPage(value);
    };

    // ading the list of posts only when mounting a component
    useEffect(() => {
            axios.get(`${API}/api/post/?search=` + search + '&ordering=' + order + '&page=' + page + '&author=' + author, {
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
                .then(response => {
                    setPosts(response.data.results)
                    setNumber_of_posts(response.data.count)
                })
                .catch(error => setError(prevState => {
                    navigate("/#", {replace: true});
                    return [...prevState, [0, 'Network error']]
                }))
        }, [order, page, search, author]);

    useEffect(() => {
            axios.get(`${API}/api/report`, {
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
                .then(response => {
                    setPosts_on_page(parseInt(response.data[0].posts_on_page));
                    setAuthors(response.data[0].number_of_posts_views)
                })
                .catch(error => setError(prevState => {
                    return [...prevState, [0, 'Network error']]
                }))
        }, [order, page, search, author]);

    return (
        <Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '35ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    onChange={e => setSearch(e.target.value)}
                />
                <TextField
                    id="ordering"
                    select
                    label="Order by"
                    value={order}
                    onChange={e => setOrder(e.target.value)}
                >
                    {ordering.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="authors"
                    select
                    label="Filter by authors"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                >

                    <MenuItem value={'all'}> {'all'} </MenuItem>
                    {
                        Array.from(authors).map((author) => (
                            <MenuItem key={author.id} value={author.username}>
                                {author.username}
                            </MenuItem>
                        ))
                    }
                </TextField>

            </Box>

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
           {/*<Container component="main" maxWidth="xs">*/}
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                <Pagination count={Math.ceil(number_of_posts/posts_on_page)} page={page} onChange={handleChangePage} />
                </Box>
           {/*</Container>*/}
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