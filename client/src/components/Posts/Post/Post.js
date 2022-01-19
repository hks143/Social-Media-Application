import React, { useReducer, useRef, useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { saveAs } from 'file-saver'
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import EditIcon from '@material-ui/icons/Edit'
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { IconButton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { likePost, deletePost } from '../../../actions/posts';
import { FindNotification, AddNotification, ClearNotification, FindUnseenNotes, SetNotesSeen } from '../../../actions/direct'
import useStyles from './styles';
import { io } from 'socket.io-client'
const Post = ({ post, setCurrentId, showEditIcon }) => {
  const dispatch = useDispatch();
  const [op, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const [likes, setLikes] = useState(post?.likes);
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();
  const location = useLocation();
  // console.log(location);
  const socket = useRef();
  const ShowProfile = () => {
    history.push(`/profile/${post.creator}`);
  }
  useEffect(() => {
    socket.current = io("https://socketioprojectchatappp.herokuapp.com/");
    socket?.current?.on("IncrementBadge", (data) => {
      if (data.isLike === true) {
        // if (data.liker !== user?.result?._id && (data.liker !== user?.result?.googleId)) {
        if (data.remove === false) {
          // setLikes([...post?.likes, data.liker]);
          setLikes((prev) => { return [...prev, data.liker] });
        }
        else {
          // setLikes(post?.likes.filter((id) => id !== data.liker));
          setLikes((prev) => {
            return prev.filter((id) => id != data.liker);
          })
        }
        // }
      }
    })



  }, [])
  const openChat = () => {
    if (!user) {
      alert(`Sign in to chat with ${post.name}`);
    }

    history.push(`/direct/${post?.creator}`);
  }
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const openPost = (e) => {

    history.push(`/${post._id}`);
  };
  const handleClose = () => {
    setOpen(false);
  }
  const handleClickopen = () => {
    setOpenDialog(true);
  }
  const OnlyClose = () => {
    setOpenDialog(false);
  }
  const closeAndDelete = () => {
    try {
      dispatch(deletePost(post._id));

    }
    catch (error) {
      alert(error);
    }
    setOpenDialog(false);

  }
  const f = () => {
    setCurrentId(post._id);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'

    });
  };
  const userId = user?.result?.googleId || user?.result?._id;
  const hasLikedPost = post?.likes?.find((like) => like === userId);
  const CopyToClipboard = () => {
    try {

      navigator.clipboard.writeText(`https://hemant-sahu.netlify.app/${post._id}`);
      setOpen(true);

      setTimeout(function () { setOpen(false) }, 4000)
    }
    catch (error) {
      alert("Can't copy the post link,please try again later")
    }
  }
  const handleLike = async () => {
    dispatch(likePost(post._id));

    if (hasLikedPost) {
      // setLikes(post?.likes.filter((id) => id !== userId));
      socket?.current.emit("IncrementBadge", {
        ID: post.creator,
        liker: (user?.result?._id || (user?.result?.googleId)),
        remove: true,
        isLike: true

      })


      // if (post.creator !== (user?.result?.googleId) && (post.creator !== (user?.result?._id)))
      dispatch(AddNotification({ id: (post?.creator), data: `${user?.result?.name} unliked your #post#https://hemant-sahu.netlify.app/${post._id}`, seen: false }))
    } else {
      // setLikes([...post?.likes, userId]);
      socket?.current.emit("IncrementBadge", {
        ID: post.creator,
        liker: (user?.result?._id || (user?.result?.googleId)),
        remove: false,
        isLike: true
      })

      // if (post.creator !== (user?.result?.googleId) && (post.creator !== (user?.result?._id)))
      dispatch(AddNotification({ id: (post?.creator), data: `${user?.result?.name} liked your #post#https://hemant-sahu.netlify.app/${post._id}`, seen: false }))

    }



  };
  const Likes = () => {
    if (likes?.length > 0) {
      return likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
        ? (
          <><FavoriteIcon color="secondary" fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
        ) : (
          <><FavoriteBorderIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><FavoriteBorderIcon fontSize="small" />&nbsp;Like</>;
  };
  const download = () => {
    saveAs(`${post?.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}`, `QuickShare: ${post?.name}'s post`)
  };
  return (

    <Card className={classes.card}>
      {/* <Link to={`/${post._id}`}> */}
      <CardMedia onDoubleClick={handleLike} className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
      {/* </Link> */}

      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>

      </div>


      {
        (post?.creator === "107825854419209828003") ? (
          <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.name}{<VerifiedIcon color="primary" />}{<IconButton color='primary' fontSize='small' onClick={ShowProfile}><VisibilityIcon /></IconButton>}</Typography>
        ) :
          (post?.creator !== "107825854419209828003") && (
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.name}{<IconButton onClick={ShowProfile} color='primary' fontSize='small'><VisibilityIcon /></IconButton>}</Typography>
          )

      }

      <Typography className={classes.title} variant="body2" component="h2">{moment(post.createdAt).format('lll')}</Typography>
      {

        (post?.message?.match(/(\w+)/g)?.length > 10 ? (
          <CardContent className={classes.cardContent}>
            <Typography variant="caption" color="textSecondary" component="p">{isReadMore ? post?.message?.slice(0, 70) : post.message}<Button variant="text" onClick={toggleReadMore} >
              <Typography variant="caption">{isReadMore ? "...read more" : " show less"}</Typography>
            </Button></Typography>
          </CardContent>
        )
          :
          (
            <CardContent className={classes.cardContent}>
              <Typography variant="caption" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
          )
        )
      }

      {/* <div></div> */}
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>

        {
          (op && (
            <Snackbar open={op} autoHideDuration={4000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} >
                Post link has been copied to clipboard
              </Alert>
            </Snackbar>
          ))
        }

        <Button padding='0px' onClick={openPost} color="primary">
          <Badge badgeContent={post?.comments?.length ? (post?.comments?.length) : 0} color="secondary" max={9} color="primary">

            {/* <CommentIcon fontSize="small" /> */}
            <svg aria-label="Comment" class="_8-yf5 " color="#262626" fill="#262626" height="18" role="img" viewBox="0 0 48 48" width="18"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
          </Badge>
        </Button>
        {
          (!(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
            <Button padding='0px' onClick={openChat} color="primary">
              <svg aria-label="Messenger" class="_8-yf5 " fill="#262626" height="18" role="img" viewBox="0 0 48 48" width="18"><path d="M36.2 16.7L29 22.2c-.5.4-1.2.4-1.7 0l-5.4-4c-1.6-1.2-3.9-.8-5 .9l-6.8 10.7c-.7 1 .6 2.2 1.6 1.5l7.3-5.5c.5-.4 1.2-.4 1.7 0l5.4 4c1.6 1.2 3.9.8 5-.9l6.8-10.7c.6-1.1-.7-2.2-1.7-1.5zM24 1C11 1 1 10.5 1 23.3 1 30 3.7 35.8 8.2 39.8c.4.3.6.8.6 1.3l.2 4.1c0 1 .9 1.8 1.8 1.8.2 0 .5 0 .7-.2l4.6-2c.2-.1.5-.2.7-.2.2 0 .3 0 .5.1 2.1.6 4.3.9 6.7.9 13 0 23-9.5 23-22.3S37 1 24 1zm0 41.6c-2 0-4-.3-5.9-.8-.4-.1-.8-.2-1.3-.2-.7 0-1.3.1-2 .4l-3 1.3V41c0-1.3-.6-2.5-1.6-3.4C6.2 34 4 28.9 4 23.3 4 12.3 12.6 4 24 4s20 8.3 20 19.3-8.6 19.3-20 19.3z"></path></svg>
            </Button>
          ))
        }

        <a href={`whatsapp://send?text=Click on the link to see ${post.name}'s post on QuickShare https://hemant-sahu.netlify.app/${post._id}`}>

          <WhatsAppIcon fontSize='small' />
        </a>


        <Button onClick={CopyToClipboard} color="primary" >
          <ContentCopyIcon fontSize='small' />
        </Button>

        <Button disabled={!user} onClick={download} color="primary" >
          <DownloadIcon fontSize="small" />
        </Button>

        {
          (openDialog && (
            <Dialog
              open={handleClickopen}
              onClose={OnlyClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Do you really want to delete this post?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Once you delete this post, there is no going back.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeAndDelete}>Yes</Button>
                <Button onClick={OnlyClose} autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
          ))
        }

        {
          ((showEditIcon === 1) && (

            <Button disabled={!(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator)} onClick={f} size="small" color="primary" >
              <EditIcon fontSize="small" />
            </Button>
          ))
        }


        <Button disabled={!(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator)} size="small" color="primary" onClick={handleClickopen}>
          <DeleteIcon fontSize="small" />
        </Button>

      </CardActions>
    </Card>
  );
};

export default Post;
