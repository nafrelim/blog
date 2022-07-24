import React from 'react';
import {useLocation} from "react-router-dom";
import Box from "@mui/material/Box";
import {Alert} from "@mui/material";

const NotFound = () => {
    let location = useLocation();

    return (
        <Box sx={{"marginY": 2 }}>
            <Alert severity="error">Wrong website address: "<code>{location.pathname}"</code></Alert>
        </Box>
    )
}

export default NotFound;