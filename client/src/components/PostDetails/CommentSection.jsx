import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button, Divider } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import { FindNotification,AddNotification,ClearNotification ,FindUnseenNotes, SetNotesSeen} from '../../actions/direct'
import VerifiedIcon from '@mui/icons-material/Verified';
import { commentPost } from '../../actions/posts';
import useStyles from './styles';
import { io } from 'socket.io-client'
import { useHistory, useLocation } from 'react-router-dom';

const CommentSection = ({ post, id }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  const socket=useRef();
  const mylove = post?.comments;

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [comments, setComments] = useState(mylove);
  const classes = useStyles();
  const commentsRef = useRef();
  const [showComment, setShowComment] = useState(0);
  const tt = () => {
    setShowComment(1 - showComment);
  }
  useEffect(()=>{
    socket.current = io("https://socketioprojectchatappp.herokuapp.com/"); 
    socket.current.on("getComment",data=>{
      if(data.ID===post._id){
      setComments((prev)=>{
        return [...prev,data.comment];
      })
    }
    })
  
  },[])

//   useEffect(() => {
//     socket?.current?.emit("addUserForComment", (user?.result?.googleId || user?.result?._id));
    
// }, [user]);
  useEffect(() => {

    if (comments) setComments(comments);
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [dispatch, id, comments, history, location, showComment]);

  const handleComment = async () => {
    const p = comment;
    // setComments([...comments, ]);

    setComment('');
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    socket.current.emit("IncrementBadge",{
         ID:post?.creator,
         liker:1,
         remove:true,
         isLike:false
    })
    socket.current.emit("SendComment",{ID:post._id,comment:`${user?.result?.name}: ${p}`});
    dispatch(commentPost(`${user?.result?.name}: ${p}:${user?.result?.googleId||(user?.result?._id)}`, post._id));
    dispatch(AddNotification({id:(post?.creator), data:`${user?.result?.name} commented on your #post#https://hemant-sahu.netlify.app/${post._id}`,seen:false}));

  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Button variant="text" size="small" onClick={tt} fontSize="small">
            <Typography gutterBottom variant="body1">{!comments?.length ? `No comments yet` : (showComment === 1 ? `Hide ${comments?.length} ${comments?.length == 1 ? `Comment` : `Comments`}` : `View ${comments?.length} ${comments?.length == 1 ? `Comment` : `Comments`}`)}</Typography>
          </Button>

          {comments?.map((c, i) => (
            (showComment === 1) && (
              <Typography key={i} gutterBottom variant="body2" >
                <Button variant='text' color='primary' onClick={()=>{history.push(`/profile/${c.split(':')[2]}`)}}>{c.split(': ')[0]}</Button>
                {/* <strong>{c.split(': ')[0]}</strong> */}
                {
                  (c.includes('107825854419209828003') && (
                    <VerifiedIcon color="primary" fontSize="inherit" />)

                  )
                }
                {c.split(':')[1]}
                <Divider style={{ margin: '5px 0' }} />
              </Typography>
            )
          ))}
          <div ref={commentsRef} />
        </div>
        <div style={{ width: '70%' }}>
         
          <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
          <br />
          <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment?.length || (!user?.result?.name) || ((!comment || /^\s*$/.test(comment)))} color="primary" variant="contained" onClick={handleComment}>
            {user?.result ? ((!comment || /^\s*$/.test(comment))  ? `Start typing..` : `Post`) : `Signin to comment`}
          </Button>
         
        </div>
      </div>
    </div>
  );
};

export default CommentSection;