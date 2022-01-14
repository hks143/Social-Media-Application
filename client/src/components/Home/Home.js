import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { getPosts } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import useStyles from './styles';
import Navbar from '../Navbar/Navbar'
const Home = () => {
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const classes = useStyles();
  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  return (
    <>
    <Navbar/>
     <Grow in>
      <Container>
        <Grid
          className={classes.mainContainer}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
        >
          {
            (window.screen.width < 800 && (
              <>
                <Grid item xs={12} sm={12}>
                  <Posts setCurrentId={setCurrentId} />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Form currentId={currentId} setCurrentId={setCurrentId} />
                </Grid>
              </>
            ))

          }
          {
            (window.screen.width >= 800 && (
              <>

                <Grid item xs={12} sm={12}>
                  <Form currentId={currentId} setCurrentId={setCurrentId} />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Posts setCurrentId={setCurrentId} />
                </Grid>
              </>
            ))

          }
         
        </Grid>
      </Container>
    </Grow>
    </>
   
  );
};

export default Home;
