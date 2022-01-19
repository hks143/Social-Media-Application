import * as api from '../api/index.js';

export const createMessage = (Data) => async (dispatch) => {
    try {
      const { data } = await api.createMessage(Data);
      // console.log(data);
     
    } catch (error) {
        console.log(error);
    //   alert("Invalid email or password !");
    }
  };
  export const SendMailToUser = (Data) => async (dispatch) => {
    try {
       await api.SendMailToUser(Data);
      // console.log(data);
     
    } catch (error) {
        console.log(error);
    //   alert("Invalid email or password !");
    }
  };

  export const GetDirectMessage = (ID) => async (dispatch) => {
    try {
      // console.log(ID);
      const { data } = await api.GetDirectMessage(ID);
      // console.log(data);
      
      dispatch({type:'GET_MESSAGES',payload:data});
      return data;
     
    } catch (error) {
        console.log(error);
    //   alert("Invalid email or password !");
    }
  };

  export const FindUserForChat= (ID,history) => async (dispatch) => {
    try {
      // console.log(ID);
      const { data } = await api.FindUserForChat(ID);
      console.log(data);
      return data;
     
    } catch (error) {
        console.log(error);
        alert("User with this id doesn't exists,Go to Home Page");
        history.push('/');
    //   alert("Invalid email or password !");
    }
  }; 

  export const Mychats= () => async (dispatch) => {
    try {
      // console.log(ID);
      const { data } = await api.Mychats();
      // console.log(data);
      return data;
     
    } catch (error) {
        console.log(error);
        
    }
  }; 
  export const AddNotification= (data) => async (dispatch) => {
    try {
      // console.log(ID);
      const { Data } = await api.AddNotification(data);
      // console.log(data);
      return Data;
     
    } catch (error) {
        console.log(error);
        
    }
  }; 
  export const FindNotification= (Data) => async (dispatch) => {
    try {
      // console.log(Data);
      const {data} = await api.FindNotification(Data);
      // console.log(data);
      return data;
     
    } catch (error) {
        console.log(error);
        
    }
  }; 
  export const FindUnseenNotes= (Data) => async (dispatch) => {
    try {
      // console.log(Data);
      const {data} = await api.FindUnseenNotes(Data);
      // console.log(data);
      return data;
     
    } catch (error) {
        console.log(error);
        
    }
  }; 
 
  export const SetNotesSeen= (Data) => async (dispatch) => {
    try {
      // console.log(Data);
      const {data} = await api.SetNotesSeen(Data);
      // console.log(data);
      return data;
     
    } catch (error) {
        console.log(error);
        
    }
  }; 
  export const ClearNotification= (data) => async (dispatch) => {
    try {
      // console.log(ID);
      const { Data } = await api.ClearNotification(data);
      // console.log(data);
      return Data;
     
    } catch (error) {
        console.log(error);
        
    }
  }; 

  export const FollowUnfollow=(data)=>async(dispatch)=>{
    try{
         await api.FollowUnfollow(data);
    }
    catch(error){
       console.log(error);
    }
  }

 