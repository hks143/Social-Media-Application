import axios from 'axios';

const API = axios.create({ baseURL: 'https://hemant-sahu.herokuapp.com/' });
// const API = axios.create({ baseURL: 'http://localhost:7000/' });
API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token} ${JSON.parse(localStorage.getItem('profile')).result?.name}`;
  }

  return req;
});

export const fetchPosts = () => API.get('/posts');
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const changePassword = (formData) => API.patch(`/user/changePassword`, formData);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const fetchById = (id) => API.get(`/posts/${id}`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const requestOtp = (formData) => API.post('/user/requestotp', formData);
export const requestOtpLogin = (formData) => API.post('/user/requestotpLogin', formData);
export const loginviaOTP = (formData) => API.post('/user/loginviaOTP', formData);
export const loginUsers = (result) => API.post('/user/loginUsers', result);
export const createMessage = (newMessage) => API.post('user/direct', newMessage);
export const GetDirectMessage = (data) => API.post('user/GETdirect', data);
export const FindUserForChat = (id) => API.post('user/FindUserForChat', id);
export const SendMailToUser=(data)=>API.post('user/SendMailToUser', data);
export const AddNotification=(data)=>API.post('user/addNotification', data);
export const FindNotification=(data)=>API.post('user/findNotification', data);
export const ClearNotification=(data)=>API.post('user/clearNotification', data);
export const FollowUnfollow=(data)=>API.patch('user/followUnfollow',data);
export const FindUnseenNotes=(data)=>API.post('user/findUnseenNotes', data);
export const SetNotesSeen=(data)=>API.post('user/SetNotesSeen', data);
export const Mychats=()=>API.get('user/Mychats');