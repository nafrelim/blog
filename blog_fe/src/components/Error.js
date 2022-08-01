import React from 'react';
import {Alert} from "@mui/material";


const Error = ({error}) => {
    return (
        error.map((e, index) => {
                if (e[0] === 0) {
                    return <Alert key={index} severity="error">{e[1]}</Alert>
                } else if (e[0] === 1) {
                    return <Alert key={index} severity="warning">{e[1]}</Alert>
                }
            }
        )
    );
};


export default Error;