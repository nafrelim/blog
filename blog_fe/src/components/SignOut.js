import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API} from "../blog_be";
import {useNavigate} from "react-router-dom";

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

const SignOut = () => {
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
                console.log("wylogowanie")
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                localStorage.removeItem('username')
                navigate("/", {replace: true});
            })
            .catch(() => {navigate("/", {replace: true})})
    })
}


export default SignOut;