import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Post from './Post/Post';
import useStyles from './styles';
import Skelaton from './Skelaton';
const Posts = ({ setCurrentId }) => {
  const { posts } = useSelector((state) => state?.posts);
  // console.log(posts);
  const classes = useStyles();

  return (
    !posts.length ?


      (
        // <Grid className={classes.container} container spacing={3}>
          <Skelaton />
          /* <Skelaton />
          <Skelaton /> */
        // </Grid>

      )
      : (
        <Grid className={classes.container} container alignItems="stretch"  >
          {posts.slice(0).reverse().map((post) => (
            <>
            <div> &nbsp;</div>
            <Grid key={post._id} item xs={12} sm={12} md={12}>
              <Post showEditIcon={1} post={post}  setCurrentId={setCurrentId} />
            </Grid>
             </>
          )) }
        </Grid>
      )
  );
};

export default Posts;
