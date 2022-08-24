import React, {useState} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {Stack, TextareaAutosize} from "@mui/material";
import Error from "./Error";
import Grid from "@mui/material/Grid";

import {API} from "../blog_be";
import Box from "@mui/material/Box";

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const EditComment = ({comment_id, content}) => {
    const [comment, setComment] = useState(content);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function handleEdit () {
        setOpen(false);
        await axios(`${API}/api/comment/${comment_id}/`, {
            method: 'PATCH',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            data: {
                'content': comment,
            }
        })
            .catch(error => setError(prevState => {
                if (error.response.status == 401 || error.response.status == 403) {
                    navigate("#/", {replace: true});
                }
                return [...prevState, [0, 'Network error']]
            }))
        location.reload()
    }

    return (
        <div>
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
            <Button
                sx={{ ml:1, mt: 1, mb: 1, width: 52, height:20 }}
                size="small"
                variant="outlined"
                onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ m: 0, p: 1 }}>
                    Edit comment
                </DialogTitle>
                <Box
                    sx={{ml: 1, mr:1}}
                >
                    <TextareaAutosize
                        required
                        placeholder="Edit comment"
                        style={{ minWidth: 300}}
                        name="content"
                        value= {comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </Box>
                <DialogActions>
                    <Button
                        sx={{ mb: 1, width: 100 }}
                        onClick={handleClose}
                        autoFocus
                        size="small"
                        variant="contained"
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ mb: 1, width: 100 }}
                        onClick={handleEdit}
                        size="small"
                    >
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditComment;