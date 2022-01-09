import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  media: {
    height: '400px',
    
    maxWidth:'700px',
    // minWidth:'400px'
    
  },
  border: {
    border: 'solid',
  },
  fullHeightCard: {
    height: '100%',
    
  },
  card: {
    display: 'block',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    margin:'auto',
    borderRadius: '15px',
    height: '100%',
    position: 'relative',
    maxWidth:'700px',
    // marginBottom:'20px'
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
  },
  overlay2: {
    position: 'absolute',
    top: '15px',
    right: '5px',
    color: 'white',
  },
  grid: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    // margin: '20px',
    marginTop:'9px',
    marginBottom:'7px',
    marginLeft:'20px'
  },
  title: {
    padding: '0 16px',
  },
  cardActions: {
    padding: '8px 16px 5px 16px',
    // padding: '0 0px 8px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    overflowX:'auto',
    maxWidth:'700px'
  },
  cardContent:{
    maxHeight:'40px',
    overflow:'auto'
  },
});
