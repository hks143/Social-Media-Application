import React, { useState, useEffect } from 'react'
import { Avatar, Paper, Card, Button, Typography } from '@material-ui/core/';
import { useSelector, useDispatch } from 'react-redux';
import useStyles from './styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, history, useHistory } from 'react-router-dom';
import { Mychats, FollowUnfollow } from '../../actions/direct'
import MessageIcon from '@mui/icons-material/Message';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Navbar from '../Navbar/Navbar';
const Mychat = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'));
    const [state, setstate] = useState([]);
  

    useEffect(async () => {

        if (user) {
            const data = await dispatch(Mychats());
            setstate(...state, data);
        }
        else {
            history.push('/auth');
        }
    }, []);

    return (
        <>
            <Navbar />
            {
                !state ? (
                    <h2>Loading....</h2>
                )
                    :
                    (
                        state?.map((item, i) =>
                            <>
                                <Paper className={classes.home}  >
                                    <div className={classes.paper}>
                                        {/* <AccountCircleIcon color="primary" /> */}
                                        <div className={classes.paper}>
                                            <Avatar style={{ height: '35px', width: '35px' }} alt={item?.firstname} >{item?.firstname.charAt(0)}</Avatar>
                                            <div>&nbsp;</div>
                                            <div>&nbsp;</div>
                                            <Typography variant="text">{`${item?.firstname} ${item?.lastname}`}</Typography>
                                        </div>
                                        <div>
                                            <IconButton color='primary' fontSize="small" onClick={() => history.push(`/profile/${item?.id}`)}> <VisibilityIcon /></IconButton>
                                            <IconButton color='primary' fontSize="small" onClick={() => history.push(`/direct/${item?.id}`)}> <MessageIcon /></IconButton>
                                        </div>


                                    </div>
                                </Paper>
                                <div>&nbsp;</div>
                            </>

                        )
                    )

            }
        </>


    )
}

export default Mychat
