//Login component prototype


import React, {useState} from 'react';
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

    axios(`${API}/rest-auth/logout/`, {
        method: 'POST',
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
      .then(response => {
          localStorage.setItem('token', null)
          localStorage.setItem('username', null)
          console.log(response);
          navigate("/", { replace: true });
          })
      .catch(error => console.log('To jest mój Error;', error))
    }


export default SignOut;