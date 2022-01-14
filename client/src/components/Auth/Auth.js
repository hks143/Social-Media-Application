import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useSelector } from 'react-redux';
import Icon from './icons';
import { signin, signup, loginUsers, requestOtp } from '../../actions/auth';
// import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [oneTimePass, setOneTimePass] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sentOtp, setSentOtp] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  var OTP = useSelector((state) => state?.auth?.OTP?.data);
  const [resend, setResend] = useState(false);
    const ff = () => {
      dispatch(requestOtp(form));
        setResend(false);

        setTimeout(function () { setResend(true) }, 10000);
    }
  const f = () => {
    history.push('/forgetPassword');
  }
  const SignInOTP = () => {
    history.push('/loginViaOTP');
  }
  const switchMode = () => {
    setForm(initialState);
    if (isSignup === true) {
      setVerified(false);
      // setOneTimePass(false);
      setSentOtp(false);
    }
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (verified) {
        dispatch(signup(form, history));
      }
      else {
        if (!sentOtp) {

          
          try {

            dispatch(requestOtp(form));
            setSentOtp(true);
            setTimeout(function () { setResend(true) }, 10000);
          }
          catch (error) {
            console.log(error);
          }
          
        }
        else {

         
          if (String(oneTimePass) === String(OTP)) {
            setVerified(true);
          }
          else {
            alert("You have entered wrong OTP,enter correct OTP to signup")
          }
        }
      }
    } else {
      dispatch(signin(form, history));
    }
  };

  const googleSuccess = async (res) => {
    // console.log(res);
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: 'AUTH', data: { result, token } });

      history.push('/');
      await dispatch(loginUsers(result));
    } catch (error) {
      console.log(error);
      // alert(error);
    }
  };

  const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            {(isSignup && verified) && (
              <>
                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
              
              </>
            )}
            {
              ((!isSignup || (!verified) && (!sentOtp)) && (
                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              ))
            }
          

            {
              ((isSignup && sentOtp && !verified) && (
                <Input name="OTP" label="Enter OTP" handleChange={(e) => setOneTimePass(e.target.value)} type="number" />
              ))
            }
              {
                            ((isSignup && sentOtp && !verified) && (
                                <Button disabled={!resend} variant="text" onClick={ff} color="primary" >{resend?'resend otp':'resend otp'}</Button>
                            ))
                        }
            {
              (((!isSignup) || (verified)) && (
                <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
              ))
            }

          </Grid>
          {
            ((!isSignup) && (
              <Button variant="text" onClick={f} color="primary" >Forgot password?</Button>
            ))
          }
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? (verified ? 'Signup' : (sentOtp ? 'Proceed To Signup' : 'Verify Gmail And Proceed To Signup')) : 'Sign In'}
          </Button>
          {
            ((!isSignup) && (
              <Button onClick={SignInOTP} fullWidth variant="contained" color="primary" className={classes.submit}>
                Sign IN Via OTP
              </Button>
            ))
          }

          <GoogleLogin
            clientId={process.env.clientId}
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Sign In with Google
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />


          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}
              </Button>
            </Grid>

          </Grid>
          <Typography variant="caption" >Made with ❤️ by Hemant</Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
