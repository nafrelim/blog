import React, {useState} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {Stack} from "@mui/material";
import Error from "./Error";
import Grid from "@mui/material/Grid";

import {API} from "../blog_be";
import AddPost from "./AddPost";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const AddComment = ({post_id}) => {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState([]);
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function handleAdd () {
        setOpen(false);
        await axios(`${API}/api/comment/${post_id}/`, {
            method: 'POST',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            data: {
                "content": content,
                "comment_author": localStorage.getItem('username'),
                "post": post_id

            }
        })
            .catch(error => setError(prevState => {
                if (error.response.status == 401 || error.response.status == 403) {
                    navigate("#/", {replace: true});
                }
                return [...prevState, [0, 'Network error']]
            }))
        navigate("/#/post", { replace: true });
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
            <IconButton size="lg" varian="solid" onClick={handleClickOpen}> <AddCircleIcon/> </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Do you want to add comment?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleAdd} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddPost;