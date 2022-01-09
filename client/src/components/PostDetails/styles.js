import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '500px',

  },
  card: {
    display: 'flex',
    width: '100%',
    // maxHeight: '1500px',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  imageSection: {
    // marginLeft: '250px',
    display:'block',
    margin:'auto',
    maxWidth:'800px',
    // justifyContent:'center',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  recommendedPosts: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  loadingPaper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', borderRadius: '15px', height: '39vh',
  },
  commentsOuterContainer: {
    // display: 'flex',
    justifyContent: 'space-between',
    // marginRight: '30px',
  },
  commentsInnerContainer: {
    maxHeight: '250px',
    overflowY: 'auto',
    marginRight: '30px',
  },
  cardContent:{
    maxHeight:'80px',
    overflow:'auto'
  },
}));