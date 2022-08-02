import React, {useState} from "react"
import {BrowserRouter, HashRouter, Route, Router, Routes} from "react-router-dom";
import Container from "@mui/material/Container";

import StartPage from "./StartPage";
import AppBar from "./AppBar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignOut from "./SignOut";
import PostList from "./PostList";
import ShowPost from "./ShowPost";
import AddPost from "./AddPost";
import EditPost from "./EditPost";
import Report from "./Report";
import NotFound from "./NotFound";

const Main = () => {
    return (
        <HashRouter>
            <Container sx={{'center': 'center'}}>
                <AppBar />
            </Container>
            <Routes>
                <Route exact path="/" element={
                    <Container sx={{'center': 'center'}}>
                        <StartPage />
                    </Container>
                }/>
                <Route exact path="/login" element={
                    <Container sx={{'center': 'center'}}>
                        <SignIn />
                        {/*<Login />*/}
                    </Container>
                }/>
                <Route exact path="/logout" element={
                    <Container sx={{'center': 'center'}}>
                        <SignOut />
                    </Container>
                }/>
                <Route exact path="/register" element={
                    <Container sx={{'center': 'center'}}>
                        <SignUp />
                    </Container>
                }/>
                <Route exact path="/post" element={
                    <Container sx={{'center': 'center'}}>
                        <PostList />
                    </Container>
                }/>
                <Route path="/post/:id" onleave={this} element={
                    <Container sx={{'center': 'center'}}>
                        <ShowPost />
                    </Container>
                }/>
                <Route path="/add" element={
                    <Container sx={{'center': 'center'}}>
                        <AddPost />
                    </Container>
                }/>
                <Route path="/edit/:id" element={
                    <Container sx={{'center': 'center'}}>
                        <EditPost />
                    </Container>
                }/>
                <Route path="/report" element={
                    <Container sx={{'center': 'center'}}>
                        <Report />
                    </Container>
                }/>
                <Route path="*" element={
                    <Container sx={{'center': 'center'}}>
                        <NotFound/>
                    </Container>
                }/>
            </Routes>
        </HashRouter>
    );
};

export default Main