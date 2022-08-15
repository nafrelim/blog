import axios from "axios";
import {API} from "../blog_be";
import jwt_decode from "jwt-decode";


const TokenRefresh = () => {
    let refresh_sub = 2
    let refresh_add = 2
    let expired_sub = false
    let expired_add = false
    let expired = false

    console.log('date: ', parseInt(Date.now()/1000))
    if (localStorage.getItem('token') != null) {
        console.log('token exp: ', jwt_decode(localStorage.getItem('token')).exp)
        expired_sub = jwt_decode(localStorage.getItem('token')).exp - parseInt((1000 * 60 * refresh_sub)/1000) < parseInt((Date.now()) / 1000);
        console.log('token sub: ', jwt_decode(localStorage.getItem('token')).exp - parseInt((1000 * 60 * refresh_sub)/1000))
        expired_add = jwt_decode(localStorage.getItem('token')).exp + parseInt((1000 * 60 * refresh_add)/1000) < parseInt((Date.now()) / 1000);
        console.log('token add: ', jwt_decode(localStorage.getItem('token')).exp + parseInt((1000 * 60 * refresh_add)/1000))
        console.log('token: ',localStorage.getItem('token'), expired_sub, expired_add, (localStorage.getItem('token') != null))
    }

    if (localStorage.getItem('token') == null) {
        if (localStorage.getItem('refresh') == null) {
            localStorage.removeItem('token');
        }
        if (localStorage.getItem('token') == null) {
            localStorage.removeItem('refresh');
        }
        return false
    }

    if (expired_sub || expired_add) {
        console.log('in expired_sub and refresh')
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
                console.log('odświerzył')
                localStorage.setItem('token', response.data.access)
                localStorage.setItem('refresh', response.data.refresh)
                return true
            })
            .catch(() => {
                console.log('nie odświerzył')
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                return false
            })
    }
    return false
}

export default TokenRefresh;
