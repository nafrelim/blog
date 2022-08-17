import axios from "axios";
import {API} from "../blog_be";
import jwt_decode from "jwt-decode";


const TokenRefresh = () => {
    let refresh_sub = 1
    let refresh_add = 2
    let expired_sub = false
    let expired_add = false
    let expired = false

    // console.log('date: ', parseInt(Date.now() / 1000))

    if (localStorage.getItem('token') == null || localStorage.getItem('refresh') == null) {
        if (localStorage.getItem('refresh') == null) {
            localStorage.removeItem('token');
        }
        if (localStorage.getItem('token') == null) {
            localStorage.removeItem('refresh');
        }
        return false
    }

    if (localStorage.getItem('token') != null) {
        expired_sub = jwt_decode(localStorage.getItem('token')).exp - parseInt((1000 * 60 * refresh_sub) / 1000) < parseInt((Date.now()) / 1000);
        expired_add = jwt_decode(localStorage.getItem('token')).exp + parseInt((1000 * 60 * refresh_add) / 1000) < parseInt((Date.now()) / 1000);
    }

    console.log('token sub: ', jwt_decode(localStorage.getItem('token')).exp - parseInt((1000 * 60 * refresh_sub) / 1000))
    console.log('token exp: ', jwt_decode(localStorage.getItem('token')).exp)
    console.log('token add: ', jwt_decode(localStorage.getItem('token')).exp + parseInt((1000 * 60 * refresh_add) / 1000))

    if (expired_sub) {
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
                if (!expired_add) {
                    console.log('odświerzył')
                    localStorage.setItem('token', response.data.access)
                    localStorage.setItem('refresh', response.data.refresh)
                    return true
                } else {
                    console.log('nie odświerzył i skasował tokeny')
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh');
                    return false
                }
            })
            .catch(() => {
                console.log('skasował token - token odświerzania nieaktywny')
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                return false
            })
        return false
    }

    if (localStorage.getItem('token') != null) {
        console.log('token: ', (localStorage.getItem('token') != null))
    }

    // if (expired_add) {
    //     console.log('in expired_add and not refresh')
    //     axios.post(`${API}/auth/refresh/`,
    //         {
    //             'refresh': localStorage.getItem('refresh')
    //         },
    //         {
    //             headers: {
    //                 'accept': 'application/json',
    //                 'content-Type': 'application/json',
    //             },
    //
    //         })
    //         .then(response => {
    //             console.log('nie odświerzył i skasował tokeny')
    //             localStorage.removeItem('token');
    //             localStorage.removeItem('refresh');
    //             return false
    //         })
    //         .catch(() => {
    //             console.log('skasował token - token odświerzania nieaktywny')
    //             localStorage.removeItem('token');
    //             localStorage.removeItem('refresh');
    //             return false
    //         })
    //     return false
    // }

}

export default TokenRefresh;
