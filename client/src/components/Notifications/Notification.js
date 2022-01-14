import React, { useState, useEffect } from 'react'
import { Avatar, Paper, Card, Button, Typography } from '@material-ui/core/';
import { useSelector, useDispatch } from 'react-redux';
import useStyles from './styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, history, useHistory } from 'react-router-dom';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton } from '@mui/material';
import moment from 'moment'
import { FindNotification, ClearNotification, AddNotification } from '../../actions/direct'
import Navbar from '../Navbar/Navbar';
const Mychat = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'));
    const [state, setstate] = useState([])
    const clearall = () => {
        setstate([]);
        dispatch(ClearNotification({ id: (user?.result?.googleId || (user?.result?._id)) }));
    }
    useEffect(async () => {

        if (user) {
            const data = await dispatch(FindNotification({ id: (user?.result?.googleId || (user?.result?._id)) }));
            setstate(...state, data);
        }
        else {
            history.push('/auth');
        }
    }, []);

    return (

        !(state?.length) ? (
            <>
                <Navbar />
                <Paper className={classes.home} >
                    <div className={classes.paper}>
                        <Typography variant="h6">No new notifications</Typography>
                    </div>
                </Paper>
            </>

        )
            :
            (
                <>
                    <Navbar />
                    {

                        state?.slice(0).reverse().map((item, i) => (
                            <>

                                <Paper className={classes.home} >
                                    <div className={classes.paper}>
                                        {/* <AccountCircleIcon color="primary" /> */}

                                        <Typography variant="text">{`${item.notification.split('#')[0]}`} <a href={`${item.notification.split('#')[2]}`}>{item.notification.split('#')[1]}</a></Typography>
                                        <Typography variant="caption">{`${moment(item.createdAt).format('lll')}`}</Typography>
                                    </div>
                                </Paper>

                                <div>&nbsp;</div>
                            </>

                        ))}
                    <Button className={classes.home} onClick={clearall} fullWidth variant="contained" color="secondary">Clear All</Button>

                </>
            )

    )
}

export default Mychat
