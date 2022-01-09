import React, { useState,useEffect } from 'react'
import { Avatar, Paper, Card, Button, Typography } from '@material-ui/core/';
import { useSelector, useDispatch } from 'react-redux';
import useStyles from './styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, history, useHistory } from 'react-router-dom';
import { Mychats } from '../../actions/direct'
import MessageIcon from '@mui/icons-material/Message';
import { IconButton } from '@mui/material';
const Mychat = () => {
    const classes = useStyles();
    const history = useHistory();
     const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'));
    const [state, setstate] = useState([])
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
                          <IconButton fontSize="small" onClick={() => history.push(`/direct/${item?.id}`)}> <MessageIcon/></IconButton>

                        </div>
                    </Paper>
                    <div>&nbsp;</div>
                    </>
    
                )
            )

    )
}

export default Mychat
