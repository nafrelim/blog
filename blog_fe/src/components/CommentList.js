import React, {useEffect, useState} from "react";
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Typography from "@mui/material/Typography";

import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SendIcon from '@mui/icons-material/Send';
import ButtonGroup from "@mui/material/ButtonGroup";
import {TextareaAutosize} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {API} from "../blog_be";
import jwt_decode from "jwt-decode";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

export default function CommentList({post_id}) {
    const [error, setError] = useState([]);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [author, setAuthor] = useState('');

    let navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        await axios(`${API}/api/comment/`, {
            method: 'POST',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            data: {
                "content": content,
                "comment_author": jwt_decode(localStorage.getItem('token')).username,
                "post": post_id

            }
        })
            .catch(error => setError(prevState => {
                if (error.response.status == 401 || error.response.status == 403) {
                    navigate("/#/", {replace: true});
                }
                return [...prevState, [0, 'Network error']]
            }))
        location.reload();
    }

    useEffect(() => {
        setAuthor(jwt_decode(localStorage.getItem('token')).username)
        axios.get(`${API}/api/post_comments/${post_id}/`, {
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
                navigate(`/post/`, { replace: true })
            }));
    }, []);

  return (
    <Root sx={{marginTop: 3}}>
        <Divider color={"black"} sx = {{borderBottomWidth: 4, "mb": 3}}/>
        <Typography variant="h6" sx={{"mb": 5, "mt": 5}}>
                Comments
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Box>
                    <TextareaAutosize
                        required
                        placeholder="Add comment"
                        minRows={4}
                        name="content"
                        value= {content}
                        style={{ minWidth: 300}}
                        onChange={e => setContent(e.target.value)}
                    />
                </Box>
                <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    endIcon={<SendIcon />}
                >
                    Add
                </Button>
        </Box>
        {
            comments.map((comment) =>
                <Box key={comment.id}>
                    <Divider textAlign="left">
                        <Typography variant="caption text">
                            {comment.comment_author},  {comment.created?.slice(8,10)+comment.created?.slice(4,8)+comment.created?.slice(0,4)}
                            {
                                (author === comment.comment_author)
                                &&
                                <ButtonGroup>
                                    <EditComment comment_id={comment.id} content={comment.content}/>
                                    <DeleteComment comment_id={comment.id}/>
                                </ButtonGroup>
                            }
                        </Typography>
                    </Divider>
                    <Typography variant="body2">
                        {comment.content}
                    </Typography>
                </Box>
            )
        }
    </Root>
  );
}
