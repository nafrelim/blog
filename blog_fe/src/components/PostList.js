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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useNavigate} from "react-router-dom";

import axios from "axios";

import {API} from "../blog_be";
import Error from "./Error";
import Copyright from "./Copyright";
import TokenRefresh from "./TokenRefresh";
import parse from "html-react-parser";
import Container from "@mui/material/Container";

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
    const [posts_on_page, setPosts_on_page] = useState(1);
    const [page, setPage] = useState(1);
    const [authors, setAuthors] = useState([])
    const [author, setAuthor] = useState('all');

    const handleChangePage = (event, value) => {
        setPage(value);
    };
    // list of posts


    useEffect(() => {
        if (TokenRefresh()) {
             console.log('token refreshed in post list')
             location.reload()
        }
        if (localStorage.getItem('token') === null || localStorage.getItem('refresh') === null) {
            navigate('/login')
        }

        console.log('post list')

        axios.get(`${API}/api/post/?search=`+search+'&ordering='+order+'&page='+page+'&author='+author, {
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
            .catch(e => setError(prevState => {
                if (e?.response?.status == 403) {
                    navigate("/", {replace: true});
                }
                navigate("/post/", {replace: true});
            }))

        axios.get(`${API}/api/parameters`, {
            mode: 'same-origin',
            headers: {
                'accept': 'application/json',
                'content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            })
            .then(response => {
                setPosts_on_page(parseInt(response.data[0].posts_on_page));
                setAuthors(response.data[0].authors);
            })
            .catch((e) => setError(prevState => {
                if (e?.response?.status === 403) {
                  setError(prevState => {
                      return ([...prevState, [0, e.response.data.detail]])
                  })
                }
            }))
        }, [page]);

    useEffect(() => {
        axios.get(`${API}/api/post/?search=`+search+'&ordering='+order+'&page='+page+'&author='+author, {
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
            .catch(e => setError(prevState => {
                if (e?.response?.status === 403) {
                    setError(prevState => {
                        return ([...prevState, [0, e.response.data.detail]])
                    })
                }
                // if (e?.response?.status === 401) {
                //     navigate("/login", {replace: true});
                // }
                if (e?.response?.status === 500) {
                    setError(prevState => {
                            return ([...prevState, [0, 'Network error: ' + e.response.data.detail +
                            '. Try to login again. If the error persists - there is a network or server error.']])
                        })}
            }))
        }, [order, search, author, page]);

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    // flexDirection: 'column',
                    alignItems: 'center',
                    '& > :not(style)': { mt: 1, mb: 1, mr: 1},
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    value={search}
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
                    style={{ minWidth: 120}}
                    onChange={e => setAuthor(e.target.value)}
                >
                    <MenuItem value={'all'}> {'all'} </MenuItem>
                    {
                        authors.map((author) => (
                            <MenuItem key={author} value={author}>
                                {author}
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
                                {post.content.replace(/(<([^>]+)>)|&nbsp;/gi,"").slice(0,200)+ ' ... '}
                                <Button href={"#/post/"+post.id}><ArrowForwardIcon fontSize={"large"}/></Button>
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
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Pagination count={parseInt(Math.ceil(number_of_posts/posts_on_page))} page={page} onChange={handleChangePage} />
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
        </Container>
    );
};

export default PostList;