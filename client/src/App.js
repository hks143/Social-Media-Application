import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PostDetails from './components/PostDetails/PostDetails';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Auth from './components/Auth/Auth';
import ForgetPassword from './components/Auth/ForgetPassword'
import Chat from './components/chat/Chat';
import My404Component from './components/PageNotFound/PageNotFound.js'
import LoginviaOTP from './components/Auth/LoginviaOTP';
import Mychats from './components/mychats/Mychat';
import Notification from './components/Notifications/Notification.js';
import Profile from './components/Profile/Profile';
import Follower from './components/Profile/Follower';
import Following from './components/Profile/Following';
const user = JSON.parse(localStorage.getItem('profile'));
// console.log(user);
const App = () => (

    <BrowserRouter>
        <Container maxWidth="lg">
           
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/auth" exact component={Auth} />
                <Route path="/forgetPassword" exact component={ForgetPassword} />
                <Route path="/loginViaOTP" exact component={LoginviaOTP} />
                <Route path="/notifications" exact component={Notification} />
                <Route path="/direct" exact component={Mychats} />
                <Route path="/:id" exact component={PostDetails} />
                <Route path="/profile/:id" exact component={Profile} />
                <Route path="/user/followers/:id" exact component={Follower} />
                <Route path="/user/followings/:id" exact component={Following} />
             

                <Route path="/direct/:id">
                    { <Chat/>}
                </Route>

                <Route path='*' exact={true} component={My404Component} />
            </Switch>
        </Container>
    </BrowserRouter>
);

export default App;
