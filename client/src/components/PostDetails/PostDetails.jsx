import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, CircularProgress, Divider, Button } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import CommentSection from './CommentSection';
import { fetchById } from '../../actions/posts';
import useStyles from './styles';
import { Skeleton } from '@mui/material';
import Navbar from '../Navbar/Navbar';
const Post = () => {
  const { post, isLoading } = useSelector((state) => state?.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const { id } = useParams();
  useEffect(async () => {

    await dispatch(fetchById(id));
    history.push(`/${id}`);

  }, [id, dispatch]);
  const openPost = (_id) => history.push(`/posts/${_id}`);
  return (
   <>
   <Navbar/>
   {
       (!post) ?

     
       <Grid xs={12} sm={12} md={12}>
         <Skeleton
           animation="wave"
           // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
           variant="rectangular"
           height={300}
         />
         <Skeleton
           animation="wave"
           // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
           variant="text"
           width="100%"
           height={50}
         />
         <Skeleton
           animation="wave"
           // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
           variant="text"
           width="70%"
           height={50}
         />
         <Skeleton
           animation="wave"
           // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
           variant="text"
           width="50%"
           height={30}
         />
         <Skeleton
           animation="wave"
           // sx={{ bgcolor: 'rgb(215 215 223 / 11%)' }}
           variant="text"
           width="100%"
           height={200}
         />
       </Grid>
 
 
       :
       (
         <Paper style={{ padding: '20px', paddingBottom: '25px', paddingTop: '15px', borderRadius: '15px' }} elevation={6}>
           <div className={classes.card}>
             <div className={classes.section}>
               <div className={classes.imageSection}>
                 <img className={classes.media} src={post?.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={'image'} />
               </div>
 
               <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post?.tags.map((tag) => `#${tag} `)}</Typography>
 
               {
                 (post?.creator === "107825854419209828003") ? (
                   <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.name}{<VerifiedIcon color="primary" />}</Typography>
                 ) :
                   (
                     <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.name}</Typography>
                   )
 
               }
 
               <Typography variant="body1">{moment(post?.createdAt).fromNow()}</Typography>
               <Divider style={{ margin: '20px 0' }} />
               <Typography className={classes.cardContent} gutterBottom variant="body2" component="p">{post?.message}</Typography>
 
               <Divider style={{ margin: '20px 0' }} />
               <CommentSection post={post} id={id} />
              
 
             </div>
 
           </div>
 
         </Paper>)
   }
   </>
   

  );
};

export default Post;