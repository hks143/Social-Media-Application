import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import HomeIcon from '@mui/icons-material/Home';
import Badge from '@mui/material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import memories from '../../images/logo.png';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { FindNotification, AddNotification, ClearNotification, FindUnseenNotes, SetNotesSeen } from '../../actions/direct.js'
import useStyles from './styles';
import { io } from 'socket.io-client'
const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const [badge, setBadge] = useState(10001);
  const socket = useRef();
  const logout = () => {
    dispatch({ type: 'LOGOUT' });

    history.push('/auth');

    setUser(null);
  };
  const f = () => {
    setBadge(0);
    dispatch(SetNotesSeen({ id: (user?.result?.googleId || user?.result?._id) }))
    history.push('/notifications');

  }

  useEffect(async () => {
    if (user) {
      const data = await dispatch(FindUnseenNotes({ id: (user?.result?.googleId || user?.result?._id) }))
      // console.log(data);
      setBadge(data?.length);
      // console.log(data,badge);
      socket.current = io("https://socketioprojectchatappp.herokuapp.com/");

      socket?.current?.on("IncrementBadge", (data) => {
        if (user?.result?._id === data?.ID || user?.result?.googleId === data?.ID) {
          setBadge(prev => prev + 1);
        }
      })

    }
    else {
      history.push('/auth');
    }
  }, [])
  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <>

      <AppBar className={classes.appBar} position="static" color="inherit">
        <div className={classes.brandContainer}>
          <Typography component={Link} to="/" className={classes.heading} variant="h4" align="center">QuickShare</Typography>
          <img className={classes.image} src={memories} alt="icon" height="40" />
        </div>
        <Toolbar className={classes.toolbar}>
          {user?.result ? (
            <div className={classes.profile}>
              <IconButton onClick={() => { history.push(`/profile/${(user?.result?._id || user?.result?.googleId)}`) }}> <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar></IconButton>
              {/* <Avatar onClick={()=>{history.push(`/profile/${(user?.result?._id || user?.result?.googleId)}`)}} className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar> */}
              <Typography className={classes.userName} variant="h6" type>{user?.result.name}</Typography>
              <IconButton component={Link} to="/" ><HomeIcon /></IconButton>
              <IconButton component={Link} to="/direct">  <svg aria-label="Messenger" class="_8-yf5 " fill="#262626" height="18" role="img" viewBox="0 0 48 48" width="18"><path d="M36.2 16.7L29 22.2c-.5.4-1.2.4-1.7 0l-5.4-4c-1.6-1.2-3.9-.8-5 .9l-6.8 10.7c-.7 1 .6 2.2 1.6 1.5l7.3-5.5c.5-.4 1.2-.4 1.7 0l5.4 4c1.6 1.2 3.9.8 5-.9l6.8-10.7c.6-1.1-.7-2.2-1.7-1.5zM24 1C11 1 1 10.5 1 23.3 1 30 3.7 35.8 8.2 39.8c.4.3.6.8.6 1.3l.2 4.1c0 1 .9 1.8 1.8 1.8.2 0 .5 0 .7-.2l4.6-2c.2-.1.5-.2.7-.2.2 0 .3 0 .5.1 2.1.6 4.3.9 6.7.9 13 0 23-9.5 23-22.3S37 1 24 1zm0 41.6c-2 0-4-.3-5.9-.8-.4-.1-.8-.2-1.3-.2-.7 0-1.3.1-2 .4l-3 1.3V41c0-1.3-.6-2.5-1.6-3.4C6.2 34 4 28.9 4 23.3 4 12.3 12.6 4 24 4s20 8.3 20 19.3-8.6 19.3-20 19.3z"></path></svg></IconButton>
              <IconButton onClick={f} >
                <Badge badgeContent={badge === 10001 ? 0 : badge} color="error" max={9} >
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton className={classes.logout} onClick={logout}><LogoutIcon /></IconButton>

            </div>
          ) : (
            <div className={classes.profile}>
              <IconButton component={Link} to="/" ><HomeIcon /></IconButton>
              <IconButton>  <svg aria-label="Messenger" class="_8-yf5 " fill="#262626" height="18" role="img" viewBox="0 0 48 48" width="18"><path d="M36.2 16.7L29 22.2c-.5.4-1.2.4-1.7 0l-5.4-4c-1.6-1.2-3.9-.8-5 .9l-6.8 10.7c-.7 1 .6 2.2 1.6 1.5l7.3-5.5c.5-.4 1.2-.4 1.7 0l5.4 4c1.6 1.2 3.9.8 5-.9l6.8-10.7c.6-1.1-.7-2.2-1.7-1.5zM24 1C11 1 1 10.5 1 23.3 1 30 3.7 35.8 8.2 39.8c.4.3.6.8.6 1.3l.2 4.1c0 1 .9 1.8 1.8 1.8.2 0 .5 0 .7-.2l4.6-2c.2-.1.5-.2.7-.2.2 0 .3 0 .5.1 2.1.6 4.3.9 6.7.9 13 0 23-9.5 23-22.3S37 1 24 1zm0 41.6c-2 0-4-.3-5.9-.8-.4-.1-.8-.2-1.3-.2-.7 0-1.3.1-2 .4l-3 1.3V41c0-1.3-.6-2.5-1.6-3.4C6.2 34 4 28.9 4 23.3 4 12.3 12.6 4 24 4s20 8.3 20 19.3-8.6 19.3-20 19.3z"></path></svg></IconButton>
              <IconButton >
                <Badge color="error" max={9} >
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton component={Link} to="/auth"  ><LoginIcon /></IconButton>
            </div>
          )}
        </Toolbar>


      </AppBar>
    </>
  );
};

export default Navbar;
