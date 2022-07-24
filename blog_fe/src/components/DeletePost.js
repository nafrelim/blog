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

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const DeletePost = ({id}) => {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function handleDelete () {
        setOpen(false);
        await axios(`${API}/api/post/${id}/`, {
            method: 'DELETE',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
        })
            .catch(error => setError(prevState => {
                return [...prevState, [0, 'Network error']]
            }))
        navigate("/post", { replace: true });
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
            <Button variant="outlined" onClick={handleClickOpen}>
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Do you want to delete the post?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleDelete} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeletePost;