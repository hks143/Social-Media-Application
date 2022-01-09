import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField, useTheme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useSelector } from 'react-redux';
import Icon from './icons';
import { requestOtpLogin, updatePassord } from '../../actions/auth';
import useStyles from './styles';
import Input from './Input';
const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
const ForgetPassword = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [form, setForm] = useState(initialState);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const [showPassword, setShowPassword] = useState(false);
    const [sentotp, setSentotp] = useState(false);
    const [verified, setVerified] = useState(false);
    const [oneTimePass, setOneTimePass] = useState(0);
    const [resend,setResend]=useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);
    const otpForLogin = useSelector((state) => state?.auth?.OTPLOGIN?.data);
    const f=()=>{
        dispatch(requestOtpLogin(form));
        setResend(false);

        setTimeout(function(){setResend(true)},10000);
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!sentotp) {
            dispatch(requestOtpLogin(form));
            
            setSentotp(true);

            setTimeout(function(){setResend(true)},10000);
        }
        else {
            if (verified) {
                try {
                   
                    dispatch(updatePassord(form));

                    history.push('/auth');
                    alert('Your Password has been changed successfully.');
                }
                catch (error) {
                    alert(error);
                }
            }
            else {
                if (String(otpForLogin) === String(oneTimePass)) {
                    setVerified(true);
                }
                else {
                    alert('You have entered wrong otp,Enter correct otp to proceed')
                }
            }
        }

    }



    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{'CHANGING PASSWORD'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        {
                            ((!sentotp) && (
                                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                            ))
                        }
                        {
                            ((sentotp && !verified) && (
                                <Input name="OTP" label="Enter OTP" type="number" handleChange={(e) => setOneTimePass(e.target.value)} />
                            ))
                        }
                        {
                            (((sentotp && !verified)) &&(
                                <Button disabled={!resend} variant="text" onClick={f} color="primary" >{resend?'resend otp':'resend otp'}</Button>
                            ))
                        }
                        {
                            ((sentotp && verified) && (
                                <Input name="password" label="New Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                            ))
                        }


                    </Grid>
                    <div>&nbsp;</div>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {!sentotp ? 'Send OTP' : (!verified ? 'Proceed to change password' : 'Change Password')}
                    </Button>
                </form>

            </Paper>
        </Container>
    )
}

export default ForgetPassword
