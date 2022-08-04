import {useState} from "react";
import axios from "axios";
import {API} from "../blog_be";

const TokenRefresh = () => {
    const [error, setError] = useState([]);

    axios.post(`${API}/auth/refresh/`,
        {
                'refresh': localStorage.getItem('refresh')
            },
        {
            headers: {
                'accept': 'application/json',
                'content-Type': 'application/json',
            },

        })
        .then(response => {
          localStorage.setItem('token', response.data.access)
          localStorage.setItem('refresh', response.data.refresh)
        })
        .catch(e => {
          if (e.response.status === 401) {
              setError(prevState => {
                  return ([...prevState, [0, e.response.data.detail]])
              })
          }
      });

}

export default TokenRefresh;
