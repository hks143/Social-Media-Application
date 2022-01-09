export default (state = { messages: [] }, action) => {
  // console.log(action);
  switch (action.type) {


    case 'GET_MESSAGES':
      // console.log(action);
      return {
        ...state,
        messages: action.payload
      };
    default:
      return state;
  }
};

