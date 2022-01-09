import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField, useTheme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useSelector } from 'react-redux';
import Icon from './icons';
import { loginviaOTP, signinByOTP } from '../../actions/auth';
import useStyles from './styles';
import Input from './Input';
const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
const LoginviaOTP = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [form, setForm] = useState(initialState);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const [sentotp, setSentotp] = useState(false);
    const [oneTimePass, setOneTimePass] = useState(0);
    const otpForLogin = useSelector((state) => state?.auth?.UserDetails?.data?.OneTimePassword);
    const oldUserData = useSelector((state) => state?.auth?.UserDetails?.data?.UserResult);
    const tokn = useSelector((state) => state?.auth?.UserDetails?.data?.token);
    const [resend, setResend] = useState(false);
    const f = () => {
        dispatch(loginviaOTP(form));
        setResend(false);

        setTimeout(function () { setResend(true) }, 10000);
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!sentotp) {
            dispatch(loginviaOTP(form));
            setSentotp(true);
            setTimeout(function () { setResend(true) }, 10000);
        }
        else {

            if (String(otpForLogin) === String(oneTimePass)) {
                dispatch(signinByOTP({ result: oldUserData, token: tokn }, history));
            }
            else {
                alert('You have entered wrong otp,Enter correct otp to proceed')
            }

        }

    }



    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{'Sign in'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        {
                            ((!sentotp) && (
                                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                            ))
                        }
                        {
                            ((sentotp) && (
                                <Input name="OTP" label="Enter OTP" type="number" handleChange={(e) => setOneTimePass(e.target.value)} />
                            ))
                        }

                        {
                            ((sentotp ) && (
                                <Button disabled={!resend} variant="text" onClick={f} color="primary" >{resend?'resend otp':'resend otp'}</Button>
                            ))
                        }

                    </Grid>
                    <div>&nbsp;</div>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {!sentotp ? 'Send OTP' : 'Sign In'}
                    </Button>
                </form>

            </Paper>
        </Container>
    )
}

export default LoginviaOTP
