import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API, csrfToken, token} from "../blog_be";
import {useNavigate} from "react-router-dom";

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

const SignOut = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        axios(`${API}/auth/logout_all/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(response => {
                localStorage.setItem('token', null)
                localStorage.setItem('username', null)
                navigate("/#", {replace: true});
            })
            .catch(error => navigate("/#", {replace: true}))
    })
}


export default SignOut;