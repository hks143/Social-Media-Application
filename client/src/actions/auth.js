import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    console.log(data);
    dispatch({ type: 'AUTH', data });

    router.push('/');
  } catch (error) {
    alert("Invalid email or password !");
  }
};
export const signinByOTP = (data, router) => async (dispatch) => {
  try {
    // console.log(data);
    dispatch({ type: 'AUTH', data });

    router.push('/');
  } catch (error) {
    alert("Invalid email or password !");
  }
};

export const requestOtp = (formData) => async (dispatch) => {
  try {
    const data = await api.requestOtp(formData);
    dispatch({ type: 'SETOTP', data });

  } catch (error) {
    alert("OTP couldn't be sent: This email has been registered or email id doesn't exist,Try with another email id");
  }
};
export const updatePassord = (formData) => async (dispatch) => {
  try {

    const { data } = await api.changePassword(formData);
    // console.log(data);

  } catch (error) {
    alert(error.message);
  }
};
export const requestOtpLogin = (formData) => async (dispatch) => {
  try {
    const data = await api.requestOtpLogin(formData);
    dispatch({ type: 'SETOTPLOGIN', data });

  } catch (error) {
    alert("OTP couldn't be sent: This email has not been registered or email id doesn't exist,Try with another email id");
  }
};
export const loginviaOTP = (formData) => async (dispatch) => {
  try {
    const data = await api.loginviaOTP(formData);
    // console.log(data);
    dispatch({ type: 'GETOTPSETUSER', data });

  } catch (error) {
    alert("OTP couldn't be sent: This email has not been registered or email id doesn't exist,Try with another email id");
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: 'AUTH', data });

    router.push('/');
  } catch (error) {
    alert("This email has been already taken, please try with another !")
  }
};
export const loginUsers = (result) => async (dispatch) => {
  try {
    await api.loginUsers(result);

  } catch (error) {
    // alert("Something went wrong , Try again later !");
  }
};
