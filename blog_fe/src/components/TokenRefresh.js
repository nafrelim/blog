import axios from "axios";
import {API} from "../blog_be";

const TokenRefresh = () => {

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


}

export default TokenRefresh;
