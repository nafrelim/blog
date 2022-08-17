import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

import {API} from "../blog_be";
import jwt_decode from "jwt-decode";
import TokenRefresh from "./TokenRefresh";


const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [logged, setLogged] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenuPosts = () => {
        setAnchorElNav(navigate("/post", { replace: true }));
    };

    const handleCloseNavMenuAdd = () => {
        setAnchorElNav(navigate("/add", { replace: true }));
    };

    const handleCloseNavMenuReport = () => {
        setAnchorElNav(navigate("/report", { replace: true }));
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleClosePost = () => {
        setAnchorElNav(null);
    };

    const handleCloseAdd = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseUserMenuSignIn = () => {
        setAnchorElUser(navigate("/login", { replace: true }));
    };

    const handleCloseUserMenuSignOut = () => {
        setAnchorElUser(navigate("/logout", { replace: true }));
    };

    const handleCloseUserMenuUpdateProfile = () => {
        setAnchorElUser(navigate("/update_profile/"+jwt_decode(localStorage.getItem('token')).username +"/", { replace: true }));
    };

    const handleCloseUserMenuSignUp = () => {
        setAnchorElUser(navigate("/register", { replace: true }));
    };


    useEffect(() => {
            axios(`${API}/api/post/`, {
                method: "HEAD",
                mode: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token'),
                }

            })
                .then(response => {
                    if (jwt_decode(localStorage.getItem('token')).username === 'admin') {
                        setAdmin(true);
                    } else {
                        setAdmin(false);
                    }
                    setLogged(true);
                })
                .catch(() => {
                    setLogged(false)
                })
    });

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Button href={"/#/"} sx={{ my: 2, color: 'white', display: 'block' }}>
                        Home
                    </Button>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {
                                logged
                                &&
                                <MenuItem onClick={handleCloseNavMenuPosts}>
                                    <Typography textAlign="center">Blog</Typography>
                                </MenuItem>
                            }
                            {
                                logged
                                &&
                                <MenuItem onClick={handleCloseNavMenuAdd}>
                                    <Typography textAlign="center">Add post</Typography>
                                </MenuItem>
                            }
                            {
                                logged
                                &&
                                isAdmin
                                &&
                                <MenuItem onClick={handleCloseNavMenuReport}>
                                    <Typography textAlign="center">Report</Typography>
                                </MenuItem>
                            }
                        </Menu>
                    </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {
                                logged
                                &&
                                <Button href={"#/post"} sx={{my: 2, color: 'white', display: 'block'}}>
                                    Blog
                                </Button>
                            }
                            {
                                logged
                                &&
                                <Button href={"#/add"} sx={{my: 2, color: 'white', display: 'block'}}>
                                    Add post
                                </Button>
                            }
                            {
                                logged
                                &&
                                isAdmin
                                &&
                                <Button href={"#/report"} sx={{my: 2, color: 'white', display: 'block'}}>
                                    Report
                                </Button>
                            }
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="User menu">
                                <Button
                                    onClick={handleOpenUserMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                User
                                </Button>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenuSignIn}>
                                    <Typography textAlign="center">Sign in</Typography>
                                </MenuItem>
                                {
                                    logged &&
                                    <MenuItem onClick={handleCloseUserMenuSignOut}>
                                        <Typography textAlign="center">Sign out</Typography>
                                    </MenuItem>
                                }
                                <MenuItem onClick={handleCloseUserMenuSignUp}>
                                    <Typography textAlign="center">Sign up</Typography>
                                </MenuItem>
                                {
                                    logged &&
                                    <MenuItem onClick={handleCloseUserMenuUpdateProfile}>
                                        <Typography textAlign="center">Update profile</Typography>
                                    </MenuItem>
                                }
                            </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
