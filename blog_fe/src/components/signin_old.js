import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

import axios from "axios";
import {API, csrfToken, token} from "../blog_be";

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState([]);
    const [data, setData] = useState(false);
    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (username.length > 0 && password.length > 0) {
            console.log(username + ":" + password)
            axios(`${API}/accounts/rest-auth/login/`, {
                // credentials: 'include',
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                data: {
                    'username': username,
                    'password': password,
                }
            })
                .then(response => {
                    setData(true)
                    localStorage.setItem('token', response.data.key)
                    localStorage.setItem('username', username)
                    navigate("/post", { replace: true });
                })
                .catch(error => console.log('To jest mój Error;', error))
            }
        else {
            if (username.length <= 2 && password.length <= 4) {
                setError(["username cannot be empty", "password cannot be empty"]);
            }
            else if (username.length <= 2) {
                setError(["username cannot be empty"]);
            }
            else {
                setError(["password cannot be empty"]);
            }
        }
    }

    if (!data) {
        return (
            <form action='/' onSubmit={submitHandler} method='Post'>
                {
                    error.length > 0
                    &&
                    <div>
                        {
                            error.map((el, index) => <p key={index}>{el}</p>)
                        }
                    </div>
                }
                <input
                    type="text"
                    placeholder="user"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="hasło"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        );
    }
    else {

    }

};

export default Login;