import React, { useState, useEffect, useRef } from 'react'
import { Paper, Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, Divider } from '@material-ui/core/';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Container } from '@mui/material';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import { FindUserForChat, FollowUnfollow, AddNotification } from '../../actions/direct';
import image from '../../images/user.png'
import moment from 'moment';
import Post from "../Posts/Post/Post.js";
import Posts from "../Posts/Posts.js";
import { io } from 'socket.io-client'
import useStyles from './styles';
const Profile = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const socket = useRef();
    const classes=useStyles();
    const [Name, SetName] = useState('Name:Loading...');
    const [Email, setEmail] = useState('Email:Loading.. ');
    const [JoinDate, setJoinDate] = useState(Date.now());
    const [Follower, setFollower] = useState(0);
    const [Following, setFollowing] = useState(0);
    const [IsFollowing, setIsFollowing] = useState(false);
    const [noOfPosts, setNoOfPosts] = useState(0);
    const [posts, setPosts] = useState([]);
    const showFollowers = () => {
        if (Follower > 0) {
            history.push(`/user/followers/${id}`);
        }
    }
    const showFollowings = () => {
        if (Following > 0) {
            history.push(`/user/followings/${id}`);
        }
    }
    const handleFollowers = async () => {
        if (IsFollowing) {
            // setFollower((Follower) => Follower - 1);
            socket.current.emit("ChangeFollower", {
                number: -1
            })
        }
        else {
            // setFollower(Follower => Follower + 1);
            socket.current.emit("IncrementBadge", {
                ID: id,
                liker: 1,
                remove: true,
                isLike: false
            })
            socket.current.emit("ChangeFollower", {
                number: 1
            })

            dispatch(AddNotification({ id: id, data: `${user?.result?.name} started following #you#https://hemant-sahu.netlify.app/user/followers/${id}`, seen: false }))
        }
        setIsFollowing((IsFollowing) => !IsFollowing);
        await (dispatch(FollowUnfollow({ Follower: (user?.result?._id || user?.result?.googleId), FollowedBy: id })));
    }

    // console.log(id);
    useEffect(async () => {

        if (!user) {
            history.push('/');
        }
        socket.current = io("https://socketioprojectchatappp.herokuapp.com/");
        const Profile = await dispatch(FindUserForChat({ id: id }, history));
        console.log(Profile);
        SetName(Profile?.name);
        setEmail(Profile?.email);
        setJoinDate(Profile?.JoinedOn);
        setFollower(Profile?.follower?.length);
        setFollowing(Profile?.following?.length);
        setNoOfPosts(Profile?.post?.length);
        setPosts(Profile?.post);
        const temp = Profile?.follower.filter((id) => id === (user?.result?._id || user?.result?.googleId));

        if (temp?.length) {
            setIsFollowing(true);
        }
        else {
            setIsFollowing(false);
        }

        socket?.current.on("ChangeFollower", (number) => {
            setFollower(Follower => Follower + number.number);
        })
    }, [])
    return (
        <>
            <Navbar />
            <Container maxWidth="md">

                <Paper elevation={4}>
                    <Grid container >
                        <Grid item xs={12} md={4}>
                            <img src={image} alt='User' style={{ width: '180px', height: '180px', padding: '5px', display: 'block', margin: 'auto' }}></img>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            &nbsp;
                            <Typography variant='body2'>&nbsp;{Name}</Typography>
                            &nbsp;
                            <Divider />
                            {/* &nbsp;
                            <Typography variant='body2'>&nbsp;{Email}</Typography>
                            &nbsp; */}

                            {/* <Divider /> */}
                            &nbsp;
                            <Typography variant='body2'>&nbsp;{`Joined On : ${moment(JoinDate).format('ll')}`}</Typography>
                            &nbsp;
                            <Divider />
                            &nbsp;
                            <Typography variant='body2'>&nbsp;{`Posts : ${noOfPosts}`}</Typography>
                            &nbsp;
                            <Divider />


                        </Grid>

                    </Grid>
                </Paper>
                &nbsp;
                <Grid container spacing={2} >
                    {
                        ((user?.result?._id !== id && (user?.result?.googleId !== id)) && (
                            <Grid item xs={12} md={4}>
                                <Button onClick={handleFollowers} fullWidth variant='contained' color={IsFollowing ? `secondary` : `primary`}>
                                    {
                                        !IsFollowing ? 'Follow' : 'Unfollow'
                                    }
                                </Button>
                            </Grid>
                        ))
                    }


                    <Grid item xs={12} md={(user?.result?._id === id || (user?.result?.googleId === id)) ? 6 : 4}>
                        <Button onClick={showFollowers} fullWidth variant='contained' color="primary">
                            {`${Follower} Follower`}
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={(user?.result?._id === id || (user?.result?.googleId === id)) ? 6 : 4}>
                        <Button onClick={showFollowings} fullWidth variant='contained' color="primary">
                            {`${Following} Following`}
                        </Button>
                    </Grid>

                </Grid>
               <Divider/>
               &nbsp;
                {
                    !posts.length ?


                        (

                            <Paper  elivation={15}>
                                <Typography style={{display:'block',margin:'auto'}} variant='h6'>User doesn't have any post</Typography>
                            </Paper>

                        )
                        :
                        (
                            (
                                <Grid className={classes.container} container alignItems="stretch"  >
                                    {posts.slice(0).reverse().map((post) => (
                                        <>
                                            <div> &nbsp;</div>
                                            <Grid key={post._id} item xs={12} sm={12} md={12}>
                                                <Post showEditIcon={0} post={post} setCurrentId={0} />
                                            </Grid>
                                        </>
                                    ))}
                                </Grid>
                            )
                        )
                }
            </Container>


        </>

    )
}

export default Profile
