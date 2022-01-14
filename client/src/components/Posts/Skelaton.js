import React from 'react'
import { Grid ,Card} from '@material-ui/core';
import Skeleton from '@mui/material/Skeleton';
import useStyles from './Post/styles'
const Skelaton = () => {
    const classes=useStyles();
    return (
        <div className={classes.card}>
            <Skeleton
                animation="wave"
                // sx={{ bgcolor: 'white' }}
                variant="rectangular"
                height={400}
            />
            <Skeleton
                animation="wave"
                // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
                variant="text"
                width="100%"
                height={30}
            />
            <Skeleton
                animation="wave"
                // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
                variant="text"
                width="70%"
                height={30}
            />
            <Skeleton
                animation="wave"
                // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
                variant="text"
                width="50%"
                height={15}
            />
            <Skeleton
                animation="wave"
                // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
                variant="text"
                width="100%"
                height={150}
            />
        </div>
    )
}

export default Skelaton
